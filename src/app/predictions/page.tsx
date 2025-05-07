import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, Filter, RefreshCw, Search } from "lucide-react"
import PredictionList from "@/components/prediction-list"

export default function PredictionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Football Predictions</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Today</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
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

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          <TabsTrigger value="weekend">Weekend</TabsTrigger>
          <TabsTrigger value="top">Top Picks</TabsTrigger>
          <TabsTrigger value="vip">VIP Only</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-full md:col-span-1 lg:col-span-2">
            <TabsContent value="all" className="mt-0">
              <PredictionList filter="all" />
            </TabsContent>

            <TabsContent value="today" className="mt-0">
              <PredictionList filter="today" />
            </TabsContent>

            <TabsContent value="tomorrow" className="mt-0">
              <PredictionList filter="tomorrow" />
            </TabsContent>

            <TabsContent value="weekend" className="mt-0">
              <PredictionList filter="weekend" />
            </TabsContent>

            <TabsContent value="top" className="mt-0">
              <PredictionList filter="top" />
            </TabsContent>

            <TabsContent value="vip" className="mt-0">
              <PredictionList filter="vip" />
            </TabsContent>
          </div>

          <div className="hidden md:block">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Filter Predictions</h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Leagues</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Premier League
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        La Liga
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Bundesliga
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Serie A
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Ligue 1
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Prediction Type</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Match Result
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Both Teams to Score
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Over/Under
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Correct Score
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Confidence Level</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        High (90%+)
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Medium (70-90%)
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Low (&lt;70%)
                      </Button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full bg-[#1a56db] hover:bg-[#1e40af]">Apply Filters</Button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Top Leagues</h3>
                <ul className="space-y-2">
                  {["Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1", "Champions League"].map(
                    (league, i) => (
                      <li key={i}>
                        <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300">
                          <img
                            src={`/placeholder.svg?height=20&width=20`}
                            alt={league}
                            className="w-5 h-5 mr-2 rounded-full"
                          />
                          {league}
                        </Button>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
