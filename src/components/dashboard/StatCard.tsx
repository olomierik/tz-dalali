import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  sub?: string
  alert?: boolean
}

export function StatCard({ icon: Icon, label, value, sub, alert }: StatCardProps) {
  return (
    <Card className={`shadow-card ${alert ? 'border-amber-200' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert ? 'bg-amber-100' : 'bg-gold/10'}`}>
            <Icon className={`h-5 w-5 ${alert && Number(value) > 0 ? 'text-amber-600' : 'text-gold'}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`font-semibold text-lg ${alert && Number(value) > 0 ? 'text-amber-700' : 'text-primary'}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
