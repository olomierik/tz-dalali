import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Search, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/contexts/AuthContext'
import { Transaction } from '@/hooks/useTransactions'

const STATUS_COLORS: Record<string, string> = {
  partner_assigned: 'bg-purple-100 text-purple-700 border-purple-200',
  due_diligence: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  contract_prep: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  tax_clearance: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  escrow_funded: 'bg-orange-100 text-orange-700 border-orange-200',
  title_transfer: 'bg-orange-100 text-orange-700 border-orange-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

function usePartnerTransactions() {
  const { user, profile } = useAuthContext()
  const field = profile?.role === 'law_firm' ? 'law_firm_id' : 'tax_consultant_id'

  return useQuery({
    queryKey: ['partner-transactions', user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Transaction[]> => {
      if (!user) return []
      const { data, error } = await (supabase as any)
        .from('transactions')
        .select('*, properties(title)')
        .eq(field, user.id)
        .order('created_at', { ascending: false })
      if (error) throw new Error(error.message)
      return (data ?? []) as Transaction[]
    },
    staleTime: 5 * 60 * 1000,
  })
}

export default function PartnerTransactions() {
  const { data: transactions = [], isLoading } = usePartnerTransactions()
  const [search, setSearch] = useState('')

  const filtered = transactions.filter(tx =>
    !search || tx.reference_code?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl text-primary">Assigned Transactions</h1>
        <p className="text-muted-foreground mt-1">Transactions assigned to your firm by TzDalali.</p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search reference…" className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Deal Value</TableHead>
              <TableHead>Your Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>{Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                  <FileCheck className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium">No assignments yet</p>
                  <p className="text-sm mt-1">TzDalali will assign transactions based on jurisdiction.</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(tx => {
                const fee = (tx.agreed_price ?? 0) * 0.03
                return (
                  <TableRow key={tx.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">{tx.reference_code}</TableCell>
                    <TableCell className="max-w-[140px] truncate text-sm">{(tx as any).properties?.title ?? '—'}</TableCell>
                    <TableCell className="text-sm font-medium">${tx.agreed_price?.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-green-700 font-medium">${fee.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                    <TableCell><Badge className={`text-xs capitalize ${STATUS_COLORS[tx.status] ?? ''}`}>{tx.status.replace(/_/g, ' ')}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link to={`/partner/transactions/${tx.id}`}><ExternalLink className="h-4 w-4" /></Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
