'use client'

import { useState, useEffect } from 'react'
import PredictionCard from '@/components/prediction-card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface Prediction {
  id: number
  homeTeam: string
  homeTeamLogo?: string
  awayTeam: string
  awayTeamLogo?: string
  league: string
  leagueLogo?: string
  matchTime: string
  prediction: string
  confidence?: number
  status: string
  result?: string
  analysis?: string
  vipOnly?: boolean
}

interface PredictionListProps {
  predictions: Prediction[]
  loading: boolean
  error: string | null
}

export default function PredictionList({ predictions, loading, error }: PredictionListProps) {
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    // Reset visible count when predictions change (e.g., new filter applied)
    setVisibleCount(6)
  }, [predictions])

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-10 h-10 text-[#1a56db] animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading predictions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-red-600 dark:text-red-400 mb-2">Error: {error}</p>
        <p className="text-gray-500 dark:text-gray-500">Please try refreshing the page.</p>
      </div>
    )
  }

  if (predictions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          No predictions found for the selected criteria.
        </p>
        <p className="text-gray-500 dark:text-gray-500">
          Try adjusting your filters or check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {predictions.slice(0, visibleCount).map((prediction) => (
          <PredictionCard key={prediction.id} prediction={prediction} />
        ))}
      </div>

      {visibleCount < predictions.length && (
        <div className="text-center pt-4">
          <Button
            onClick={loadMore}
            variant="outline"
            className="border-[#1a56db] text-[#1a56db] hover:bg-[#1a56db]/10"
          >
            Load More Predictions
          </Button>
        </div>
      )}
    </div>
  )
}
