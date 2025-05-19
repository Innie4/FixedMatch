"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Star, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
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
  Clock,
  Calendar,
  ArrowUpDown,
  ThumbsUp,
  AlertTriangle,
  Save,
  FileText,
  Bookmark,
  BookmarkCheck,
  Plus
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Label } from "@/components/ui/label"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ReviewManagementPage() {
  const [selectedReview, setSelectedReview] = useState(null)
  const [isReviewDetailsOpen, setIsReviewDetailsOpen] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRating, setFilterRating] = useState("all")
  const [filterDateRange, setFilterDateRange] = useState("all")
  const [activeTab, setActiveTab] = useState("pending")
  const [isEditReviewOpen, setIsEditReviewOpen] = useState(false)
  const [isTemplateResponseOpen, setIsTemplateResponseOpen] = useState(false)
  
  // Mock reviews data
  const reviews = [
    {
      id: 1,
      username: "john_doe",
      userId: 1,
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      title: "Excellent predictions!",
      comment: "I've been using this service for 3 months and have won consistently. The VIP predictions are especially accurate.",
      date: "2023-06-10",
      status: "pending",
      featured: false,
      visible: true,
      flagged: false,
      flagReason: null,
      edited: false,
      editHistory: [],
      replies: [],
      engagement: {
        likes: 12,
        views: 145
      }
    },
    {
      id: 2,
      username: "jane_smith",
      userId: 2,
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      title: "Good service overall",
      comment: "Good predictions, but some could be more accurate. The interface is easy to use and customer service is responsive.",
      date: "2023-06-09",
      status: "approved",
      featured: true,
      visible: true,
      flagged: false,
      flagReason: null,
      edited: false,
      editHistory: [],
      replies: [
        {
          id: 1,
          adminName: "Admin",
          comment: "Thank you for your feedback! We're constantly working to improve our prediction accuracy.",
          date: "2023-06-09",
          engagement: {
            likes: 3,
            views: 42
          }
        }
      ],
      engagement: {
        likes: 8,
        views: 120
      }
    },
    {
      id: 3,
      username: "mike_wilson",
      userId: 3,
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 2,
      title: "Disappointing results",
      comment: "I lost money following these predictions. The free predictions are especially inaccurate.",
      date: "2023-06-08",
      status: "pending",
      featured: false,
      visible: true,
      flagged: true,
      flagReason: "Negative content",
      edited: false,
      editHistory: [],
      replies: [],
      engagement: {
        likes: 1,
        views: 95
      }
    },
    {
      id: 4,
      username: "sarah_johnson",
      userId: 4,
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      title: "Worth every penny",
      comment: "The VIP predictions are worth every penny. I've had an 80% success rate with them!",
      date: "2023-06-07",
      status: "approved",
      featured: true,
      visible: true,
      flagged: false,
      flagReason: null,
      edited: true,
      editHistory: [
        {
          originalComment: "The VIP predictions are great. I've had good success with them!",
          editedBy: "Admin",
          editDate: "2023-06-07",
          reason: "Enhanced clarity"
        }
      ],
      replies: [],
      engagement: {
        likes: 24,
        views: 210
      }
    },
    {
      id: 5,
      username: "david_brown",
      userId: 5,
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 1,
      title: "Waste of money",
      comment: "This is a complete scam! Don't waste your money on the VIP predictions.",
      date: "2023-06-06",
      status: "rejected",
      featured: false,
      visible: false,
      flagged: true,
      flagReason: "Abusive content",
      edited: false,
      editHistory: [],
      replies: [],
      engagement: {
        likes: 0,
        views: 15
      }
    },
  ]
  
  // Mock template responses
  const templateResponses = [
    {
      id: 1,
      title: "Thank you for positive feedback",
      content: "Thank you for your positive feedback! We're glad you're enjoying our prediction service and finding value in it. We strive to maintain high accuracy and your success is our success too!"
    },
    {
      id: 2,
      title: "Response to negative feedback",
      content: "We're sorry to hear about your experience. Our predictions are based on thorough analysis, but sports outcomes can be unpredictable. We'd like to learn more about your specific concerns to help improve our service. Please contact our support team."
    },
    {
      id: 3,
      title: "VIP subscription benefits",
      content: "Thank you for mentioning our VIP service! We put extra effort into our premium predictions and are thrilled they're working well for you. Remember that our VIP members also get access to exclusive analysis and priority support."
    },
    {
      id: 4,
      title: "General thank you",
      content: "Thank you for taking the time to leave a review. Customer feedback is vital to our continuous improvement, and we appreciate your input!"
    }
  ]
  
  // Filter reviews based on search term, status filter, and active tab
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" || 
      review.status === filterStatus;
    
    const matchesRating = 
      filterRating === "all" || 
      review.rating === parseInt(filterRating);
    
    const matchesTab = 
      (activeTab === "pending" && review.status === "pending") ||
      (activeTab === "approved" && review.status === "approved") ||
      (activeTab === "rejected" && review.status === "rejected") ||
      (activeTab === "flagged" && review.flagged) ||
      (activeTab === "featured" && review.featured);
    
    return matchesSearch && matchesStatus && matchesRating && matchesTab;
  });
  
  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortColumn === "date") {
      return sortDirection === "asc" 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortColumn === "rating") {
      return sortDirection === "asc" 
        ? a.rating - b.rating
        : b.rating - a.rating;
    } else if (sortColumn === "engagement") {
      return sortDirection === "asc" 
        ? a.engagement.likes - b.engagement.likes
        : b.engagement.likes - a.engagement.likes;
    }
    return 0;
  });
  
  // Paginate reviews
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = sortedReviews.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle row selection
  const handleRowSelect = (reviewId) => {
    if (selectedRows.includes(reviewId)) {
      setSelectedRows(selectedRows.filter(id => id !== reviewId));
    } else {
      setSelectedRows([...selectedRows, reviewId]);
    }
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedReviews.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedReviews.map(review => review.id));
    }
  };
  
  // Handle sort
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  // Handle review selection
  const handleReviewSelect = (review) => {
    setSelectedReview(review);
    setIsReviewDetailsOpen(true);
  };
  
  // Handle review reply
  const handleReviewReply = (review) => {
    setSelectedReview(review);
    setIsReplyOpen(true);
  };
  
  // Handle review edit
  const handleReviewEdit = (review) => {
    setSelectedReview(review);
    setIsEditReviewOpen(true);
  };
  
  // Handle review approval
  const handleReviewApproval = (reviewId, approved) => {
    // In a real app, this would call an API to update the review status
    console.log(`Review ${reviewId} ${approved ? 'approved' : 'rejected'}`);
  };
  
  // Handle review visibility toggle
  const handleVisibilityToggle = (reviewId) => {
    // In a real app, this would call an API to toggle visibility
    console.log(`Toggling visibility for review ${reviewId}`);
  };
  
  // Handle review featuring toggle
  const handleFeatureToggle = (reviewId) => {
    // In a real app, this would call an API to toggle featuring
    console.log(`Toggling featured status for review ${reviewId}`);
  };
  
  // Handle bulk actions
  const handleBulkAction = (action) => {
    // In a real app, this would call an API to perform the action
    console.log(`Performing ${action} on reviews:`, selectedRows);
    
    // Reset selection after action
    setSelectedRows([]);
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };
  
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/admin/reviews">Review Management</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Review Management</h1>
          <p className="text-muted-foreground">Manage user reviews and testimonials for your platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsTemplateResponseOpen(true)}
            variant="outline"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Response Templates
          </Button>
          <Button 
            onClick={() => handleBulkAction('export')}
            variant="outline"
          >
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
                  <DropdownMenuItem onClick={() => setFilterRating("all")}>
                    All Ratings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating("5")}>
                    5 Stars
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating("4")}>
                    4 Stars
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating("3")}>
                    3 Stars
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating("2")}>
                    2 Stars
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating("1")}>
                    1 Star
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterDateRange("all")}>
                    All Time
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange("today")}>
                    Today
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange("week")}>
                    This Week
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange("month")}>
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
                    <DropdownMenuItem onClick={() => handleBulkAction("approve")}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("reject")}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("flag")}>
                      <Flag className="mr-2 h-4 w-4" />
                      Flag
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction("delete")}>
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
              <Card key={review.id} className={review.flagged ? "border-red-300" : ""}>
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
                  <p className="text-sm text-muted-foreground line-clamp-3">{review.comment}</p>
                  {review.flagged && (
                    <Badge variant="destructive" className="mt-2">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Flagged: {review.flagReason}
                    </Badge>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {review.engagement.likes} likes
                    <Eye className="h-3 w-3 ml-2 mr-1" />
                    {review.engagement.views} views
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleReviewSelect(review)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleReviewEdit(review)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleReviewReply(review)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-green-600"
                      onClick={() => handleReviewApproval(review.id, true)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-600"
                      onClick={() => handleReviewApproval(review.id, false)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {paginatedReviews.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No pending reviews</h3>
              <p className="text-muted-foreground mt-2">
                There are no pending reviews that match your filters.
              </p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Showing
                </p>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  of {filteredReviews.length} reviews
                </p>
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
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4">
          {/* Approved Reviews Section - Table Layout */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                      <DropdownMenuItem onClick={() => setFilterRating("all")}>
                        All Ratings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterRating("5")}>
                        5 Stars
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterRating("4")}>
                        4 Stars
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterRating("3")}>
                        3 Stars
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterRating("2")}>
                        2 Stars
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterRating("1")}>
                        1 Star
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterDateRange("all")}>
                        All Time
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterDateRange("today")}>
                        Today
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterDateRange("week")}>
                        This Week
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterDateRange("month")}>
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
                        <DropdownMenuItem onClick={() => handleBulkAction("feature")}>
                          <BookmarkCheck className="mr-2 h-4 w-4" />
                          Feature
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction("hide")}>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Hide
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction("show")}>
                          <Eye className="mr-2 h-4 w-4" />
                          Show
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBulkAction("delete")}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
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
                      <DropdownMenuItem onClick={() => handleBulkAction("feature")}>
                        <BookmarkCheck className="mr-2 h-4 w-4" />
                        Feature
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction("hide")}>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hide
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction("show")}>
                        <Eye className="mr-2 h-4 w-4" />
                        Show
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleBulkAction("delete")}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
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
                    <DropdownMenuItem onClick={() => handleBulkAction("feature")}>
                      <BookmarkCheck className="mr-2 h-4 w-4" />
                      Feature
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("hide")}>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("show")}>
                      <Eye className="mr-2 h-4 w-4" />
                      Show
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction("delete")}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedRows.length === paginatedReviews.length && paginatedReviews.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("rating")}>
                    <div className="flex items-center">
                      Rating
                      {sortColumn === "rating" && (
                        sortDirection === "asc" ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                    <div className="flex items-center">
                      Date
                      {sortColumn === "date" && (
                        sortDirection === "asc" ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("engagement")}>
                    <div className="flex items-center">
                      Engagement
                      {sortColumn === "engagement" && (
                        sortDirection === "asc" ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(review.id)}
                        onCheckedChange={() => handleRowSelect(review.id)}
                        aria-label={`Select review ${review.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Image
                          src={review.userAvatar}
                          alt={review.username}
                          width={24}
                          height={24}
                          className="rounded-full mr-2"
                        />
                        <span>{review.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <span className="font-medium">{review.title}</span>
                      <p className="text-xs text-muted-foreground truncate">{review.comment}</p>
                    </TableCell>
                    <TableCell>{review.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="h-3 w-3" />
                        <span className="text-xs">{review.engagement.likes}</span>
                        <Eye className="h-3 w-3 ml-1" />
                        <span className="text-xs">{review.engagement.views}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {review.featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                        {review.edited && (
                          <Badge variant="outline">Edited</Badge>
                        )}
                        {review.replies.length > 0 && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Replied
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleReviewEdit(review)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReviewReply(review)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFeatureToggle(review.id)}>
                            {review.featured ? (
                              <>
                                <Bookmark className="mr-2 h-4 w-4" />
                                Unfeature
                              </>
                            ) : (
                              <>
                                <BookmarkCheck className="mr-2 h-4 w-4" />
                                Feature
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleVisibilityToggle(review.id)}>
                            {review.visible ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Show
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(review)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredReviews.length)}
                </span>{" "}
                of <span className="font-medium">{filteredReviews.length}</span> reviews
              </p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
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
          </TabsContent>
          
          <TabsContent value="approved" className="space-y-4">
          {/* Approved Reviews Section - Table Layout */}
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
                  <DropdownMenuItem onClick={() => setFilterRating("all")}>
                    All Ratings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating("5")}>
                    5 Stars
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating("4")}>
                    4 Stars
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating("3")}>
                    3 Stars
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating("2")}>
                    2 Stars
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRating("1")}>
                    1 Star
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterDateRange("all")}>
                    All Time
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange("today")}>
                    Today
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange("week")}>
                    This Week
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDateRange("month")}>
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
                    <DropdownMenuItem onClick={() => handleBulkAction("feature")}>
                      <BookmarkCheck className="mr-2 h-4 w-4" />
                      Feature
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("hide")}>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("show")}>
                      <Eye className="mr-2 h-4 w-4" />
                      Show
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction("delete")}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedRows.length === paginatedReviews.length && paginatedReviews.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("rating")}>
                    <div className="flex items-center">
                      Rating
                      {sortColumn === "rating" && (
                        sortDirection === "asc" ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                    <div className="flex items-center">
                      Date
                      {sortColumn === "date" && (
                        sortDirection === "asc" ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("engagement")}>
                    <div className="flex items-center">
                      Engagement
                      {sortColumn === "engagement" && (
                        sortDirection === "asc" ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(review.id)}
                        onCheckedChange={() => handleRowSelect(review.id)}
                        aria-label={`Select review ${review.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Image
                          src={review.userAvatar}
                          alt={review.username}
                          width={24}
                          height={24}
                          className="rounded-full mr-2"
                        />
                        <span>{review.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <span className="font-medium">{review.title}</span>
                      <p className="text-xs text-muted-foreground truncate">{review.comment}</p>
                    </TableCell>
                    <TableCell>{review.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="h-3 w-3" />
                        <span className="text-xs">{review.engagement.likes}</span>
                        <Eye className="h-3 w-3 ml-1" />
                        <span className="text-xs">{review.engagement.views}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {review.featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                        {review.edited && (
                          <Badge variant="outline">Edited</Badge>
                        )}
                        {review.replies.length > 0 && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Replied
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleReviewEdit(review)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReviewReply(review)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFeatureToggle(review.id)}>
                            {review.featured ? (
                              <>
                                <Bookmark className="mr-2 h-4 w-4" />
                                Unfeature
                              </>
                            ) : (
                              <>
                                <BookmarkCheck className="mr-2 h-4 w-4" />
                                Feature
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleVisibilityToggle(review.id)}>
                            {review.visible ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Show
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(review)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredReviews.length)}
                </span>{" "}
                of <span className="font-medium">{filteredReviews.length}</span> reviews
              </p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
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
          </TabsContent>
          
          {/* Similar TabsContent for rejected, flagged, and featured tabs */}
          
          {/* Edit Review Dialog */}
          <Dialog open={isEditReviewOpen} onOpenChange={setIsEditReviewOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Review</DialogTitle>
                <DialogDescription>
                  Make changes to the review content. All edits are logged.
                </DialogDescription>
              </DialogHeader>
              {selectedReview && (
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={selectedReview.userAvatar}
                      alt={selectedReview.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{selectedReview.username}</p>
                      <p className="text-sm text-muted-foreground">{selectedReview.date}</p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < selectedReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Review Title</Label>
                    <Input
                      id="edit-title"
                      defaultValue={selectedReview.title}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-comment">Review Content</Label>
                    <Textarea
                      id="edit-comment"
                      rows={5}
                      defaultValue={selectedReview.comment}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-reason">Edit Reason</Label>
                    <Input
                      id="edit-reason"
                      placeholder="Reason for editing this review"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="feature-review" />
                    <Label htmlFor="feature-review">Feature this review</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="visible-review" defaultChecked={selectedReview.visible} />
                    <Label htmlFor="visible-review">Visible on frontend</Label>
                  </div>
                  
                  {selectedReview.editHistory.length > 0 && (
                    <div className="space-y-2 border-t pt-4 mt-4">
                      <h4 className="font-medium">Edit History</h4>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {selectedReview.editHistory.map((edit, index) => (
                          <div key={index} className="text-sm border rounded-md p-2">
                            <p className="text-muted-foreground">
                              Edited by {edit.editedBy} on {edit.editDate}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Reason: {edit.reason}
                            </p>
                            <p className="mt-1 text-xs">Original: {edit.originalComment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditReviewOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  console.log("Saving edited review");
                  setIsEditReviewOpen(false);
                }}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Reply to Review Dialog */}
          <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Reply to Review</DialogTitle>
                <DialogDescription>
                  Your reply will be visible to all users on the platform.
                </DialogDescription>
              </DialogHeader>
              {selectedReview && (
                <div className="space-y-4 py-4">
                  <div className="border rounded-md p-3 bg-muted/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Image
                        src={selectedReview.userAvatar}
                        alt={selectedReview.username}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <p className="font-medium">{selectedReview.username}</p>
                      <div className="ml-auto flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < selectedReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm font-medium">{selectedReview.title}</p>
                    <p className="text-sm">{selectedReview.comment}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reply-content">Your Reply</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsTemplateResponseOpen(true)}
                        className="h-8 text-xs"
                      >
                        Use Template
                      </Button>
                    </div>
                    <Textarea
                      id="reply-content"
                      rows={5}
                      placeholder="Type your reply here..."
                    />
                  </div>
                  
                  {selectedReview.replies.length > 0 && (
                    <div className="space-y-2 border-t pt-4">
                      <h4 className="font-medium">Previous Replies</h4>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {selectedReview.replies.map((reply, index) => (
                          <div key={index} className="text-sm border rounded-md p-2">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{reply.adminName}</p>
                              <p className="text-xs text-muted-foreground">{reply.date}</p>
                            </div>
                            <p className="mt-1">{reply.comment}</p>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{reply.engagement.likes}</span>
                              <Eye className="h-3 w-3 ml-1" />
                              <span>{reply.engagement.views}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReplyOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  console.log("Sending reply");
                  setIsReplyOpen(false);
                }}>
                  Send Reply
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Template Responses Dialog */}
          <Dialog open={isTemplateResponseOpen} onOpenChange={setIsTemplateResponseOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Response Templates</DialogTitle>
                <DialogDescription>
                  Select a template to use or create a new one.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
                {templateResponses.map((template) => (
                  <div key={template.id} className="border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{template.title}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
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
                    <p className="text-sm mt-1">{template.content}</p>
                    <div className="mt-2 flex justify-end">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          // In a real app, this would insert the template into the reply textarea
                          console.log(`Using template: ${template.title}`);
                          setIsTemplateResponseOpen(false);
                          // Keep the reply dialog open
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="border border-dashed rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center justify-center h-20">
                    <Button variant="ghost">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Template
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTemplateResponseOpen(false)}>
                  Cancel
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
                  This action cannot be undone. This will permanently delete the selected review
                  and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    console.log("Deleting review", selectedReview?.id);
                    setIsDeleteConfirmOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>