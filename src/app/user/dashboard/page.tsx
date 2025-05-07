import Link from "next/link"
import Image from "next/image"
import { BarChart3, Clock, FileText, MessageSquare, Settings, Star, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserStats from "@/components/user-stats"
import UserPredictions from "@/components/user-predictions"
import UserSubscription from "@/components/user-subscription"

export default function UserDashboard() {
  // Sample user data - in a real app, this would come from a database or API
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "May 2023",
    subscription: "VIP Monthly",
    predictionStats: {
      total: 248,
      won: 187,
      lost: 61,
      successRate: 75.4,
      averageOdds: 1.85,
      profit: 126.5,
      roi: 24.3,
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 lg:w-72">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-20">
            <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#10b981] rounded-full p-1">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Member since {user.joinDate}</p>
              <div className="mt-2">
                <span className="bg-[#1a56db]/10 text-[#1a56db] dark:bg-[#1a56db]/20 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {user.subscription}
                </span>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <Link href="/user/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/user/predictions">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      My Predictions
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/user/subscription">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Subscription
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/user/bookmarks">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Bookmarks
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/user/messages">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Messages
                      <span className="ml-auto bg-[#1a56db] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        3
                      </span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/user/profile">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/user/settings">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user.name}! Here's an overview of your predictions and performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="bg-[#1a56db]/10 dark:bg-[#1a56db]/20 p-3 rounded-full mr-4">
                  <BarChart3 className="h-6 w-6 text-[#1a56db]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.predictionStats.successRate}%
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="bg-[#10b981]/10 dark:bg-[#10b981]/20 p-3 rounded-full mr-4">
                  <Trophy className="h-6 w-6 text-[#10b981]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Predictions</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{user.predictionStats.total}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="bg-[#fbbf24]/10 dark:bg-[#fbbf24]/20 p-3 rounded-full mr-4">
                  <Star className="h-6 w-6 text-[#fbbf24]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Profit</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    +{user.predictionStats.profit} units
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ROI</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{user.predictionStats.roi}%</h3>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="stats" className="space-y-4">
            <TabsList>
              <TabsTrigger value="stats">Stats & Performance</TabsTrigger>
              <TabsTrigger value="predictions">Recent Predictions</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-4">
              <UserStats stats={user.predictionStats} />
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <UserPredictions />
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4">
              <UserSubscription subscription={user.subscription} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
