import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications, useMarkAllAsRead } from "@/hooks/useNotifications";
import { Bell, Check, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markAllRead } = useMarkAllAsRead();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {notifications && notifications.length > 0 && unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => markAllRead()}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map(notification => (
            <Card 
              key={notification.id}
              className={cn(
                "transition-colors hover:bg-gray-50",
                !notification.is_read && "border-l-4 border-l-gold"
              )}
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    notification.notification_type === 'deal_update' ? 'bg-blue-100 text-blue-600' :
                    notification.notification_type === 'payment_confirmed' ? 'bg-green-100 text-green-600' :
                    notification.notification_type === 'partner_assigned' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  )}>
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={cn(
                          "font-medium",
                          !notification.is_read && "text-gold"
                        )}>
                          {notification.title}
                        </p>
                        {notification.body && (
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.body}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {notification.action_url && (
                      <Button variant="ghost" size="sm" className="mt-2 -ml-2" asChild>
                        <Link to={notification.action_url}>
                          View <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                  {!notification.is_read && (
                    <Badge className="bg-gold text-black">New</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}