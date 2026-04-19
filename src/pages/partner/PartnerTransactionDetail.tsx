import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TransactionStepper } from '@/components/transaction/TransactionStepper'
import { useTransaction, useTransactionSteps, useUpdateTransactionStep } from '@/hooks/useTransactions'
import { useAuthContext } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const STATUS_COLORS: Record<string, string> = {
  initiated: 'bg-blue-100 text-blue-700 border-blue-200',
  partner_assigned: 'bg-purple-100 text-purple-700 border-purple-200',
  due_diligence: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  contract_prep: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  tax_clearance: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  escrow_funded: 'bg-orange-100 text-orange-700 border-orange-200',
  title_transfer: 'bg-orange-100 text-orange-700 border-orange-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

export default function PartnerTransactionDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthContext()
  const { data: tx, isLoading } = useTransaction(id)
  const { data: steps = [], isLoading: stepsLoading } = useTransactionSteps(id)
  const updateStep = useUpdateTransactionStep()
  const [notes, setNotes] = useState('')
  const [completing, setCompleting] = useState<string | null>(null)

  const activeStep = steps.find(s => s.status === 'active')

  const handleCompleteStep = async (stepId: string) => {
    if (!user) return
    setCompleting(stepId)
    try {
      await updateStep.mutateAsync({
        stepId,
        transactionId: id!,
        status: 'completed',
        notes: notes || undefined,
        completed_by: user.id,
      })
      setNotes('')
      toast.success('Step marked as completed')
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to update step')
    } finally {
      setCompleting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!tx) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-primary mb-2">Transaction not found</h2>
        <Button asChild variant="outline"><Link to="/partner/transactions"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link></Button>
      </div>
    )
  }

  const agreedPrice = tx.agreed_price ?? 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link to="/partner/transactions"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl text-primary">Transaction {tx.reference_code}</h1>
          <p className="text-sm text-muted-foreground">{(tx as any).properties?.title ?? 'Property'}</p>
        </div>
        <Badge className={`ml-auto text-xs capitalize ${STATUS_COLORS[tx.status] ?? ''}`}>{tx.status.replace(/_/g, ' ')}</Badge>
      </div>

      {/* Stepper */}
      <Card className="shadow-card">
        <CardHeader><CardTitle className="font-serif text-lg">Transaction Progress</CardTitle></CardHeader>
        <CardContent>
          {stepsLoading ? <Skeleton className="h-20 w-full" /> : <TransactionStepper steps={steps} />}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Active step action */}
          {activeStep && (
            <Card className="shadow-card border-gold/30">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-gold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Current Step: {activeStep.step_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Complete your work for this step, then mark it as done to advance the transaction.
                </p>
                <div className="space-y-1.5">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add notes about this step completion…"
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="gold"
                    onClick={() => handleCompleteStep(activeStep.id)}
                    disabled={completing === activeStep.id}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {completing === activeStep.id ? 'Saving…' : 'Mark Step Complete'}
                  </Button>
                  <Button variant="outline" asChild>
                    <label className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                      <input type="file" className="sr-only" onChange={() => toast.info('Document upload requires Supabase Storage setup.')} />
                    </label>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All steps */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-serif text-lg">All Steps</CardTitle></CardHeader>
            <CardContent>
              {stepsLoading ? (
                <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : (
                <div className="space-y-2">
                  {steps.map(step => (
                    <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        step.status === 'completed' ? 'bg-green-500 text-white' :
                        step.status === 'active' ? 'bg-gold text-white' :
                        'bg-muted text-muted-foreground border border-border'
                      }`}>{step.step_number}</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{step.step_name}</span>
                          <Badge variant="outline" className="text-xs capitalize">{step.status}</Badge>
                        </div>
                        {step.notes && <p className="text-xs text-muted-foreground mt-0.5">{step.notes}</p>}
                        {step.completed_at && <p className="text-xs text-muted-foreground mt-0.5">Done: {new Date(step.completed_at).toLocaleDateString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <Card className="shadow-card h-fit">
          <CardHeader><CardTitle className="font-serif text-base">Financial Summary</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Deal Value</span><span className="font-semibold">${agreedPrice.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Your Fee (3%)</span><span className="text-green-700 font-bold">${(agreedPrice * 0.03).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span>{tx.currency}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Initiated</span><span>{new Date(tx.created_at).toLocaleDateString()}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
