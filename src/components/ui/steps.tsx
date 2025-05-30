import { cn } from '@/lib/utils'

interface StepsProps {
  children: React.ReactNode
  currentStep: number
  className?: string
}

interface StepProps {
  number: number
  children: React.ReactNode
}

export function Steps({ children, currentStep, className }: StepsProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {children}
    </div>
  )
}

export function Step({ number, children }: StepProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full border-2',
        'text-sm font-medium'
      )}>
        {number}
      </div>
      <span className="text-sm font-medium">{children}</span>
    </div>
  )
}