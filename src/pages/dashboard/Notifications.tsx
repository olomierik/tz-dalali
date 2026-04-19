import { Bell, CheckCheck, FileText, CheckCircle, CreditCard, Upload, Users, MessageSquare, Settings, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<string, React.ElementType> = {
  deal_update: FileText,
  listing_approved: CheckCircle,
  payment_confirmed: CreditCard,
  document_uploaded: Upload,
  partner_assigned: Users,
  message: MessageSquare,
  system: Settings,
  marketing: Star,
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function Notifications() {
  const { data: notifications = [], isLoading } = useNotifications()
  const markRead = useMarkAsRead()
  const markAll = useMarkAllAsRead()

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-primary">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay up to date with your transactions and listings.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-serif text-xl text-primary mb-2">No notifications yet</h2>
            <p className="text-muted-foreground text-sm">You'll see updates about your transactions and listings here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map(n => {
              const Icon = TYPE_ICONS[n.notification_type] ?? Bell
              return (
                <div
                  key={n.id}
                  className={cn('flex gap-3 p-4 transition-colors', !n.is_read && 'bg-gold/5')}
                  onClick={() => !n.is_read && markRead.mutate(n.id)}
                  role={!n.is_read ? 'button' : undefined}
                  style={!n.is_read ? { cursor: 'pointer' } : undefined}
                >
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', !n.is_read ? 'bg-gold/20' : 'bg-muted')}>
                    <Icon className={cn('h-5 w-5', !n.is_read ? 'text-gold' : 'text-muted-foreground')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-sm', !n.is_read ? 'font-semibold text-foreground' : 'text-foreground')}>{n.title}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        {!n.is_read && <Badge className="bg-gold text-white text-xs px-1.5 py-0">New</Badge>}
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(n.created_at)}</span>
                      </div>
                    </div>
                    {n.body && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>}
                    {n.action_url && (
                      <a href={n.action_url} className="text-xs text-gold hover:underline mt-1 inline-block">View details →</a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
