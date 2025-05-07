import Image from "next/image"
import { Star, CheckCircle } from "lucide-react"

interface TestimonialCardProps {
  testimonial: {
    id: number
    name: string
    avatar: string
    rating: number
    text: string
    date: string
    verified: boolean
    subscription: string
  }
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-4">
        <Image
          src={testimonial.avatar || "/placeholder.svg"}
          alt={testimonial.name}
          width={48}
          height={48}
          className="rounded-full mr-3"
        />
        <div>
          <div className="flex items-center">
            <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
            {testimonial.verified && (
              <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < testimonial.rating ? "text-[#fbbf24] fill-[#fbbf24]" : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">"{testimonial.text}"</p>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{testimonial.date}</span>
        <span>{testimonial.subscription}</span>
      </div>
    </div>
  )
}
