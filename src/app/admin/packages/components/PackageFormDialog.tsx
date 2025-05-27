import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { CountrySelector } from "@/components/ui/country-selector"
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

interface PackageFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (packageData: Omit<SubscriptionPackage, "id" | "subscribers" | "revenue" | "createdAt" | "updatedAt">) => void
  package: SubscriptionPackage | null
}

export function PackageFormDialog({ isOpen, onClose, onSave, package: pkg }: PackageFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    durations: {
      twoWeeks: { price: 0, enabled: false },
      oneMonth: { price: 0, enabled: false },
      threeMonths: { price: 0, enabled: false },
      sixMonths: { price: 0, enabled: false }
    },
    countries: [] as string[],
    status: "active" as "active" | "inactive"
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedCountry, setSelectedCountry] = useState("")

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name,
        description: pkg.description,
        durations: pkg.durations,
        countries: pkg.countries,
        status: pkg.status
      })
    } else {
      setFormData({
        name: "",
        description: "",
        durations: {
          twoWeeks: { price: 0, enabled: false },
          oneMonth: { price: 0, enabled: false },
          threeMonths: { price: 0, enabled: false },
          sixMonths: { price: 0, enabled: false }
        },
        countries: [],
        status: "active"
      })
    }
    setErrors({})
    setSelectedCountry("")
  }, [pkg, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Package name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    const hasEnabledDuration = Object.values(formData.durations).some(d => d.enabled)
    if (!hasEnabledDuration) {
      newErrors.durations = "At least one duration must be enabled"
    }

    Object.entries(formData.durations).forEach(([key, duration]) => {
      if (duration.enabled && duration.price <= 0) {
        newErrors[`duration_${key}`] = "Price must be greater than 0"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handleDurationChange = (duration: keyof typeof formData.durations, field: "price" | "enabled", value: number | boolean) => {
    setFormData(prev => ({
      ...prev,
      durations: {
        ...prev.durations,
        [duration]: {
          ...prev.durations[duration],
          [field]: value
        }
      }
    }))
    // Clear duration-specific errors when user makes changes
    if (errors[`duration_${duration}`] || errors.durations) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`duration_${duration}`]
        delete newErrors.durations
        return newErrors
      })
    }
  }

  const addCountry = (countryCode: string) => {
    if (!formData.countries.includes(countryCode)) {
      setFormData(prev => ({
        ...prev,
        countries: [...prev.countries, countryCode]
      }))
    }
    setSelectedCountry("")
  }

  const removeCountry = (countryCode: string) => {
    setFormData(prev => ({
      ...prev,
      countries: prev.countries.filter(c => c !== countryCode)
    }))
  }

  const getCountryName = (code: string) => {
    const country = countries.find(c => c.code === code)
    return country ? country.name : code
  }

  const getDurationLabel = (key: string) => {
    switch (key) {
      case 'twoWeeks': return '2 Weeks'
      case 'oneMonth': return '1 Month'
      case 'threeMonths': return '3 Months'
      case 'sixMonths': return '6 Months'
      default: return key
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pkg ? "Edit Package" : "Create New Package"}</DialogTitle>
          <DialogDescription>
            {pkg ? "Update the package details below." : "Fill in the details to create a new subscription package."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Package Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Package Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }))
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: "" }))
                }
              }}
              placeholder="Enter package name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, description: e.target.value }))
                if (errors.description) {
                  setErrors(prev => ({ ...prev, description: "" }))
                }
              }}
              placeholder="Enter package description"
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Duration Pricing */}
          <div className="space-y-4">
            <div>
              <Label>Duration & Pricing *</Label>
              {errors.durations && <p className="text-sm text-red-500 mt-1">{errors.durations}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.durations).map(([key, duration]) => (
                <div key={key} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">{getDurationLabel(key)}</Label>
                    <Switch
                      checked={duration.enabled}
                      onCheckedChange={(checked) => handleDurationChange(key as keyof typeof formData.durations, "enabled", checked)}
                    />
                  </div>
                  {duration.enabled && (
                    <div className="space-y-2">
                      <Label htmlFor={`price-${key}`}>Price ($)</Label>
                      <Input
                        id={`price-${key}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={duration.price}
                        onChange={(e) => handleDurationChange(key as keyof typeof formData.durations, "price", parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className={errors[`duration_${key}`] ? "border-red-500" : ""}
                      />
                      {errors[`duration_${key}`] && <p className="text-sm text-red-500">{errors[`duration_${key}`]}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Country Assignment */}
          <div className="space-y-4">
            <Label>Country Assignment</Label>
            <div className="space-y-3">
              <CountrySelector
                value={selectedCountry}
                onValueChange={addCountry}
                placeholder="Select countries (leave empty for global)"
              />
              {formData.countries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.countries.map((countryCode) => (
                    <Badge key={countryCode} variant="secondary" className="flex items-center gap-1">
                      {getCountryName(countryCode)}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeCountry(countryCode)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {formData.countries.length === 0 ? "Global package (available to all countries)" : `Available in ${formData.countries.length} selected countries`}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {pkg ? "Update Package" : "Create Package"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}