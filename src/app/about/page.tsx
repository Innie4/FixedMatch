"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  Trophy, 
  Users, 
  BarChart3, 
  Calendar, 
  CheckCircle2
} from "lucide-react"

export default function AboutPage() {
  // Mock statistics data
  const stats = [
    { label: "Predictions Made", value: "50,000+", icon: BarChart3 },
    { label: "Success Rate", value: "85%", icon: CheckCircle2 },
    { label: "Active Members", value: "25,000+", icon: Users },
    { label: "Years of Experience", value: "7+", icon: Calendar },
    { label: "Tournaments Covered", value: "100+", icon: Trophy },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">About Fixed Match Pro</h1>
        
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your Trusted Football Prediction Platform</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Founded in 2016, Fixed Match Pro has grown to become one of the most reliable football prediction platforms worldwide. 
                Our team of expert analysts and advanced statistical models provide accurate predictions for matches across all major leagues.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We&apos;re passionate about football and committed to helping our users make informed betting decisions through 
                data-driven insights and expert analysis.
              </p>
              <Button asChild className="bg-[#1a56db] hover:bg-[#1e40af]">
                <Link href="/vip">Join Our VIP Community</Link>
              </Button>
            </div>
            <div className="relative h-64 md:h-full">
              <Image
                src="/FIXEDMatchD.png?height=400&width=600"
                alt="Football stadium"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Our Success in Numbers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-[#1a56db]" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Our Approach Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Our Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 text-center">
              <div className="bg-[#1a56db] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Data Analysis</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We analyze thousands of data points from past matches, player statistics, and team performance to identify patterns.
              </p>
            </div>
            <div className="p-4 text-center">
              <div className="bg-[#1a56db] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Expert Analysis</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our team of football experts reviews the data and adds valuable insights based on their deep understanding of the game.
              </p>
            </div>
            <div className="p-4 text-center">
              <div className="bg-[#1a56db] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Verified Results</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We track and verify all our predictions, maintaining transparency about our success rates and performance.
              </p>
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((member) => (
              <div key={member} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">John Doe {member}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Football Analyst</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Former professional player with over 10 years of experience in football analysis and prediction.
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-[#1a56db] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Improve Your Betting Success?</h2>
          <p className="mb-6">Join thousands of satisfied members and get access to our premium predictions.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary">
              <Link href="/auth/signup">Sign Up Now</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}