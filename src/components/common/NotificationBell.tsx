import { Bell, Check, CreditCard, FileText, MessageSquare, Settings, Upload, Users, CheckCircle, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotifications, useMarkAllAsRead, useMarkAsRead, type Notification } from '@/hooks/useNotifications'
import { cn, timeAgo } from '@/lib/utils'

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


function NotificationItem({ n }: { n: Notification }) {
  const Icon = TYPE_ICONS[n.notification_type] ?? Bell
  const { mutate: markRead } = useMarkAsRead()

  return (
    <div
      className={cn(
        'flex gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors',
        !n.is_read && 'bg-gold/5 border-l-2 border-gold'
      )}
      onClick={() => { if (!n.is_read) markRead(n.id) }}
    >
      <div className="shrink-0 mt-0.5">
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-gold" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm leading-snug', !n.is_read ? 'font-semibold text-foreground' : 'text-foreground/80')}>
          {n.title}
        </p>
        {n.body && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
        )}
        <p className="text-xs text-muted-foreground/60 mt-1">{timeAgo(n.created_at)}</p>
      </div>
      {!n.is_read && <div className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />}
    </div>
  )
}

export function NotificationBell() {
  const { data: notifications = [] } = useNotifications()
  const { mutate: markAllRead } = useMarkAllAsRead()

  const unread = notifications.filter(n => !n.is_read).length
  const recent = notifications.slice(0, 8)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-auto py-1 text-gold" onClick={() => markAllRead()}>
              <Check className="h-3 w-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-96">
          {recent.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No notifications yet</div>
          ) : (
            <div className="divide-y divide-border">
              {recent.map(n => <NotificationItem key={n.id} n={n} />)}
            </div>
          )}
        </ScrollArea>
        <div className="border-t border-border p-2">
          <Link to="/dashboard/notifications">
            <Button variant="ghost" size="sm" className="w-full text-xs">View all notifications</Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
