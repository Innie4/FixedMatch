"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, ChevronUp, Clock } from "lucide-react"

interface MatchEvent {
  type: "goal" | "yellowCard" | "redCard" | "substitution"
  team: "home" | "away"
  player: string
  minute: number
  penalty?: boolean
}

interface LiveMatchCardProps {
  match: {
    id: number
    homeTeam: string
    homeTeamLogo: string
    homeScore?: number
    awayTeam: string
    awayTeamLogo: string
    awayScore?: number
    league: string
    leagueLogo: string
    status: "LIVE" | "FINISHED" | "UPCOMING"
    minute?: number
    kickoff?: string
    events?: MatchEvent[]
  }
}

export default function LiveMatchCard({ match }: LiveMatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Determine background color based on match status
  const getStatusColor = () => {
    switch (match.status) {
      case "LIVE":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
      case "FINISHED":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      case "UPCOMING":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
    }
  }

  // Render match status
  const renderStatus = () => {
    if (match.status === "LIVE") {
      return (
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>{match.minute}'</span>
        </div>
      )
    }

    if (match.status === "UPCOMING") {
      return (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{match.kickoff}</span>
        </div>
      )
    }

    return <span>FT</span>
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Image
              src={match.leagueLogo || "/placeholder.svg"}
              alt={match.league}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{match.league}</span>
          </div>
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor()}`}>{renderStatus()}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Image src={match.homeTeamLogo || "/placeholder.svg"} alt={match.homeTeam} width={40} height={40} />
            <span className="font-semibold text-gray-900 dark:text-white">{match.homeTeam}</span>
          </div>

          {match.status !== "UPCOMING" ? (
            <div className="flex items-center gap-2 px-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{match.homeScore}</span>
              <span className="text-gray-400">-</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{match.awayScore}</span>
            </div>
          ) : (
            <div className="px-4 text-sm text-gray-500 dark:text-gray-400">vs</div>
          )}

          <div className="flex items-center gap-3 flex-1 justify-end">
            <span className="font-semibold text-gray-900 dark:text-white">{match.awayTeam}</span>
            <Image src={match.awayTeamLogo || "/placeholder.svg"} alt={match.awayTeam} width={40} height={40} />
          </div>
        </div>

        {match.events && match.events.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-4 flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 py-1 px-2 rounded-md border border-gray-200 dark:border-gray-700"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Hide match events</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Show match events</span>
              </>
            )}
          </button>
        )}
      </div>

      {isExpanded && match.events && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Match Timeline</h4>
          <div className="relative pl-4 border-l border-gray-300 dark:border-gray-600 space-y-3">
            {match.events.map((event, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="absolute left-0 w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 transform -translate-x-[4.5px]"></div>
                <div className="min-w-[30px] text-sm font-medium text-gray-700 dark:text-gray-300">{event.minute}'</div>
                <div className="flex items-center gap-1">
                  {event.type === "goal" && (
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-0.5 rounded">
                      ⚽ Goal
                    </div>
                  )}
                  {event.type === "yellowCard" && (
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">
                      🟨 Yellow Card
                    </div>
                  )}
                  {event.type === "redCard" && (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs font-medium px-2 py-0.5 rounded">
                      🟥 Red Card
                    </div>
                  )}
                  {event.type === "substitution" && (
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium px-2 py-0.5 rounded">
                      ↔️ Substitution
                    </div>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {event.player} {event.penalty ? "(Penalty)" : ""}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {event.team === "home" ? match.homeTeam : match.awayTeam}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
        <Link
          href={`/match/${match.id}`}
          className="flex justify-between items-center text-[#1a56db] text-sm font-medium hover:underline"
        >
          <span>View match details</span>
          <ChevronDown className="h-4 w-4 transform rotate-270" />
        </Link>
      </div>
    </div>
  )
}
