import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { PaymentConfirmation } from "../page"

interface DeclineConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  confirmation: PaymentConfirmation
  comment: string
  onCommentChange: (value: string) => void
  isSubmitting: boolean
}

export function DeclineConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  confirmation,
  comment,
  onCommentChange,
  isSubmitting
}: DeclineConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Decline Payment Confirmation</DialogTitle>
          <DialogDescription>
            Are you sure you want to decline this payment confirmation?
            Please provide a reason for the user.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid gap-2">
            <p><strong>User:</strong> {confirmation.username}</p>
            <p><strong>Package:</strong> {confirmation.packageName}</p>
            <p><strong>Amount:</strong> ${confirmation.amount}</p>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="comment">Decline Reason (Required)</label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Explain why this payment confirmation is being declined..."
              required
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isSubmitting || !comment.trim()}
          >
            {isSubmitting ? "Declining..." : "Decline Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
