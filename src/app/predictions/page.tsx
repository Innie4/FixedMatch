import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar, Filter, RefreshCw, Search } from 'lucide-react'
import PredictionList from '@/components/prediction-list'
import { fetcher } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface Prediction {
  id: number
  homeTeam: string
  homeTeamLogo?: string
  awayTeam: string
  awayTeamLogo?: string
  league: string
  leagueLogo?: string
  matchTime: string
  prediction: string
  odds?: number
  confidence?: number
  status: string
  result?: string
  analysis?: string
  vipOnly?: boolean
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<
    'all' | 'today' | 'tomorrow' | 'weekend' | 'top' | 'vip'
  >('all')
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([])
  const [selectedPredictionTypes, setSelectedPredictionTypes] = useState<string[]>([])
  const [selectedConfidenceLevels, setSelectedConfidenceLevels] = useState<string[]>([])
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const { toast } = useToast()

  const fetchPredictions = async (
    filter: typeof activeTab,
    leagues: string[] = [],
    predictionTypes: string[] = [],
    confidenceLevels: string[] = []
  ) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append('filter', filter)
      if (leagues.length > 0) {
        params.append('leagues', leagues.join(','))
      }
      if (predictionTypes.length > 0) {
        params.append('predictionTypes', predictionTypes.join(','))
      }
      if (confidenceLevels.length > 0) {
        params.append('confidenceLevels', confidenceLevels.join(','))
      }
      const url = `/api/predictions?${params.toString()}`
      const data = await fetcher<Prediction[]>(url, {}, toast)
      setPredictions(data)
    } catch (e: any) {
      setError(e.message || 'Failed to load predictions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPredictions(activeTab, selectedLeagues, selectedPredictionTypes, selectedConfidenceLevels)
  }, [activeTab, selectedLeagues, selectedPredictionTypes, selectedConfidenceLevels])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleRefresh = () => {
    fetchPredictions(activeTab, selectedLeagues, selectedPredictionTypes, selectedConfidenceLevels)
  }

  const handleLeagueToggle = (league: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(league) ? prev.filter((l) => l !== league) : [...prev, league]
    )
  }

  const handlePredictionTypeToggle = (type: string) => {
    setSelectedPredictionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleConfidenceLevelToggle = (level: string) => {
    setSelectedConfidenceLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    )
  }

  const applyFilters = () => {
    fetchPredictions(activeTab, selectedLeagues, selectedPredictionTypes, selectedConfidenceLevels)
    setIsFilterSheetOpen(false)
  }

  const resetFilters = () => {
    setSelectedLeagues([])
    setSelectedPredictionTypes([])
    setSelectedConfidenceLevels([])
    fetchPredictions(activeTab, [], [], [])
    setIsFilterSheetOpen(false)
  }

  const filteredPredictions = predictions.filter(
    (prediction) =>
      prediction.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.league.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Football Predictions
      </h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setActiveTab('today')}
          >
            <Calendar className="h-4 w-4" />
            <span>Today</span>
          </Button>
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filter Predictions</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Leagues</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Premier League',
                      'La Liga',
                      'Bundesliga',
                      'Serie A',
                      'Ligue 1',
                      'Champions League',
                      'Eredivisie',
                      'Primeira Liga',
                    ].map((league) => (
                      <div key={league} className="flex items-center space-x-2">
                        <Checkbox
                          id={`league-${league.replace(/\s/g, '')}`}
                          checked={selectedLeagues.includes(league)}
                          onCheckedChange={() => handleLeagueToggle(league)}
                        />
                        <Label
                          htmlFor={`league-${league.replace(/\s/g, '')}`}
                          className="text-sm font-normal"
                        >
                          {league}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                    Prediction Type
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Match Result',
                      'Both Teams to Score',
                      'Over/Under',
                      'Correct Score',
                      'Handicap',
                    ].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type.replace(/\s/g, '')}`}
                          checked={selectedPredictionTypes.includes(type)}
                          onCheckedChange={() => handlePredictionTypeToggle(type)}
                        />
                        <Label
                          htmlFor={`type-${type.replace(/\s/g, '')}`}
                          className="text-sm font-normal"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                    Confidence Level
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {['High (90%+)', 'Medium (70-90%)', 'Low (<70%)'].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`confidence-${level.replace(/\s|\W/g, '')}`}
                          checked={selectedConfidenceLevels.includes(level)}
                          onCheckedChange={() => handleConfidenceLevelToggle(level)}
                        />
                        <Label
                          htmlFor={`confidence-${level.replace(/\s|\W/g, '')}`}
                          className="text-sm font-normal"
                        >
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <SheetClose asChild>
                    <Button
                      className="w-full bg-[#1a56db] hover:bg-[#1e40af]"
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search teams or leagues..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            size="icon"
            className="flex-shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        className="space-y-4"
      >
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
            <PredictionList predictions={filteredPredictions} loading={loading} error={error} />
          </div>

          <div className="hidden md:block">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Quick Filters</h3>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => {
                      setSelectedLeagues(
                        selectedLeagues.includes('Premier League') ? [] : ['Premier League']
                      )
                      applyFilters()
                    }}
                  >
                    <img
                      src="/leagues/premier-league.svg"
                      alt="Premier League"
                      className="w-4 h-4 mr-2 rounded-full"
                    />
                    Premier League
                  </Button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Top Leagues</h3>
                <ul className="space-y-2">
                  {[
                    'Premier League',
                    'La Liga',
                    'Bundesliga',
                    'Serie A',
                    'Ligue 1',
                    'Champions League',
                  ].map((league, i) => (
                    <li key={i}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 dark:text-gray-300"
                      >
                        <img
                          src={`/leagues/${league.toLowerCase().replace(/ /g, '-')}.svg`}
                          alt={league}
                          className="w-5 h-5 mr-2 rounded-full"
                        />
                        {league}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
