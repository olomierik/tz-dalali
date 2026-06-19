import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useAuditLog } from '@/hooks/useAuditLog'
import { supabase } from '@/integrations/supabase/client'
import { format } from 'date-fns'
import { Pin, PinOff, Megaphone, Plus, Trash2, Globe, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Announcement {
  id: string
  title: string
  body: string
  is_pinned: boolean
  class_id: string | null
  created_at: string
  author: { full_name: string } | null
  class: { name: string } | null
}

interface ClassOption { id: string; name: string }

export default function AnnouncementsPage() {
  const { t } = useTranslation()
  const { profile, schoolId, hasRole } = useAuth()
  const { logAction } = useAuditLog()
  const canWrite = hasRole('super_admin', 'school_admin', 'teacher')

  const [items, setItems] = useState<Announcement[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', class_id: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (schoolId) load() }, [schoolId])

  const load = async () => {
    const [annRes, clsRes] = await Promise.all([
      supabase.from('announcements').select('id,title,body,is_pinned,class_id,created_at,author:author_id(full_name),class:class_id(name)').eq('school_id', schoolId!).order('is_pinned', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('classes').select('id,name').eq('school_id', schoolId!).order('name'),
    ])
    setItems((annRes.data ?? []) as unknown as Announcement[])
    setClasses((clsRes.data ?? []) as ClassOption[])
    setLoading(false)
  }

  const handleCreate = async () => {
    if (!form.title.trim() || !form.body.trim()) return
    setSaving(true)
    const { data } = await supabase.from('announcements').insert({
      school_id: schoolId!,
      author_id: profile!.id,
      title: form.title.trim(),
      body: form.body.trim(),
      class_id: form.class_id || null,
      is_pinned: false,
    }).select().single()
    if (data) {
      await logAction({ action: 'announcement_created', entityType: 'announcements', entityId: data.id, details: { title: form.title } })
    }
    setForm({ title: '', body: '', class_id: '' })
    setShowForm(false)
    setSaving(false)
    load()
  }

  const handlePin = async (id: string, pinned: boolean) => {
    await supabase.from('announcements').update({ is_pinned: !pinned }).eq('id', id)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('announcements.deleteConfirm'))) return
    await supabase.from('announcements').delete().eq('id', id)
    await logAction({ action: 'announcement_deleted', entityType: 'announcements', entityId: id })
    load()
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-blue-700" /> {t('announcements.title')}
        </h1>
        {canWrite && (
          <Button onClick={() => setShowForm(true)} size="sm" className="bg-blue-700 hover:bg-blue-800">
            <Plus className="h-4 w-4 mr-1" /> {t('announcements.new')}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">{t('announcements.noAnnouncements')}</div>
      ) : (
        <div className="space-y-3">
          {items.map(a => (
            <div key={a.id} className={cn('bg-white rounded-xl border p-4 space-y-2', a.is_pinned ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100')}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {a.is_pinned && <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs"><Pin className="h-2.5 w-2.5 mr-0.5" />{t('announcements.pinned')}</Badge>}
                    {a.class ? (
                      <Badge variant="outline" className="text-xs"><BookOpen className="h-2.5 w-2.5 mr-0.5" />{(a.class as any)?.name}</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs"><Globe className="h-2.5 w-2.5 mr-0.5" />{t('announcements.schoolWide')}</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{a.title}</h3>
                </div>
                {canWrite && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handlePin(a.id, a.is_pinned)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-amber-600">
                      {a.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{a.body}</p>
              <p className="text-xs text-gray-400">
                {t('announcements.postedBy', { name: (a.author as any)?.full_name ?? '?' })} · {format(new Date(a.created_at), 'd MMM yyyy')}
              </p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{t('announcements.new')}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>{t('announcements.titleLabel')}</Label>
              <Input placeholder={t('announcements.titlePlaceholder')} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div><Label>{t('announcements.bodyLabel')}</Label>
              <Textarea placeholder={t('announcements.bodyPlaceholder')} rows={4} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
            </div>
            <div><Label>{t('announcements.classLabel')}</Label>
              <Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v === '__all__' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder={t('announcements.schoolWide')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t('announcements.schoolWide')}</SelectItem>
                  {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>{t('announcements.cancel')}</Button>
            <Button onClick={handleCreate} disabled={saving || !form.title || !form.body} className="bg-blue-700 hover:bg-blue-800">
              {saving ? t('common.loading') : t('announcements.publish')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
