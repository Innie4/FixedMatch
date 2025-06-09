import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PaymentConfirmation } from '../page'

interface ApproveConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  confirmation: PaymentConfirmation
  comment: string
  onCommentChange: (value: string) => void
  isSubmitting: boolean
}

export function ApproveConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  confirmation,
  comment,
  onCommentChange,
  isSubmitting,
}: ApproveConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Payment Confirmation</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this payment confirmation? This will grant VIP access
            to the user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <p>
              <strong>User:</strong> {confirmation.username}
            </p>
            <p>
              <strong>Package:</strong> {confirmation.packageName}
            </p>
            <p>
              <strong>Amount:</strong> ${confirmation.amount}
            </p>
          </div>

          <div className="grid gap-2">
            <label htmlFor="comment">Admin Comment (Optional)</label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Add any notes about this approval..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Approving...' : 'Approve Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
