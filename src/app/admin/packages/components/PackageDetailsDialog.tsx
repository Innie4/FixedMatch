import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Globe, Calendar } from "lucide-react"
import { countries } from "@/lib/countries"

interface SubscriptionPackage {
  id: number
  name: string
  description: string
  durations: {
    twoWeeks: { price: number; enabled: boolean }
    oneMonth: { price: number; enabled: boolean }
    threeMonths: { price: number; enabled: boolean }
    sixMonths: { price: number; enabled: boolean }
  }
  countries: string[]
  status: "active" | "inactive"
  subscribers: number
  revenue: number
  createdAt: string
  updatedAt: string
}

interface PackageDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  package: SubscriptionPackage | null
}

export function PackageDetailsDialog({ isOpen, onClose, package: pkg }: PackageDetailsDialogProps) {
  if (!pkg) return null

  const getCountryNames = (countryCodes: string[]) => {
    if (countryCodes.length === 0) return "Global"
    return countryCodes.map(code => {
      const country = countries.find(c => c.code === code)
      return country ? country.name : code
    }).join(", ")
  }

  const enabledDurations = Object.entries(pkg.durations)
    .filter(([_, duration]) => duration.enabled)
    .map(([key, duration]) => ({ key, ...duration }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {pkg.name}
            <Badge variant={pkg.status === "active" ? "default" : "secondary"}>
              {pkg.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>{pkg.description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pkg.subscribers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pkg.revenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Target Countries
            </h4>
            <p className="text-sm text-muted-foreground">{getCountryNames(pkg.countries)}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Available Durations & Pricing</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {enabledDurations.map(({ key, price }) => {
                const durationLabels = {
                  twoWeeks: "2 Weeks",
                  oneMonth: "1 Month",
                  threeMonths: "3 Months",
                  sixMonths: "6 Months"
                }
                return (
                  <div key={key} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">{durationLabels[key as keyof typeof durationLabels]}</span>
                    <span className="text-sm font-medium">${price}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created: {new Date(pkg.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Updated: {new Date(pkg.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}