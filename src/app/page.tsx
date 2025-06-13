"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, ChevronRight, Check } from 'lucide-react'
import PredictionCard from '@/components/prediction-card'
import TestimonialCarousel from '@/components/testimonial-carousel'
import UpcomingMatches from '@/components/upcoming-matches'
import NewsletterSignup from '@/components/newsletter-signup'
import NotificationPopup from '@/components/notification-popup'
import RecentWins from '@/components/recent-wins'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates'
import { UpdateNotification } from '@/components/update-notification'
import type { Prediction, Package } from '@/types'

export default function Home() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loadingPredictions, setLoadingPredictions] = useState(true)
  const [errorPredictions, setErrorPredictions] = useState<string | null>(null)

  const { data: realtimePredictions } = useRealTimeUpdates<Prediction[]>('PREDICTIONS_UPDATED')

  const [packages, setPackages] = useState<Package[]>([])
  const [loadingPackages, setLoadingPackages] = useState(true)
  const [errorPackages, setErrorPackages] = useState<string | null>(null)

  const { data: realtimePackages } = useRealTimeUpdates<Package[]>('PACKAGES_UPDATED')

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoadingPredictions(true)
        const response = await fetch('/api/predictions')
        if (!response.ok) {
          throw new Error('Failed to fetch predictions')
        }
        const data = await response.json()
        setPredictions(data)
      } catch (err: unknown) {
        setErrorPredictions(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoadingPredictions(false)
      }
    }
    fetchPredictions()
  }, [])

  useEffect(() => {
    if (realtimePredictions) {
      setPredictions(realtimePredictions)
    }
  }, [realtimePredictions])

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoadingPackages(true)
        const response = await fetch('/api/packages')
        if (!response.ok) {
          throw new Error('Failed to fetch packages')
        }
        const data = await response.json()
        setPackages(data)
      } catch (err: unknown) {
        setErrorPackages(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoadingPackages(false)
      }
    }
    fetchPackages()
  }, [])

  useEffect(() => {
    if (realtimePackages) {
      setPackages(realtimePackages)
    }
  }, [realtimePackages])

  return (
    <main className="min-h-screen">
      {/* Add UpdateNotification components */}
      <UpdateNotification 
        type="PREDICTIONS_UPDATED" 
        message="New predictions available" 
      />
      <UpdateNotification 
        type="PACKAGES_UPDATED" 
        message="Package updates available" 
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a56db] to-[#1e293b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Replace this with a real background image URL from your CDN/storage */}
          <div className="absolute inset-0 bg-[url('/path/to/your/actual-background-image.jpg')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Expert Football Predictions
            </h1>
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
            {loadingPredictions && <p>Loading predictions...</p>}
            {errorPredictions && <p className="text-red-500">Error: {errorPredictions}</p>}
            {!loadingPredictions &&
              !errorPredictions &&
              predictions.slice(0, 3).map((prediction: Prediction) => (
                <div
                  key={prediction.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src={prediction.leagueLogo || '/placeholder.svg'}
                        alt={prediction.league}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium">{prediction.league}</span>
                    </div>
                    <span className="text-xs opacity-80">
                      {new Date(prediction.matchTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src={prediction.homeTeamLogo || '/placeholder.svg'}
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
                        src={prediction.awayTeamLogo || '/placeholder.svg'}
                        alt={prediction.awayTeam}
                        width={32}
                        height={32}
                      />
                    </div>
                  </div>
                  <div className="bg-white/10 rounded p-2 text-center">
                    <p className="font-medium">{prediction.prediction}</p>
                    <div className="w-full bg-gray-300/30 rounded-full h-2 mt-2">
                      <div
                        className="bg-[#10b981] h-2 rounded-full"
                        style={{ width: `${prediction.confidence}%` }}
                      ></div>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Free Predictions
            </h2>
            <div className="flex gap-2">
              <button className="bg-[#1a56db] text-white px-4 py-2 rounded-lg text-sm font-medium">
                Today
              </button>
              <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium">
                Tomorrow
              </button>
              <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hidden md:block">
                This Week
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingPredictions && <p>Loading free predictions...</p>}
            {errorPredictions && (
              <p className="text-red-500">Error loading free predictions: {errorPredictions}</p>
            )}
            {!loadingPredictions &&
              !errorPredictions &&
              predictions.map((prediction: Prediction) => (
                <PredictionCard key={prediction.id} prediction={prediction} />
              ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/predictions"
              className="inline-flex items-center text-[#1a56db] font-medium hover:underline"
            >
              View all predictions
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* VIP Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm font-medium text-[#1a56db] border-[#1a56db]"
            >
              Exclusive Access
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-4 mb-4">
              Unlock Premium Predictions
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Join our VIP community and get access to the most accurate football predictions,
              expert analysis, and exclusive insights.
            </p>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {loadingPackages && <p>Loading packages...</p>}
            {errorPackages && (
              <p className="text-red-500">Error loading packages: {errorPackages}</p>
            )}
            {!loadingPackages &&
              !errorPackages &&
              packages.map((pkg: Package) => (
                <Card
                  key={pkg.id}
                  className={`${pkg.color} ${pkg.popular ? 'border-2 border-[#1a56db]' : ''} text-white dark:text-gray-900`}
                >
                  <CardHeader className="text-center pb-0">
                    {pkg.popular && (
                      <Badge className="bg-yellow-400 text-yellow-900 px-3 py-1 text-xs font-semibold rounded-full mb-2 mx-auto">
                        Most Popular
                      </Badge>
                    )}
                    <CardTitle
                      className={`text-3xl font-bold ${pkg.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}
                    >
                      {pkg.name}
                    </CardTitle>
                    <p
                      className={`mt-2 ${pkg.popular ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                      <span className="text-4xl font-bold">${pkg.price}</span> / {pkg.duration}
                    </p>
                  </CardHeader>
                  <CardContent className="py-6 px-4">
                    <ul className="space-y-3">
                      {pkg.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center justify-center gap-2">
                          <Check
                            className={`h-5 w-5 ${pkg.popular ? 'text-green-300' : 'text-green-500'}`}
                          />
                          <span
                            className={`${pkg.popular ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-4">
                    <Button
                      asChild
                      className={`w-full ${pkg.popular ? 'bg-white text-[#1a56db] hover:bg-gray-100' : 'bg-[#1a56db] text-white hover:bg-[#1e40af]'}`}
                    >
                      <Link href="/vip/subscribe">Get Started</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            What Our Members Say
          </h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-xl mx-auto mb-8">
            Get the latest predictions, exclusive offers, and football news straight to your inbox.
          </p>
          <NewsletterSignup />
        </div>
      </section>

      {/* Upcoming Matches Section (already integrated with mock data in UpcomingMatches component) */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Upcoming Matches
          </h2>
          <UpcomingMatches />
        </div>
      </section>

      {/* Notification Popup */}
      <NotificationPopup />
    </main>
  )
}
