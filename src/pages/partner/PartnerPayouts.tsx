import { DollarSign, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuthContext } from '@/contexts/AuthContext'
import { usePartnerPayouts } from '@/hooks/usePartnerData'
import { PAYOUT_STATUS_COLORS } from '@/lib/statusColors'

export default function PartnerPayouts() {
  const { data: payouts = [], isLoading } = usePartnerPayouts()
  const { profile } = useAuthContext()

  const totalPaid = payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl text-primary">Payouts</h1>
        <p className="text-muted-foreground mt-1">Your commission payout history.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="font-bold text-lg text-primary">${totalPaid.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="font-bold text-lg text-primary">${totalPending.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Commission Rate</p>
              <p className="font-bold text-lg text-primary">{profile?.role === 'law_firm' ? '3%' : '2%'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Paid At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : payouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                  <DollarSign className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium">No payouts yet</p>
                  <p className="text-sm mt-1">Payouts are released when deals complete.</p>
                </TableCell>
              </TableRow>
            ) : (
              payouts.map(p => (
                <TableRow key={p.id} className="hover:bg-muted/50">
                  <TableCell className="text-sm">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-bold text-sm">${p.amount.toLocaleString()} {p.currency}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs capitalize ${PAYOUT_STATUS_COLORS[p.status] ?? ''}`}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{p.reference ?? '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : '—'}
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
