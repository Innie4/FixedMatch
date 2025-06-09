'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { CountrySelector } from '@/components/ui/country-selector'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

// This interface should match the expected type in page.tsx
interface Package {
  name: string
  description: string
  durations: {
    twoWeeks: { price: number; enabled: boolean }
    oneMonth: { price: number; enabled: boolean }
    threeMonths: { price: number; enabled: boolean }
    sixMonths: { price: number; enabled: boolean }
  }
  countries: string[]
  status: 'active' | 'inactive'
}

interface PackageFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Package) => void
  initialData?: Package
  title?: string
}

export function PackageFormDialog({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = 'Add Package',
}: PackageFormDialogProps) {
  // ... existing code ...
}
