"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  paymentMethodName: string
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  paymentMethodName
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Payment Method
          </DialogTitle>
          <DialogDescription className="text-left">
            Are you sure you want to delete <strong>{paymentMethodName}</strong>?
            <br /><br />
            This action cannot be undone. All country assignments and configurations
            for this payment method will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Payment Method
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}