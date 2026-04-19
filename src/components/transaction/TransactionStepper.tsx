import { Check, Circle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TransactionStep, StepStatus } from '@/hooks/useTransactions'

interface TransactionStepperProps {
  steps: TransactionStep[]
  className?: string
}

const stepStatusClass: Record<StepStatus, string> = {
  completed: 'bg-green-500 border-green-500 text-white',
  active: 'bg-gold border-gold text-white',
  pending: 'bg-muted border-border text-muted-foreground',
  blocked: 'bg-red-100 border-red-300 text-red-600',
}

const connectorClass: Record<StepStatus, string> = {
  completed: 'bg-green-400',
  active: 'bg-gold/50',
  pending: 'bg-border',
  blocked: 'bg-red-200',
}

function StepIcon({ status, stepNumber }: { status: StepStatus; stepNumber: number }) {
  if (status === 'completed') return <Check className="h-3.5 w-3.5" />
  if (status === 'active') return <Clock className="h-3.5 w-3.5" />
  if (status === 'blocked') return <Circle className="h-3.5 w-3.5" />
  return <span className="text-xs font-semibold">{stepNumber}</span>
}

export function TransactionStepper({ steps, className }: TransactionStepperProps) {
  if (!steps || steps.length === 0) return null

  const sorted = [...steps].sort((a, b) => a.step_number - b.step_number)

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop horizontal stepper */}
      <div className="hidden md:flex items-start">
        {sorted.map((step, idx) => {
          const isLast = idx === sorted.length - 1
          return (
            <div key={step.id} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300',
                    stepStatusClass[step.status]
                  )}
                >
                  <StepIcon status={step.status} stepNumber={step.step_number} />
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs text-center leading-tight max-w-[80px]',
                    step.status === 'active'
                      ? 'text-gold font-semibold'
                      : step.status === 'completed'
                      ? 'text-green-600 font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.step_name}
                </span>
              </div>
              {!isLast && (
                <div className="flex-1 mt-4 mx-1">
                  <div
                    className={cn('h-0.5 w-full transition-colors duration-300', connectorClass[step.status])}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile vertical stepper */}
      <div className="flex flex-col md:hidden gap-0">
        {sorted.map((step, idx) => {
          const isLast = idx === sorted.length - 1
          return (
            <div key={step.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-300',
                    stepStatusClass[step.status]
                  )}
                >
                  <StepIcon status={step.status} stepNumber={step.step_number} />
                </div>
                {!isLast && <div className={cn('w-0.5 flex-1 min-h-[24px] mt-1', connectorClass[step.status])} />}
              </div>
              <div className="pb-4">
                <p
                  className={cn(
                    'text-sm font-medium',
                    step.status === 'active'
                      ? 'text-gold'
                      : step.status === 'completed'
                      ? 'text-green-600'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.step_name}
                </p>
                {step.status === 'active' && (
                  <p className="text-xs text-muted-foreground mt-0.5">In progress</p>
                )}
                {step.status === 'completed' && step.completed_at && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(step.completed_at).toLocaleDateString()}
                  </p>
                )}
                {step.notes && (
                  <p className="text-xs text-muted-foreground mt-1 italic">{step.notes}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
