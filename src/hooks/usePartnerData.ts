import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/contexts/AuthContext'
import { Transaction } from '@/hooks/useTransactions'

const STALE = 5 * 60 * 1000

// ─── Partner transactions ─────────────────────────────────────────────────────

export function usePartnerTransactions() {
  const { user, profile } = useAuthContext()
  const field = profile?.role === 'law_firm' ? 'law_firm_id' : 'tax_consultant_id'

  return useQuery({
    queryKey: ['partner-transactions', user?.id, profile?.role],
    enabled: !!user && !!profile?.role,
    queryFn: async (): Promise<Transaction[]> => {
      if (!user) return []
      const { data, error } = await (supabase as any)
        .from('transactions')
        .select('*, properties(id, title)')
        .eq(field, user.id)
        .order('created_at', { ascending: false })
      if (error) throw new Error(error.message)
      return (data ?? []) as Transaction[]
    },
    staleTime: STALE,
  })
}

// ─── Partner payouts ──────────────────────────────────────────────────────────

export interface PartnerPayout {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'paid' | 'failed'
  reference: string | null
  created_at: string
  paid_at: string | null
}

export function usePartnerPayouts() {
  const { user } = useAuthContext()

  return useQuery({
    queryKey: ['partner-payouts', user?.id],
    enabled: !!user,
    queryFn: async (): Promise<PartnerPayout[]> => {
      if (!user) return []
      const { data, error } = await (supabase as any)
        .from('partner_payouts')
        .select('*')
        .eq('partner_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw new Error(error.message)
      return (data ?? []) as PartnerPayout[]
    },
    staleTime: STALE,
  })
}
