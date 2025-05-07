"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, ChevronUp, Lock, TrendingUp, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VipPredictionCardProps {
  prediction: {
    id: number
    homeTeam: string
    homeTeamLogo: string
    homeScore?: number
    awayTeam: string
    awayTeamLogo: string
    awayScore?: number
    league: string
    leagueLogo: string
    matchTime: string
    prediction: string
    confidence: number
    status: string
    vipOnly: boolean
    result?: string
    analysis?: string
  }
}

export default function VipPredictionCard({ prediction }: VipPredictionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Determine confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-500"
    if (confidence >= 80) return "bg-green-400"
    if (confidence >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Image
              src={prediction.leagueLogo || "/placeholder.svg"}
              alt={prediction.league}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{prediction.league}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">{prediction.matchTime}</span>
            {prediction.vipOnly && (
              <span className="bg-[#fbbf24]/10 text-[#fbbf24] text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                VIP
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Image
              src={prediction.homeTeamLogo || "/placeholder.svg"}
              alt={prediction.homeTeam}
              width={40}
              height={40}
            />
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">{prediction.homeTeam}</span>
              {prediction.homeScore !== undefined && (
                <span className="ml-2 font-bold text-gray-900 dark:text-white">{prediction.homeScore}</span>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">vs</span>
          <div className="flex items-center gap-2">
            <div>
              {prediction.awayScore !== undefined && (
                <span className="mr-2 font-bold text-gray-900 dark:text-white">{prediction.awayScore}</span>
              )}
              <span className="font-semibold text-gray-900 dark:text-white">{prediction.awayTeam}</span>
            </div>
            <Image
              src={prediction.awayTeamLogo || "/placeholder.svg"}
              alt={prediction.awayTeam}
              width={40}
              height={40}
            />
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prediction:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{prediction.prediction}</span>
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

          {prediction.status === "completed" && prediction.result && (
            <div
              className={`mt-2 text-xs font-medium flex items-center ${
                prediction.result === "won" ? "text-green-500" : "text-red-500"
              }`}
            >
              {prediction.result === "won" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Prediction Won
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-1" />
                  Prediction Lost
                </>
              )}
            </div>
          )}
        </div>

        {prediction.analysis && (
          <div className="mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-[#1a56db] text-sm font-medium"
            >
              <span>Expert Analysis</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {isExpanded && (
              <div className="mt-2 p-3 bg-[#1a56db]/5 dark:bg-[#1a56db]/10 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                {prediction.analysis}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
        <Link
          href={`/prediction/${prediction.id}`}
          className="text-[#1a56db] text-sm font-medium hover:underline flex items-center"
        >
          <TrendingUp className="h-4 w-4 mr-1" />
          View detailed stats
        </Link>
        <Button size="sm" className="bg-[#1a56db] hover:bg-[#1e40af]">
          Place Bet
        </Button>
      </div>
    </div>
  )
}
