'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

// Sample testimonials data (will be replaced by API data)
// const testimonials = [
//   {
//     id: 1,
//     name: "John Smith",
//     avatar: "/placeholder.svg?height=64&width=64",
//     rating: 5,
//     text: "The predictions are incredibly accurate. I've been using this service for 3 months and it's transformed my betting strategy completely.",
//     date: "2 weeks ago",
//   },
//   {
//     id: 2,
//     name: "Sarah Johnson",
//     avatar: "/placeholder.svg?height=64&width=64",
//     rating: 5,
//     text: "The VIP membership is worth every penny. The detailed analysis helps me understand the reasoning behind each prediction.",
//     date: "1 month ago",
//   },
//   {
//     id: 3,
//     name: "Michael Brown",
//     avatar: "/placeholder.svg?height=64&width=64",
//     rating: 4,
//     text: "Great service overall. The live scores feature is particularly useful for tracking multiple matches simultaneously.",
//     date: "3 weeks ago",
//   },
//   {
//     id: 4,
//     name: "Emma Wilson",
//     avatar: "/placeholder.svg?height=64&width=64",
//     rating: 5,
//     text: "I was skeptical at first, but the accuracy of the predictions convinced me. Now I'm a loyal VIP member.",
//     date: "2 months ago",
//   },
//   {
//     id: 5,
//     name: "David Lee",
//     avatar: "/placeholder.svg?height=64&width=64",
//     rating: 4,
//     text: "The league tables and statistics are comprehensive and well-presented. Makes research so much easier.",
//     date: "1 week ago",
//   },
// ]

interface Testimonial {
  id: number
  author: string
  rating: number
  content: string
  source?: string
  createdAt: string // Or Date if you prefer to parse it
}

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Number of testimonials to show at once based on screen size
  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3
      if (window.innerWidth >= 640) return 2
    }
    return 1
  }

  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Testimonial[] = await response.json()
        setTestimonials(data)
      } catch (e) {
        setError('Failed to load testimonials.')
        console.error('Fetching testimonials error:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()

    const handleResize = () => {
      setVisibleCount(getVisibleCount())
    }

    // Set initial visible count
    setVisibleCount(getVisibleCount())

    // Add resize listener
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoplay && testimonials.length > visibleCount) {
      interval = setInterval(() => {
        goToNext()
      }, 5000)
    }

    return () => clearInterval(interval)
  }, [currentIndex, autoplay, testimonials.length, visibleCount])

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - visibleCount : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= testimonials.length - visibleCount ? 0 : prevIndex + 1
    )
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false)
  const handleMouseLeave = () => setAutoplay(true)

  if (loading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">Loading testimonials...</div>
    )
  }

  if (error) {
    return <div className="text-center text-red-600 dark:text-red-400">{error}</div>
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">No testimonials available.</div>
    )
  }

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="flex items-center">
        <button
          onClick={goToPrev}
          className="absolute left-0 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none hidden md:block"
          aria-label="Previous testimonial"
          disabled={testimonials.length <= visibleCount}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="overflow-hidden w-full px-4 md:px-10">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="min-w-full sm:min-w-[50%] lg:min-w-[33.333%] px-3"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
                  <div className="flex items-center mb-4">
                    {/* Testimonial avatar is not available from backend, using a placeholder */}
                    <Image
                      src="/placeholder.svg"
                      alt={testimonial.author}
                      width={48}
                      height={48}
                      className="rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.author}
                      </h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? 'text-[#fbbf24] fill-[#fbbf24]'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">"{testimonial.content}"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.source ? `${testimonial.source} - ` : ''}
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={goToNext}
          className="absolute right-0 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none hidden md:block"
          aria-label="Next testimonial"
          disabled={testimonials.length <= visibleCount}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile navigation dots */}
      <div className="flex justify-center mt-6 md:hidden">
        {testimonials.length > 0 &&
          [...Array(Math.max(0, testimonials.length - visibleCount + 1))].map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`h-2 w-2 rounded-full mx-1 ${
                currentIndex === i ? 'bg-[#1a56db]' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
      </div>
    </div>
  )
}
