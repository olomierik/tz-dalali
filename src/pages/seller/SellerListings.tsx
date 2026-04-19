import { Link } from 'react-router-dom'
import { Plus, Edit, Eye, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuthContext } from '@/contexts/AuthContext'
import { useProperties } from '@/hooks/useProperties'
import { PROPERTY_STATUS_COLORS } from '@/lib/statusColors'

export default function SellerListings() {
  const { profile } = useAuthContext()
  const { data: myProperties = [], isLoading } = useProperties({ seller_id: profile?.id })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-primary">My Listings</h1>
          <p className="text-muted-foreground mt-1">Manage your property listings.</p>
        </div>
        <Button asChild variant="gold">
          <Link to="/seller/listings/new"><Plus className="h-4 w-4 mr-2" />New Listing — $50</Link>
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Listed</TableHead>
              <TableHead className="w-20"></TableHead>
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
            ) : myProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                  <Building2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium">No listings yet</p>
                  <p className="text-sm mt-1 mb-4">Pay $50 to list your first property globally.</p>
                  <Button asChild variant="gold" size="sm">
                    <Link to="/seller/listings/new"><Plus className="h-4 w-4 mr-1" />Create Listing</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              myProperties.map(p => (
                <TableRow key={p.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {p.featured_image ? (
                        <img src={p.featured_image} alt={p.title} className="w-10 h-8 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="font-medium text-sm truncate max-w-[200px]">{p.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm capitalize">{p.property_type}</TableCell>
                  <TableCell className="text-sm font-medium">${p.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs capitalize ${PROPERTY_STATUS_COLORS[p.status] ?? ''}`}>
                      {p.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.views}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link to={`/listings/${p.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link to={`/seller/listings/${p.id}/edit`}><Edit className="h-4 w-4" /></Link>
                      </Button>
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
