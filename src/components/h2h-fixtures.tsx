"use client"

import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface H2HFixturesProps {
  homeTeam: string
  awayTeam: string
}

export default function H2HFixtures({ homeTeam, awayTeam }: H2HFixturesProps) {
  // Sample head to head data - in a real app, this would be fetched based on the teams
  const h2hFixtures = [
    {
      date: "Jan 15, 2025",
      competition: "Premier League",
      homeTeam: homeTeam,
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      homeScore: 2,
      awayTeam: awayTeam,
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      awayScore: 1,
    },
    {
      date: "Aug 22, 2024",
      competition: "Premier League",
      homeTeam: awayTeam,
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      homeScore: 1,
      awayTeam: homeTeam,
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      awayScore: 1,
    },
    {
      date: "Dec 8, 2023",
      competition: "Premier League",
      homeTeam: homeTeam,
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      homeScore: 3,
      awayTeam: awayTeam,
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      awayScore: 1,
    },
    {
      date: "Apr 30, 2023",
      competition: "Premier League",
      homeTeam: awayTeam,
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      homeScore: 2,
      awayTeam: homeTeam,
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      awayScore: 0,
    },
    {
      date: "Oct 15, 2022",
      competition: "Premier League",
      homeTeam: homeTeam,
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      homeScore: 1,
      awayTeam: awayTeam,
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      awayScore: 0,
    },
  ]

  // Calculate overall statistics
  const homeWins = h2hFixtures.filter(
    (f) =>
      (f.homeTeam === homeTeam && f.homeScore > f.awayScore) || (f.awayTeam === homeTeam && f.awayScore > f.homeScore),
  ).length

  const awayWins = h2hFixtures.filter(
    (f) =>
      (f.homeTeam === awayTeam && f.homeScore > f.awayScore) || (f.awayTeam === awayTeam && f.awayScore > f.homeScore),
  ).length

  const draws = h2hFixtures.filter((f) => f.homeScore === f.awayScore).length

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="grid grid-cols-3 w-full max-w-md mx-auto text-center">
          <div>
            <div className="text-3xl font-bold text-[#1a56db]">{homeWins}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{homeTeam}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">{draws}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Draws</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600">{awayWins}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{awayTeam}</div>
          </div>
        </div>
      </div>

      <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">Last 5 Meetings</h4>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {h2hFixtures.map((fixture, index) => (
          <div key={index} className="py-3">
            <div className="flex justify-between items-center mb-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {fixture.date}
              </div>
              <Badge variant="outline" className="font-normal">
                {fixture.competition}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src={fixture.homeTeamLogo || "/placeholder.svg"} alt={fixture.homeTeam} width={24} height={24} />
                <span className="font-medium text-gray-900 dark:text-white text-sm">{fixture.homeTeam}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`font-bold ${
                    fixture.homeScore > fixture.awayScore
                      ? "text-green-600 dark:text-green-500"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {fixture.homeScore}
                </span>
                <span className="text-gray-500">-</span>
                <span
                  className={`font-bold ${
                    fixture.awayScore > fixture.homeScore
                      ? "text-green-600 dark:text-green-500"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {fixture.awayScore}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white text-sm">{fixture.awayTeam}</span>
                <Image src={fixture.awayTeamLogo || "/placeholder.svg"} alt={fixture.awayTeam} width={24} height={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
