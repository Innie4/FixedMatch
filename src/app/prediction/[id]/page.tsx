'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeftCircle,
  Home,
  Calendar,
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  BarChart,
  Percent,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface PredictionDetails {
  id: number
  homeTeam: string
  awayTeam: string
  league: string
  matchTime: string
  prediction: string
  odds: number
  confidence?: number
  status: string // e.g., "upcoming", "completed", "won", "lost"
  result?: string // e.g., "2-1", "Draw"
  analysis?: string
  // Add more fields as needed
}

export default function PredictionDetailPage() {
  const params = useParams()
  const predictionId = params.id as string
  const [prediction, setPrediction] = useState<PredictionDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (predictionId) {
      const fetchPredictionDetails = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/predictions/${predictionId}`)
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Prediction not found.')
            } else {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
          }
          const data: PredictionDetails = await response.json()
          setPrediction(data)
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to load prediction details.')
          console.error('Fetching prediction details error:', e)
        } finally {
          setLoading(false)
        }
      }
      fetchPredictionDetails()
    }
  }, [predictionId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-[#1a56db]" />
        <p className="ml-3 text-gray-900 dark:text-white">Loading prediction details...</p>
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

  if (!prediction) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Prediction Not Found
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          The prediction you are looking for does not exist or has been removed.
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

  const matchDateTime = new Date(prediction.matchTime)
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'won':
        return 'bg-green-500 text-white'
      case 'lost':
        return 'bg-red-500 text-white'
      case 'upcoming':
      case 'pending':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

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
            Prediction: {prediction.homeTeam} vs {prediction.awayTeam}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center">
          {/* Teams */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {prediction.homeTeam}
            </h2>
          </div>

          <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">VS</div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {prediction.awayTeam}
            </h2>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-center md:text-left">
          <p className="flex items-center justify-center md:justify-start text-lg text-gray-700 dark:text-gray-300">
            <Trophy className="mr-2 h-5 w-5 text-[#1a56db]" />
            <span className="font-semibold">League:</span> {prediction.league}
          </p>
          <p className="flex items-center justify-center md:justify-start text-lg text-gray-700 dark:text-gray-300">
            <Calendar className="mr-2 h-5 w-5 text-[#1a56db]" />
            <span className="font-semibold">Date:</span> {formattedDate}
          </p>
          <p className="flex items-center justify-center md:justify-start text-lg text-gray-700 dark:text-gray-300">
            <Clock className="mr-2 h-5 w-5 text-[#1a56db]" />
            <span className="font-semibold">Time:</span> {formattedTime}
          </p>
          <p className="flex items-center justify-center md:justify-start text-lg text-gray-900 dark:text-white">
            <BarChart className="mr-2 h-5 w-5 text-[#1a56db]" />
            <span className="font-semibold">Prediction:</span> {prediction.prediction}
          </p>
          <p className="flex items-center justify-center md:justify-start text-lg text-gray-900 dark:text-white">
            <Percent className="mr-2 h-5 w-5 text-[#1a56db]" />
            <span className="font-semibold">Odds:</span> {prediction.odds}
          </p>
          {prediction.confidence && (
            <p className="flex items-center justify-center md:justify-start text-lg text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="mr-2 h-5 w-5 text-[#1a56db]" />
              <span className="font-semibold">Confidence:</span> {prediction.confidence}%
            </p>
          )}
          <p
            className={`flex items-center justify-center md:justify-start text-lg font-semibold px-3 py-1 rounded-full w-fit ${getStatusColor(prediction.status)}`}
          >
            Status: {prediction.status.toUpperCase()}
          </p>
          {prediction.result && (
            <p className="flex items-center justify-center md:justify-start text-lg text-gray-900 dark:text-white">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              <span className="font-semibold">Result:</span> {prediction.result}
            </p>
          )}
        </div>

        {prediction.analysis && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Expert Analysis
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {prediction.analysis}
            </p>
          </div>
        )}

        {/* TODO: Add sections for historical performance, related predictions, etc. */}
        <div className="mt-10 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-center">
          <p>
            More detailed historical performance and related predictions will be displayed here.
          </p>
        </div>
      </div>
    </div>
  )
}
