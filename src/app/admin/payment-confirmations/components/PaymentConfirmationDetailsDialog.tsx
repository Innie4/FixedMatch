import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { PaymentConfirmation } from "../page"

interface PaymentConfirmationDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  confirmation: PaymentConfirmation
  onApprove: (confirmation: PaymentConfirmation) => void
  onDecline: (confirmation: PaymentConfirmation) => void
}

export function PaymentConfirmationDetailsDialog({
  isOpen,
  onClose,
  confirmation,
  onApprove,
  onDecline
}: PaymentConfirmationDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Payment Confirmation Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">User Information</h4>
              <p>Username: {confirmation.username}</p>
              <p>Email: {confirmation.userEmail}</p>
            </div>
            <div>
              <h4 className="font-semibold">Package Information</h4>
              <p>Package: {confirmation.packageName}</p>
              <p>Duration: {confirmation.packageDuration}</p>
              <p>Amount: ${confirmation.amount}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold">Payment Information</h4>
            <p>Method: {confirmation.paymentMethod}</p>
            <p>Transaction ID: {confirmation.transactionId}</p>
            <p>Submitted: {new Date(confirmation.submittedAt).toLocaleString()}</p>
            {confirmation.reviewedAt && (
              <p>Reviewed: {new Date(confirmation.reviewedAt).toLocaleString()}</p>
            )}
          </div>
          
          <div>
            <h4 className="font-semibold">Payment Screenshot</h4>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={confirmation.screenshot}
                alt="Payment Screenshot"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          {confirmation.adminComment && (
            <div>
              <h4 className="font-semibold">Admin Comment</h4>
              <p>{confirmation.adminComment}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onDecline(confirmation)}
            className="text-red-600 hover:text-red-700"
          >
            Decline
          </Button>
          <Button
            onClick={() => onApprove(confirmation)}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}