'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeftCircle, Home, Calendar, Clock, Trophy, MapPin, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface MatchDetails {
  id: number
  homeTeam: string
  homeTeamLogo?: string
  awayTeam: string
  awayTeamLogo?: string
  league: string
  leagueLogo?: string
  matchTime: string
  stadium?: string
  // Add more fields as needed for detailed match info
}

export default function MatchDetailPage() {
  const params = useParams()
  const matchId = params.id as string
  const [match, setMatch] = useState<MatchDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (matchId) {
      const fetchMatchDetails = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/matches/${matchId}`)
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Match not found.')
            } else {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
          }
          const data: MatchDetails = await response.json()
          setMatch(data)
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to load match details.')
          console.error('Fetching match details error:', e)
        } finally {
          setLoading(false)
        }
      }
      fetchMatchDetails()
    }
  }, [matchId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-[#1a56db]" />
        <p className="ml-3 text-gray-900 dark:text-white">Loading match details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
        <Link
          href="/predictions"
          className="inline-flex items-center text-[#1a56db] hover:underline"
        >
          <ArrowLeftCircle className="mr-2 h-5 w-5" />
          Back to Predictions
        </Link>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Match Not Found</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          The match you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/predictions"
          className="inline-flex items-center text-[#1a56db] hover:underline"
        >
          <ArrowLeftCircle className="mr-2 h-5 w-5" />
          Back to Predictions
        </Link>
      </div>
    )
  }

  const matchDateTime = new Date(match.matchTime)
  const formattedDate = matchDateTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = matchDateTime.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <div className="mb-6">
          <Link
            href="/predictions"
            className="inline-flex items-center text-[#1a56db] hover:underline mb-4"
          >
            <ArrowLeftCircle className="mr-2 h-5 w-5" />
            Back to Predictions
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Match Details: {match.homeTeam} vs {match.awayTeam}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center">
          {/* Home Team */}
          <div>
            <Image
              src={match.homeTeamLogo || '/placeholder-team.png'}
              alt={match.homeTeam}
              width={100}
              height={100}
              className="mx-auto mb-4 rounded-full"
            />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {match.homeTeam}
            </h2>
          </div>

          <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">VS</div>

          {/* Away Team */}
          <div>
            <Image
              src={match.awayTeamLogo || '/placeholder-team.png'}
              alt={match.awayTeam}
              width={100}
              height={100}
              className="mx-auto mb-4 rounded-full"
            />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {match.awayTeam}
            </h2>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-center md:text-left">
          <p className="flex items-center justify-center md:justify-start text-lg text-gray-700 dark:text-gray-300">
            <Trophy className="mr-2 h-5 w-5 text-[#1a56db]" />
            <span className="font-semibold">League:</span> {match.league}
            {match.leagueLogo && (
              <Image
                src={match.leagueLogo}
                alt={`${match.league} logo`}
                width={24}
                height={24}
                className="ml-2 inline-block"
              />
            )}
          </p>
          <p className="flex items-center justify-center md:justify-start text-lg text-gray-700 dark:text-gray-300">
            <Calendar className="mr-2 h-5 w-5 text-[#1a56db]" />
            <span className="font-semibold">Date:</span> {formattedDate}
          </p>
          <p className="flex items-center justify-center md:justify-start text-lg text-gray-700 dark:text-gray-300">
            <Clock className="mr-2 h-5 w-5 text-[#1a56db]" />
            <span className="font-semibold">Time:</span> {formattedTime}
          </p>
          {match.stadium && (
            <p className="flex items-center justify-center md:justify-start text-lg text-gray-700 dark:text-gray-300">
              <MapPin className="mr-2 h-5 w-5 text-[#1a56db]" />
              <span className="font-semibold">Stadium:</span> {match.stadium}
            </p>
          )}
        </div>

        {/* TODO: Add sections for match statistics, head-to-head, etc. */}
        <div className="mt-10 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-center">
          <p>
            More detailed match statistics, team forms, and betting odds will be displayed here.
          </p>
        </div>
      </div>
    </div>
  )
}
