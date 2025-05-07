import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, RefreshCw, Search } from "lucide-react"
import LiveMatchCard from "@/components/live-match-card"

// Define types for match data
type MatchStatus = "LIVE" | "FINISHED" | "UPCOMING";

type MatchEvent = {
  type: "goal" | "yellowCard" | "redCard" | "substitution";
  team: "home" | "away";
  player: string;
  minute: number;
  penalty?: boolean;
};

type Match = {
  id: number;
  homeTeam: string;
  homeTeamLogo: string;
  homeScore?: number;
  awayTeam: string;
  awayTeamLogo: string;
  awayScore?: number;
  league: string;
  leagueLogo: string;
  status: MatchStatus;
  minute?: number;
  kickoff?: string;
  events?: MatchEvent[];
};

export default function LiveScoresPage() {
  // Sample live matches data
  const liveMatches: Match[] = [
    {
      id: 1,
      homeTeam: "Liverpool",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      homeScore: 2,
      awayTeam: "Manchester City",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      awayScore: 1,
      league: "Premier League",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      status: "LIVE" as "LIVE",
      minute: 67,
      events: [
        { type: "goal", team: "home", player: "Salah", minute: 23 },
        { type: "goal", team: "away", player: "De Bruyne", minute: 45 },
        { type: "yellowCard", team: "away", player: "Rodri", minute: 52 },
        { type: "goal", team: "home", player: "Nunez", minute: 61 },
      ],
    },
    {
      id: 2,
      homeTeam: "Barcelona",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      homeScore: 3,
      awayTeam: "Real Madrid",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      awayScore: 2,
      league: "La Liga",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      status: "LIVE" as "LIVE",
      minute: 82,
      events: [
        { type: "goal", team: "home", player: "Lewandowski", minute: 12 },
        { type: "goal", team: "away", player: "Vinicius", minute: 24 },
        { type: "goal", team: "home", player: "Pedri", minute: 36 },
        { type: "redCard", team: "away", player: "Carvajal", minute: 58 },
        { type: "goal", team: "away", player: "Bellingham", minute: 65 },
        { type: "goal", team: "home", player: "Raphinha", minute: 77 },
      ],
    },
    {
      id: 3,
      homeTeam: "Bayern Munich",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      homeScore: 1,
      awayTeam: "Dortmund",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      awayScore: 1,
      league: "Bundesliga",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      status: "LIVE" as "LIVE",
      minute: 54,
      events: [
        { type: "goal", team: "away", player: "Haaland", minute: 15 },
        { type: "yellowCard", team: "home", player: "Kimmich", minute: 32 },
        { type: "goal", team: "home", player: "Musiala", minute: 48 },
      ],
    },
    {
      id: 4,
      homeTeam: "AC Milan",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      homeScore: 0,
      awayTeam: "Inter Milan",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      awayScore: 0,
      league: "Serie A",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      status: "LIVE" as "LIVE",
      minute: 23,
      events: [{ type: "yellowCard", team: "away", player: "Barella", minute: 18 }],
    },
    {
      id: 5,
      homeTeam: "PSG",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      homeScore: 2,
      awayTeam: "Marseille",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      awayScore: 0,
      league: "Ligue 1",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      status: "LIVE" as "LIVE",
      minute: 75,
      events: [
        { type: "goal", team: "home", player: "Mbappé", minute: 8 },
        { type: "yellowCard", team: "away", player: "Guendouzi", minute: 27 },
        { type: "goal", team: "home", player: "Mbappé", minute: 62, penalty: true },
      ],
    },
    {
      id: 6,
      homeTeam: "Ajax",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      homeScore: 3,
      awayTeam: "PSV",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      awayScore: 1,
      league: "Eredivisie",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      status: "FINISHED" as "FINISHED",
      minute: 90,
      events: [
        { type: "goal", team: "home", player: "Tadic", minute: 14 },
        { type: "goal", team: "home", player: "Bergwijn", minute: 35 },
        { type: "goal", team: "away", player: "Gakpo", minute: 52 },
        { type: "goal", team: "home", player: "Brobbey", minute: 78 },
      ],
    },
  ]

  // Upcoming matches
  const upcomingMatches: Match[] = [
    {
      id: 7,
      homeTeam: "Arsenal",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      awayTeam: "Tottenham",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      league: "Premier League",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      status: "UPCOMING" as "UPCOMING",  // Type assertion here
      kickoff: "Today, 17:30",
    },
    {
      id: 8,
      homeTeam: "Juventus",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      awayTeam: "Napoli",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      league: "Serie A",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      status: "UPCOMING" as "UPCOMING",  // Type assertion here
      kickoff: "Today, 19:45",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Live Scores</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Today</span>
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex">
            All Leagues
          </Button>
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input type="search" placeholder="Search teams or leagues..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="live">
        <TabsList className="mb-6">
          <TabsTrigger value="live" className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Live
          </TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="finished">Finished</TabsTrigger>
          <TabsTrigger value="all">All Matches</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {liveMatches
            .filter((match) => match.status === "LIVE")
            .map((match) => (
              <LiveMatchCard key={match.id} match={match} />
            ))}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMatches.map((match) => (
            <LiveMatchCard key={match.id} match={match} />
          ))}
        </TabsContent>

        <TabsContent value="finished" className="space-y-4">
          {liveMatches
            .filter((match) => match.status === "FINISHED")
            .map((match) => (
              <LiveMatchCard key={match.id} match={match} />
            ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {[...liveMatches, ...upcomingMatches].map((match) => (
            <LiveMatchCard key={match.id} match={match} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
