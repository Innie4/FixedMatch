import { useState } from "react"
import Image from "next/image"
import { 
  Star, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Edit, 
  Flag, 
  Eye, 
  EyeOff, 
  Bookmark, 
  BookmarkCheck,
  Calendar
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ReviewCardProps {
  review: any;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onViewDetails: (review: any) => void;
  onReply: (review: any) => void;
  onEdit: (review: any) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onToggleVisibility: (id: number) => void;
  onToggleFeature: (id: number) => void;
  onFlag: (id: number) => void;
}

export function ReviewCard({
  review,
  isSelected,
  onSelect,
  onViewDetails,
  onReply,
  onEdit,
  onApprove,
  onReject,
  onToggleVisibility,
  onToggleFeature,
  onFlag
}: ReviewCardProps) {
  return (
    <Card className={review.flagged ? "border-red-300" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(review.id)}
              aria-label={`Select review ${review.id}`}
            />
            <div className="flex flex-col">
              <div className="flex items-center">
                <Image
                  src={review.userAvatar}
                  alt={review.username}
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                />
                <span className="font-medium">{review.username}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {review.date}
              </div>
            </div>
          </div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <CardTitle className="text-base mt-2">{review.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{review.comment}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={review.status === "approved" ? "secondary" : review.status === "rejected" ? "destructive" : "outline"}>
              {review.status === "approved" ? (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              ) : review.status === "rejected" ? (
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
                <BookmarkCheck className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onViewDetails(review)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onReply(review)}>
              <MessageSquare className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(review)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReply(review)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(review)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {review.status !== "approved" && (
                  <DropdownMenuItem onClick={() => onApprove(review.id)}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </DropdownMenuItem>
                )}
                {review.status !== "rejected" && (
                  <DropdownMenuItem onClick={() => onReject(review.id)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleVisibility(review.id)}>
                  {review.visible ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleFeature(review.id)}>
                  {review.featured ? (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Unfeature
                    </>
                  ) : (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      Feature
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFlag(review.id)}>
                  <Flag className="h-4 w-4 mr-2" />
                  {review.flagged ? "Unflag" : "Flag"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}