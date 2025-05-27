'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface VIPPredictionListProps {
  category: string
  filter: string
  search: string
}

export function VIPPredictionList({ category, filter, search }: VIPPredictionListProps) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Premier League</CardTitle>
            <p className="text-xs text-muted-foreground">Today, 20:00</p>
          </div>
          <Badge variant={getStatusVariant('pending')}>Pending</Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src="/placeholder.svg" alt="Team logo" className="w-8 h-8" />
              <span>Manchester United</span>
            </div>
            <span>vs</span>
            <div className="flex items-center gap-2">
              <span>Liverpool</span>
              <img src="/placeholder.svg" alt="Team logo" className="w-8 h-8" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Prediction:</span>
              <span className="font-medium">Home Win & Over 1.5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Odds:</span>
              <span className="font-medium">2.10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Confidence:</span>
              <span className="font-medium text-green-600">95%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'won':
      return 'default'
    case 'lost':
      return 'destructive'
    case 'pending':
      return 'secondary'
    default:
      return 'outline'
  }
}