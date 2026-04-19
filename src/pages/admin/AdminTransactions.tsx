import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAdminTransactions } from '@/hooks/useAdminData'
import { TRANSACTION_STATUS_COLORS, ACTIVE_TX_STATUSES } from '@/lib/statusColors'

export default function AdminTransactions() {
  const { data: transactions = [], isLoading } = useAdminTransactions()
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = transactions.filter(tx => {
    const tabMatch =
      tab === 'all' ||
      (tab === 'active' && ACTIVE_TX_STATUSES.includes(tx.status)) ||
      (tab === 'completed' && tx.status === 'completed') ||
      (tab === 'cancelled' && ['cancelled', 'disputed'].includes(tx.status))
    const searchMatch = !search || tx.reference_code?.toLowerCase().includes(search.toLowerCase())
    return tabMatch && searchMatch
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl text-primary">All Transactions</h1>
        <p className="text-muted-foreground mt-1">Platform-wide transaction overview.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Tabs value={tab} onValueChange={setTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({transactions.filter(t => ACTIVE_TX_STATUSES.includes(t.status)).length})</TabsTrigger>
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
              <TableHead>Deal Value</TableHead>
              <TableHead>Platform (5%)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Step</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No transactions found</TableCell>
              </TableRow>
            ) : (
              filtered.map(tx => (
                <TableRow key={tx.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">{tx.reference_code}</TableCell>
                  <TableCell className="max-w-[140px] truncate text-sm">{(tx as any).properties?.title ?? '—'}</TableCell>
                  <TableCell className="text-sm font-medium">${tx.agreed_price?.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-gold font-medium">
                    ${((tx.agreed_price ?? 0) * 0.05).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs capitalize ${TRANSACTION_STATUS_COLORS[tx.status] ?? ''}`}>
                      {tx.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
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
