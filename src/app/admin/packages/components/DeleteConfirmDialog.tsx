import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  packageName: string
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  packageName,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Package
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the package &quot;{packageName}&quot;? This action cannot be undone.
            All active subscriptions will be affected.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Delete Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
