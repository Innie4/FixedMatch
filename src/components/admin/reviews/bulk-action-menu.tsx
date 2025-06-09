import { ChevronDown, CheckCircle2, XCircle, Flag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BulkActionMenuProps {
  selectedCount: number
  onBulkAction: (action: string) => void
}

export function BulkActionMenu({ selectedCount, onBulkAction }: BulkActionMenuProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{selectedCount} selected</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Actions
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onBulkAction('approve')}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkAction('reject')}>
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkAction('flag')}>
            <Flag className="mr-2 h-4 w-4" />
            Flag
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onBulkAction('delete')}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
