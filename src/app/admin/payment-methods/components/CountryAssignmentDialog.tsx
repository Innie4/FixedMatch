"use client"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Globe } from "lucide-react"
import { countries } from "@/lib/countries"

interface PaymentMethod {
  id: number
  name: string
  provider: string
  countries: string[]
}

interface CountryAssignmentDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (methodId: number, countries: string[]) => void
  method: PaymentMethod | null
}

export function CountryAssignmentDialog({
  isOpen,
  onClose,
  onSave,
  method
}: CountryAssignmentDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])

  useEffect(() => {
    if (method) {
      setSelectedCountries(method.countries)
    }
  }, [method])

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCountryToggle = (countryCode: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(countryCode)) {
        return prev.filter(c => c !== countryCode)
      } else {
        return [...prev, countryCode]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedCountries.length === filteredCountries.length) {
      setSelectedCountries([])
    } else {
      setSelectedCountries(filteredCountries.map(c => c.code))
    }
  }

  const handleSave = () => {
    if (method) {
      onSave(method.id, selectedCountries)
      onClose()
    }
  }

  if (!method) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Assign Countries to {method.name}
          </DialogTitle>
          <DialogDescription>
            Select the countries where this payment method should be available.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Select All */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedCountries.length === filteredCountries.length && filteredCountries.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All ({filteredCountries.length})
              </label>
            </div>
            <Badge variant="secondary">
              {selectedCountries.length} selected
            </Badge>
          </div>

          {/* Countries List */}
          <div className="border rounded-lg max-h-96 overflow-y-auto">
            <div className="grid gap-1 p-2">
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                >
                  <Checkbox
                    id={country.code}
                    checked={selectedCountries.includes(country.code)}
                    onCheckedChange={() => handleCountryToggle(country.code)}
                  />
                  <label
                    htmlFor={country.code}
                    className="flex-1 text-sm cursor-pointer"
                  >
                    <span className="font-medium">{country.name}</span>
                    <span className="text-gray-500 ml-2">({country.code})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Countries Summary */}
          {selectedCountries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Countries:</h4>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {selectedCountries.map((countryCode) => {
                  const country = countries.find(c => c.code === countryCode)
                  return (
                    <Badge key={countryCode} variant="secondary" className="text-xs">
                      {country?.name || countryCode}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}