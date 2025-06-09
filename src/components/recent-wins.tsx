'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'

interface RecentWinPrediction {
  id: number
  homeTeam: string
  awayTeam: string
  league: string
  prediction: string
  odds: number
  matchTime: string
  result: string
  match?: {
    homeTeamLogo?: string
    awayTeamLogo?: string
    leagueLogo?: string
  }
}

export default function RecentWins() {
  const [wins, setWins] = useState<RecentWinPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentWins = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/vip-predictions/recent-wins')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch recent wins')
        }
        const data: RecentWinPrediction[] = await response.json()
        setWins(data)
      } catch (err: any) {
        setWins([])
        setError(err.message || 'Unable to load recent wins. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecentWins()
    const interval = setInterval(fetchRecentWins, 300000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Loading Recent Winning Predictions...
        </h2>
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Recent Winning Predictions
        </h2>
        <Link href="/vip" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View All VIP Predictions →
        </Link>
      </div>

      {error && (
        <div className="rounded bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-4 py-2 text-sm mb-2">
          {error}
        </div>
      )}

      {wins.length === 0 && !loading && !error && (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          <p className="text-lg mb-2">No recent winning predictions available yet.</p>
          <p className="text-sm">Check back soon for updates!</p>
        </div>
      )}

      {wins.map((win) => (
        <Card
          key={win.id}
          className="overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Image
                  src={win.match?.leagueLogo || '/placeholder.svg'}
                  alt={win.league}
                  width={24}
                  height={24}
                  className="rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg'
                  }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{win.league}</span>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Won
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={win.match?.homeTeamLogo || '/placeholder.svg'}
                  alt={win.homeTeam}
                  width={40}
                  height={40}
                  className="rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg'
                  }}
                />
                <span className="font-semibold text-gray-900 dark:text-white">{win.homeTeam}</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">vs</span>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 dark:text-white">{win.awayTeam}</span>
                <Image
                  src={win.match?.awayTeamLogo || '/placeholder.svg'}
                  alt={win.awayTeam}
                  width={40}
                  height={40}
                  className="rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg'
                  }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-medium">Prediction:</span> {win.prediction}
              </div>
              <div>
                <span className="font-medium">Odds:</span> {win.odds.toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Result:</span> {win.result}
              </div>
              <div>
                <span className="font-medium">Time:</span>{' '}
                {new Date(win.matchTime).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
