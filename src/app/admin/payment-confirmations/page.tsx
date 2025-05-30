"use client"

import { useState } from "react"
import { 
  CreditCard, 
  Search, 
  Filter, 
  ChevronDown, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Eye, 
  ArrowUpDown,
  Clock,
  User,
  Package,
  Bell
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PaymentConfirmationDetailsDialog } from "./components/PaymentConfirmationDetailsDialog"
import { ApproveConfirmDialog } from "./components/ApproveConfirmDialog"
import { DeclineConfirmDialog } from "./components/DeclineConfirmDialog"

export interface PaymentConfirmation {
  id: number
  userId: number
  username: string
  userEmail: string
  packageName: string
  packageDuration: string
  amount: number
  paymentMethod: string
  transactionId: string
  screenshot: string
  status: "pending" | "approved" | "declined"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  adminComment?: string
}

export default function PaymentConfirmationsPage() {
  // State for managing payment confirmations
  const [confirmations, setConfirmations] = useState<PaymentConfirmation[]>([
    {
      id: 1,
      userId: 101,
      username: "john_doe",
      userEmail: "john@example.com",
      packageName: "VIP Monthly",
      packageDuration: "30 days",
      amount: 29.99,
      paymentMethod: "Bank Transfer - Zenith Bank",
      transactionId: "TRX123456789",
      screenshot: "/placeholder.svg?height=300&width=400",
      status: "pending",
      submittedAt: "2023-11-15T10:30:00Z",
    },
    {
      id: 2,
      userId: 102,
      username: "jane_smith",
      userEmail: "jane@example.com",
      packageName: "VIP Quarterly",
      packageDuration: "90 days",
      amount: 69.99,
      paymentMethod: "Mobile Money - MTN",
      transactionId: "MM987654321",
      screenshot: "/placeholder.svg?height=300&width=400",
      status: "approved",
      submittedAt: "2023-11-14T14:45:00Z",
      reviewedAt: "2023-11-14T16:20:00Z",
      reviewedBy: "admin",
    },
    {
      id: 3,
      userId: 103,
      username: "mike_johnson",
      userEmail: "mike@example.com",
      packageName: "VIP Weekly",
      packageDuration: "7 days",
      amount: 9.99,
      paymentMethod: "Bank Transfer - GTBank",
      transactionId: "TRX567891234",
      screenshot: "/placeholder.svg?height=300&width=400",
      status: "declined",
      submittedAt: "2023-11-13T09:15:00Z",
      reviewedAt: "2023-11-13T11:30:00Z",
      reviewedBy: "admin",
      adminComment: "Transaction ID not found in our records",
    },
    {
      id: 4,
      userId: 104,
      username: "sarah_williams",
      userEmail: "sarah@example.com",
      packageName: "VIP Monthly",
      packageDuration: "30 days",
      amount: 29.99,
      paymentMethod: "Mobile Money - Airtel",
      transactionId: "MM456789123",
      screenshot: "/placeholder.svg?height=300&width=400",
      status: "pending",
      submittedAt: "2023-11-15T08:20:00Z",
    },
  ])
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortColumn, setSortColumn] = useState("submittedAt")
  const [sortDirection, setSortDirection] = useState("desc")
  
  // State for dialogs
  const [selectedConfirmation, setSelectedConfirmation] = useState<PaymentConfirmation | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isDeclineOpen, setIsDeclineOpen] = useState(false)
  const [adminComment, setAdminComment] = useState("")
  
  // Filter confirmations based on search term and status filter
  const filteredConfirmations = confirmations.filter(confirmation => {
    const matchesSearch = 
      confirmation.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      confirmation.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      confirmation.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      confirmation.packageName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || confirmation.status === filterStatus
    
    return matchesSearch && matchesStatus
  })
  
  // Sort confirmations
  const sortedConfirmations = [...filteredConfirmations].sort((a, b) => {
    let comparison = 0
    
    switch (sortColumn) {
      case "username":
        comparison = a.username.localeCompare(b.username)
        break
      case "packageName":
        comparison = a.packageName.localeCompare(b.packageName)
        break
      case "amount":
        comparison = a.amount - b.amount
        break
      case "submittedAt":
        comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        break
      default:
        comparison = 0
    }
    
    return sortDirection === "asc" ? comparison : -comparison
  })
  
  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }
  
  // Handle view details
  const handleViewDetails = (confirmation: PaymentConfirmation) => {
    setSelectedConfirmation(confirmation)
    setIsDetailsOpen(true)
  }
  
  // Handle approve
  const handleApprove = (confirmation: PaymentConfirmation) => {
    setSelectedConfirmation(confirmation)
    setIsApproveOpen(true)
  }
  
  // Handle decline
  const handleDecline = (confirmation: PaymentConfirmation) => {
    setSelectedConfirmation(confirmation)
    setIsDeclineOpen(true)
  }
  
  // Confirm approval
  // Fix the grantVIPAccess function call on line 208
  const handleApproveConfirm = async () => {
    if (selectedConfirmation) {
      try {
        // Grant VIP access
        await grantVIPAccess(
          selectedConfirmation.userId,
          selectedConfirmation.packageDuration
        )
  
        // Update confirmation status
        setConfirmations(confirmations.map(confirmation => 
          confirmation.id === selectedConfirmation.id 
            ? { 
                ...confirmation, 
                status: "approved", 
                reviewedAt: new Date().toISOString(),
                reviewedBy: "admin",
                adminComment: adminComment || undefined
              } 
            : confirmation
        ))
  
        // Send notification to user
        await sendNotification(
          selectedConfirmation.userId,
          'Your payment has been approved. VIP access granted!'
        )
  
        setIsApproveOpen(false)
        setAdminComment("")
      } catch (error) {
        console.error('Error approving payment:', error)
        // Show error message
      }
    }
  }
  
  // Confirm decline
  const handleDeclineConfirm = () => {
    if (selectedConfirmation) {
      setConfirmations(confirmations.map(confirmation => 
        confirmation.id === selectedConfirmation.id 
          ? { 
              ...confirmation, 
              status: "declined", 
              reviewedAt: new Date().toISOString(),
              reviewedBy: "admin",
              adminComment: adminComment
            } 
          : confirmation
      ))
      setIsDeclineOpen(false)
      setAdminComment("")
      
      // In a real app, you would also:
      // 1. Call API to update payment status
      // 2. Send email notification to user
    }
  }
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Approved</Badge>
      case "declined":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Declined</Badge>
      default:
        return null
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payment Confirmations</h2>
          <p className="text-muted-foreground">Manage and review user payment confirmations</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            {confirmations.filter(c => c.status === "pending").length} Pending
          </Badge>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            {confirmations.filter(c => c.status === "approved").length} Approved
          </Badge>
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            {confirmations.filter(c => c.status === "declined").length} Declined
          </Badge>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Payment Confirmation Requests</CardTitle>
          <CardDescription>
            Review and manage payment confirmation requests from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Status: {filterStatus === "all" ? "All" : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("approved")}>
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("declined")}>
                    Declined
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("username")}
                    >
                      User
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("packageName")}
                    >
                      Package
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("amount")}
                    >
                      Amount
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("submittedAt")}
                    >
                      Submitted
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedConfirmations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No payment confirmations found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedConfirmations.map((confirmation) => (
                    <TableRow key={confirmation.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <div>{confirmation.username}</div>
                            <div className="text-xs text-gray-500">{confirmation.userEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <div>
                            <div>{confirmation.packageName}</div>
                            <div className="text-xs text-gray-500">{confirmation.packageDuration}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${confirmation.amount.toFixed(2)}</TableCell>
                      <TableCell>{confirmation.paymentMethod}</TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">{confirmation.transactionId}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(confirmation.submittedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(confirmation.submittedAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(confirmation.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(confirmation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {confirmation.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprove(confirmation)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDecline(confirmation)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Confirmation Details Dialog */}
      {selectedConfirmation && (
        <PaymentConfirmationDetailsDialog
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          confirmation={selectedConfirmation}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      )}
      
      {/* Approve Confirmation Dialog */}
      {selectedConfirmation && (
        <ApproveConfirmDialog
          isOpen={isApproveOpen}
          onClose={() => {
            setIsApproveOpen(false)
            setAdminComment("")
          }}
          onConfirm={handleApproveConfirm}
          confirmation={selectedConfirmation}
          comment={adminComment}
          onCommentChange={setAdminComment}
          isSubmitting={false} // TODO: Add loading state when implementing API
        />
      )}
      
      {/* Decline Confirmation Dialog */}
      {selectedConfirmation && (
        <DeclineConfirmDialog
          isOpen={isDeclineOpen}
          onClose={() => {
            setIsDeclineOpen(false)
            setAdminComment("")
          }}
          onConfirm={handleDeclineConfirm}
          confirmation={selectedConfirmation}
          comment={adminComment}
          onCommentChange={setAdminComment}
          isSubmitting={false} // TODO: Add loading state when implementing API
        />
      )}
    </div>
  )
}

const grantVIPAccess = async (userId: number, packageDuration: string) => {
  try {
    const response = await fetch('/api/subscriptions/grant-vip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, packageDuration }),
    })
    
    if (!response.ok) throw new Error('Failed to grant VIP access')
    return await response.json()
  } catch (error) {
    console.error('Error granting VIP access:', error)
    throw error
  }
}

const sendNotification = async (userId: number, message: string) => {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, message }),
    })
    
    if (!response.ok) throw new Error('Failed to send notification')
    return await response.json()
  } catch (error) {
    console.error('Error sending notification:', error)
    throw error
  }
}