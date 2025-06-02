import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, ChevronRight, Star, Trophy, Check } from "lucide-react"
import PredictionCard from "@/components/prediction-card"
import TestimonialCarousel from "@/components/testimonial-carousel"
import UpcomingMatches from "@/components/upcoming-matches"
import NewsletterSignup from "@/components/newsletter-signup"
import NotificationPopup from "@/components/notification-popup"
import RecentWins from "@/components/recent-wins"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  // Sample prediction data
  const predictions = [
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
  ]

  // Sample packages data
  const packages = [
    {
      id: 1,
      name: "Basic",
      price: 19.99,
      duration: "Monthly",
      features: ["Daily Premium Predictions", "Match Analysis", "Win Rate Tracking", "Email Notifications"],
      popular: false,
      color: "bg-white dark:bg-gray-800",
    },
    {
      id: 2,
      name: "Pro",
      price: 49.99,
      duration: "Monthly",
      features: ["All Basic Features", "VIP Predictions", "Early Access", "Live Chat Support", "Performance Analytics"],
      popular: true,
      color: "bg-gradient-to-br from-[#1a56db] to-[#1e40af]",
    },
    {
      id: 3,
      name: "Elite",
      price: 99.99,
      duration: "Monthly",
      features: ["All Pro Features", "1-on-1 Consultation", "Custom Alerts", "Priority Support", "Advanced Statistics"],
      popular: false,
      color: "bg-gradient-to-br from-[#1e40af] to-[#312e81]",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a56db] to-[#1e293b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Expert Football Predictions</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Get accurate predictions for matches across all major leagues
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/predictions"
                className="bg-[#10b981] hover:bg-[#0d9668] text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Today's Predictions
                <Calendar className="h-5 w-5" />
              </Link>
              <Link
                href="/live-scores"
                className="bg-white hover:bg-gray-100 text-[#1a56db] font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Live Scores
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Top 3 Predictions Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {predictions.slice(0, 3).map((prediction) => (
              <div
                key={prediction.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-all"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src={prediction.leagueLogo || "/placeholder.svg"}
                      alt={prediction.league}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium">{prediction.league}</span>
                  </div>
                  <span className="text-xs opacity-80">{prediction.matchTime}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={prediction.homeTeamLogo || "/placeholder.svg"}
                      alt={prediction.homeTeam}
                      width={32}
                      height={32}
                    />
                    <span className="font-semibold">{prediction.homeTeam}</span>
                  </div>
                  <span className="text-sm">vs</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{prediction.awayTeam}</span>
                    <Image
                      src={prediction.awayTeamLogo || "/placeholder.svg"}
                      alt={prediction.awayTeam}
                      width={32}
                      height={32}
                    />
                  </div>
                </div>
                <div className="bg-white/10 rounded p-2 text-center">
                  <p className="font-medium">{prediction.prediction}</p>
                  <div className="w-full bg-gray-300/30 rounded-full h-2 mt-2">
                    <div className="bg-[#10b981] h-2 rounded-full" style={{ width: `${prediction.confidence}%` }}></div>
                  </div>
                  <p className="text-xs mt-1">{prediction.confidence}% confidence</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Wins Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <RecentWins />
        </div>
      </section>

      {/* Free Predictions Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Free Predictions</h2>
            <div className="flex gap-2">
              <button className="bg-[#1a56db] text-white px-4 py-2 rounded-lg text-sm font-medium">Today</button>
              <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium">
                Tomorrow
              </button>
              <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hidden md:block">
                This Week
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/predictions" className="inline-flex items-center text-[#1a56db] font-medium hover:underline">
              View all predictions
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* VIP Section */}
      <section className="py-16 bg-gradient-to-r from-[#1a56db] to-[#1e40af] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Upgrade to VIP Access</h2>
            <p className="text-lg opacity-90 mb-8">
              Get exclusive predictions with 90%+ accuracy, detailed analysis, and premium features
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-[#fbbf24]" />
                <h3 className="text-xl font-semibold mb-2">Premium Predictions</h3>
                <p className="text-sm opacity-80">Expert analysis and high-confidence picks</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <Star className="h-12 w-12 mx-auto mb-4 text-[#fbbf24]" />
                <h3 className="text-xl font-semibold mb-2">VIP Statistics</h3>
                <p className="text-sm opacity-80">Detailed stats and performance metrics</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-[#fbbf24]" />
                <h3 className="text-xl font-semibold mb-2">Early Access</h3>
                <p className="text-sm opacity-80">Get predictions 24 hours before everyone else</p>
              </div>
            </div>
            <Link
              href="/vip"
              className="bg-[#10b981] hover:bg-[#0d9668] text-white font-bold py-4 px-8 rounded-lg text-lg inline-block transition-transform hover:scale-105 animate-pulse"
            >
              Join VIP Now
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Packages Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Select the perfect package for your betting needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative transform hover:scale-105 transition-all ${pkg.popular ? pkg.color + " text-white" : ""}`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#10b981] text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">{pkg.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">${pkg.price}</span>
                    <span className="text-sm opacity-80">/{pkg.duration.toLowerCase()}</span>
                  </div>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-[#10b981]" />
                        <span className={pkg.popular ? "text-white" : "text-gray-600 dark:text-gray-300"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/subscribe/${pkg.id}`}
                    className={`w-full py-3 px-6 rounded-lg text-center font-semibold transition-all flex items-center justify-center gap-2 ${
                      pkg.popular
                        ? "bg-[#10b981] hover:bg-[#0d9668] text-white"
                        : "bg-[#1a56db] hover:bg-[#1e40af] text-white"
                    }`}
                  >
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What Our Members Say
          </h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">Upcoming Matches</h2>
          <UpcomingMatches />
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>

      {/* Notification Popup */}
      <NotificationPopup />
    </main>
  )
}
