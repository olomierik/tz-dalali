interface PriceDisplayProps {
  price: number
  currency?: string
  priceUsd?: number | null
  negotiable?: boolean
  period?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SYMBOLS: Record<string, string> = {
  USD: '$', TZS: 'TSh', KES: 'KSh', GBP: '£', AED: 'AED',
  EUR: '€', ZAR: 'R', NGN: '₦', GHS: 'GH₵',
}

function fmt(n: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n)
  } catch {
    return `${SYMBOLS[currency] ?? currency} ${n.toLocaleString()}`
  }
}

export function PriceDisplay({
  price,
  currency = 'USD',
  priceUsd,
  negotiable = false,
  period,
  size = 'md',
  className,
}: PriceDisplayProps) {
  const sizeClass = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'

  return (
    <div className={className}>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={`font-serif font-semibold text-primary ${sizeClass}`}>
          {fmt(price, currency)}
          {period && <span className="text-sm font-normal text-muted-foreground ml-1">/{period}</span>}
        </span>
        {negotiable && (
          <span className="text-xs text-gold border border-gold/40 px-1.5 py-0.5 rounded">
            Negotiable
          </span>
        )}
      </div>
      {priceUsd != null && currency !== 'USD' && (
        <p className="text-xs text-muted-foreground mt-0.5">≈ {fmt(priceUsd, 'USD')}</p>
      )}
    </div>
  )
}
