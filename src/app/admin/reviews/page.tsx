'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Star,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Edit,
  Flag,
  Download,
  Eye,
  EyeOff,
  ThumbsUp,
  AlertTriangle,
  Save,
  Bookmark,
  BookmarkCheck,
  Plus,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

// Define interfaces for your data types
interface ReviewEngagement {
  likes: number
  views: number
}

interface ReviewReply {
  id: number
  adminName: string
  comment: string
  date: string
  engagement: ReviewEngagement
}

interface EditHistory {
  originalComment: string
  editedBy: string
  editDate: string
  reason: string
}

interface Review {
  id: number
  username: string
  userId: number
  userAvatar: string
  rating: number
  title: string
  comment: string
  date: string
  status: string
  featured: boolean
  visible: boolean
  flagged: boolean
  flagReason: string | null
  edited: boolean
  editHistory: EditHistory[]
  replies: ReviewReply[]
  engagement: ReviewEngagement
}

interface TemplateResponse {
  id: number
  title: string
  content: string
}

export default function ReviewManagementPage() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isReviewDetailsOpen, setIsReviewDetailsOpen] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('all')
  const [activeTab, setActiveTab] = useState('pending')
  const [isEditReviewOpen, setIsEditReviewOpen] = useState(false)
  const [isTemplateResponseOpen, setIsTemplateResponseOpen] = useState(false)

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: 1,
      username: 'john_doe',
      userId: 1,
      userAvatar: '/placeholder.svg?height=40&width=40',
      rating: 5,
      title: 'Excellent predictions!',
      comment:
        "I've been using this service for 3 months and have won consistently. The VIP predictions are especially accurate.",
      date: '2023-06-10',
      status: 'pending',
      featured: false,
      visible: true,
      flagged: false,
      flagReason: null,
      edited: false,
      editHistory: [],
      replies: [],
      engagement: {
        likes: 12,
        views: 145,
      },
    },
    {
      id: 2,
      username: 'jane_smith',
      userId: 2,
      userAvatar: '/placeholder.svg?height=40&width=40',
      rating: 4,
      title: 'Good service overall',
      comment:
        'Good predictions, but some could be more accurate. The interface is easy to use and customer service is responsive.',
      date: '2023-06-09',
      status: 'approved',
      featured: true,
      visible: true,
      flagged: false,
      flagReason: null,
      edited: false,
      editHistory: [],
      replies: [
        {
          id: 1,
          adminName: 'Admin',
          comment:
            "Thank you for your feedback! We're constantly working to improve our prediction accuracy.",
          date: '2023-06-09',
          engagement: {
            likes: 3,
            views: 42,
          },
        },
      ],
      engagement: {
        likes: 8,
        views: 120,
      },
    },
    {
      id: 3,
      username: 'mike_wilson',
      userId: 3,
      userAvatar: '/placeholder.svg?height=40&width=40',
      rating: 2,
      title: 'Disappointing results',
      comment:
        'I lost money following these predictions. The free predictions are especially inaccurate.',
      date: '2023-06-08',
      status: 'pending',
      featured: false,
      visible: true,
      flagged: true,
      flagReason: 'Negative content',
      edited: false,
      editHistory: [],
      replies: [],
      engagement: {
        likes: 1,
        views: 95,
      },
    },
    {
      id: 4,
      username: 'sarah_johnson',
      userId: 4,
      userAvatar: '/placeholder.svg?height=40&width=40',
      rating: 5,
      title: 'Worth every penny',
      comment: "The VIP predictions are worth every penny. I've had an 80% success rate with them!",
      date: '2023-06-07',
      status: 'approved',
      featured: true,
      visible: true,
      flagged: false,
      flagReason: null,
      edited: true,
      editHistory: [
        {
          originalComment: "The VIP predictions are great. I've had good success with them!",
          editedBy: 'Admin',
          editDate: '2023-06-07',
          reason: 'Enhanced clarity',
        },
      ],
      replies: [],
      engagement: {
        likes: 24,
        views: 210,
      },
    },
    {
      id: 5,
      username: 'david_brown',
      userId: 5,
      userAvatar: '/placeholder.svg?height=40&width=40',
      rating: 1,
      title: 'Waste of money',
      comment: "This is a complete scam! Don't waste your money on the VIP predictions.",
      date: '2023-06-06',
      status: 'rejected',
      featured: false,
      visible: false,
      flagged: true,
      flagReason: 'Abusive content',
      edited: false,
      editHistory: [],
      replies: [],
      engagement: {
        likes: 0,
        views: 15,
      },
    },
  ]

  // Mock template responses
  const templateResponses: TemplateResponse[] = [
    {
      id: 1,
      title: 'Thank you for positive feedback',
      content:
        "Thank you for your positive feedback! We're glad you're enjoying our prediction service and finding value in it. We strive to maintain high accuracy and your success is our success too!",
    },
    {
      id: 2,
      title: 'Response to negative feedback',
      content:
        "We're sorry to hear about your experience. Our predictions are based on thorough analysis, but sports outcomes can be unpredictable. We'd like to learn more about your specific concerns to help improve our service. Please contact our support team.",
    },
    {
      id: 3,
      title: 'VIP subscription benefits',
      content:
        "Thank you for mentioning our VIP service! We put extra effort into our premium predictions and are thrilled they're working well for you. Remember that our VIP members also get access to exclusive analysis and priority support.",
    },
    {
      id: 4,
      title: 'General thank you',
      content:
        'Thank you for taking the time to leave a review. Customer feedback is vital to our continuous improvement, and we appreciate your input!',
    },
  ]

  // Filter reviews based on search term, status filter, and active tab
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = activeTab === 'all' || review.status === activeTab

    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating)

    const matchesTab =
      (activeTab === 'pending' && review.status === 'pending') ||
      (activeTab === 'approved' && review.status === 'approved') ||
      (activeTab === 'rejected' && review.status === 'rejected') ||
      (activeTab === 'flagged' && review.flagged) ||
      (activeTab === 'featured' && review.featured)

    return matchesSearch && matchesStatus && matchesRating && matchesTab
  })

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortColumn === 'date') {
      // Convert string dates to timestamps for comparison
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
    } else if (sortColumn === 'rating') {
      return sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating
    } else if (sortColumn === 'engagement') {
      return sortDirection === 'asc'
        ? a.engagement.likes - b.engagement.likes
        : b.engagement.likes - a.engagement.likes
    }
    return 0
  })

  // Paginate reviews
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReviews = sortedReviews.slice(startIndex, startIndex + itemsPerPage)

  // Handle row selection
  const handleRowSelect = (reviewId: number) => {
    if (selectedRows.includes(reviewId)) {
      setSelectedRows(selectedRows.filter((id) => id !== reviewId))
    } else {
      setSelectedRows([...selectedRows, reviewId])
    }
  }

  // Handle review selection
  const handleReviewSelect = (review: Review) => {
    setSelectedReview(review)
    setIsReviewDetailsOpen(true)
  }

  // Handle review reply
  const handleReviewReply = (review: Review) => {
    setSelectedReview(review)
    setIsReplyOpen(true)
  }

  // Handle review edit
  const handleReviewEdit = (review: Review) => {
    setSelectedReview(review)
    setIsEditReviewOpen(true)
  }

  // Handle review approval
  const handleReviewApproval = (reviewId: number, approved: boolean) => {
    // In a real app, this would call an API to update the review status
    console.log(`Review ${reviewId} ${approved ? 'approved' : 'rejected'}`)
  }

  // Handle review visibility toggle
  const handleVisibilityToggle = (reviewId: number) => {
    // In a real app, this would call an API to toggle visibility
    console.log(`Toggling visibility for review ${reviewId}`)
  }

  // Handle review featuring toggle
  const handleFeatureToggle = (reviewId: number) => {
    // In a real app, this would call an API to toggle featuring
    console.log(`Toggling featured status for review ${reviewId}`)
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    // In a real app, this would call an API to perform the action
    console.log(`Performing ${action} on reviews:`, selectedRows)

    // Reset selection after action
    setSelectedRows([])
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/reviews">Review Management</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Review Management</h1>
          <p className="text-muted-foreground">
            Manage user reviews and testimonials for your platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsTemplateResponseOpen(true)} variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Response Templates
          </Button>
          <Button onClick={() => handleBulkAction('export')} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs for different review views */}
      <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-md">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {/* Pending Reviews Section - Card Layout */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search pending reviews..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by Rating</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterRating('all')}>
                    All Ratings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('5')}>5 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('4')}>4 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('3')}>3 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('2')}>2 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('1')}>1 Star</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterDateRange('all')}>
                    All Time
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange('today')}>
                    Today
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange('week')}>
                    This Week
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange('month')}>
                    This Month
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedRows.length} selected
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction('approve')}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('reject')}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('flag')}>
                      <Flag className="mr-2 h-4 w-4" />
                      Flag
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedReviews.map((review) => (
              <Card key={review.id} className={review.flagged ? 'border-red-300' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedRows.includes(review.id)}
                        onCheckedChange={() => handleRowSelect(review.id)}
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
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {review.flagged && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Flagged
                        </Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleReviewSelect(review)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReviewReply(review)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReviewEdit(review)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleReviewApproval(review.id, true)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReviewApproval(review.id, false)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReview(review)
                              setIsDeleteConfirmOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="mb-2 flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium">{review.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                  {review.replies.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs font-medium mb-1">Admin Response:</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {review.replies[0].comment}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {review.engagement.likes} likes
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVisibilityToggle(review.id)}
                    >
                      {review.visible ? (
                        <Eye className="h-4 w-4 mr-1" />
                      ) : (
                        <EyeOff className="h-4 w-4 mr-1" />
                      )}
                      {review.visible ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeatureToggle(review.id)}
                    >
                      {review.featured ? (
                        <BookmarkCheck className="h-4 w-4 mr-1" />
                      ) : (
                        <Bookmark className="h-4 w-4 mr-1" />
                      )}
                      {review.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, sortedReviews.length)}
              </span>{' '}
              of <span className="font-medium">{sortedReviews.length}</span> reviews
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={itemsPerPage.toString()} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Other tab contents */}
        <TabsContent value="approved" className="space-y-4">
          {/* Approved Reviews Section - Card Layout */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search approved reviews..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by Rating</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterRating('all')}>
                    All Ratings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('5')}>5 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('4')}>4 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('3')}>3 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('2')}>2 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('1')}>1 Star</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterDateRange('all')}>
                    All Time
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange('today')}>
                    Today
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange('week')}>
                    This Week
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange('month')}>
                    This Month
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedRows.length} selected
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction('unapprove')}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Unapprove
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('flag')}>
                      <Flag className="mr-2 h-4 w-4" />
                      Flag
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedReviews.map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={review.userAvatar}
                          alt={review.username}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-medium">{review.username}</h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="ml-1 text-xs text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                      >
                        Approved
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleReviewSelect(review)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReviewReply(review)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReviewEdit(review)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleReviewApproval(review.id, false)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Unapprove
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setIsDeleteConfirmOpen(true)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm pt-2">{review.title}</h4>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center space-x-2 mb-2">
                    {review.featured && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      >
                        <BookmarkCheck className="mr-1 h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                    {review.edited && (
                      <Badge variant="outline" className="text-xs">
                        Edited
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                  {review.replies.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs font-medium mb-1">Admin Response:</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {review.replies[0].comment}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {review.engagement.likes} likes
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVisibilityToggle(review.id)}
                    >
                      {review.visible ? (
                        <Eye className="h-4 w-4 mr-1" />
                      ) : (
                        <EyeOff className="h-4 w-4 mr-1" />
                      )}
                      {review.visible ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeatureToggle(review.id)}
                    >
                      {review.featured ? (
                        <BookmarkCheck className="h-4 w-4 mr-1" />
                      ) : (
                        <Bookmark className="h-4 w-4 mr-1" />
                      )}
                      {review.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, sortedReviews.length)}
              </span>{' '}
              of <span className="font-medium">{sortedReviews.length}</span> reviews
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={itemsPerPage.toString()} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {/* Rejected Reviews Section - Card Layout */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search rejected reviews..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by Rating</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterRating('all')}>
                    All Ratings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('5')}>5 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('4')}>4 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('3')}>3 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('2')}>2 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating('1')}>1 Star</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterDateRange('all')}>
                    All Time
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange('today')}>
                    Today
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange('week')}>
                    This Week
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange('month')}>
                    This Month
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedRows.length} selected
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction('approve')}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('flag')}>
                      <Flag className="mr-2 h-4 w-4" />
                      Flag
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedReviews.map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={review.userAvatar}
                          alt={review.username}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-medium">{review.username}</h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="ml-1 text-xs text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                      >
                        Rejected
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleReviewSelect(review)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReviewReply(review)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReviewEdit(review)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleReviewApproval(review.id, true)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setIsDeleteConfirmOpen(true)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm pt-2">{review.title}</h4>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center space-x-2 mb-2">
                    {review.flagged && (
                      <Badge
                        variant="destructive"
                        className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                      >
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Flagged
                      </Badge>
                    )}
                    {review.edited && (
                      <Badge variant="outline" className="text-xs">
                        Edited
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                  {review.replies.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs font-medium mb-1">Admin Response:</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {review.replies[0].comment}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {review.engagement.likes} likes
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVisibilityToggle(review.id)}
                    >
                      {review.visible ? (
                        <Eye className="h-4 w-4 mr-1" />
                      ) : (
                        <EyeOff className="h-4 w-4 mr-1" />
                      )}
                      {review.visible ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, sortedReviews.length)}
              </span>{' '}
              of <span className="font-medium">{sortedReviews.length}</span> reviews
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={itemsPerPage.toString()} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          {/* Similar content structure as the "pending" tab */}
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          {/* Similar content structure as the "pending" tab */}
        </TabsContent>
      </Tabs>

      {/* Review Details Dialog */}
      <Dialog open={isReviewDetailsOpen} onOpenChange={setIsReviewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>View complete details for this review.</DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Image
                  src={selectedReview.userAvatar}
                  alt={selectedReview.username}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="space-y-1">
                  <h3 className="font-medium">{selectedReview.username}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < selectedReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {selectedReview.date}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg">{selectedReview.title}</h4>
                <p className="mt-2">{selectedReview.comment}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    selectedReview.status === 'approved'
                      ? 'default'
                      : selectedReview.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                </Badge>
                {selectedReview.featured && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                  >
                    <BookmarkCheck className="mr-1 h-3 w-3" />
                    Featured
                  </Badge>
                )}
                {selectedReview.flagged && (
                  <Badge variant="destructive">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Flagged
                  </Badge>
                )}
                {selectedReview.edited && <Badge variant="outline">Edited</Badge>}
              </div>

              {selectedReview.flagged && selectedReview.flagReason && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <h4 className="font-medium flex items-center text-red-700 dark:text-red-300">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Flag Reason
                  </h4>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    {selectedReview.flagReason}
                  </p>
                </div>
              )}

              {selectedReview.edited && selectedReview.editHistory.length > 0 && (
                <div>
                  <h4 className="font-medium">Edit History</h4>
                  <div className="mt-2 space-y-3">
                    {selectedReview.editHistory.map((edit, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Edited by {edit.editedBy}</span>
                          <span className="text-sm text-muted-foreground">{edit.editDate}</span>
                        </div>
                        <p className="text-sm mt-1">Reason: {edit.reason}</p>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Original comment:</p>
                          <p className="text-sm mt-1">{edit.originalComment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedReview.replies.length > 0 && (
                <div>
                  <h4 className="font-medium">Admin Replies</h4>
                  <div className="mt-2 space-y-3">
                    {selectedReview.replies.map((reply) => (
                      <div key={reply.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{reply.adminName}</span>
                          <span className="text-sm text-muted-foreground">{reply.date}</span>
                        </div>
                        <p className="text-sm mt-1">{reply.comment}</p>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {reply.engagement.likes} likes
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium">Engagement</h4>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {selectedReview.engagement.likes} likes
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {selectedReview.engagement.views} views
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDetailsOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                handleReviewReply(selectedReview!)
                setIsReviewDetailsOpen(false)
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
            <DialogDescription>
              Write a response to {selectedReview?.username}'s review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <Image
                  src={selectedReview?.userAvatar || '/placeholder.svg'}
                  alt={selectedReview?.username || 'User'}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium">{selectedReview?.username}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < (selectedReview?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <h4 className="font-medium text-sm">{selectedReview?.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{selectedReview?.comment}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reply-template">Quick Response Templates</Label>
              <Select
                onValueChange={(value) => {
                  const template = templateResponses.find((t) => t.id === parseInt(value))
                  if (template) {
                    // In a real app, this would populate the textarea
                    console.log('Selected template:', template.content)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {templateResponses.map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reply-message">Your Response</Label>
              <Textarea
                id="reply-message"
                placeholder="Write your response here..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // In a real app, this would submit the reply
                console.log('Submitting reply')
                setIsReplyOpen(false)
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Review Dialog */}
      <Dialog open={isEditReviewOpen} onOpenChange={setIsEditReviewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Make changes to this review. Changes will be logged in the edit history.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Review Title</Label>
              <Input
                id="edit-title"
                defaultValue={selectedReview?.title}
                placeholder="Review title..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-comment">Review Comment</Label>
              <Textarea
                id="edit-comment"
                defaultValue={selectedReview?.comment}
                placeholder="Review comment..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-rating">Rating</Label>
              <Select defaultValue={selectedReview?.rating.toString()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-reason">Reason for Edit</Label>
              <Input id="edit-reason" placeholder="Why are you making this change?" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditReviewOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // In a real app, this would submit the edit
                console.log('Submitting edit')
                setIsEditReviewOpen(false)
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Response Management Dialog */}
      <Dialog open={isTemplateResponseOpen} onOpenChange={setIsTemplateResponseOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Response Templates</DialogTitle>
            <DialogDescription>
              Manage quick response templates for common review scenarios.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Available Templates</h4>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Template
              </Button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {templateResponses.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm">{template.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{template.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateResponseOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the review and remove it
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // In a real app, this would delete the review
                console.log('Deleting review:', selectedReview?.id)
                setIsDeleteConfirmOpen(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
