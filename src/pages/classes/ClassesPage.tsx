import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { GraduationCap, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface ClassItem {
  id: string; name: string; grade_level: string | null; academic_year: string; created_at: string
  teacher_count: number; student_count: number
}
interface TeacherOption { id: string; full_name: string }

export default function ClassesPage() {
  const { t } = useTranslation()
  const { profile, schoolId } = useAuth()

  const [classes, setClasses] = useState<ClassItem[]>([])
  const [teachers, setTeachers] = useState<TeacherOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [activeClassId, setActiveClassId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', grade_level: '', academic_year: new Date().getFullYear().toString() })
  const [assignTeacherId, setAssignTeacherId] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (schoolId) { loadClasses(); loadTeachers() } }, [schoolId])

  const loadClasses = async () => {
    const { data } = await supabase.from('classes').select('id,name,grade_level,academic_year,created_at').eq('school_id', schoolId!).order('name')
    if (!data) { setLoading(false); return }

    const withCounts = await Promise.all(data.map(async cls => {
      const [{ count: tc }, { count: sc }] = await Promise.all([
        supabase.from('class_teachers').select('id', { count: 'exact' }).eq('class_id', cls.id),
        supabase.from('enrollments').select('id', { count: 'exact' }).eq('class_id', cls.id).eq('status', 'active'),
      ])
      return { ...cls, teacher_count: tc ?? 0, student_count: sc ?? 0 }
    }))

    setClasses(withCounts as ClassItem[])
    setLoading(false)
  }

  const loadTeachers = async () => {
    const { data } = await supabase.from('profiles').select('id,full_name').eq('school_id', schoolId!).eq('role', 'teacher').order('full_name')
    setTeachers((data ?? []) as TeacherOption[])
  }

  const handleCreate = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    await supabase.from('classes').insert({ school_id: schoolId!, name: form.name, grade_level: form.grade_level || null, academic_year: form.academic_year })
    setForm({ name: '', grade_level: '', academic_year: new Date().getFullYear().toString() })
    setShowCreate(false); setSaving(false); loadClasses()
  }

  const handleAssignTeacher = async () => {
    if (!assignTeacherId || !activeClassId) return
    setSaving(true)
    await supabase.from('class_teachers').upsert({ class_id: activeClassId, teacher_id: assignTeacherId, is_primary: false }, { onConflict: 'class_id,teacher_id' })
    setAssignTeacherId(''); setSaving(false); loadClasses()
  }

  const activeClass = classes.find(c => c.id === activeClassId)

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-blue-700" />{t('classes.title')}</h1>
        <Button onClick={() => setShowCreate(true)} size="sm" className="bg-blue-700 hover:bg-blue-800"><Plus className="h-4 w-4 mr-1" />{t('classes.new')}</Button>
      </div>

      {loading ? <div className="grid md:grid-cols-2 gap-3">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        : classes.length === 0 ? <div className="text-center py-16 text-gray-400">{t('classes.noClasses')}</div>
        : <div className="grid md:grid-cols-2 gap-3">
          {classes.map(cls => (
            <div key={cls.id} onClick={() => setActiveClassId(cls.id)} className={cn('bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all', activeClassId === cls.id ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-100')}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                  {cls.grade_level && <p className="text-xs text-gray-500 mt-0.5">{cls.grade_level} · {cls.academic_year}</p>}
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{t('classes.teachers', { count: cls.teacher_count })}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{t('classes.students', { count: cls.student_count })}</span>
              </div>
            </div>
          ))}
        </div>
      }

      {/* Assign teacher panel */}
      {activeClassId && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
          <h3 className="font-semibold text-sm text-gray-900">{activeClass?.name} — {t('classes.assignTeacher')}</h3>
          <div className="flex gap-2">
            <Select value={assignTeacherId} onValueChange={setAssignTeacherId}>
              <SelectTrigger className="flex-1"><SelectValue placeholder="Select teacher" /></SelectTrigger>
              <SelectContent>{teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={handleAssignTeacher} disabled={!assignTeacherId || saving} size="sm" className="bg-blue-700 hover:bg-blue-800">{t('classes.assignTeacher')}</Button>
          </div>
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{t('classes.new')}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>{t('classes.name')}</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Form 2A" /></div>
            <div><Label>{t('classes.gradeLevel')}</Label><Input value={form.grade_level} onChange={e => setForm(f => ({ ...f, grade_level: e.target.value }))} placeholder="e.g. Standard 5" /></div>
            <div><Label>{t('classes.academicYear')}</Label><Input value={form.academic_year} onChange={e => setForm(f => ({ ...f, academic_year: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>{t('classes.cancel')}</Button>
            <Button onClick={handleCreate} disabled={saving || !form.name} className="bg-blue-700 hover:bg-blue-800">{saving ? t('common.loading') : t('classes.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
