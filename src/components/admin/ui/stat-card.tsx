import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change?: string
  trend?: "up" | "down" | "neutral"
  icon: React.ReactNode
  color?: "blue" | "green" | "red" | "purple" | "yellow"
}

export function StatCard({ title, value, change, trend, icon, color = "blue" }: StatCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "bg-blue-100 dark:bg-blue-900/20"
      case "green":
        return "bg-green-100 dark:bg-green-900/20"
      case "red":
        return "bg-red-100 dark:bg-red-900/20"
      case "purple":
        return "bg-purple-100 dark:bg-purple-900/20"
      case "yellow":
        return "bg-yellow-100 dark:bg-yellow-900/20"
      default:
        return "bg-gray-100 dark:bg-gray-900/20"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-full ${getColorClasses()}`}>
            {icon}
          </div>
          {change && trend && (
            <div className={`flex items-center text-xs font-medium ${
              trend === "up" 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            }`}>
              {change}
              {trend === "up" ? (
                <ArrowUpRight className="ml-1 h-3 w-3" />
              ) : (
                <ArrowDownRight className="ml-1 h-3 w-3" />
              )}
            </div>
          )}
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}