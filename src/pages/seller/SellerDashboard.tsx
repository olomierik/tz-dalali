import { Link } from 'react-router-dom'
import { Building2, FileText, DollarSign, Plus, ArrowRight, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthContext } from '@/contexts/AuthContext'
import { useProperties } from '@/hooks/useProperties'
import { useSellerTransactions } from '@/hooks/useTransactions'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-muted text-muted-foreground',
  under_offer: 'bg-yellow-100 text-yellow-700',
  sold: 'bg-blue-100 text-blue-700',
  rented: 'bg-blue-100 text-blue-700',
  inactive: 'bg-red-100 text-red-700',
}

const TX_STATUS_COLORS: Record<string, string> = {
  initiated: 'bg-blue-100 text-blue-700',
  partner_assigned: 'bg-purple-100 text-purple-700',
  due_diligence: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-semibold text-lg text-primary">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SellerDashboard() {
  const { profile } = useAuthContext()
  const { data: transactions = [], isLoading: txLoading } = useSellerTransactions()
  const { data: listings = [], isLoading: listingsLoading } = useProperties({ status: 'active' })

  const myListings = listings.filter(p => p.seller_id === profile?.id)
  const activeTransactions = transactions.filter(t => !['completed', 'cancelled'].includes(t.status))
  const totalEarnings = profile?.total_spent ?? 0

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-primary">Seller Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your listings and track deals.</p>
        </div>
        <Button asChild variant="gold">
          <Link to="/seller/listings/new"><Plus className="h-4 w-4 mr-2" />New Listing</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Building2} label="Active Listings" value={myListings.length} />
        <StatCard icon={FileText} label="Active Deals" value={activeTransactions.length} />
        <StatCard icon={DollarSign} label="Total Earned" value={`$${totalEarnings.toLocaleString()}`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent listings */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-serif text-xl">My Listings</CardTitle>
            <Link to="/seller/listings" className="text-sm text-gold hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </CardHeader>
          <CardContent>
            {listingsLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : myListings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm mb-4">No listings yet</p>
                <Button asChild variant="outline" size="sm"><Link to="/seller/listings/new"><Plus className="h-4 w-4 mr-1" />Create First Listing</Link></Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myListings.slice(0, 4).map(p => (
                  <Link key={p.id} to={`/seller/listings/${p.id}/edit`} className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-muted transition-colors">
                    {p.featured_image ? (
                      <img src={p.featured_image} alt={p.title} className="w-12 h-10 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">${p.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`text-xs capitalize ${STATUS_COLORS[p.status] ?? 'bg-muted'}`}>{p.status}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Eye className="h-3 w-3" />{p.views}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active deals */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-serif text-xl">Active Deals</CardTitle>
            <Link to="/seller/transactions" className="text-sm text-gold hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : activeTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No active deals</p>
                <p className="text-xs text-muted-foreground mt-1">Deals appear here when buyers initiate on your listings</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTransactions.slice(0, 4).map(tx => (
                  <Link key={tx.id} to={`/dashboard/transactions/${tx.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-muted transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-muted-foreground">{tx.reference_code}</p>
                      <p className="text-sm font-medium">${tx.agreed_price?.toLocaleString()}</p>
                    </div>
                    <Badge className={`text-xs ${TX_STATUS_COLORS[tx.status] ?? 'bg-muted text-muted-foreground'}`}>{tx.status.replace(/_/g, ' ')}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
