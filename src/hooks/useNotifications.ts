import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/contexts/AuthContext'

// ─── Domain types ────────────────────────────────────────────────────────────

export type NotificationType =
  | 'deal_update'
  | 'listing_approved'
  | 'payment_confirmed'
  | 'document_uploaded'
  | 'partner_assigned'
  | 'message'
  | 'system'
  | 'marketing'

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string | null
  notification_type: NotificationType
  is_read: boolean
  action_url: string | null
  created_at: string
}

// ─── Query keys ──────────────────────────────────────────────────────────────

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
}

const STALE_TIME = 2 * 60 * 1000

// ─── useNotifications ────────────────────────────────────────────────────────

export function useNotifications() {
  const { user } = useAuthContext()

  return useQuery({
    queryKey: notificationKeys.list(),
    enabled: !!user,
    queryFn: async (): Promise<Notification[]> => {
      if (!user) return []

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return (data ?? []) as Notification[]
    },
    staleTime: STALE_TIME,
  })
}

// ─── useMarkAsRead ────────────────────────────────────────────────────────────

export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() })
    },
  })
}

// ─── useMarkAllAsRead ─────────────────────────────────────────────────────────

export function useMarkAllAsRead() {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationFn: async (): Promise<void> => {
      if (!user) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() })
    },
  })
}
