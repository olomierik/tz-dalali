import { Link } from 'react-router-dom'
import { Users, Building2, FileText, DollarSign, ArrowRight, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { StatCard } from '@/components/dashboard/StatCard'

interface PlatformStats {
  total_users: number
  total_properties: number
  total_transactions: number
  active_transactions: number
  completed_transactions: number
  total_revenue: number
  pending_listings: number
  pending_verifications: number
}

function usePlatformStats() {
  return useQuery({
    queryKey: ['admin-platform-stats'],
    queryFn: async (): Promise<PlatformStats | null> => {
      const { data, error } = await (supabase as any)
        .from('platform_stats')
        .select('*')
        .maybeSingle()
      if (error) {
        console.error('platform_stats error:', error.message)
        return null
      }
      return data as PlatformStats | null
    },
    staleTime: 5 * 60 * 1000,
  })
}


export default function AdminDashboard() {
  const { data: stats, isLoading } = usePlatformStats()

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management.</p>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : (
          <>
            <StatCard icon={Users} label="Total Users" value={stats?.total_users ?? '—'} />
            <StatCard icon={Building2} label="Total Listings" value={stats?.total_properties ?? '—'} />
            <StatCard icon={FileText} label="Active Deals" value={stats?.active_transactions ?? '—'} />
            <StatCard icon={DollarSign} label="Platform Revenue" value={stats ? `$${(stats.total_revenue ?? 0).toLocaleString()}` : '—'} />
            <StatCard icon={AlertTriangle} label="Pending Listings" value={stats?.pending_listings ?? 0} alert={(stats?.pending_listings ?? 0) > 0} />
            <StatCard icon={AlertTriangle} label="Pending Verifications" value={stats?.pending_verifications ?? 0} alert={(stats?.pending_verifications ?? 0) > 0} />
            <StatCard icon={FileText} label="Completed Deals" value={stats?.completed_transactions ?? '—'} />
            <StatCard icon={Building2} label="Published Listings" value={stats?.total_properties ?? '—'} />
          </>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: '/admin/listings', label: 'Manage Listings', badge: stats?.pending_listings },
          { to: '/admin/users', label: 'Manage Users', badge: stats?.pending_verifications },
          { to: '/admin/partners', label: 'Manage Partners', badge: null },
          { to: '/admin/transactions', label: 'All Transactions', badge: null },
        ].map(action => (
          <Link key={action.to} to={action.to} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg shadow-card hover:shadow-luxe hover:border-gold/30 transition-all">
            <span className="font-medium text-sm">{action.label}</span>
            <div className="flex items-center gap-2">
              {!!action.badge && action.badge > 0 && <Badge className="bg-amber-100 text-amber-700 text-xs">{action.badge}</Badge>}
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
