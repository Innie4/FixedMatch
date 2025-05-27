'use client'

import { Check, Shield, Star, Trophy, Clock, BarChart3, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import VipPredictionCard from "@/components/vip-prediction-card"
import SuccessRateChart from "@/components/success-rate-chart"
import TestimonialCard from "@/components/testimonial-card"
import PricingCard from "@/components/pricing-card"
import { SubscriptionStatus } from "@/components/vip/SubscriptionStatus"
import { useState } from "react"
import { useSession } from "next-auth/react"

export default function VipPage() {
  const { data: session } = useSession()
  const [showVipDialog, setShowVipDialog] = useState(false)
  
  // Sample VIP predictions data
  const vipPredictions = [
    {
      id: 1,
      homeTeam: "Manchester United",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      awayTeam: "Tottenham",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      league: "Premier League",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      matchTime: "Today, 20:00",
      prediction: "Home Win & Over 1.5",
      confidence: 92,
      status: "upcoming",
      vipOnly: true,
      analysis:
        "Manchester United's strong home form combined with Tottenham's defensive vulnerabilities make this a high-confidence prediction.",
    },
    {
      id: 2,
      homeTeam: "Bayern Munich",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      awayTeam: "Dortmund",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      league: "Bundesliga",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      matchTime: "Today, 17:30",
      prediction: "Both Teams to Score & Over 2.5",
      confidence: 95,
      status: "upcoming",
      vipOnly: true,
      analysis:
        "Der Klassiker historically produces high-scoring games. Both teams are in excellent scoring form with Bayern averaging 3.2 goals per game at home.",
    },
    {
      id: 3,
      homeTeam: "PSG",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      awayTeam: "Marseille",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      league: "Ligue 1",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      matchTime: "Tomorrow, 19:45",
      prediction: "Home Win & Over 2.5",
      confidence: 88,
      status: "upcoming",
      vipOnly: true,
      analysis:
        "PSG has dominated this fixture at home, winning the last 5 meetings. With their attacking talent, expect multiple goals.",
    },
  ]

  // Sample past VIP predictions data
  const pastVipPredictions = [
    {
      id: 4,
      homeTeam: "Liverpool",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      homeScore: 3,
      awayTeam: "Arsenal",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      awayScore: 1,
      league: "Premier League",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      matchTime: "Yesterday",
      prediction: "Home Win & Over 2.5",
      confidence: 85,
      status: "completed",
      result: "won",
      vipOnly: true,
    },
    {
      id: 5,
      homeTeam: "Barcelona",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      homeScore: 4,
      awayTeam: "Sevilla",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      awayScore: 0,
      league: "La Liga",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      matchTime: "2 days ago",
      prediction: "Home Win -1.5",
      confidence: 80,
      status: "completed",
      result: "won",
      vipOnly: true,
    },
    {
      id: 6,
      homeTeam: "AC Milan",
      homeTeamLogo: "/placeholder.svg?height=40&width=40",
      homeScore: 1,
      awayTeam: "Inter Milan",
      awayTeamLogo: "/placeholder.svg?height=40&width=40",
      awayScore: 1,
      league: "Serie A",
      leagueLogo: "/placeholder.svg?height=24&width=24",
      matchTime: "3 days ago",
      prediction: "Draw",
      confidence: 75,
      status: "completed",
      result: "won",
      vipOnly: true,
    },
  ]

  // Sample pricing plans
  const pricingPlans = [
    {
      id: "weekly",
      name: "Weekly Pass",
      price: 9.99,
      duration: "7 days",
      features: [
        "All VIP predictions",
        "Detailed match analysis",
        "Expert betting tips",
        "In-play advice",
        "Email notifications",
      ],
      popular: false,
      color: "blue",
    },
    {
      id: "monthly",
      name: "Monthly Premium",
      price: 29.99,
      duration: "30 days",
      features: [
        "All VIP predictions",
        "Detailed match analysis",
        "Expert betting tips",
        "In-play advice",
        "Email notifications",
        "24/7 customer support",
        "Performance tracking",
      ],
      popular: true,
      color: "green",
    },
    {
      id: "quarterly",
      name: "Quarterly Pro",
      price: 69.99,
      duration: "90 days",
      features: [
        "All VIP predictions",
        "Detailed match analysis",
        "Expert betting tips",
        "In-play advice",
        "Email notifications",
        "24/7 customer support",
        "Performance tracking",
        "Personalized strategy calls",
        "Early access to new features",
      ],
      popular: false,
      color: "blue",
      discount: "Save 22%",
    },
  ]

  // Sample testimonials
  const testimonials = [
    {
      id: 1,
      name: "Michael Johnson",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 5,
      text: "The VIP predictions have been incredibly accurate. I've been using this service for 6 months and it's completely transformed my betting strategy. The detailed analysis helps me understand the reasoning behind each prediction.",
      date: "2 months ago",
      verified: true,
      subscription: "Quarterly Pro",
    },
    {
      id: 2,
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 5,
      text: "I was skeptical at first, but after my first month as a VIP member, I'm completely convinced. The in-depth analysis and high-confidence picks have been spot on. Definitely worth the investment!",
      date: "3 weeks ago",
      verified: true,
      subscription: "Monthly Premium",
    },
    {
      id: 3,
      name: "David Chen",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 4,
      text: "The VIP service provides excellent value. The predictions are well-researched and the success rate is impressive. I especially appreciate the early access to predictions which gives me time to place my bets at better odds.",
      date: "1 month ago",
      verified: true,
      subscription: "Quarterly Pro",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Add SubscriptionStatus at the top of the page */}
      {session?.user?.subscriptionStatus && session?.user?.subscriptionExpiry && (
        <div className="container mx-auto px-4 py-4">
          <SubscriptionStatus 
            status={session.user.subscriptionStatus as 'active' | 'grace_period' | 'expired'}
            expiryDate={new Date(session.user.subscriptionExpiry)}
          />
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a56db] to-[#1e293b] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Unlock Premium Football Predictions</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Join thousands of successful bettors with our expert VIP predictions
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Trophy className="h-5 w-5 mr-2 text-[#fbbf24]" />
                <span className="text-sm font-medium">92% Success Rate</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-5 w-5 mr-2 text-[#fbbf24]" />
                <span className="text-sm font-medium">4.9/5 Customer Rating</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Shield className="h-5 w-5 mr-2 text-[#fbbf24]" />
                <span className="text-sm font-medium">Money-Back Guarantee</span>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-[#10b981] hover:bg-[#0d9668] text-white font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all animate-pulse"
            >
              Get VIP Access Now
            </Button>
          </div>
        </div>
      </section>

      {/* VIP Access Dialog */}
      <Dialog open={showVipDialog} onOpenChange={setShowVipDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Get VIP Access</DialogTitle>
            <DialogDescription>
              Unlock premium predictions and expert analysis with Fixed Match Pro VIP.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose an option below to continue:
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              <Button 
                className="bg-[#1a56db] hover:bg-[#1e40af] w-full"
                onClick={() => {
                  setShowVipDialog(false)
                  window.location.href = "/auth/signup"
                }}
              >
                Sign Up for VIP Access
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setShowVipDialog(false)
                  window.location.href = "/auth/login"
                }}
              >
                Login to My VIP Account
              </Button>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Benefits Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Our VIP Service?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="bg-[#1a56db]/10 dark:bg-[#1a56db]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-[#1a56db]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Expert Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our team of professional analysts study every aspect of the game to provide you with the most accurate
                predictions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="bg-[#10b981]/10 dark:bg-[#10b981]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">High Success Rate</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our VIP predictions maintain a 90%+ success rate, verified and tracked for complete transparency.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="bg-[#fbbf24]/10 dark:bg-[#fbbf24]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-[#fbbf24]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Early Access</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get predictions 24 hours before they're released to free users, giving you time to place bets at better
                odds.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Free vs VIP: What's the Difference?
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-6 py-4 text-left text-gray-900 dark:text-white font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center text-gray-900 dark:text-white font-semibold">Free</th>
                    <th className="px-6 py-4 text-center text-[#1a56db] font-semibold">VIP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">Daily Predictions</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">3 per day</td>
                    <td className="px-6 py-4 text-center text-gray-900 dark:text-white font-medium">Unlimited</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">Prediction Accuracy</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">~70%</td>
                    <td className="px-6 py-4 text-center text-gray-900 dark:text-white font-medium">90%+</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">Detailed Analysis</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      <span className="text-red-500">✕</span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-900 dark:text-white font-medium">
                      <span className="text-green-500">✓</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">Early Access</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      <span className="text-red-500">✕</span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-900 dark:text-white font-medium">
                      <span className="text-green-500">✓</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">In-Play Advice</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      <span className="text-red-500">✕</span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-900 dark:text-white font-medium">
                      <span className="text-green-500">✓</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">Customer Support</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">Email Only</td>
                    <td className="px-6 py-4 text-center text-gray-900 dark:text-white font-medium">
                      24/7 Priority Support
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Success Rate Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Our Proven Track Record
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <SuccessRateChart />
              </div>
              <div>
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    VIP Prediction Success Rate
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Premier League</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">94%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-[#1a56db] h-2 rounded-full" style={{ width: "94%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">La Liga</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-[#1a56db] h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bundesliga</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">91%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-[#1a56db] h-2 rounded-full" style={{ width: "91%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Serie A</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">89%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-[#1a56db] h-2 rounded-full" style={{ width: "89%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ligue 1</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">88%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-[#1a56db] h-2 rounded-full" style={{ width: "88%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Predictions Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            VIP Predictions
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
            Get exclusive access to our highest confidence predictions with detailed analysis from our expert team.
          </p>

          <Tabs defaultValue="today" className="max-w-4xl mx-auto">
            <TabsList className="mb-8 justify-center">
              <TabsTrigger value="today">Today's VIP Picks</TabsTrigger>
              <TabsTrigger value="results">Recent Results</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-6">
              {vipPredictions.map((prediction) => (
                <VipPredictionCard key={prediction.id} prediction={prediction} />
              ))}
              <div className="text-center mt-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  <Lock className="inline-block h-4 w-4 mr-1" />
                  Subscribe to VIP to unlock all premium predictions
                </p>
                <Button className="bg-[#1a56db] hover:bg-[#1e40af]">Unlock VIP Access</Button>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {pastVipPredictions.map((prediction) => (
                <VipPredictionCard key={prediction.id} prediction={prediction} />
              ))}
              <div className="text-center mt-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  <Lock className="inline-block h-4 w-4 mr-1" />
                  Subscribe to VIP to see all past results and performance metrics
                </p>
                <Button className="bg-[#1a56db] hover:bg-[#1e40af]">Unlock VIP Access</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Choose Your VIP Plan
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
            Select the plan that works best for you. All plans include full access to our VIP predictions and features.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All plans come with a 7-day money-back guarantee. No questions asked.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Secure Payment</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Instant Access</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            What Our VIP Members Say
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
            Don't just take our word for it. Here's what our satisfied VIP members have to say about our service.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-[#1a56db] hover:bg-[#1e40af]">Read More Testimonials</Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  How do I access VIP predictions after subscribing?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Once you subscribe, you'll gain immediate access to all VIP content. Simply log in to your account and
                  navigate to the VIP section. All predictions will be visible and the lock icons will be removed.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Can I cancel my subscription at any time?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, you can cancel your subscription at any time from your account settings. Your access will
                  continue until the end of your current billing period.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  How many VIP predictions do you provide each day?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We provide between 5-10 VIP predictions daily, depending on the fixtures available. We focus on
                  quality over quantity, only sharing predictions that meet our strict confidence threshold.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What is your refund policy?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We offer a 7-day money-back guarantee on all subscriptions. If you're not satisfied with our service
                  for any reason, simply contact our support team within 7 days of your purchase for a full refund.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  How do you calculate your success rate?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our success rate is calculated based on the total number of correct predictions divided by the total
                  number of predictions made. We maintain complete transparency by showing all past predictions,
                  including both wins and losses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#1a56db] to-[#1e293b] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Betting Experience?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful members who have already taken their betting to the next level with our VIP
            predictions.
          </p>
          <Button
            size="lg"
            className="bg-[#10b981] hover:bg-[#0d9668] text-white font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all animate-pulse"
            onClick={() => setShowVipDialog(true)}
          >
            Get VIP Access Now
          </Button>
          <p className="mt-4 text-sm opacity-80">No long-term commitment. Cancel anytime.</p>
        </div>
      </section>
    </main>
  )
}
