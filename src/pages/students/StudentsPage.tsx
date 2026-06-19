import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useAuditLog } from '@/hooks/useAuditLog'
import { supabase } from '@/integrations/supabase/client'
import { format } from 'date-fns'
import { Users, Plus, UserPlus, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { ConsentStatus } from '@/types'

interface Student {
  id: string; full_name: string; student_number: string | null
  consent_status: ConsentStatus; enrollment_date: string
  profile: { id: string } | null
}
interface ClassOption { id: string; name: string }

const CONSENT_CONFIG: Record<ConsentStatus, { icon: typeof CheckCircle; cls: string; key: string }> = {
  active:          { icon: CheckCircle,   cls: 'bg-green-100 text-green-700 border-green-200', key: 'students.active' },
  pending_consent: { icon: Clock,         cls: 'bg-amber-100 text-amber-700 border-amber-200', key: 'students.pending' },
  suspended:       { icon: AlertTriangle, cls: 'bg-red-100 text-red-700 border-red-200',       key: 'students.suspended' },
}

export default function StudentsPage() {
  const { t } = useTranslation()
  const { profile, schoolId } = useAuth()
  const { logAction } = useAuditLog()

  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showEnroll, setShowEnroll] = useState(false)
  const [form, setForm] = useState({ full_name: '', guardian_phone: '', student_number: '', class_id: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (schoolId) { loadStudents(); loadClasses() } }, [schoolId])

  const loadStudents = async () => {
    const { data } = await supabase.from('students').select('id,full_name,student_number,consent_status,enrollment_date,profile:profile_id(id)').eq('school_id', schoolId!).order('full_name')
    setStudents((data ?? []) as unknown as Student[])
    setLoading(false)
  }

  const loadClasses = async () => {
    const { data } = await supabase.from('classes').select('id,name').eq('school_id', schoolId!).order('name')
    setClasses((data ?? []) as ClassOption[])
  }

  const handleEnroll = async () => {
    if (!form.full_name.trim() || !form.guardian_phone.trim()) return
    setSaving(true)

    // Create student record
    const { data: student, error } = await supabase.from('students').insert({
      school_id: schoolId!, full_name: form.full_name.trim(),
      student_number: form.student_number || null, enrollment_date: format(new Date(), 'yyyy-MM-dd'),
      consent_status: 'pending_consent',
    }).select().single()

    if (error || !student) { setSaving(false); return }

    // Create guardian record
    const { data: guardian } = await supabase.from('guardians').insert({
      school_id: schoolId!, full_name: 'Guardian of ' + form.full_name, phone: form.guardian_phone, relationship: 'guardian',
    }).select().single()

    if (guardian) {
      await supabase.from('student_guardians').insert({ student_id: student.id, guardian_id: guardian.id, is_primary: true })

      // Generate invite token for guardian
      const token = `ELOHIM-${Math.random().toString(36).slice(2,6).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
      await supabase.from('invite_tokens').insert({
        school_id: schoolId!, token, role: 'parent',
        phone: form.guardian_phone, student_id: student.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: profile!.id,
      })
    }

    // Enroll in class
    if (form.class_id) {
      await supabase.from('enrollments').insert({ class_id: form.class_id, student_id: student.id, status: 'active' })
    }

    await logAction({ action: 'student_enrolled', entityType: 'students', entityId: student.id, details: { full_name: form.full_name } })

    setForm({ full_name: '', guardian_phone: '', student_number: '', class_id: '' })
    setShowEnroll(false); setSaving(false); loadStudents()
  }

  const filtered = students.filter(s => s.full_name.toLowerCase().includes(search.toLowerCase()) || s.student_number?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Users className="h-5 w-5 text-blue-700" />{t('students.title')}</h1>
        <Button onClick={() => setShowEnroll(true)} size="sm" className="bg-blue-700 hover:bg-blue-800"><Plus className="h-4 w-4 mr-1" />{t('students.enroll')}</Button>
      </div>

      {/* Search */}
      <Input placeholder={t('common.search') + '...'} value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />

      {/* Stats */}
      <div className="flex gap-3 flex-wrap">
        {(['active', 'pending_consent', 'suspended'] as ConsentStatus[]).map(status => {
          const count = students.filter(s => s.consent_status === status).length
          const cfg = CONSENT_CONFIG[status]
          return <div key={status} className={cn('flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium', cfg.cls)}><cfg.icon className="h-3 w-3" />{t(cfg.key)}: {count}</div>
        })}
      </div>

      {/* Table */}
      {loading ? <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        : filtered.length === 0 ? <div className="text-center py-16 text-gray-400">{t('students.noStudents')}</div>
        : <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2 border-b border-gray-100 text-xs font-medium text-gray-500">
            <span>{t('students.name')}</span>
            <span className="hidden sm:block">{t('students.studentNumber')}</span>
            <span>{t('students.consentStatus')}</span>
            <span className="hidden md:block">{t('students.enrollDate')}</span>
          </div>
          {filtered.map((s, i) => {
            const cfg = CONSENT_CONFIG[s.consent_status]
            return (
              <div key={s.id} className={cn('grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center px-4 py-3', i > 0 && 'border-t border-gray-50')}>
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.full_name}</p>
                  {s.student_number && <p className="text-xs text-gray-400">{s.student_number}</p>}
                </div>
                <span className="hidden sm:block text-xs text-gray-500">{s.student_number ?? '—'}</span>
                <Badge className={cn('text-xs border gap-1', cfg.cls)}><cfg.icon className="h-3 w-3" />{t(cfg.key)}</Badge>
                <span className="hidden md:block text-xs text-gray-400">{format(new Date(s.enrollment_date), 'd MMM yyyy')}</span>
              </div>
            )
          })}
        </div>
      }

      {/* Enroll dialog */}
      <Dialog open={showEnroll} onOpenChange={setShowEnroll}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-blue-700" />{t('students.enroll')}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>{t('students.fullName')}</Label><Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
            <div><Label>{t('students.studentNumber')}</Label><Input value={form.student_number} onChange={e => setForm(f => ({ ...f, student_number: e.target.value }))} /></div>
            <div><Label>{t('students.guardianPhone')} <span className="text-red-500">*</span></Label>
              <Input placeholder="+255 700 000 000" value={form.guardian_phone} onChange={e => setForm(f => ({ ...f, guardian_phone: e.target.value }))} />
              <p className="text-xs text-gray-400 mt-0.5">An invite link will be generated for the guardian.</p>
            </div>
            <div><Label>{t('students.class')} (optional)</Label>
              <Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v === '__none__' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No class yet</SelectItem>
                  {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnroll(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleEnroll} disabled={saving || !form.full_name || !form.guardian_phone} className="bg-blue-700 hover:bg-blue-800">{saving ? t('common.loading') : t('students.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
