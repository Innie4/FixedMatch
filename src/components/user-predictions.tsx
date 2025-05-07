"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Check, X, Calendar, FilterX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UserPredictions() {
  const [filter, setFilter] = useState("all")

  // Sample predictions data
  const predictions = [
    {
      id: 1,
      date: "Oct 28, 2023",
      homeTeam: "Arsenal",
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      awayTeam: "Chelsea",
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      league: "Premier League",
      prediction: "Home Win",
      odds: 1.85,
      result: "won",
      stake: 3,
      profit: 2.55,
    },
    {
      id: 2,
      date: "Oct 25, 2023",
      homeTeam: "Barcelona",
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      awayTeam: "Real Madrid",
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      league: "La Liga",
      prediction: "Over 2.5 Goals",
      odds: 1.75,
      result: "won",
      stake: 2,
      profit: 1.5,
    },
    {
      id: 3,
      date: "Oct 22, 2023",
      homeTeam: "Bayern Munich",
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      awayTeam: "Dortmund",
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      league: "Bundesliga",
      prediction: "Both Teams to Score",
      odds: 1.65,
      result: "lost",
      stake: 2,
      profit: -2,
    },
    {
      id: 4,
      date: "Oct 18, 2023",
      homeTeam: "Liverpool",
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      awayTeam: "Man City",
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      league: "Premier League",
      prediction: "Draw",
      odds: 3.75,
      result: "won",
      stake: 1,
      profit: 2.75,
    },
    {
      id: 5,
      date: "Oct 15, 2023",
      homeTeam: "PSG",
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      awayTeam: "Marseille",
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      league: "Ligue 1",
      prediction: "Home Win & Over 2.5",
      odds: 2.2,
      result: "lost",
      stake: 2,
      profit: -2,
    },
  ]

  const filteredPredictions = filter === "all" ? predictions : predictions.filter((p) => p.result === filter)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Predictions</h3>
        <div className="flex items-center gap-2">
          <Select defaultValue="all" onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredPredictions.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Match</TableHead>
                <TableHead>League</TableHead>
                <TableHead>Prediction</TableHead>
                <TableHead className="text-right">Odds</TableHead>
                <TableHead className="text-right">Stake</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-center">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPredictions.map((prediction) => (
                <TableRow key={prediction.id}>
                  <TableCell className="font-medium">{prediction.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Image
                        src={prediction.homeTeamLogo || "/placeholder.svg"}
                        alt={prediction.homeTeam}
                        width={16}
                        height={16}
                      />
                      <span className="text-gray-900 dark:text-white">{prediction.homeTeam}</span>
                      <span className="text-gray-500 mx-1">vs</span>
                      <span className="text-gray-900 dark:text-white">{prediction.awayTeam}</span>
                      <Image
                        src={prediction.awayTeamLogo || "/placeholder.svg"}
                        alt={prediction.awayTeam}
                        width={16}
                        height={16}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{prediction.league}</TableCell>
                  <TableCell>{prediction.prediction}</TableCell>
                  <TableCell className="text-right">{prediction.odds.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{prediction.stake}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      prediction.result === "won" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {prediction.profit > 0 ? "+" : ""}
                    {prediction.profit.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {prediction.result === "won" ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                        <Check className="h-3 w-3 mr-1" />
                        Won
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Lost
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <FilterX className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No predictions match your filter criteria</p>
          <Button variant="outline" className="mt-4" onClick={() => setFilter("all")}>
            Clear Filters
          </Button>
        </div>
      )}

      <div className="text-center">
        <Button variant="outline">View All Predictions History</Button>
      </div>
    </div>
  )
}
