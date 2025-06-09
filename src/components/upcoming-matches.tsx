'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { fetcher } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'

interface Match {
  id: number
  homeTeam: string
  homeTeamLogo?: string
  awayTeam: string
  awayTeamLogo?: string
  league: string
  leagueLogo?: string
  matchTime: string
  stadium?: string
}

export default function UpcomingMatches() {
  const [activeTab, setActiveTab] = useState('all')
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [errorMatches, setErrorMatches] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUpcomingMatches = async (filterLeague: string = 'all') => {
    setLoadingMatches(true)
    setErrorMatches(null)
    try {
      const url = `/api/upcoming-matches?league=${filterLeague}`
      const data = await fetcher<Match[]>(url, {}, toast)
      setUpcomingMatches(data)
    } catch (err: any) {
      setErrorMatches(err.message || 'Failed to load upcoming matches.')
    } finally {
      setLoadingMatches(false)
    }
  }

  useEffect(() => {
    // When activeTab changes, fetch data based on the new tab
    fetchUpcomingMatches(activeTab)
  }, [activeTab])

  const calculateCountdown = (matchTime: string) => {
    const now = new Date()
    const matchDate = new Date(matchTime)
    const diff = matchDate.getTime() - now.getTime()

    if (diff < 0) return 'Finished'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    let countdownString = ''
    if (days > 0) countdownString += `${days}d `
    if (hours > 0) countdownString += `${hours}h `
    if (minutes > 0) countdownString += `${minutes}m`

    return countdownString.trim() || '< 1m'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'all'
              ? 'text-[#1a56db] border-b-2 border-[#1a56db]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All Matches
        </button>
        <button
          onClick={() => setActiveTab('premier league')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'premier league'
              ? 'text-[#1a56db] border-b-2 border-[#1a56db]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Premier League
        </button>
        <button
          onClick={() => setActiveTab('la liga')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'la liga'
              ? 'text-[#1a56db] border-b-2 border-[#1a56db]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          La Liga
        </button>
        <button
          onClick={() => setActiveTab('serie a')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'serie a'
              ? 'text-[#1a56db] border-b-2 border-[#1a56db]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Serie A
        </button>
        <button
          onClick={() => setActiveTab('bundesliga')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'bundesliga'
              ? 'text-[#1a56db] border-b-2 border-[#1a56db]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Bundesliga
        </button>
      </div>

      {/* Matches list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {loadingMatches && <p className="p-4 text-center">Loading upcoming matches...</p>}
        {errorMatches && <p className="p-4 text-center text-red-500">Error: {errorMatches}</p>}
        {!loadingMatches && !errorMatches && upcomingMatches.length === 0 && (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">
            No upcoming matches found.
          </p>
        )}
        {!loadingMatches &&
          !errorMatches &&
          upcomingMatches.length > 0 &&
          upcomingMatches.map((match: any) => (
            <Link
              key={match.id}
              href={`/match/${match.id}`}
              className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <Image
                    src={
                      match.leagueLogo ||
                      `/leagues/${match.league.toLowerCase().replace(/ /g, '-')}.svg`
                    }
                    alt={match.league}
                    width={16}
                    height={16}
                    className="mr-1"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{match.league}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Image
                      src={match.homeTeamLogo || '/placeholder.svg'}
                      alt={match.homeTeam}
                      width={24}
                      height={24}
                      className="mr-2"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg'
                      }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {match.homeTeam}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mx-2">vs</span>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {match.awayTeam}
                    </span>
                    <Image
                      src={match.awayTeamLogo || '/placeholder.svg'}
                      alt={match.awayTeam}
                      width={24}
                      height={24}
                      className="ml-2"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg'
                      }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{match.stadium}</div>
              </div>
              <div className="flex items-center ml-4">
                <Clock className="h-4 w-4 text-[#1a56db] mr-1" />
                <span className="text-sm font-medium text-[#1a56db]">
                  {calculateCountdown(match.matchTime)}
                </span>
              </div>
            </Link>
          ))}
      </div>

      <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
        <Link href="/matches" className="text-sm text-[#1a56db] font-medium hover:underline">
          View all upcoming matches
        </Link>
      </div>
    </div>
  )
}
