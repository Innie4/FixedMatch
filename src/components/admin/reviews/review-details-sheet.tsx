import { useState } from 'react'
import Image from 'next/image'
import {
  Star,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Eye,
  CheckCircle2,
  XCircle,
  Edit,
  Flag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

// Define types for review and related objects
interface Reply {
  id: number
  adminName: string
  comment: string
  date: string
  engagement: {
    likes: number
    views: number
  }
}

interface EditHistory {
  editedBy: string
  editDate: string
  originalComment: string
  reason: string
}

interface Review {
  id: number
  username: string
  userAvatar: string
  rating: number
  title: string
  comment: string
  date: string
  status: string
  featured: boolean
  flagged: boolean
  edited: boolean
  editHistory: EditHistory[]
  replies: Reply[]
  engagement: {
    likes: number
    views: number
  }
}

interface ReviewDetailsSheetProps {
  review: Review | null
  isOpen: boolean
  onClose: () => void
  onReply: (review: Review) => void
  onEdit: (review: Review) => void
  onApprove: (id: number) => void
  onReject: (id: number) => void
  onFlag: (id: number) => void
}

export function ReviewDetailsSheet({
  review,
  isOpen,
  onClose,
  onReply,
  onEdit,
  onApprove,
  onReject,
  onFlag,
}: ReviewDetailsSheetProps) {
  if (!review) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Review Details</SheetTitle>
          <SheetDescription>View and manage review information</SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="flex items-start gap-4">
            <Image
              src={review.userAvatar}
              alt={review.username}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="font-medium">{review.username}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {review.date}
              </div>
              <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-1">{review.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={
                review.status === 'approved'
                  ? 'secondary'
                  : review.status === 'rejected'
                    ? 'destructive'
                    : 'outline'
              }
            >
              {review.status === 'approved' ? (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              ) : review.status === 'rejected' ? (
                <XCircle className="h-3 w-3 mr-1" />
              ) : null}
              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
            </Badge>
            {review.flagged && (
              <Badge variant="outline" className="text-red-500 border-red-200">
                <Flag className="h-3 w-3 mr-1" />
                Flagged
              </Badge>
            )}
            {review.featured && (
              <Badge variant="outline" className="text-yellow-500 border-yellow-200">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {review.engagement.likes} likes
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {review.engagement.views} views
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {review.replies.length} replies
            </div>
          </div>

          {review.replies.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Replies</h4>
              <div className="space-y-3">
                {review.replies.map((reply: Reply) => (
                  <div key={reply.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm">{reply.adminName}</span>
                      <span className="text-xs text-muted-foreground">{reply.date}</span>
                    </div>
                    <p className="text-sm">{reply.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {review.edited && review.editHistory.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Edit History</h4>
              <div className="space-y-3">
                {review.editHistory.map((edit: EditHistory, index: number) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm">{edit.editedBy}</span>
                      <span className="text-xs text-muted-foreground">{edit.editDate}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Original comment:</p>
                    <p className="text-sm">{edit.originalComment}</p>
                    <p className="text-xs text-muted-foreground mt-2">Reason: {edit.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        <SheetFooter className="mt-4 gap-2 sm:justify-start">
          <Button onClick={() => onReply(review)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline" onClick={() => onEdit(review)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {review.status !== 'approved' && (
            <Button
              variant="outline"
              className="text-green-600"
              onClick={() => onApprove(review.id)}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          )}
          {review.status !== 'rejected' && (
            <Button variant="outline" className="text-red-600" onClick={() => onReject(review.id)}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
