'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Search, Frown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LiveMatch {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  league: string
  matchTime: string // ISO string
  status: string // e.g., 'LIVE', 'HT', 'FT'
  elapsed: number // minutes elapsed
}

export default function LiveScoresPage() {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchLiveMatches = async () => {
    setLoading(true)
    setError(null)
    try {
      // This would be a real-time API in a production app (e.g., WebSockets, SSE)
      // For now, we simulate a fetch.
      const response = await fetch('/api/live-scores') // Placeholder API
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: LiveMatch[] = await response.json()
      setLiveMatches(data)
    } catch (e) {
      setError('Failed to load live scores.')
      console.error('Fetching live scores error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveMatches()
    // Set up a refresh interval for real-time updates
    const interval = setInterval(fetchLiveMatches, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const filteredMatches = liveMatches.filter(
    (match) =>
      match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.league.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Live Football Scores
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search teams or leagues..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={fetchLiveMatches}
            disabled={loading}
            className="bg-[#1a56db] hover:bg-[#1e40af]"
          >
            <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {loading && (
          <div className="text-center text-gray-600 dark:text-gray-400">Loading live scores...</div>
        )}
        {error && <div className="text-center text-red-600 dark:text-red-400">{error}</div>}

        {!loading && !error && filteredMatches.length === 0 && (
          <div className="text-center py-12">
            <Frown className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-700 dark:text-gray-300">
              No live matches found matching your criteria.
            </p>
          </div>
        )}

        {!loading && !error && filteredMatches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <Card
                key={match.id}
                className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {match.league}
                  </CardTitle>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${match.status === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                  >
                    {match.status}
                    {match.status === 'LIVE' && <span className="ml-1">'{match.elapsed}</span>}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold flex items-center justify-between">
                    <span>{match.homeTeam}</span>
                    <span>{match.homeScore}</span>
                  </div>
                  <div className="text-lg font-bold flex items-center justify-between mb-4">
                    <span>{match.awayTeam}</span>
                    <span>{match.awayScore}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(match.matchTime).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
