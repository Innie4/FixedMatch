import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  Clock,
  LineChart,
  Lock,
  MapPin,
  Share2,
  Shield,
  Star,
  Users,
} from "lucide-react"
import MatchStatsChart from "@/components/match-stats-chart"
import H2HFixtures from "@/components/h2h-fixtures"
import RelatedPredictions from "@/components/related-predictions"
import BettingOdds from "@/components/betting-odds"

export default function PredictionDetailPage({ params }: { params: { id: string } }) {
  // In a real app, fetch this data based on the prediction ID
  const predictionId = params.id

  // Sample data for the prediction detail page
  const prediction = {
    id: Number(predictionId) || 1,
    homeTeam: "Arsenal",
    homeTeamLogo: "/placeholder.svg?height=80&width=80",
    awayTeam: "Chelsea",
    awayTeamLogo: "/placeholder.svg?height=80&width=80",
    league: "Premier League",
    leagueLogo: "/placeholder.svg?height=30&width=30",
    matchTime: "Today, 20:00",
    date: "May 5, 2025",
    stadium: "Emirates Stadium",
    location: "London, UK",
    prediction: "Home Win",
    confidence: 85,
    status: "upcoming",
    analysis: `
      Arsenal has been in excellent form at home, winning their last 4 matches at the Emirates with a combined score of 11-2. 
      Chelsea has struggled in away fixtures against top-six teams this season, managing just 1 win in 5 attempts.

      Arsenal's pressing game has been very effective, and they've been particularly strong in the first half of matches. 
      Chelsea's defensive organization has shown vulnerabilities when facing teams that press high.

      Additionally, Arsenal has won 3 of the last 4 home fixtures against Chelsea, with the other result being a draw.
      
      Key player availability:
      - Arsenal has a fully fit squad with no suspensions
      - Chelsea will be missing their first-choice defensive midfielder due to suspension
      
      Based on current form, head-to-head record, and team news, Arsenal has a high probability of winning this match.
    `,
    vipTips: "Arsenal -1.5 Asian Handicap offers good value. Also consider Arsenal to score in both halves.",
    homeLastFive: ["W", "W", "D", "W", "W"],
    awayLastFive: ["W", "L", "W", "D", "L"],
    homeStats: {
      possession: 58,
      shots: 15.3,
      shotsOnTarget: 6.7,
      corners: 7.2,
      goals: 2.4,
    },
    awayStats: {
      possession: 52,
      shots: 13.1,
      shotsOnTarget: 5.2,
      corners: 5.8,
      goals: 1.5,
    },
  }

  const isVipPrediction = prediction.confidence > 85

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/predictions" className="text-[#1a56db] hover:underline inline-flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Predictions
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image
                src={prediction.leagueLogo || "/placeholder.svg"}
                alt={prediction.league}
                width={30}
                height={30}
                className="rounded-full"
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">{prediction.league}</span>
              {isVipPrediction && (
                <Badge className="bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/20">
                  <Lock className="h-3 w-3 mr-1" />
                  VIP
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CalendarDays className="h-4 w-4 mr-1" />
                {prediction.date}
              </div>
              <div className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                {prediction.matchTime}
              </div>
              <div className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-1" />
                {prediction.stadium}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-8">
            <div className="flex flex-col items-center text-center">
              <Image
                src={prediction.homeTeamLogo || "/placeholder.svg"}
                alt={prediction.homeTeam}
                width={80}
                height={80}
                className="mb-3"
              />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{prediction.homeTeam}</h3>
              <div className="flex mt-2 gap-1">
                {prediction.homeLastFive.map((result, i) => {
                  const bg = result === "W" ? "bg-green-500" : result === "D" ? "bg-gray-400" : "bg-red-500"
                  return (
                    <div
                      key={i}
                      className={`${bg} w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {result}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="py-4 flex flex-col items-center">
              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500 mb-3">vs</div>
              <div className="bg-[#1a56db]/10 dark:bg-[#1a56db]/20 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">Our Prediction</div>
                <div className="font-bold text-lg text-[#1a56db]">{prediction.prediction}</div>
                <div className="mt-2">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Confidence:</span>
                    <span className="text-xs font-medium">{prediction.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-[#1a56db] h-2 rounded-full" style={{ width: `${prediction.confidence}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <Image
                src={prediction.awayTeamLogo || "/placeholder.svg"}
                alt={prediction.awayTeam}
                width={80}
                height={80}
                className="mb-3"
              />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{prediction.awayTeam}</h3>
              <div className="flex mt-2 gap-1">
                {prediction.awayLastFive.map((result, i) => {
                  const bg = result === "W" ? "bg-green-500" : result === "D" ? "bg-gray-400" : "bg-red-500"
                  return (
                    <div
                      key={i}
                      className={`${bg} w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {result}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-[#1a56db]" />
                Analysis
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {prediction.analysis}
              </div>
            </div>

            {isVipPrediction && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-[#fbbf24]" />
                  VIP Betting Tips
                </h3>
                <div className="bg-[#fbbf24]/10 dark:bg-[#fbbf24]/5 rounded-lg p-4 border border-[#fbbf24]/20">
                  <div className="flex items-start">
                    <Lock className="h-5 w-5 text-[#fbbf24] mr-3 mt-0.5" />
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        Unlock exclusive betting tips and insights from our expert analysts.
                      </p>
                      <Button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-white">Upgrade to VIP</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Set Reminder
                </Button>
              </div>
              <Button className="bg-[#1a56db] hover:bg-[#1e40af]">Place Bet</Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList className="w-full justify-start border-b pb-px dark:border-gray-700">
          <TabsTrigger
            value="stats"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1a56db]"
          >
            Match Stats
          </TabsTrigger>
          <TabsTrigger
            value="h2h"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1a56db]"
          >
            Head to Head
          </TabsTrigger>
          <TabsTrigger
            value="odds"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1a56db]"
          >
            Betting Odds
          </TabsTrigger>
          <TabsTrigger
            value="lineups"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1a56db]"
          >
            Lineups
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TabsContent value="stats" className="mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Team Comparison</h3>
                <MatchStatsChart homeTeam={prediction.homeTeam} awayTeam={prediction.awayTeam} stats={prediction} />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-[#1a56db]" />
                      {prediction.homeTeam} Form
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                        <span className="text-gray-600 dark:text-gray-400">Avg. goals scored:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {prediction.homeStats.goals} per game
                        </span>
                      </li>
                      <li className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                        <span className="text-gray-600 dark:text-gray-400">Avg. possession:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {prediction.homeStats.possession}%
                        </span>
                      </li>
                      <li className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                        <span className="text-gray-600 dark:text-gray-400">Clean sheets:</span>
                        <span className="font-medium text-gray-900 dark:text-white">3 in last 5</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-[#1a56db]" />
                      {prediction.awayTeam} Form
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                        <span className="text-gray-600 dark:text-gray-400">Avg. goals scored:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {prediction.awayStats.goals} per game
                        </span>
                      </li>
                      <li className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                        <span className="text-gray-600 dark:text-gray-400">Avg. possession:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {prediction.awayStats.possession}%
                        </span>
                      </li>
                      <li className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                        <span className="text-gray-600 dark:text-gray-400">Clean sheets:</span>
                        <span className="font-medium text-gray-900 dark:text-white">1 in last 5</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="h2h" className="mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Head to Head</h3>
                <H2HFixtures homeTeam={prediction.homeTeam} awayTeam={prediction.awayTeam} />
              </div>
            </TabsContent>

            <TabsContent value="odds" className="mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Betting Odds</h3>
                <BettingOdds homeTeam={prediction.homeTeam} awayTeam={prediction.awayTeam} />
              </div>
            </TabsContent>

            <TabsContent value="lineups" className="mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Expected Lineups</h3>
                <div className="flex items-center justify-center p-10 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <div className="text-gray-500 dark:text-gray-400 text-center">
                    <Users className="h-10 w-10 mx-auto mb-2 opacity-60" />
                    <p>Lineups will be available closer to match time</p>
                    <p className="text-sm mt-1">Check back 1 hour before kickoff</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>

          <div>
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Related Predictions</h3>
                <RelatedPredictions currentId={prediction.id} league={prediction.league} />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Expert Opinion</h3>
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="Expert"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Michael Thompson</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Premier League Analyst</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  "Arsenal's pressing game will likely cause problems for Chelsea. Expect a high-intensity match with
                  Arsenal having the edge at home."
                </p>
                <div className="flex items-center">
                  <LineChart className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 dark:text-green-500">83% prediction accuracy rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
