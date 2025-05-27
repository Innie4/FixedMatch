"use client"

import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Crown, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface SubscriptionStatusProps {
  status: 'active' | 'grace_period' | 'expired'
  expiryDate: Date
}

export function SubscriptionStatus({ status, expiryDate }: SubscriptionStatusProps) {
  const [daysRemaining, setDaysRemaining] = useState(0)

  useEffect(() => {
    const days = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    setDaysRemaining(days)
  }, [expiryDate])

  if (status === 'active' && daysRemaining > 7) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Active VIP Subscription</AlertTitle>
        <AlertDescription className="text-green-700">
          Your VIP access is valid until {expiryDate.toLocaleDateString()}
        </AlertDescription>
      </Alert>
    )
  }

  if (status === 'active' && daysRemaining <= 7) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Subscription Expiring Soon</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Your VIP access expires in {daysRemaining} days. Renew now to maintain uninterrupted access.
          <Button asChild className="mt-2" variant="outline">
            <Link href="/vip/renew">Renew Subscription</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (status === 'grace_period') {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Grace Period</AlertTitle>
        <AlertDescription className="text-red-700">
          Your VIP subscription has expired. You have {daysRemaining} days of grace period remaining.
          <Button asChild className="mt-2" variant="destructive">
            <Link href="/vip/renew">Renew Now</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="bg-gray-50 border-gray-200">
      <Crown className="h-4 w-4 text-gray-600" />
      <AlertTitle className="text-gray-800">VIP Access Required</AlertTitle>
      <AlertDescription className="text-gray-700">
        Upgrade to VIP to access exclusive predictions and features.
        <Button asChild className="mt-2">
          <Link href="/vip/upgrade">Upgrade to VIP</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}