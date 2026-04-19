import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Property } from '@/hooks/useProperties'

const STALE = 2 * 60 * 1000

// ─── Admin listings ───────────────────────────────────────────────────────────

export function useAdminListings(status?: string, search?: string) {
  return useQuery({
    queryKey: ['admin-listings', status, search],
    queryFn: async (): Promise<Property[]> => {
      let q = (supabase as any)
        .from('properties')
        .select('*, users!seller_id(full_name, email)')
      if (status) q = q.eq('status', status)
      if (search) q = q.ilike('title', `%${search}%`)
      q = q.order('created_at', { ascending: false })
      const { data, error } = await q
      if (error) throw new Error(error.message)
      return (data ?? []) as Property[]
    },
    staleTime: STALE,
  })
}

export function useAdminUpdateListingStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await (supabase as any).from('properties').update({ status }).eq('id', id)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-listings'] }),
  })
}

// ─── Admin users ─────────────────────────────────────────────────────────────

export interface AdminUserRow {
  id: string
  email: string
  full_name: string | null
  role: string
  id_verification_status: string
  created_at: string
  total_deals: number
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<AdminUserRow[]> => {
      const { data, error } = await (supabase as any)
        .from('users')
        .select('id, email, full_name, role, id_verification_status, created_at, total_deals')
        .order('created_at', { ascending: false })
      if (error) throw new Error(error.message)
      return (data ?? []) as AdminUserRow[]
    },
    staleTime: STALE,
  })
}

export function useAdminUpdateVerification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await (supabase as any).from('users').update({ id_verification_status: status }).eq('id', id)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })
}

// ─── Admin partners ──────────────────────────────────────────────────────────

export interface AdminPartnerRow {
  id: string
  email: string
  full_name: string | null
  role: 'law_firm' | 'tax_consultant'
  id_verification_status: string
  total_deals: number
  total_spent: number
  created_at: string
}

export function useAdminPartners() {
  return useQuery({
    queryKey: ['admin-partners'],
    queryFn: async (): Promise<AdminPartnerRow[]> => {
      const { data, error } = await (supabase as any)
        .from('users')
        .select('id, email, full_name, role, id_verification_status, total_deals, total_spent, created_at')
        .in('role', ['law_firm', 'tax_consultant'])
        .order('created_at', { ascending: false })
      if (error) throw new Error(error.message)
      return (data ?? []) as AdminPartnerRow[]
    },
    staleTime: STALE,
  })
}

export function useAdminUpdatePartnerStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await (supabase as any).from('users').update({ id_verification_status: status }).eq('id', id)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-partners'] }),
  })
}

// ─── Admin transactions ──────────────────────────────────────────────────────

import { Transaction } from '@/hooks/useTransactions'

export function useAdminTransactions() {
  return useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async (): Promise<Transaction[]> => {
      const { data, error } = await (supabase as any)
        .from('transactions')
        .select('*, properties(id, title)')
        .order('created_at', { ascending: false })
      if (error) throw new Error(error.message)
      return (data ?? []) as Transaction[]
    },
    staleTime: STALE,
  })
}
