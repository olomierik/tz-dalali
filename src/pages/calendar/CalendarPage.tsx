import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths } from 'date-fns'
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CalendarEventType } from '@/types'

interface CalEvent {
  id: string; title: string; description: string | null
  event_type: CalendarEventType; start_date: string; end_date: string | null
}

const EVENT_COLORS: Record<CalendarEventType, string> = {
  exam: 'bg-red-100 text-red-700 border-red-200',
  holiday: 'bg-green-100 text-green-700 border-green-200',
  meeting: 'bg-blue-100 text-blue-700 border-blue-200',
  deadline: 'bg-amber-100 text-amber-700 border-amber-200',
  event: 'bg-purple-100 text-purple-700 border-purple-200',
}

const EVENT_DOT: Record<CalendarEventType, string> = {
  exam: 'bg-red-500', holiday: 'bg-green-500', meeting: 'bg-blue-500', deadline: 'bg-amber-500', event: 'bg-purple-500',
}

export default function CalendarPage() {
  const { t } = useTranslation()
  const { profile, schoolId, hasRole } = useAuth()
  const canWrite = hasRole('super_admin', 'school_admin', 'teacher')

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState<CalEvent[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', event_type: 'event' as CalendarEventType, start_date: '', end_date: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (schoolId) loadEvents() }, [schoolId, currentMonth])

  const loadEvents = async () => {
    const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
    const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd')
    const { data } = await supabase.from('calendar_events').select('id,title,description,event_type,start_date,end_date').eq('school_id', schoolId!).gte('start_date', start).lte('start_date', end).order('start_date')
    setEvents((data ?? []) as CalEvent[])
  }

  const handleCreate = async () => {
    if (!form.title || !form.start_date) return
    setSaving(true)
    await supabase.from('calendar_events').insert({ school_id: schoolId!, created_by: profile!.id, title: form.title, description: form.description || null, event_type: form.event_type, start_date: form.start_date, end_date: form.end_date || null })
    setForm({ title: '', description: '', event_type: 'event', start_date: '', end_date: '' })
    setShowForm(false); setSaving(false); loadEvents()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('calendar_events').delete().eq('id', id)
    loadEvents()
  }

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) })
  const startPad = startOfMonth(currentMonth).getDay()
  const selectedEvents = selectedDay ? events.filter(e => isSameDay(new Date(e.start_date), selectedDay)) : []

  const eventTypes: CalendarEventType[] = ['exam', 'holiday', 'meeting', 'deadline', 'event']

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-700" />{t('calendar.title')}</h1>
        {canWrite && <Button onClick={() => setShowForm(true)} size="sm" className="bg-blue-700 hover:bg-blue-800"><Plus className="h-4 w-4 mr-1" />{t('calendar.addEvent')}</Button>}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {eventTypes.map(type => (
          <span key={type} className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', EVENT_COLORS[type])}>
            {t(`calendar.eventTypes.${type}`)}
          </span>
        ))}
      </div>

      {/* Month nav */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="p-1.5 rounded hover:bg-gray-100"><ChevronLeft className="h-4 w-4" /></button>
          <h2 className="font-semibold text-gray-900 text-sm">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="p-1.5 rounded hover:bg-gray-100"><ChevronRight className="h-4 w-4" /></button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} className="text-center text-xs text-gray-400 font-medium py-2">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {Array(startPad).fill(null).map((_, i) => <div key={`pad-${i}`} className="min-h-[60px] border-b border-r border-gray-50" />)}
          {days.map(day => {
            const dayEvents = events.filter(e => isSameDay(new Date(e.start_date), day))
            const isSelected = selectedDay && isSameDay(day, selectedDay)
            return (
              <button key={day.toISOString()} onClick={() => setSelectedDay(isSameDay(day, selectedDay ?? new Date('1900')) ? null : day)}
                className={cn('min-h-[60px] border-b border-r border-gray-50 p-1 text-left hover:bg-blue-50 transition-colors', isSelected && 'bg-blue-50', !isSameMonth(day, currentMonth) && 'opacity-30')}>
                <span className={cn('text-xs font-medium block mb-0.5 w-5 h-5 flex items-center justify-center rounded-full', isToday(day) ? 'bg-blue-700 text-white' : 'text-gray-700')}>
                  {format(day, 'd')}
                </span>
                <div className="flex flex-wrap gap-0.5">
                  {dayEvents.slice(0, 2).map(e => (
                    <span key={e.id} className={cn('w-1.5 h-1.5 rounded-full', EVENT_DOT[e.event_type])} />
                  ))}
                  {dayEvents.length > 2 && <span className="text-[9px] text-gray-400">+{dayEvents.length - 2}</span>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-700">{format(selectedDay, 'd MMMM yyyy')}</h3>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-gray-400">{t('calendar.noEvents')}</p>
          ) : selectedEvents.map(e => (
            <div key={e.id} className={cn('flex items-start justify-between rounded-xl border p-3', EVENT_COLORS[e.event_type])}>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className={cn('text-xs border', EVENT_COLORS[e.event_type])}>{t(`calendar.eventTypes.${e.event_type}`)}</Badge>
                  <p className="font-medium text-sm">{e.title}</p>
                </div>
                {e.description && <p className="text-xs mt-1 opacity-80">{e.description}</p>}
                {e.end_date && <p className="text-xs mt-1 opacity-70">Until {format(new Date(e.end_date), 'd MMM')}</p>}
              </div>
              {canWrite && <button onClick={() => handleDelete(e.id)} className="text-xs opacity-60 hover:opacity-100 ml-2">{t('calendar.delete')}</button>}
            </div>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{t('calendar.addEvent')}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>{t('calendar.eventTitle')}</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><Label>{t('calendar.eventType')}</Label>
              <Select value={form.event_type} onValueChange={v => setForm(f => ({ ...f, event_type: v as CalendarEventType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{eventTypes.map(et => <SelectItem key={et} value={et}>{t(`calendar.eventTypes.${et}`)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1"><Label>{t('calendar.startDate')}</Label><input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} className="h-9 border border-gray-200 rounded-md px-3 text-sm block w-full" /></div>
              <div className="flex-1"><Label>{t('calendar.endDate')}</Label><input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} className="h-9 border border-gray-200 rounded-md px-3 text-sm block w-full" /></div>
            </div>
            <div><Label>{t('calendar.description')}</Label><Textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>{t('calendar.cancel')}</Button>
            <Button onClick={handleCreate} disabled={saving || !form.title || !form.start_date} className="bg-blue-700 hover:bg-blue-800">{saving ? t('common.loading') : t('calendar.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
