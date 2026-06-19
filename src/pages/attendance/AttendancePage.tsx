import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { format } from 'date-fns'
import { CalendarCheck, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Status = 'present' | 'absent' | 'late' | 'excused'

interface Student { id: string; full_name: string; profile_id: string | null }
interface AttRecord { student_id: string; status: Status }
interface ClassOption { id: string; name: string }

const STATUS_COLORS: Record<Status, string> = {
  present: 'bg-green-100 text-green-700 border-green-200',
  absent: 'bg-red-100 text-red-700 border-red-200',
  late: 'bg-amber-100 text-amber-700 border-amber-200',
  excused: 'bg-blue-100 text-blue-700 border-blue-200',
}

export default function AttendancePage() {
  const { t } = useTranslation()
  const { profile, schoolId, hasRole } = useAuth()
  const canWrite = hasRole('super_admin', 'school_admin', 'teacher')

  const [classes, setClasses] = useState<ClassOption[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [students, setStudents] = useState<Student[]>([])
  const [records, setRecords] = useState<Record<string, Status>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [myAttendance, setMyAttendance] = useState<AttRecord[]>([])

  useEffect(() => { if (schoolId) loadClasses() }, [schoolId])
  useEffect(() => { if (selectedClass) loadStudentsAndRecords() }, [selectedClass, selectedDate])

  useEffect(() => {
    if (profile?.role === 'student') loadMyAttendance()
  }, [profile])

  const loadClasses = async () => {
    const { data } = await supabase.from('classes').select('id,name').eq('school_id', schoolId!).order('name')
    setClasses((data ?? []) as ClassOption[])
    if (data?.length) setSelectedClass(data[0].id)
  }

  const loadStudentsAndRecords = async () => {
    setLoading(true)
    const { data: enrollments } = await supabase.from('enrollments').select('student_id,student:student_id(id,full_name,profile_id)').eq('class_id', selectedClass).eq('status', 'active')
    const studs = (enrollments ?? []).map(e => e.student).filter(Boolean) as unknown as Student[]
    setStudents(studs)

    const { data: att } = await supabase.from('attendance').select('student_id,status').eq('class_id', selectedClass).eq('date', selectedDate)
    const map: Record<string, Status> = {}
    ;(att ?? []).forEach(a => { map[a.student_id] = a.status as Status })
    studs.forEach(s => { if (!map[s.id]) map[s.id] = 'present' })
    setRecords(map)
    setLoading(false)
  }

  const loadMyAttendance = async () => {
    const { data } = await supabase.from('attendance').select('student_id,status').eq('student_id', profile!.id).order('date', { ascending: false }).limit(30)
    setMyAttendance((data ?? []) as AttRecord[])
  }

  const handleSave = async () => {
    setSaving(true)
    const rows = students.map(s => ({
      school_id: schoolId!, class_id: selectedClass, student_id: s.id,
      teacher_id: profile!.id, date: selectedDate, status: records[s.id] ?? 'present',
    }))
    await supabase.from('attendance').upsert(rows, { onConflict: 'class_id,student_id,date' })
    setSaving(false)
  }

  const statuses: Status[] = ['present', 'absent', 'late', 'excused']

  if (profile?.role === 'student') {
    const total = myAttendance.length
    const present = myAttendance.filter(a => a.status === 'present' || a.status === 'late').length
    const rate = total > 0 ? Math.round((present / total) * 100) : null

    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-blue-700" />{t('attendance.title')}</h1>
        {rate !== null && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-4xl font-bold text-blue-700">{rate}%</p>
            <p className="text-sm text-gray-500 mt-1">{t('attendance.attendanceRate', { rate })}</p>
          </div>
        )}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">{t('attendance.summary')}</p>
          <div className="grid grid-cols-2 gap-2">
            {statuses.map(s => {
              const count = myAttendance.filter(a => a.status === s).length
              return <div key={s} className={cn('text-center rounded-lg p-2 border text-xs', STATUS_COLORS[s])}><p className="font-bold text-lg">{count}</p><p>{t(`attendance.${s}`)}</p></div>
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-blue-700" />{t('attendance.title')}</h1>

      <div className="flex flex-wrap gap-3 bg-white rounded-xl border border-gray-100 p-4">
        <div><Label className="text-xs">{t('attendance.class')}</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
            <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label className="text-xs">{t('attendance.date')}</Label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="h-9 border border-gray-200 rounded-md px-3 text-sm block" />
        </div>
        {canWrite && <Button onClick={handleSave} disabled={saving || students.length === 0} size="sm" className="bg-blue-700 hover:bg-blue-800 self-end"><Save className="h-4 w-4 mr-1" />{saving ? t('common.loading') : t('attendance.save')}</Button>}
      </div>

      {loading ? <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
        : students.length === 0 ? <div className="text-center py-16 text-gray-400">{t('attendance.noRecords')}</div>
        : <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {students.map((s, i) => (
            <div key={s.id} className={cn('flex items-center justify-between p-3 gap-3', i > 0 && 'border-t border-gray-50')}>
              <p className="text-sm font-medium text-gray-900">{s.full_name}</p>
              <div className="flex gap-1.5 flex-wrap">
                {statuses.map(st => (
                  <button
                    key={st}
                    disabled={!canWrite}
                    onClick={() => setRecords(r => ({ ...r, [s.id]: st }))}
                    className={cn('text-xs px-2.5 py-1 rounded-full border font-medium transition-all', records[s.id] === st ? STATUS_COLORS[st] + ' font-bold ring-1 ring-offset-1 ring-current' : 'border-gray-200 text-gray-400 hover:border-gray-300')}
                  >{t(`attendance.${st}`)}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}
