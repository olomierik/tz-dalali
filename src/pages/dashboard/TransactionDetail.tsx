import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Download, User, Building2, Phone, Mail, DollarSign, Calendar, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { TransactionStepper } from '@/components/transaction/TransactionStepper'
import { useTransaction, useTransactionSteps } from '@/hooks/useTransactions'

const STATUS_COLORS: Record<string, string> = {
  initiated: 'bg-blue-100 text-blue-700 border-blue-200',
  fee_paid: 'bg-blue-100 text-blue-700 border-blue-200',
  partner_assigned: 'bg-purple-100 text-purple-700 border-purple-200',
  due_diligence: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  contract_prep: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  tax_clearance: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  signing: 'bg-orange-100 text-orange-700 border-orange-200',
  escrow_funded: 'bg-orange-100 text-orange-700 border-orange-200',
  transferred: 'bg-green-100 text-green-700 border-green-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  disputed: 'bg-red-100 text-red-700 border-red-200',
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  )
}

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: tx, isLoading } = useTransaction(id)
  const { data: steps = [], isLoading: stepsLoading } = useTransactionSteps(id)

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!tx) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-primary mb-2">Transaction not found</h2>
        <p className="text-muted-foreground mb-6">This transaction does not exist or you do not have access.</p>
        <Button asChild variant="outline"><Link to="/dashboard/transactions"><ArrowLeft className="h-4 w-4 mr-2" />Back to Transactions</Link></Button>
      </div>
    )
  }

  const agreedPrice = tx.agreed_price ?? 0
  const commission = agreedPrice * 0.10
  const platformFee = agreedPrice * 0.05
  const lawFirmFee = agreedPrice * 0.03
  const taxFee = agreedPrice * 0.02
  const sellerReceives = agreedPrice - commission
  const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`

  const property = (tx as any).properties
  const buyer = (tx as any).buyer
  const seller = (tx as any).seller

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link to="/dashboard/transactions"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl text-primary">Transaction {tx.reference_code}</h1>
          <p className="text-sm text-muted-foreground">{property?.title ?? 'Property'}</p>
        </div>
        <Badge className={`ml-auto text-xs capitalize ${STATUS_COLORS[tx.status] ?? ''}`}>
          {tx.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      {/* Stepper */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Transaction Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {stepsLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <TransactionStepper steps={steps} />
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Summary */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gold" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Agreed Price" value={<span className="text-lg font-bold text-primary">{fmt(agreedPrice)}</span>} />
              <InfoRow label="TzDalali Platform (5%)" value={fmt(platformFee)} />
              <InfoRow label="Law Firm Partner (3%)" value={fmt(lawFirmFee)} />
              <InfoRow label="Tax Consultant (2%)" value={fmt(taxFee)} />
              <InfoRow label="Total Commission (10%)" value={<span className="text-gold font-bold">{fmt(commission)}</span>} />
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between">
                <span className="font-semibold text-green-800">Seller Receives</span>
                <span className="font-bold text-green-800">{fmt(sellerReceives)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Steps detail */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Step Details</CardTitle>
            </CardHeader>
            <CardContent>
              {stepsLoading ? (
                <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
              ) : steps.length === 0 ? (
                <p className="text-muted-foreground text-sm">No step data available.</p>
              ) : (
                <div className="space-y-2">
                  {steps.map(step => (
                    <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                        step.status === 'completed' ? 'bg-green-500 text-white' :
                        step.status === 'active' ? 'bg-gold text-white' :
                        step.status === 'blocked' ? 'bg-red-200 text-red-700' :
                        'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {step.step_number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${step.status === 'active' ? 'text-gold' : step.status === 'completed' ? 'text-green-700' : 'text-foreground'}`}>
                            {step.step_name}
                          </span>
                          <Badge variant="outline" className="text-xs capitalize">{step.status}</Badge>
                        </div>
                        {step.notes && <p className="text-xs text-muted-foreground mt-1">{step.notes}</p>}
                        {step.completed_at && (
                          <p className="text-xs text-muted-foreground mt-1">Completed: {new Date(step.completed_at).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          {(tx.documents?.length ?? 0) > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gold" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tx.documents!.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{doc.name}</span>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Transaction info */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-serif text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gold" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono text-xs">{tx.reference_code}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deal Type</span>
                <span className="capitalize">{(tx as any).deal_type ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency</span>
                <span>{tx.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(tx.created_at).toLocaleDateString()}</span>
              </div>
              {tx.escrow_funded_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Escrow Funded</span>
                  <span>{new Date(tx.escrow_funded_at).toLocaleDateString()}</span>
                </div>
              )}
              {tx.completed_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span>{new Date(tx.completed_at).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Parties */}
          {(buyer || seller) && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-serif text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-gold" />
                  Parties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {buyer && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Buyer</p>
                    <p className="text-sm font-medium">{buyer.full_name ?? 'Buyer'}</p>
                    {buyer.email && <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{buyer.email}</p>}
                  </div>
                )}
                {seller && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Seller</p>
                    <p className="text-sm font-medium">{seller.full_name ?? 'Seller'}</p>
                    {seller.email && <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{seller.email}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Partners */}
          {(tx.law_firm_id || tx.tax_consultant_id) && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-serif text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gold" />
                  Assigned Partners
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tx.law_firm_id && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Law Firm</p>
                    <p className="text-sm font-medium">GODVIL Consult</p>
                    <p className="text-xs text-muted-foreground">Dar es Salaam, Tanzania</p>
                  </div>
                )}
                {tx.tax_consultant_id && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Tax Consultant</p>
                    <p className="text-sm font-medium">PRIME AUDITORS</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />+255 621 468 940</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {tx.notes && (
            <Card className="shadow-card">
              <CardHeader><CardTitle className="font-serif text-base">Notes</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tx.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
