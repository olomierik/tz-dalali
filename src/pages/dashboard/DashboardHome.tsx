import { Link } from 'react-router-dom'
import { FileText, Heart, CheckCircle, DollarSign, AlertTriangle, ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuthContext } from '@/contexts/AuthContext'
import { useBuyerTransactions } from '@/hooks/useTransactions'
import { useSavedProperties, useProperties } from '@/hooks/useProperties'
import { PropertyGrid } from '@/components/properties/PropertyGrid'

const TX_STATUS_COLORS: Record<string, string> = {
  initiated: 'bg-blue-100 text-blue-700',
  fee_paid: 'bg-blue-100 text-blue-700',
  partner_assigned: 'bg-purple-100 text-purple-700',
  due_diligence: 'bg-yellow-100 text-yellow-700',
  contract_prep: 'bg-yellow-100 text-yellow-700',
  tax_clearance: 'bg-yellow-100 text-yellow-700',
  signing: 'bg-orange-100 text-orange-700',
  escrow_funded: 'bg-orange-100 text-orange-700',
  transferred: 'bg-green-100 text-green-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  disputed: 'bg-red-100 text-red-700',
}

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub?: string }) {
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
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardHome() {
  const { profile } = useAuthContext()
  const { data: transactions = [], isLoading: txLoading } = useBuyerTransactions()
  const { data: savedIds = [] } = useSavedProperties()
  const { data: savedProps = [], isLoading: savedLoading } = useProperties({ status: 'active' })

  const activeTransactions = transactions.filter(t => !['completed', 'cancelled'].includes(t.status))
  const completedDeals = profile?.total_deals ?? 0
  const totalSpent = profile?.total_spent ?? 0
  const savedCount = savedIds.length
  const recentSaved = savedProps.filter(p => savedIds.includes(p.id)).slice(0, 3)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl text-primary">Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!</h1>
        <p className="text-muted-foreground mt-1">Here's your TzDalali activity overview.</p>
      </div>

      {profile?.id_verification_status === 'pending' && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-amber-800">Complete your ID verification to initiate property transactions.</span>
            <Button asChild variant="outline" size="sm" className="border-amber-400 text-amber-700 hover:bg-amber-100">
              <Link to="/dashboard/profile">Verify Now</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Active Transactions" value={activeTransactions.length} />
        <StatCard icon={Heart} label="Saved Properties" value={savedCount} />
        <StatCard icon={CheckCircle} label="Completed Deals" value={completedDeals} />
        <StatCard icon={DollarSign} label="Total Spent" value={`$${totalSpent.toLocaleString()}`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-serif text-xl">Active Transactions</CardTitle>
            <Link to="/dashboard/transactions" className="text-sm text-gold hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : activeTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm mb-4">No active transactions</p>
                <Button asChild variant="outline" size="sm"><Link to="/listings"><Plus className="h-4 w-4 mr-1" />Browse Properties</Link></Button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTransactions.slice(0, 3).map(tx => (
                  <Link key={tx.id} to={`/dashboard/transactions/${tx.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-muted transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-muted-foreground">{tx.reference_code}</p>
                      <p className="text-sm font-medium truncate">{(tx as any).properties?.title ?? 'Property'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge className={`text-xs ${TX_STATUS_COLORS[tx.status] ?? 'bg-muted text-muted-foreground'}`}>{tx.status.replace(/_/g, ' ')}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Step {tx.current_step}/8</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-serif text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="gold" className="w-full justify-start gap-2"><Link to="/listings"><Plus className="h-4 w-4" />Browse Properties</Link></Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2"><Link to="/seller/listings/new"><FileText className="h-4 w-4" />List a Property ($50)</Link></Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2"><Link to="/dashboard/transactions"><CheckCircle className="h-4 w-4" />My Transactions</Link></Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2"><Link to="/dashboard/saved"><Heart className="h-4 w-4" />Saved Properties</Link></Button>
          </CardContent>
        </Card>
      </div>

      {recentSaved.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-primary">Recently Saved</h2>
            <Link to="/dashboard/saved" className="text-sm text-gold hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <PropertyGrid properties={recentSaved} loading={savedLoading} savedIds={savedIds} />
        </div>
      )}
    </div>
  )
}
