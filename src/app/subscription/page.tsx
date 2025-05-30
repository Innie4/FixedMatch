'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import PlanSelection from '@/components/subscription/PlanSelection'
import Payment from '@/components/subscription/Payment'
import { Card } from '@/components/ui/card'
import { Steps, Step } from '@/components/ui/steps'
import { PaymentConfirmationDialog } from '@/components/payment-confirmation/PaymentConfirmationDialog'

interface SelectedPlan {
  packageType: 'basic' | 'pro' | 'elite'
  duration: {
    id: string
    name: string
    days: number
    price: number
  }
}

export default function SubscriptionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null)
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

  const handlePaymentError = useCallback((error: string) => {
    toast({
      variant: 'destructive',
      title: 'Payment Error',
      description: error
    })
  }, [toast])

  const handleDurationSelect = (duration: any) => {
    setSelectedPlan({
      packageType: 'pro', // This could be passed as a prop or from context
      duration
    })
    setCurrentStep(2)
  }

  const handlePaymentComplete = async () => {
    try {
      // After successful payment, show payment confirmation dialog
      if (selectedPlan) {
        setShowPaymentConfirmation(true)
      }
    } catch (error) {
      handlePaymentError(error as string)
    }
  }

  const handlePaymentConfirmationComplete = () => {
    // After payment confirmation is submitted
    router.push('/admin/payment-confirmations/pending')
    // Show success message to user
    toast({
      title: "Payment confirmation submitted",
      description: "We'll review your payment and activate your VIP access soon."
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Steps currentStep={currentStep} className="mb-8">
          <Step number={1}>Select Plan Duration</Step>
          <Step number={2}>Payment Details</Step>
        </Steps>

        {currentStep === 1 && (
          <PlanSelection
            packageType={selectedPlan?.packageType || 'pro'}
            onDurationSelect={handleDurationSelect}
          />
        )}

        {currentStep === 2 && selectedPlan && (
          <Payment
            amount={selectedPlan.duration.price}
            currency="USD"
            onPaymentComplete={handlePaymentComplete}
            onError={handlePaymentError}
          />
        )}

        <PaymentConfirmationDialog
          isOpen={showPaymentConfirmation}
          onClose={() => setShowPaymentConfirmation(false)}
          paymentMethod={selectedPaymentMethod}
          packageName={selectedPlan?.packageType || ''}
          amount={selectedPlan?.duration.price || 0}
        />
      </div>
    </div>
  )
}