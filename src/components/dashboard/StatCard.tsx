import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  sub?: string
  alert?: boolean
  href?: string
}

export function StatCard({ icon: Icon, label, value, sub, alert, href }: StatCardProps) {
  const content = (
    <Card className={`shadow-card ${alert ? 'border-amber-200' : ''} ${href ? 'hover:border-gold/30 cursor-pointer transition-colors' : ''}`}>
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
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return content;
}