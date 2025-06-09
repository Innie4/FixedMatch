import { useState } from 'react'
import { ImagePlus, Trash2, CreditCard, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface PaymentConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  paymentMethod: string
  packageName: string
  amount: number
}

export function PaymentConfirmationDialog({
  isOpen,
  onClose,
  paymentMethod,
  packageName,
  amount,
}: PaymentConfirmationDialogProps) {
  const [transactionId, setTransactionId] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB')
        return
      }

      // Check file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPEG, PNG, and WEBP images are allowed')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    if (!transactionId.trim()) {
      setError('Transaction ID is required')
      return false
    }

    if (!imagePreview) {
      setError('Payment screenshot is required')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call to submit payment confirmation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real implementation, you would make an API call here
      // const response = await fetch('/api/payment-confirmations', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     transactionId,
      //     screenshot: imagePreview,
      //     paymentMethod,
      //     packageName,
      //     amount
      //   })
      // });

      setIsSuccess(true)

      // Reset form after 2 seconds and close dialog
      setTimeout(() => {
        resetForm()
        onClose()
      }, 2000)
    } catch (error) {
      setError('Failed to submit payment confirmation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTransactionId('')
    setImagePreview(null)
    setIsSuccess(false)
    setError(null)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Your Payment</DialogTitle>
          <DialogDescription>
            Please provide your transaction details to confirm your payment for {packageName}.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Payment Confirmation Submitted
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm">
              Thank you! Your payment confirmation has been submitted and is pending approval. You
              will receive an email once it's approved.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="payment-method">Payment Method</Label>
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                  {paymentMethod}
                </div>
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="transaction-id">Transaction ID</Label>
                <Input
                  id="transaction-id"
                  placeholder="Enter your transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  You can find this in your payment receipt or bank statement
                </p>
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="payment-screenshot">Payment Screenshot</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4">
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img
                        src={imagePreview}
                        alt="Payment screenshot"
                        className="w-full h-auto rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setImagePreview(null)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400">PNG, JPG or WEBP (max. 2MB)</p>
                    </div>
                  )}
                  <Input
                    id="payment-screenshot"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className={
                      imagePreview ? 'hidden' : 'absolute inset-0 opacity-0 cursor-pointer'
                    }
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                  ${amount.toFixed(2)}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Submitting</span>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </>
                ) : (
                  'Submit Confirmation'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
