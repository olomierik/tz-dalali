import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { format } from 'date-fns'
import { ClipboardList, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AuditLogEntry {
  id: string; action: string; entity_type: string; entity_id: string | null
  details: Record<string, unknown>; created_at: string; actor_id: string | null
  actor: { full_name: string } | null
}

const ACTION_COLOR: Record<string, string> = {
  consent_granted: 'bg-green-100 text-green-700',
  consent_revoked: 'bg-red-100 text-red-700',
  student_enrolled: 'bg-blue-100 text-blue-700',
  announcement_created: 'bg-purple-100 text-purple-700',
  announcement_deleted: 'bg-red-100 text-red-700',
}

export default function AuditLogPage() {
  const { t } = useTranslation()
  const { schoolId } = useAuth()

  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { if (schoolId) load() }, [schoolId])

  const load = async () => {
    const { data } = await supabase
      .from('audit_logs')
      .select('id,action,entity_type,entity_id,details,created_at,actor_id,actor:actor_id(full_name)')
      .eq('school_id', schoolId!)
      .order('created_at', { ascending: false })
      .limit(500)
    setLogs((data ?? []) as unknown as AuditLogEntry[])
    setLoading(false)
  }

  const filtered = logs.filter(l =>
    !search || l.action.includes(search.toLowerCase()) || l.entity_type.includes(search.toLowerCase()) || (l.actor as any)?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><ClipboardList className="h-5 w-5 text-blue-700" />{t('auditLog.title')}</h1>
        <Badge variant="secondary" className="text-xs">{logs.length} entries</Badge>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder={t('auditLog.filter')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
        : filtered.length === 0 ? <div className="text-center py-16 text-gray-400">{t('auditLog.noLogs')}</div>
        : <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 px-4 py-2 border-b border-gray-100 text-xs font-medium text-gray-500">
            <span>{t('auditLog.action')}</span>
            <span>{t('auditLog.details')}</span>
            <span className="hidden sm:block">{t('auditLog.actor')}</span>
            <span>{t('auditLog.timestamp')}</span>
          </div>
          <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-50">
            {filtered.map(log => (
              <div key={log.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-start px-4 py-3">
                <Badge className={cn('text-xs whitespace-nowrap shrink-0', ACTION_COLOR[log.action] ?? 'bg-gray-100 text-gray-700')}>
                  {log.action.replace(/_/g, ' ')}
                </Badge>
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 font-medium">{log.entity_type}</p>
                  {Object.keys(log.details).length > 0 && (
                    <p className="text-xs text-gray-400 truncate">{JSON.stringify(log.details)}</p>
                  )}
                </div>
                <span className="hidden sm:block text-xs text-gray-500 whitespace-nowrap">{(log.actor as any)?.full_name ?? 'System'}</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">{format(new Date(log.created_at), 'd MMM HH:mm')}</span>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  )
}
