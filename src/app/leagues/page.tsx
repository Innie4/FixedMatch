import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import LeagueTable from "@/components/league-table"

export default function LeaguesPage() {
  // Sample continents data
  const continents = [
    { id: "europe", name: "Europe" },
    { id: "south-america", name: "South America" },
    { id: "north-america", name: "North America" },
    { id: "africa", name: "Africa" },
    { id: "asia", name: "Asia" },
    { id: "oceania", name: "Oceania" },
  ]

  // Sample countries data for Europe
  const europeanCountries = [
    { id: "england", name: "England", flag: "/placeholder.svg?height=24&width=24" },
    { id: "spain", name: "Spain", flag: "/placeholder.svg?height=24&width=24" },
    { id: "germany", name: "Germany", flag: "/placeholder.svg?height=24&width=24" },
    { id: "italy", name: "Italy", flag: "/placeholder.svg?height=24&width=24" },
    { id: "france", name: "France", flag: "/placeholder.svg?height=24&width=24" },
    { id: "netherlands", name: "Netherlands", flag: "/placeholder.svg?height=24&width=24" },
    { id: "portugal", name: "Portugal", flag: "/placeholder.svg?height=24&width=24" },
    { id: "belgium", name: "Belgium", flag: "/placeholder.svg?height=24&width=24" },
  ]

  // Sample leagues data for England
  const englishLeagues = [
    { id: "premier-league", name: "Premier League", logo: "/placeholder.svg?height=32&width=32" },
    { id: "championship", name: "Championship", logo: "/placeholder.svg?height=32&width=32" },
    { id: "league-one", name: "League One", logo: "/placeholder.svg?height=32&width=32" },
    { id: "league-two", name: "League Two", logo: "/placeholder.svg?height=32&width=32" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">League Tables</h1>

      <div className="mb-8">
        <div className="relative w-full max-w-md mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input type="search" placeholder="Search leagues or countries..." className="pl-8" />
        </div>

        <Tabs defaultValue="europe">
          <TabsList className="mb-6 flex flex-wrap">
            {continents.map((continent) => (
              <TabsTrigger key={continent.id} value={continent.id}>
                {continent.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="europe" className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {europeanCountries.map((country) => (
                <Link
                  key={country.id}
                  href={`/leagues/${country.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center text-center hover:shadow-md transition-all"
                >
                  <Image
                    src={country.flag || "/placeholder.svg"}
                    alt={country.name}
                    width={48}
                    height={48}
                    className="rounded-full mb-2"
                  />
                  <h3 className="font-medium text-gray-900 dark:text-white">{country.name}</h3>
                </Link>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  alt="England"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">England</h2>
                  <div className="flex gap-2 mt-1">
                    {englishLeagues.map((league) => (
                      <Link
                        key={league.id}
                        href={`/leagues/england/${league.id}`}
                        className={`text-xs px-2 py-1 rounded-full ${
                          league.id === "premier-league"
                            ? "bg-[#1a56db] text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {league.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="table">
                <TabsList>
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="top-scorers">Top Scorers</TabsTrigger>
                  <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="mt-4">
                  <LeagueTable />
                </TabsContent>

                <TabsContent value="top-scorers" className="mt-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                          <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">#</th>
                          <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Player</th>
                          <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Team</th>
                          <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-center">Goals</th>
                          <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-center">
                            Assists
                          </th>
                          <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-center">
                            Matches
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {[...Array(10)].map((_, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{index + 1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Image
                                  src="/placeholder.svg?height=32&width=32"
                                  alt={`Player ${index + 1}`}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                                <span className="font-medium text-gray-900 dark:text-white">Player Name</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Team Name</td>
                            <td className="px-4 py-3 text-center font-medium text-gray-900 dark:text-white">
                              {20 - index}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                              {10 - Math.floor(index / 2)}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">38</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="fixtures" className="mt-4">
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Fixtures content will be displayed here
                  </div>
                </TabsContent>

                <TabsContent value="results" className="mt-4">
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Results content will be displayed here
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {continents
            .filter((c) => c.id !== "europe")
            .map((continent) => (
              <TabsContent key={continent.id} value={continent.id}>
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {continent.name} leagues will be displayed here
                </div>
              </TabsContent>
            ))}
        </Tabs>
      </div>
    </div>
  )
}
