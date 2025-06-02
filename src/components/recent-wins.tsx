"use client"

import { useEffect, useState } from 'react'
import { CheckCircle2, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'

interface WinningPrediction {
  id: number
  homeTeam: string
  homeTeamLogo: string
  awayTeam: string
  awayTeamLogo: string
  league: string
  leagueLogo: string
  prediction: string
  odds: number
  matchTime: string
  result: string
}

const MOCK_WINS: WinningPrediction[] = [
  {
    id: 1,
    homeTeam: "Arsenal",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Chelsea",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "Premier League",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    prediction: "Home Win",
    odds: 2.10,
    matchTime: "Yesterday, 18:00",
    result: "2-0",
  },
  {
    id: 2,
    homeTeam: "Barcelona",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Real Madrid",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "La Liga",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    prediction: "Over 2.5 Goals",
    odds: 1.85,
    matchTime: "Yesterday, 21:00",
    result: "3-1",
  },
  {
    id: 3,
    homeTeam: "Bayern",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Dortmund",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "Bundesliga",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    prediction: "Both Teams to Score",
    odds: 1.95,
    matchTime: "2 days ago, 19:30",
    result: "2-1",
  },
  {
    id: 4,
    homeTeam: "Juventus",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Inter",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "Serie A",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    prediction: "Draw",
    odds: 3.20,
    matchTime: "2 days ago, 21:45",
    result: "1-1",
  },
  {
    id: 5,
    homeTeam: "PSG",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Lyon",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "Ligue 1",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    prediction: "PSG Win",
    odds: 1.60,
    matchTime: "3 days ago, 20:00",
    result: "2-0",
  },
]

export default function RecentWins() {
  const [wins, setWins] = useState<WinningPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingMock, setUsingMock] = useState(false)

  useEffect(() => {
    const fetchRecentWins = async () => {
      try {
        setLoading(true)
        setError(null)
        setUsingMock(false)
        const response = await fetch('/api/vip-predictions/recent-wins')
        if (!response.ok) throw new Error('Failed to fetch recent wins')
        const data = await response.json()
        setWins(data)
      } catch (err) {
        setWins(MOCK_WINS)
        setUsingMock(true)
        setError('Unable to load recent wins. Showing mock data.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecentWins()
    // Set up polling for real-time updates
    const interval = setInterval(fetchRecentWins, 300000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32 bg-gray-100 dark:bg-gray-800" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Recent Winning Predictions
        </h2>
        <Link 
          href="/vip" 
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All VIP Predictions →
        </Link>
      </div>

      {usingMock && (
        <div className="rounded bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 px-4 py-2 text-sm mb-2">
          Unable to load real recent wins. Showing mock data.
        </div>
      )}

      {wins.map((win) => (
        <Card key={win.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Image 
                  src={win.leagueLogo} 
                  alt={win.league}
                  width={24}
                  height={24}
                  className="rounded-full"
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
                  src={win.homeTeamLogo}
                  alt={win.homeTeam}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="font-semibold">{win.homeTeam}</span>
              </div>
              <span className="text-sm">vs</span>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{win.awayTeam}</span>
                <Image
                  src={win.awayTeamLogo}
                  alt={win.awayTeam}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400">{win.matchTime}</span>
                <span className="font-medium">{win.prediction}</span>
              </div>
              <span className="text-green-600 dark:text-green-400 font-semibold">
                Odds: {win.odds.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}