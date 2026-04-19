import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBuyerTransactions } from '@/hooks/useTransactions'

const STATUS_COLORS: Record<string, string> = {
  initiated: 'bg-blue-100 text-blue-700 border-blue-200',
  fee_paid: 'bg-blue-100 text-blue-700 border-blue-200',
  partner_assigned: 'bg-purple-100 text-purple-700 border-purple-200',
  due_diligence: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  contract_prep: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  tax_clearance: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  signing: 'bg-orange-100 text-orange-700 border-orange-200',
  escrow_funded: 'bg-orange-100 text-orange-700 border-orange-200',
  transferred: 'bg-green-100 text-green-700 border-green-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  disputed: 'bg-red-100 text-red-700 border-red-200',
}

const TAB_FILTERS: Record<string, string[]> = {
  all: [],
  active: ['initiated','fee_paid','partner_assigned','due_diligence','contract_prep','tax_clearance','signing','escrow_funded','transferred'],
  completed: ['completed'],
  cancelled: ['cancelled','disputed'],
}

export default function MyTransactions() {
  const { data: transactions = [], isLoading } = useBuyerTransactions()
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = transactions.filter(tx => {
    const tabMatch = TAB_FILTERS[tab].length === 0 || TAB_FILTERS[tab].includes(tx.status)
    const searchMatch = !search || tx.reference_code?.toLowerCase().includes(search.toLowerCase())
    return tabMatch && searchMatch
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl text-primary">My Transactions</h1>
        <p className="text-muted-foreground mt-1">Track all your property transactions.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Tabs value={tab} onValueChange={setTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({transactions.filter(t => TAB_FILTERS.active.includes(t.status)).length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({transactions.filter(t => t.status === 'completed').length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reference…" className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Step</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>{Array.from({ length: 8 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No transactions found</TableCell></TableRow>
            ) : (
              filtered.map(tx => (
                <TableRow key={tx.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">{tx.reference_code}</TableCell>
                  <TableCell className="max-w-[160px] truncate text-sm">{(tx as any).properties?.title ?? '—'}</TableCell>
                  <TableCell className="capitalize text-sm">{tx.deal_type}</TableCell>
                  <TableCell className="text-sm font-medium">${tx.agreed_price?.toLocaleString()}</TableCell>
                  <TableCell><Badge className={`text-xs capitalize ${STATUS_COLORS[tx.status] ?? ''}`}>{tx.status.replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell className="text-sm">{tx.current_step}/8</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link to={`/dashboard/transactions/${tx.id}`}><ExternalLink className="h-4 w-4" /></Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
