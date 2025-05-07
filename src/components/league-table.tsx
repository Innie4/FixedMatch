"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowDown, ArrowUp, ArrowRight, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample team data
const teams = [
  {
    id: 1,
    name: "Arsenal",
    logo: "/placeholder.svg?height=24&width=24",
    played: 38,
    won: 26,
    drawn: 6,
    lost: 6,
    goalsFor: 88,
    goalsAgainst: 43,
    points: 84,
    form: ["W", "W", "D", "W", "L"],
    position: 1,
    positionChange: 1,
  },
  {
    id: 2,
    name: "Manchester City",
    logo: "/placeholder.svg?height=24&width=24",
    played: 38,
    won: 25,
    drawn: 8,
    lost: 5,
    goalsFor: 94,
    goalsAgainst: 33,
    points: 83,
    form: ["W", "W", "W", "D", "W"],
    position: 2,
    positionChange: -1,
  },
  {
    id: 3,
    name: "Liverpool",
    logo: "/placeholder.svg?height=24&width=24",
    played: 38,
    won: 23,
    drawn: 10,
    lost: 5,
    goalsFor: 82,
    goalsAgainst: 41,
    points: 79,
    form: ["W", "D", "W", "W", "W"],
    position: 3,
    positionChange: 0,
  },
  {
    id: 4,
    name: "Chelsea",
    logo: "/placeholder.svg?height=24&width=24",
    played: 38,
    won: 21,
    drawn: 11,
    lost: 6,
    goalsFor: 76,
    goalsAgainst: 33,
    points: 74,
    form: ["W", "D", "W", "L", "W"],
    position: 4,
    positionChange: 0,
  },
  {
    id: 5,
    name: "Tottenham",
    logo: "/placeholder.svg?height=24&width=24",
    played: 38,
    won: 22,
    drawn: 5,
    lost: 11,
    goalsFor: 69,
    goalsAgainst: 40,
    points: 71,
    form: ["L", "W", "W", "W", "D"],
    position: 5,
    positionChange: 3,
  },
  {
    id: 6,
    name: "Manchester United",
    logo: "/placeholder.svg?height=24&width=24",
    played: 38,
    won: 20,
    drawn: 7,
    lost: 11,
    goalsFor: 57,
    goalsAgainst: 57,
    points: 67,
    form: ["L", "W", "L", "W", "W"],
    position: 6,
    positionChange: -1,
  },
  {
    id: 7,
    name: "West Ham",
    logo: "/placeholder.svg?height=24&width=24",
    played: 38,
    won: 16,
    drawn: 8,
    lost: 14,
    goalsFor: 60,
    goalsAgainst: 51,
    points: 56,
    form: ["D", "W", "L", "W", "D"],
    position: 7,
    positionChange: 0,
  },
  {
    id: 8,
    name: "Leicester",
    logo: "/placeholder.svg?height=24&width=24",
    played: 38,
    won: 14,
    drawn: 10,
    lost: 14,
    goalsFor: 62,
    goalsAgainst: 59,
    points: 52,
    form: ["W", "D", "L", "W", "W"],
    position: 8,
    positionChange: 0,
  },
  {
    id: 9,
    name: "Brighton",
    logo: "/placeholder.svg?height=24&width=24",
    played: 38,
    won: 12,
    drawn: 15,
    lost: 11,
    goalsFor: 42,
    goalsAgainst: 44,
    points: 51,
    form: ["W", "D", "W", "D", "L"],
    position: 9,
    positionChange: 2,
  },
  {
    id: 10,
    name: "Wolves",
    logo: "/placeholder.svg?height=24&width=24",
    played: 38,
    won: 15,
    drawn: 6,
    lost: 17,
    goalsFor: 38,
    goalsAgainst: 43,
    points: 51,
    form: ["L", "L", "W", "L", "W"],
    position: 10,
    positionChange: -2,
  },
]

export default function LeagueTable() {
  const [sortColumn, setSortColumn] = useState("points")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  // Sort teams based on current sort settings
  const sortedTeams = [...teams].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  // Render position change indicator
  const renderPositionChange = (change: number) => {
    if (change > 0) {
      return <ArrowUp className="h-4 w-4 text-green-500" />
    } else if (change < 0) {
      return <ArrowDown className="h-4 w-4 text-red-500" />
    } else {
      return <ArrowRight className="h-4 w-4 text-gray-400" />
    }
  }

  // Render form indicators
  const renderForm = (form: string[]) => {
    return (
      <div className="flex gap-1">
        {form.map((result, index) => {
          let bgColor = ""
          if (result === "W") bgColor = "bg-green-500"
          else if (result === "D") bgColor = "bg-gray-400"
          else bgColor = "bg-red-500"

          return (
            <div
              key={index}
              className={`${bgColor} w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold`}
            >
              {result}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 w-12">#</th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Team</th>
              <th
                className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70"
                onClick={() => handleSort("played")}
              >
                <div className="flex items-center justify-center">
                  <span>MP</span>
                  {sortColumn === "played" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3 ml-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 ml-1" />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70"
                onClick={() => handleSort("won")}
              >
                <div className="flex items-center justify-center">
                  <span>W</span>
                  {sortColumn === "won" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3 ml-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 ml-1" />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70"
                onClick={() => handleSort("drawn")}
              >
                <div className="flex items-center justify-center">
                  <span>D</span>
                  {sortColumn === "drawn" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3 ml-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 ml-1" />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70"
                onClick={() => handleSort("lost")}
              >
                <div className="flex items-center justify-center">
                  <span>L</span>
                  {sortColumn === "lost" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3 ml-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 ml-1" />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70"
                onClick={() => handleSort("goalsFor")}
              >
                <div className="flex items-center justify-center">
                  <span>GF</span>
                  {sortColumn === "goalsFor" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3 ml-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 ml-1" />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70"
                onClick={() => handleSort("goalsAgainst")}
              >
                <div className="flex items-center justify-center">
                  <span>GA</span>
                  {sortColumn === "goalsAgainst" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3 ml-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 ml-1" />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70"
                onClick={() => handleSort("points")}
              >
                <div className="flex items-center justify-center">
                  <span>Pts</span>
                  {sortColumn === "points" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3 ml-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 ml-1" />
                    ))}
                </div>
              </th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-center">
                <div className="flex items-center justify-center">
                  <span>Form</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Last 5 matches (newest first)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTeams.map((team, index) => (
              <tr
                key={team.id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800/60 ${
                  index < 4
                    ? "border-l-4 border-[#10b981]"
                    : index >= teams.length - 3
                      ? "border-l-4 border-red-500"
                      : ""
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    {team.position}
                    <span className="ml-1">{renderPositionChange(team.positionChange)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Image src={team.logo || "/placeholder.svg"} alt={team.name} width={24} height={24} />
                    <span className="font-medium text-gray-900 dark:text-white">{team.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{team.played}</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{team.won}</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{team.drawn}</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{team.lost}</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{team.goalsFor}</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{team.goalsAgainst}</td>
                <td className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">{team.points}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center">{renderForm(team.form)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
          <span>Champions League qualification</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Relegation</span>
        </div>
      </div>
    </div>
  )
}
