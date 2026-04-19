import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/contexts/AuthContext'

// ─── Domain types ────────────────────────────────────────────────────────────

export type TransactionStatus =
  | 'initiated'
  | 'partner_assigned'
  | 'due_diligence'
  | 'tax_clearance'
  | 'contract_prep'
  | 'escrow_funded'
  | 'title_transfer'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export type StepStatus = 'pending' | 'active' | 'completed' | 'blocked'

export interface TransactionStep {
  id: string
  transaction_id: string
  step_number: number
  step_name: string
  status: StepStatus
  notes: string | null
  completed_at: string | null
  completed_by: string | null
  created_at: string
  updated_at: string
}

export interface TransactionDocument {
  id: string
  transaction_id: string
  name: string
  url: string
  uploaded_by: string
  created_at: string
}

export interface Transaction {
  id: string
  reference_code: string
  property_id: string
  buyer_id: string
  seller_id: string
  law_firm_id: string | null
  tax_consultant_id: string | null
  deal_type: 'sale' | 'rent' | 'lease' | null
  status: TransactionStatus
  current_step: number
  agreed_price: number
  currency: string
  commission_total: number | null
  escrow_funded_at: string | null
  completed_at: string | null
  cancelled_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  steps?: TransactionStep[]
  documents?: TransactionDocument[]
}

export type CreateTransactionPayload = Pick<
  Transaction,
  'property_id' | 'buyer_id' | 'seller_id' | 'agreed_price' | 'currency'
> & {
  law_firm_id?: string | null
  tax_consultant_id?: string | null
  notes?: string | null
}

// ─── Default steps ────────────────────────────────────────────────────────────

export const DEFAULT_STEPS: { step_number: number; step_name: string }[] = [
  { step_number: 1, step_name: 'Buyer Initiation' },
  { step_number: 2, step_name: 'Partner Assignment' },
  { step_number: 3, step_name: 'Due Diligence' },
  { step_number: 4, step_name: 'Tax Clearance' },
  { step_number: 5, step_name: 'Contract Preparation' },
  { step_number: 6, step_name: 'Escrow Funding' },
  { step_number: 7, step_name: 'Title Transfer' },
  { step_number: 8, step_name: 'Completion & Payout' },
]

// ─── Query keys ──────────────────────────────────────────────────────────────

export const transactionKeys = {
  all: ['transactions'] as const,
  buyer: () => [...transactionKeys.all, 'buyer'] as const,
  seller: () => [...transactionKeys.all, 'seller'] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  steps: (transactionId: string) => [...transactionKeys.all, 'steps', transactionId] as const,
}

const STALE_TIME = 5 * 60 * 1000

// ─── useBuyerTransactions ────────────────────────────────────────────────────

export function useBuyerTransactions() {
  const { user } = useAuthContext()

  return useQuery({
    queryKey: transactionKeys.buyer(),
    enabled: !!user,
    queryFn: async (): Promise<Transaction[]> => {
      if (!user) return []

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('transactions')
        .select('*, properties(id, title, featured_image, deal_type)')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return (data ?? []) as Transaction[]
    },
    staleTime: STALE_TIME,
  })
}

// ─── useSellerTransactions ───────────────────────────────────────────────────

export function useSellerTransactions() {
  const { user } = useAuthContext()

  return useQuery({
    queryKey: transactionKeys.seller(),
    enabled: !!user,
    queryFn: async (): Promise<Transaction[]> => {
      if (!user) return []

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('transactions')
        .select('*, properties(id, title, featured_image, deal_type)')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return (data ?? []) as Transaction[]
    },
    staleTime: STALE_TIME,
  })
}

// ─── useTransaction ──────────────────────────────────────────────────────────

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: transactionKeys.detail(id ?? ''),
    enabled: !!id,
    queryFn: async (): Promise<Transaction | null> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('transactions')
        .select('*, steps:transaction_steps(*), documents:documents(*)')
        .eq('id', id)
        .maybeSingle()

      if (error) throw new Error(error.message)
      return data as Transaction | null
    },
    staleTime: STALE_TIME,
  })
}

// ─── useTransactionSteps ─────────────────────────────────────────────────────

export function useTransactionSteps(transactionId: string | undefined) {
  return useQuery({
    queryKey: transactionKeys.steps(transactionId ?? ''),
    enabled: !!transactionId,
    queryFn: async (): Promise<TransactionStep[]> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('transaction_steps')
        .select('*')
        .eq('transaction_id', transactionId)
        .order('step_number', { ascending: true })

      if (error) throw new Error(error.message)
      return (data ?? []) as TransactionStep[]
    },
    staleTime: STALE_TIME,
  })
}

// ─── useCreateTransaction ────────────────────────────────────────────────────

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateTransactionPayload): Promise<Transaction> => {
      // 1. Create the transaction
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: txData, error: txError } = await (supabase as any)
        .from('transactions')
        .insert({
          ...payload,
          status: 'initiated',
        })
        .select()
        .single()

      if (txError) throw new Error(txError.message)

      const transaction = txData as Transaction

      // 2. Create the 8 default steps (step 1 = active, rest = pending)
      const steps = DEFAULT_STEPS.map((step) => ({
        transaction_id: transaction.id,
        step_number: step.step_number,
        step_name: step.step_name,
        status: step.step_number === 1 ? 'active' : 'pending',
      }))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: stepsError } = await (supabase as any)
        .from('transaction_steps')
        .insert(steps)

      if (stepsError) throw new Error(stepsError.message)

      return transaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.buyer() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.seller() })
    },
  })
}

// ─── useUpdateTransactionStep ─────────────────────────────────────────────────

export interface UpdateStepPayload {
  stepId: string
  transactionId: string
  status: StepStatus
  notes?: string
  completed_at?: string | null
  completed_by?: string | null
}

export function useUpdateTransactionStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateStepPayload): Promise<TransactionStep> => {
      const { stepId, transactionId, status, notes, completed_at, completed_by } = payload

      const update: Partial<TransactionStep> & { updated_at: string } = {
        status,
        updated_at: new Date().toISOString(),
      }

      if (notes !== undefined) update.notes = notes
      if (completed_at !== undefined) update.completed_at = completed_at
      if (completed_by !== undefined) update.completed_by = completed_by

      // If marking completed, set completed_at if not explicitly provided
      if (status === 'completed' && completed_at === undefined) {
        update.completed_at = new Date().toISOString()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('transaction_steps')
        .update(update)
        .eq('id', stepId)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as TransactionStep
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.steps(variables.transactionId) })
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.transactionId) })
    },
  })
}
