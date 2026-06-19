import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { format, isPast, differenceInDays } from 'date-fns'
import { BookOpen, Plus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Assignment {
  id: string; title: string; instructions: string | null; due_date: string; max_score: number
  class: { name: string } | null; teacher: { full_name: string } | null
  submission?: { id: string; status: string; score: number | null; content: string | null }
}
interface ClassOption { id: string; name: string }

export default function AssignmentsPage() {
  const { t } = useTranslation()
  const { profile, schoolId, hasRole } = useAuth()
  const canWrite = hasRole('super_admin', 'school_admin', 'teacher')

  const [items, setItems] = useState<Assignment[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', instructions: '', due_date: '', max_score: '100', class_id: '' })
  const [submitForm, setSubmitForm] = useState({ content: '' })
  const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' })
  const [submissions, setSubmissions] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (schoolId) load() }, [schoolId])

  const load = async () => {
    const [assRes, clsRes] = await Promise.all([
      supabase.from('assignments').select('id,title,instructions,due_date,max_score,class:class_id(name),teacher:teacher_id(full_name)').eq('school_id', schoolId!).order('due_date'),
      supabase.from('classes').select('id,name').eq('school_id', schoolId!).order('name'),
    ])

    const assignments = (assRes.data ?? []) as unknown as Assignment[]

    if (profile?.role === 'student') {
      const ids = assignments.map(a => a.id)
      if (ids.length) {
        const { data: subs } = await supabase.from('submissions').select('assignment_id,id,status,score,content').eq('student_id', profile.id).in('assignment_id', ids)
        const subMap = new Map((subs ?? []).map(s => [s.assignment_id, s]))
        assignments.forEach(a => { a.submission = subMap.get(a.id) as any })
      }
    }

    setItems(assignments)
    setClasses((clsRes.data ?? []) as ClassOption[])
    setLoading(false)
  }

  const statusInfo = (a: Assignment) => {
    const overdue = isPast(new Date(a.due_date))
    const sub = a.submission
    if (!sub && overdue) return { label: t('assignments.overdue'), icon: AlertCircle, cls: 'text-red-600 bg-red-50' }
    if (!sub) {
      const days = differenceInDays(new Date(a.due_date), new Date())
      return { label: days === 0 ? t('dashboard.dueToday') : t('dashboard.dueIn', { days }), icon: Clock, cls: 'text-amber-600 bg-amber-50' }
    }
    if (sub.status === 'graded') return { label: t('assignments.graded'), icon: CheckCircle, cls: 'text-green-600 bg-green-50' }
    return { label: t('assignments.submitted'), icon: CheckCircle, cls: 'text-blue-600 bg-blue-50' }
  }

  const handleCreate = async () => {
    if (!form.title || !form.due_date || !form.class_id) return
    setSaving(true)
    await supabase.from('assignments').insert({
      school_id: schoolId!, teacher_id: profile!.id, class_id: form.class_id,
      title: form.title, instructions: form.instructions || null,
      due_date: form.due_date, max_score: Number(form.max_score),
    })
    setForm({ title: '', instructions: '', due_date: '', max_score: '100', class_id: '' })
    setShowCreate(false); setSaving(false); load()
  }

  const handleSubmit = async (assignmentId: string) => {
    setSaving(true)
    await supabase.from('submissions').insert({ assignment_id: assignmentId, student_id: profile!.id, content: submitForm.content, status: 'submitted' })
    setSubmitForm({ content: '' }); setActiveId(null); setSaving(false); load()
  }

  const loadSubmissions = async (assignmentId: string) => {
    const { data } = await supabase.from('submissions').select('*,student:student_id(full_name)').eq('assignment_id', assignmentId)
    setSubmissions(data ?? [])
    setActiveId(assignmentId)
  }

  const handleGrade = async (submissionId: string) => {
    await supabase.from('submissions').update({ score: Number(gradeForm.score), feedback: gradeForm.feedback, status: 'graded', graded_at: new Date().toISOString(), graded_by: profile!.id }).eq('id', submissionId)
    setGradeForm({ score: '', feedback: '' }); loadSubmissions(activeId!)
  }

  const active = items.find(a => a.id === activeId)

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-700" />{t('assignments.title')}</h1>
        {canWrite && <Button onClick={() => setShowCreate(true)} size="sm" className="bg-blue-700 hover:bg-blue-800"><Plus className="h-4 w-4 mr-1" />{t('assignments.new')}</Button>}
      </div>

      {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        : items.length === 0 ? <div className="text-center py-16 text-gray-400">{t('assignments.noAssignments')}</div>
        : <div className="space-y-3">
          {items.map(a => {
            const s = statusInfo(a)
            return (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium', s.cls)}>
                        <s.icon className="h-3 w-3" />{s.label}
                      </span>
                      <Badge variant="outline" className="text-xs">{(a.class as any)?.name}</Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    {a.instructions && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.instructions}</p>}
                    <p className="text-xs text-gray-400 mt-1">{t('assignments.dueDate', { date: format(new Date(a.due_date), 'd MMM yyyy HH:mm') })} · {t('assignments.maxScore', { score: a.max_score })}</p>
                    {a.submission?.status === 'graded' && <p className="text-sm font-semibold text-green-700 mt-1">Score: {a.submission.score}/{a.max_score}</p>}
                  </div>
                  <div className="shrink-0 flex flex-col gap-1.5">
                    {!canWrite && !a.submission && (
                      <Button size="sm" variant="outline" onClick={() => setActiveId(a.id)} className="text-xs h-8">{t('assignments.submit')}</Button>
                    )}
                    {canWrite && (
                      <Button size="sm" variant="outline" onClick={() => loadSubmissions(a.id)} className="text-xs h-8"><FileText className="h-3 w-3 mr-1" />{t('assignments.viewSubmissions', { count: '' })}</Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      }

      {/* Submit dialog (student) */}
      <Dialog open={!!activeId && !canWrite} onOpenChange={v => !v && setActiveId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{t('assignments.submit')} — {active?.title}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>{t('assignments.submitText')}</Label>
              <Textarea rows={5} value={submitForm.content} onChange={e => setSubmitForm({ content: e.target.value })} placeholder="Write your answer here..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveId(null)}>{t('common.cancel')}</Button>
            <Button onClick={() => handleSubmit(activeId!)} disabled={saving || !submitForm.content} className="bg-blue-700 hover:bg-blue-800">{saving ? t('common.loading') : t('assignments.submitButton')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View submissions dialog (teacher) */}
      <Dialog open={!!activeId && canWrite} onOpenChange={v => !v && setActiveId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{active?.title} — Submissions</DialogTitle></DialogHeader>
          {submissions.length === 0 ? <p className="text-sm text-gray-400 text-center py-4">{t('assignments.noSubmissions')}</p>
            : <div className="space-y-3 max-h-96 overflow-y-auto">
              {submissions.map(sub => (
                <div key={sub.id} className="border border-gray-100 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{sub.student?.full_name}</p>
                    <Badge variant={sub.status === 'graded' ? 'default' : 'secondary'} className="text-xs">{sub.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{sub.content}</p>
                  {sub.status !== 'graded' && (
                    <div className="flex gap-2">
                      <Input type="number" placeholder="Score" value={gradeForm.score} onChange={e => setGradeForm(f => ({ ...f, score: e.target.value }))} className="h-8 w-24 text-sm" />
                      <Input placeholder="Feedback" value={gradeForm.feedback} onChange={e => setGradeForm(f => ({ ...f, feedback: e.target.value }))} className="h-8 text-sm flex-1" />
                      <Button size="sm" onClick={() => handleGrade(sub.id)} className="bg-blue-700 hover:bg-blue-800 h-8 text-xs">{t('assignments.saveGrade')}</Button>
                    </div>
                  )}
                  {sub.status === 'graded' && <p className="text-xs text-green-700 font-medium">Score: {sub.score}/{active?.max_score} {sub.feedback && `· ${sub.feedback}`}</p>}
                </div>
              ))}
            </div>
          }
        </DialogContent>
      </Dialog>

      {/* Create assignment dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{t('assignments.create')}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>{t('assignments.classLabel')}</Label>
              <Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>{t('assignments.titleLabel')}</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><Label>{t('assignments.instructionsLabel')}</Label><Textarea rows={3} value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} /></div>
            <div className="flex gap-2">
              <div className="flex-1"><Label>{t('assignments.dueDateLabel')}</Label><Input type="datetime-local" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} /></div>
              <div className="w-24"><Label>{t('assignments.maxScoreLabel')}</Label><Input type="number" value={form.max_score} onChange={e => setForm(f => ({ ...f, max_score: e.target.value }))} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleCreate} disabled={saving || !form.title || !form.due_date || !form.class_id} className="bg-blue-700 hover:bg-blue-800">{saving ? t('common.loading') : t('assignments.create')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
