import { Link } from 'react-router-dom'
import { FileText, CheckCircle, DollarSign, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthContext } from '@/contexts/AuthContext'

const TX_STATUS_COLORS: Record<string, string> = {
  partner_assigned: 'bg-purple-100 text-purple-700',
  due_diligence: 'bg-yellow-100 text-yellow-700',
  contract_prep: 'bg-yellow-100 text-yellow-700',
  tax_clearance: 'bg-yellow-100 text-yellow-700',
  escrow_funded: 'bg-orange-100 text-orange-700',
  title_transfer: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
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

export default function PartnerDashboard() {
  const { profile } = useAuthContext()

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl text-primary">Partner Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your assigned transactions and track earnings.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={FileText} label="Active Assignments" value="—" />
        <StatCard icon={CheckCircle} label="Completed Deals" value={profile?.total_deals ?? 0} />
        <StatCard icon={DollarSign} label="Total Earned" value={`$${(profile?.total_spent ?? 0).toLocaleString()}`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-serif text-xl">Active Assignments</CardTitle>
            <Link to="/partner/transactions" className="text-sm text-gold hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm mb-2">No active assignments</p>
              <p className="text-xs text-muted-foreground">TzDalali will assign transactions based on jurisdiction and availability.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Partner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Firm Name</p>
              <p className="font-medium">{profile?.full_name ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Role</p>
              <Badge variant="outline" className="capitalize">{profile?.role === 'law_firm' ? 'Law Firm Partner' : 'Tax Consultant Partner'}</Badge>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Commission Rate</p>
              <p className="font-medium">{profile?.role === 'law_firm' ? '3%' : '2%'} of deal value</p>
            </div>
            <div className="pt-2">
              <Button asChild variant="outline" size="sm" className="w-full"><Link to="/partner/profile">Update Profile</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
