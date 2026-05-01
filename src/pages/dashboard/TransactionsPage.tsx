import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuthContext } from "@/contexts/AuthContext";
import { FileText, ExternalLink, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  initiated: { color: 'bg-blue-100 text-blue-700', icon: Clock },
  partner_assigned: { color: 'bg-purple-100 text-purple-700', icon: Clock },
  due_diligence: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  tax_clearance: { color: 'bg-orange-100 text-orange-700', icon: Clock },
  contract_prep: { color: 'bg-indigo-100 text-indigo-700', icon: Clock },
  escrow_funded: { color: 'bg-teal-100 text-teal-700', icon: Clock },
  title_transfer: { color: 'bg-cyan-100 text-cyan-700', icon: Clock },
  completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-700', icon: AlertCircle },
  disputed: { color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

const STEP_LABELS: Record<string, string> = {
  initiated: 'Initiation',
  partner_assigned: 'Partner Assigned',
  due_diligence: 'Due Diligence',
  tax_clearance: 'Tax Clearance',
  contract_prep: 'Contract Prep',
  escrow_funded: 'Escrow Funded',
  title_transfer: 'Title Transfer',
  completed: 'Completed',
};

export default function TransactionsPage() {
  const { profile } = useAuthContext();
  const { data: transactions, isLoading } = useTransactions({ 
    buyer_id: profile?.id 
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold mb-2">My Transactions</h1>
        <p className="text-gray-500">
          Track your property transactions
        </p>
      </div>

      {transactions && transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map(transaction => {
            const config = statusConfig[transaction.status] || statusConfig.initiated;
            const StatusIcon = config.icon;
            
            return (
              <Card key={transaction.id} className="hover:border-gold/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(transaction as any).properties?.featured_image ? (
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        <img 
                          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                          src={(transaction as any).properties.featured_image} 
                          alt="Property"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FileText className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold mb-1">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(transaction as any).properties?.title || 'Property Transaction'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Ref: {transaction.reference_code} • {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={config.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {STEP_LABELS[transaction.status] || transaction.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                        <span className="font-semibold text-gold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: transaction.currency || 'USD',
                            maximumFractionDigits: 0,
                          }).format(transaction.agreed_price)}
                        </span>
                        <span className="text-gray-500">
                          Step {transaction.current_step} of 8
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dashboard/transactions/${transaction.id}`}>
                        View Details
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
            <p className="text-gray-500 mb-6">Start your first property transaction</p>
            <Button asChild>
              <Link to="/listings">Browse Properties</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}