import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Define a proper Review type to replace 'any'
interface Review {
  id: number
  username: string
  userAvatar: string
  rating: number
  title: string
  date: string
  status: string
  // Add other properties as needed
}

interface ReviewTableProps {
  reviews: Review[]
  selectedRows: number[] // Changed from any[] to number[]
  onSelectRow: (id: number) => void
  onSelectAll: () => void
  onSort: (column: string) => void
  sortColumn: string
  sortDirection: string
  onViewDetails: (review: Review) => void
  onReply: (review: Review) => void
  onEdit: (review: Review) => void
  onDelete: (review: Review) => void
}

export function ReviewTable({
  reviews,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onSort,
  sortColumn,
  sortDirection,
  onViewDetails,
  onReply,
  onEdit,
  onDelete,
}: ReviewTableProps) {
  const isAllSelected = selectedRows.length === reviews.length && reviews.length > 0
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < reviews.length

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === 'asc' ? (
      <ArrowUpDown className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowUpDown className="h-4 w-4 text-blue-600 transform rotate-180" />
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      default:
        return null
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={isAllSelected}
              ref={(el) => {
                if (el) {
                  // Cast the element to HTMLInputElement to fix the TypeScript error
                  ;(el as HTMLInputElement).indeterminate = isIndeterminate
                }
              }}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
            />
          </TableHead>
          <TableHead className="w-12">ID</TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => onSort('username')}
              className="flex items-center gap-1 p-0 h-auto font-medium"
            >
              User {getSortIcon('username')}
            </Button>
          </TableHead>
          <TableHead className="w-24">Rating</TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => onSort('title')}
              className="flex items-center gap-1 p-0 h-auto font-medium"
            >
              Title {getSortIcon('title')}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => onSort('date')}
              className="flex items-center gap-1 p-0 h-auto font-medium"
            >
              Date {getSortIcon('date')}
            </Button>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell>
              <Checkbox
                checked={selectedRows.includes(review.id)}
                onCheckedChange={() => onSelectRow(review.id)}
                aria-label={`Select review ${review.id}`}
              />
            </TableCell>
            <TableCell>{review.id}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={review.userAvatar}
                    alt={review.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>{review.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </TableCell>
            <TableCell>{review.title}</TableCell>
            <TableCell>{review.date}</TableCell>
            <TableCell>{getStatusBadge(review.status)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewDetails(review)}>
                    View details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onReply(review)}>Reply</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(review)}>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(review)} className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
