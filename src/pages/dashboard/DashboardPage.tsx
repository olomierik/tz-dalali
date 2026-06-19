import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { differenceInDays, format, isPast } from 'date-fns'
import { BookOpen, Megaphone, CalendarCheck, MessageSquare, ArrowRight, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DashboardData {
  announcements: Array<{ id: string; title: string; created_at: string; is_pinned: boolean }>
  assignments: Array<{ id: string; title: string; due_date: string; class: { name: string } | null }>
  attendanceRate: number | null
  unreadMessages: number
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { profile, schoolId } = useAuth()
  const [data, setData] = useState<DashboardData>({ announcements: [], assignments: [], attendanceRate: null, unreadMessages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!schoolId) return
    loadDashboard()
  }, [schoolId])

  const loadDashboard = async () => {
    const [annRes, assRes, unreadRes] = await Promise.all([
      supabase.from('announcements').select('id,title,created_at,is_pinned').eq('school_id', schoolId!).order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(3),
      supabase.from('assignments').select('id,title,due_date,class:class_id(name)').eq('school_id', schoolId!).gte('due_date', new Date().toISOString()).order('due_date').limit(5),
      supabase.from('conversation_participants').select('id', { count: 'exact' }).eq('profile_id', profile!.id).is('last_read_at', null),
    ])

    let attendanceRate: number | null = null
    if (profile?.role === 'student') {
      const { data: attData } = await supabase.from('attendance').select('status').eq('student_id', profile.id)
      if (attData && attData.length > 0) {
        const present = attData.filter(a => a.status === 'present' || a.status === 'late').length
        attendanceRate = Math.round((present / attData.length) * 100)
      }
    }

    setData({
      announcements: (annRes.data ?? []) as typeof data.announcements,
      assignments: (assRes.data ?? []) as typeof data.assignments,
      attendanceRate,
      unreadMessages: unreadRes.count ?? 0,
    })
    setLoading(false)
  }

  const getDueLabel = (dueDate: string) => {
    const days = differenceInDays(new Date(dueDate), new Date())
    if (days < 0) return { label: t('dashboard.overdue'), className: 'text-red-600 bg-red-50' }
    if (days === 0) return { label: t('dashboard.dueToday'), className: 'text-amber-600 bg-amber-50' }
    return { label: t('dashboard.dueIn', { days }), className: 'text-blue-600 bg-blue-50' }
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.welcome', { name: profile?.full_name?.split(' ')[0] ?? '' })}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {format(new Date(), 'EEEE, d MMMM yyyy')}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Megaphone, label: t('dashboard.recentAnnouncements'), value: data.announcements.length, to: '/announcements', color: 'bg-blue-50 text-blue-700' },
          { icon: BookOpen, label: t('dashboard.upcomingAssignments'), value: data.assignments.length, to: '/assignments', color: 'bg-amber-50 text-amber-700' },
          data.attendanceRate !== null
            ? { icon: CalendarCheck, label: t('dashboard.attendanceRate'), value: `${data.attendanceRate}%`, to: '/attendance', color: 'bg-green-50 text-green-700' }
            : null,
          { icon: MessageSquare, label: t('dashboard.unreadMessages'), value: data.unreadMessages, to: '/messages', color: 'bg-purple-50 text-purple-700' },
        ].filter(Boolean).map((card, i) => {
          const c = card!
          return (
            <Link key={i} to={c.to} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className={cn('inline-flex p-2 rounded-lg mb-2', c.color)}>
                <c.icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{loading ? '—' : c.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Announcements */}
        <section className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-blue-600" /> {t('dashboard.recentAnnouncements')}
            </h2>
            <Button asChild variant="ghost" size="sm" className="text-xs text-blue-600 h-7">
              <Link to="/announcements">{t('dashboard.viewAll')} <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </div>
          {loading ? (
            <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : data.announcements.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">{t('dashboard.noAnnouncements')}</p>
          ) : (
            <div className="space-y-2">
              {data.announcements.map(a => (
                <Link key={a.id} to="/announcements" className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 group">
                  {a.is_pinned && <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">{a.title}</p>
                    <p className="text-xs text-gray-400">{format(new Date(a.created_at), 'd MMM')}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Assignments */}
        <section className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-600" /> {t('dashboard.upcomingAssignments')}
            </h2>
            <Button asChild variant="ghost" size="sm" className="text-xs text-blue-600 h-7">
              <Link to="/assignments">{t('dashboard.viewAll')} <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </div>
          {loading ? (
            <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : data.assignments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">{t('dashboard.noAssignments')}</p>
          ) : (
            <div className="space-y-2">
              {data.assignments.map(a => {
                const due = getDueLabel(a.due_date)
                return (
                  <Link key={a.id} to="/assignments" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">{a.title}</p>
                      <p className="text-xs text-gray-400">{(a.class as any)?.name}</p>
                    </div>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2', due.className)}>
                      {due.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
