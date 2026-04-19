import { useState } from 'react'
import { CheckCircle, XCircle, Eye, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAdminListings, useAdminUpdateListingStatus } from '@/hooks/useAdminData'
import { PROPERTY_STATUS_COLORS } from '@/lib/statusColors'

export default function AdminListings() {
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const statusFilter = tab === 'all' ? undefined : tab

  const { data: properties = [], isLoading } = useAdminListings(statusFilter, search || undefined)
  const updateStatus = useAdminUpdateListingStatus()

  const approve = (id: string) => updateStatus.mutate(
    { id, status: 'active' },
    { onSuccess: () => toast.success('Listing approved and published'), onError: (e: any) => toast.error(e.message) }
  )
  const reject = (id: string) => updateStatus.mutate(
    { id, status: 'inactive' },
    { onSuccess: () => toast.success('Listing rejected'), onError: (e: any) => toast.error(e.message) }
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl text-primary">Manage Listings</h1>
        <p className="text-muted-foreground mt-1">Review and approve property listings.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Tabs value={tab} onValueChange={setTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Pending Review</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search listings…"
            className="pl-9 h-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-28">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No listings found</TableCell>
              </TableRow>
            ) : (
              properties.map(p => (
                <TableRow key={p.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {p.featured_image && (
                        <img src={p.featured_image} alt={p.title} className="w-10 h-8 rounded object-cover flex-shrink-0" />
                      )}
                      <span className="font-medium text-sm truncate max-w-[160px]">{p.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{(p as any).users?.email ?? '—'}</TableCell>
                  <TableCell className="text-sm capitalize">{p.property_type}</TableCell>
                  <TableCell className="text-sm">${p.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs capitalize ${PROPERTY_STATUS_COLORS[p.status] ?? ''}`}>
                      {p.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                        <Link to={`/listings/${p.id}`}><Eye className="h-3.5 w-3.5" /></Link>
                      </Button>
                      {p.status === 'draft' && (
                        <>
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:text-green-700"
                            onClick={() => approve(p.id)} disabled={updateStatus.isPending}
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:text-red-700"
                            onClick={() => reject(p.id)} disabled={updateStatus.isPending}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </>
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
