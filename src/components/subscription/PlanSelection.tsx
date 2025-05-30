import { useState } from 'react'
import { Check, Info } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Duration {
  id: string
  name: string
  days: number
  price: number
  originalPrice: number
  popular: boolean
}

interface PlanSelectionProps {
  packageType: 'basic' | 'pro' | 'elite'
  onDurationSelect: (duration: Duration) => void
}

export default function PlanSelection({ packageType, onDurationSelect }: PlanSelectionProps) {
  const [selectedDuration, setSelectedDuration] = useState<string>('monthly')

  const durations: Duration[] = [
    {
      id: 'weekly',
      name: '1 Week',
      days: 7,
      price: 9.99,
      originalPrice: 9.99,
      popular: false
    },
    {
      id: 'biweekly',
      name: '2 Weeks',
      days: 14,
      price: 17.99,
      originalPrice: 19.98,
      popular: false
    },
    {
      id: 'monthly',
      name: '1 Month',
      days: 30,
      price: 29.99,
      originalPrice: 39.99,
      popular: true
    },
    {
      id: 'quarterly',
      name: '3 Months',
      days: 90,
      price: 79.99,
      originalPrice: 119.97,
      popular: false
    }
  ]

  const handleDurationSelect = (duration: Duration) => {
    setSelectedDuration(duration.id)
    onDurationSelect(duration)
  }

  const calculateSavings = (price: number, originalPrice: number) => {
    const savings = originalPrice - price
    const percentage = Math.round((savings / originalPrice) * 100)
    return { amount: savings.toFixed(2), percentage }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {durations.map((duration) => {
          const savings = calculateSavings(duration.price, duration.originalPrice)
          return (
            <Card 
              key={duration.id}
              className={`relative ${selectedDuration === duration.id ? 'border-primary' : ''}`}
            >
              {duration.popular && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-primary"
                  variant="secondary"
                >
                  Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {duration.name}
                  {parseFloat(savings.amount) > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Save {savings.percentage}% (${savings.amount})
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${duration.price}
                  {parseFloat(savings.amount) > 0 && (
                    <span className="ml-2 text-sm line-through text-muted-foreground">
                      ${duration.originalPrice}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {duration.days} days of premium access
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={selectedDuration === duration.id ? 'default' : 'outline'}
                  onClick={() => handleDurationSelect(duration)}
                >
                  {selectedDuration === duration.id && (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Select Plan
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}