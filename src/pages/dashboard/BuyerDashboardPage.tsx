import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSavedProperties } from "@/hooks/useProperties";
import { useTransactions } from "@/hooks/useTransactions";
import { useNotifications } from "@/hooks/useNotifications";
import { Heart, FileText, Bell, Building2, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/dashboard/StatCard";

export default function BuyerDashboardPage() {
  const { profile } = useAuthContext();
  const { data: savedIds } = useSavedProperties();
  const { data: transactions } = useTransactions({ buyer_id: profile?.id });
  const { data: notifications } = useNotifications();
  
  const activeDeals = transactions?.filter(t => 
    ['initiated', 'partner_assigned', 'due_diligence', 'tax_clearance', 'contract_prep', 'escrow_funded'].includes(t.status)
  ).length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-serif text-3xl font-bold mb-2">
          Welcome back, {profile?.full_name || profile?.email?.split('@')[0] || 'Guest'}
        </h1>
        <p className="text-gray-500">Manage your property searches and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Heart}
          label="Saved Properties"
          value={savedIds?.length || 0}
          href="/dashboard/saved"
        />
        <StatCard
          icon={FileText}
          label="Active Transactions"
          value={activeDeals}
          href="/dashboard/transactions"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Spent"
          value={`$${profile?.total_spent?.toLocaleString() || '0'}`}
        />
        <StatCard
          icon={Bell}
          label="Notifications"
          value={notifications?.filter(n => !n.is_read).length || 0}
          href="/dashboard/notifications"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gold" />
              Continue Browsing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link 
              to="/listings" 
              className="block p-4 rounded-lg border border-gray-200 hover:border-gold/30 hover:bg-gold/5 transition-colors"
            >
              <h3 className="font-semibold mb-1">Browse Properties</h3>
              <p className="text-sm text-gray-500">Find your next investment or home</p>
            </Link>
            <Link 
              to="/cars" 
              className="block p-4 rounded-lg border border-gray-200 hover:border-gold/30 hover:bg-gold/5 transition-colors"
            >
              <h3 className="font-semibold mb-1">Browse Cars</h3>
              <p className="text-sm text-gray-500">Verified vehicles worldwide</p>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {transactions.slice(0, 3).map((t: any) => (
                  <Link 
                    key={t.id} 
                    to={`/dashboard/transactions/${t.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{t.properties?.title || 'Transaction'}</p>
                      <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">{t.status.replace('_', ' ')}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No active transactions</p>
                <p className="text-sm">Start by browsing properties</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}