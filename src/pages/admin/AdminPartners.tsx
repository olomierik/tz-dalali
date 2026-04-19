import { useState } from 'react'
import { Search, CheckCircle, XCircle, Scale, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useAdminPartners, useAdminUpdatePartnerStatus } from '@/hooks/useAdminData'
import { TRANSACTION_STATUS_COLORS } from '@/lib/statusColors'

const VERIFICATION_BADGE: Record<string, string> = {
  verified: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  not_submitted: 'bg-muted text-muted-foreground border-border',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

export default function AdminPartners() {
  const { data: partners = [], isLoading } = useAdminPartners()
  const updateStatus = useAdminUpdatePartnerStatus()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = partners.filter(p => {
    const matchSearch = !search
      || (p.full_name ?? '').toLowerCase().includes(search.toLowerCase())
      || p.email.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || p.role === typeFilter
    return matchSearch && matchType
  })

  const approve = (id: string) => updateStatus.mutate(
    { id, status: 'verified' },
    { onSuccess: () => toast.success('Partner approved'), onError: (e: any) => toast.error(e.message) }
  )
  const suspend = (id: string) => updateStatus.mutate(
    { id, status: 'rejected' },
    { onSuccess: () => toast.success('Partner suspended'), onError: (e: any) => toast.error(e.message) }
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl text-primary">Manage Partners</h1>
        <p className="text-muted-foreground mt-1">Law firms and tax consultants in the TzDalali network.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search partners…" className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="sm:w-48 h-9"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Partners</SelectItem>
            <SelectItem value="law_firm">Law Firms</SelectItem>
            <SelectItem value="tax_consultant">Tax Consultants</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deals</TableHead>
              <TableHead>Earned</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                  <Scale className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium">No partners found</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(p => (
                <TableRow key={p.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{p.full_name ?? 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {p.role === 'law_firm'
                        ? <Scale className="h-4 w-4 text-blue-600" />
                        : <Calculator className="h-4 w-4 text-purple-600" />
                      }
                      <span className="text-sm capitalize">{p.role.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs capitalize ${VERIFICATION_BADGE[p.id_verification_status] ?? ''}`}>
                      {p.id_verification_status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{p.total_deals}</TableCell>
                  <TableCell className="text-sm">${(p.total_spent ?? 0).toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {p.id_verification_status !== 'verified' && (
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 text-green-600"
                          onClick={() => approve(p.id)} disabled={updateStatus.isPending}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {p.id_verification_status === 'verified' && (
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 text-red-600"
                          onClick={() => suspend(p.id)} disabled={updateStatus.isPending}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
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
