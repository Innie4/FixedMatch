"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"

// Sample upcoming matches data
const upcomingMatches = [
  {
    id: 1,
    homeTeam: "Manchester United",
    homeTeamLogo: "/placeholder.svg?height=32&width=32",
    awayTeam: "Tottenham",
    awayTeamLogo: "/placeholder.svg?height=32&width=32",
    league: "Premier League",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "2023-05-12T19:45:00",
    stadium: "Old Trafford",
    countdown: "2d 4h 15m",
  },
  {
    id: 2,
    homeTeam: "Juventus",
    homeTeamLogo: "/placeholder.svg?height=32&width=32",
    awayTeam: "Napoli",
    awayTeamLogo: "/placeholder.svg?height=32&width=32",
    league: "Serie A",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "2023-05-11T20:00:00",
    stadium: "Allianz Stadium",
    countdown: "1d 5h 30m",
  },
  {
    id: 3,
    homeTeam: "PSG",
    homeTeamLogo: "/placeholder.svg?height=32&width=32",
    awayTeam: "Lyon",
    awayTeamLogo: "/placeholder.svg?height=32&width=32",
    league: "Ligue 1",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "2023-05-10T21:00:00",
    stadium: "Parc des Princes",
    countdown: "8h 45m",
  },
  {
    id: 4,
    homeTeam: "Bayern Munich",
    homeTeamLogo: "/placeholder.svg?height=32&width=32",
    awayTeam: "Leverkusen",
    awayTeamLogo: "/placeholder.svg?height=32&width=32",
    league: "Bundesliga",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "2023-05-11T17:30:00",
    stadium: "Allianz Arena",
    countdown: "1d 2h 15m",
  },
  {
    id: 5,
    homeTeam: "Real Madrid",
    homeTeamLogo: "/placeholder.svg?height=32&width=32",
    awayTeam: "Atletico Madrid",
    awayTeamLogo: "/placeholder.svg?height=32&width=32",
    league: "La Liga",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "2023-05-12T20:00:00",
    stadium: "Santiago Bernabeu",
    countdown: "2d 5h 30m",
  },
]

export default function UpcomingMatches() {
  const [activeTab, setActiveTab] = useState("all")

  // Filter matches based on active tab
  const filteredMatches =
    activeTab === "all"
      ? upcomingMatches
      : upcomingMatches.filter((match) => match.league.toLowerCase().includes(activeTab))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === "all"
              ? "text-[#1a56db] border-b-2 border-[#1a56db]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          All Matches
        </button>
        <button
          onClick={() => setActiveTab("premier")}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === "premier"
              ? "text-[#1a56db] border-b-2 border-[#1a56db]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Premier League
        </button>
        <button
          onClick={() => setActiveTab("liga")}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === "liga"
              ? "text-[#1a56db] border-b-2 border-[#1a56db]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          La Liga
        </button>
        <button
          onClick={() => setActiveTab("serie")}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === "serie"
              ? "text-[#1a56db] border-b-2 border-[#1a56db]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Serie A
        </button>
        <button
          onClick={() => setActiveTab("bundesliga")}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === "bundesliga"
              ? "text-[#1a56db] border-b-2 border-[#1a56db]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Bundesliga
        </button>
      </div>

      {/* Matches list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredMatches.map((match) => (
          <Link
            key={match.id}
            href={`/match/${match.id}`}
            className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <Image
                  src={match.leagueLogo || "/placeholder.svg"}
                  alt={match.league}
                  width={16}
                  height={16}
                  className="mr-1"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">{match.league}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={match.homeTeamLogo || "/placeholder.svg"}
                    alt={match.homeTeam}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">{match.homeTeam}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mx-2">vs</span>
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 dark:text-white">{match.awayTeam}</span>
                  <Image
                    src={match.awayTeamLogo || "/placeholder.svg"}
                    alt={match.awayTeam}
                    width={24}
                    height={24}
                    className="ml-2"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{match.stadium}</div>
            </div>
            <div className="flex items-center ml-4">
              <Clock className="h-4 w-4 text-[#1a56db] mr-1" />
              <span className="text-sm font-medium text-[#1a56db]">{match.countdown}</span>
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
