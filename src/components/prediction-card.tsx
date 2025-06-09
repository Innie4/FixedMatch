'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, TrendingUp } from 'lucide-react'

interface PredictionCardProps {
  prediction: {
    id: number
    homeTeam: string
    homeTeamLogo: string
    awayTeam: string
    awayTeamLogo: string
    league: string
    leagueLogo: string
    matchTime: string
    prediction: string
    confidence: number
    status: string
    result?: string
  }
}

export default function PredictionCard({ prediction }: PredictionCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Determine confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'bg-green-500'
    if (confidence >= 70) return 'bg-green-400'
    if (confidence >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-md transform -translate-y-1' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Image
              src={prediction.leagueLogo || '/placeholder.svg'}
              alt={prediction.league}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {prediction.league}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{prediction.matchTime}</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Image
              src={prediction.homeTeamLogo || '/placeholder.svg'}
              alt={prediction.homeTeam}
              width={40}
              height={40}
            />
            <span className="font-semibold text-gray-900 dark:text-white">
              {prediction.homeTeam}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">vs</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">
              {prediction.awayTeam}
            </span>
            <Image
              src={prediction.awayTeamLogo || '/placeholder.svg'}
              alt={prediction.awayTeam}
              width={40}
              height={40}
            />
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Prediction:
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {prediction.prediction}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-600 dark:text-gray-400">Confidence:</span>
            <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-full h-2">
              <div
                className={`${getConfidenceColor(prediction.confidence)} h-2 rounded-full`}
                style={{ width: `${prediction.confidence}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium">{prediction.confidence}%</span>
          </div>

          {prediction.status === 'completed' && prediction.result && (
            <div
              className={`mt-2 text-xs font-medium ${prediction.result === 'won' ? 'text-green-500' : 'text-red-500'}`}
            >
              {prediction.result === 'won' ? '✓ Prediction Won' : '✗ Prediction Lost'}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
        <Link
          href={`/prediction/${prediction.id}`}
          className="flex justify-between items-center text-[#1a56db] text-sm font-medium hover:underline"
        >
          <span className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            View detailed analysis
          </span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
