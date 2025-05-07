import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface RelatedPredictionsProps {
  currentId: number
  league: string
}

export default function RelatedPredictions({ currentId, league }: RelatedPredictionsProps) {
  // Sample related predictions data - in a real app, this would be fetched based on the league or teams
  const relatedPredictions = [
    {
      id: currentId === 1 ? 2 : 1,
      homeTeam: "Liverpool",
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      awayTeam: "Man City",
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      league: "Premier League",
      leagueLogo: "/placeholder.svg?height=16&width=16",
      matchTime: "Today, 17:30",
      prediction: "Both Teams to Score",
    },
    {
      id: currentId === 3 ? 4 : 3,
      homeTeam: "Barcelona",
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      awayTeam: "Real Madrid",
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      league: "La Liga",
      leagueLogo: "/placeholder.svg?height=16&width=16",
      matchTime: "Tomorrow, 20:00",
      prediction: "Over 2.5 Goals",
    },
    {
      id: currentId === 5 ? 6 : 5,
      homeTeam: "PSG",
      homeTeamLogo: "/placeholder.svg?height=24&width=24",
      awayTeam: "Marseille",
      awayTeamLogo: "/placeholder.svg?height=24&width=24",
      league: "Ligue 1",
      leagueLogo: "/placeholder.svg?height=16&width=16",
      matchTime: "Sunday, 20:45",
      prediction: "Home Win",
    },
  ]

  return (
    <div className="space-y-3">
      {relatedPredictions.map((prediction) => (
        <Link key={prediction.id} href={`/prediction/${prediction.id}`}>
          <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                <Image
                  src={prediction.leagueLogo || "/placeholder.svg"}
                  alt={prediction.league}
                  width={16}
                  height={16}
                  className="rounded-full"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">{prediction.matchTime}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Image
                    src={prediction.homeTeamLogo || "/placeholder.svg"}
                    alt={prediction.homeTeam}
                    width={20}
                    height={20}
                  />
                  <span className="font-medium text-gray-900 dark:text-white">{prediction.homeTeam}</span>
                </div>

                <span className="text-xs text-gray-500 dark:text-gray-400 mx-1">vs</span>

                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900 dark:text-white">{prediction.awayTeam}</span>
                  <Image
                    src={prediction.awayTeamLogo || "/placeholder.svg"}
                    alt={prediction.awayTeam}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            </div>

            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </Link>
      ))}

      <Link href="/predictions" className="block text-center text-sm text-[#1a56db] hover:underline pt-2">
        View more predictions
      </Link>
    </div>
  )
}
