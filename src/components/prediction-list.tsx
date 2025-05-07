"use client"

import { useState, useEffect } from "react"
import PredictionCard from "@/components/prediction-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Sample prediction data
const allPredictions = [
  {
    id: 1,
    homeTeam: "Arsenal",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Chelsea",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "Premier League",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "Today, 20:00",
    prediction: "Home Win",
    confidence: 85,
    status: "upcoming",
  },
  {
    id: 2,
    homeTeam: "Barcelona",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Real Madrid",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "La Liga",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "Tomorrow, 19:45",
    prediction: "Over 2.5 Goals",
    confidence: 78,
    status: "upcoming",
  },
  {
    id: 3,
    homeTeam: "Bayern Munich",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Dortmund",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "Bundesliga",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "Today, 17:30",
    prediction: "Both Teams to Score",
    confidence: 92,
    status: "upcoming",
    vipOnly: true,
    analysis:
      "Bayern and Dortmund both have strong attacking options but have shown defensive vulnerabilities in recent matches.",
  },
  {
    id: 4,
    homeTeam: "Liverpool",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Man City",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "Premier League",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "Tomorrow, 16:00",
    prediction: "Draw",
    confidence: 65,
    status: "upcoming",
  },
  {
    id: 5,
    homeTeam: "PSG",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Marseille",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "Ligue 1",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "Today, 21:00",
    prediction: "Home Win & Over 2.5",
    confidence: 75,
    status: "upcoming",
  },
  {
    id: 6,
    homeTeam: "AC Milan",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Inter Milan",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "Serie A",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "Tomorrow, 20:45",
    prediction: "Away Win",
    confidence: 70,
    status: "upcoming",
  },
  {
    id: 7,
    homeTeam: "Manchester United",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Tottenham",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "Premier League",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "Saturday, 17:30",
    prediction: "Over 2.5 Goals & BTTS",
    confidence: 88,
    status: "upcoming",
    vipOnly: true,
    analysis:
      "Both teams have been scoring and conceding goals consistently in their recent fixtures. Expect an open game with multiple goals.",
  },
  {
    id: 8,
    homeTeam: "Juventus",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "Napoli",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "Serie A",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "Sunday, 19:45",
    prediction: "Under 2.5 Goals",
    confidence: 72,
    status: "upcoming",
  },
  {
    id: 9,
    homeTeam: "Ajax",
    homeTeamLogo: "/placeholder.svg?height=40&width=40",
    awayTeam: "PSV",
    awayTeamLogo: "/placeholder.svg?height=40&width=40",
    league: "Eredivisie",
    leagueLogo: "/placeholder.svg?height=24&width=24",
    matchTime: "Sunday, 15:30",
    prediction: "Home Win & Over 1.5",
    confidence: 81,
    status: "upcoming",
  },
]

interface PredictionListProps {
  filter: "all" | "today" | "tomorrow" | "weekend" | "top" | "vip"
}

export default function PredictionList({ filter }: PredictionListProps) {
  const [predictions, setPredictions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    // Simulate API call with a delay
    setIsLoading(true)

    setTimeout(() => {
      let filteredPredictions = [...allPredictions]

      // Apply filter
      switch (filter) {
        case "today":
          filteredPredictions = allPredictions.filter((p) => p.matchTime.includes("Today"))
          break
        case "tomorrow":
          filteredPredictions = allPredictions.filter((p) => p.matchTime.includes("Tomorrow"))
          break
        case "weekend":
          filteredPredictions = allPredictions.filter(
            (p) => p.matchTime.includes("Saturday") || p.matchTime.includes("Sunday"),
          )
          break
        case "top":
          filteredPredictions = allPredictions
            .filter((p) => p.confidence >= 80)
            .sort((a, b) => b.confidence - a.confidence)
          break
        case "vip":
          filteredPredictions = allPredictions.filter((p) => p.vipOnly)
          break
      }

      setPredictions(filteredPredictions)
      setIsLoading(false)
      setVisibleCount(6)
    }, 800)
  }, [filter])

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-10 h-10 text-[#1a56db] animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading predictions...</p>
      </div>
    )
  }

  if (predictions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-2">No predictions found for the selected filter.</p>
        <p className="text-gray-500 dark:text-gray-500">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {predictions.slice(0, visibleCount).map((prediction) => (
          <PredictionCard key={prediction.id} prediction={prediction} />
        ))}
      </div>

      {visibleCount < predictions.length && (
        <div className="text-center pt-4">
          <Button
            onClick={loadMore}
            variant="outline"
            className="border-[#1a56db] text-[#1a56db] hover:bg-[#1a56db]/10"
          >
            Load More Predictions
          </Button>
        </div>
      )}
    </div>
  )
}
