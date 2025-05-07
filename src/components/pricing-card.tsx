import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PricingCardProps {
  plan: {
    id: string
    name: string
    price: number
    duration: string
    features: string[]
    popular?: boolean
    color?: string
    discount?: string
  }
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
        plan.popular ? "border-[#10b981] dark:border-[#10b981]/70 shadow-md" : "border-gray-200 dark:border-gray-700"
      } overflow-hidden relative`}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-[#10b981] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          Most Popular
        </div>
      )}

      {plan.discount && (
        <div className="absolute top-0 left-0 bg-[#fbbf24] text-white text-xs font-bold px-3 py-1 rounded-br-lg">
          {plan.discount}
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
          <span className="text-gray-600 dark:text-gray-400">/{plan.duration}</span>
        </div>
        <Button
          className={`w-full mb-6 ${
            plan.popular
              ? "bg-[#10b981] hover:bg-[#0d9668]"
              : plan.color === "blue"
                ? "bg-[#1a56db] hover:bg-[#1e40af]"
                : "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
          }`}
        >
          Get Started
        </Button>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          7-day money-back guarantee. No questions asked.
        </p>
      </div>
    </div>
  )
}
