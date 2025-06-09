import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}

export function DateRangeSelector({
  timeRange,
  onChange,
}: {
  timeRange: string
  onChange: (range: string) => void
}) {
  const getTimeRangeText = () => {
    switch (timeRange) {
      case '7d':
        return 'Last 7 days'
      case '30d':
        return 'Last 30 days'
      case '90d':
        return 'Last 90 days'
      default:
        return 'Custom range'
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8"
      onClick={() => onChange(timeRange === '7d' ? '30d' : '7d')}
    >
      <Calendar className="mr-2 h-4 w-4" />
      <span>{getTimeRangeText()}</span>
    </Button>
  )
}
