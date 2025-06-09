'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  MoreHorizontal,
  UserPlus,
  Trash2,
  Download,
  Shield,
  Clock,
  CreditCard,
  Mail,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  UserCog,
  Calendar,
  User,
  Lock,
  Eye,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Textarea } from '@/components/ui/textarea'
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
} from '@/components/ui/alert-dialog'

// Define User type
type User = {
  id: number
  username: string
  email: string
  name: string
  status: string
  subscriptionStatus: string
  subscriptionExpiry: string | null
  joinDate: string
  lastLogin: string
  avatar: string
}

export default function UserManagementPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState('username')
  const [sortDirection, setSortDirection] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [activeTab, setActiveTab] = useState('all')
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isExtendSubscriptionOpen, setIsExtendSubscriptionOpen] = useState(false)
  const [isApplyDiscountOpen, setIsApplyDiscountOpen] = useState(false)
  const [isEmailNotificationOpen, setIsEmailNotificationOpen] = useState(false)

  // Mock user data
  const users = [
    {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      name: 'John Doe',
      status: 'active',
      subscriptionStatus: 'vip',
      subscriptionExpiry: '2023-12-31',
      joinDate: '2022-05-15',
      lastLogin: '2023-06-10 14:30',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 2,
      username: 'jane_smith',
      email: 'jane@example.com',
      name: 'Jane Smith',
      status: 'active',
      subscriptionStatus: 'free',
      subscriptionExpiry: null,
      joinDate: '2022-06-20',
      lastLogin: '2023-06-09 10:15',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 3,
      username: 'mike_wilson',
      email: 'mike@example.com',
      name: 'Mike Wilson',
      status: 'suspended',
      subscriptionStatus: 'expired',
      subscriptionExpiry: '2023-05-31',
      joinDate: '2022-04-10',
      lastLogin: '2023-05-28 09:45',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 4,
      username: 'sarah_johnson',
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      status: 'active',
      subscriptionStatus: 'vip',
      subscriptionExpiry: '2023-12-15',
      joinDate: '2022-07-05',
      lastLogin: '2023-06-10 16:20',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 5,
      username: 'david_brown',
      email: 'david@example.com',
      name: 'David Brown',
      status: 'inactive',
      subscriptionStatus: 'expired',
      subscriptionExpiry: '2023-04-30',
      joinDate: '2022-03-15',
      lastLogin: '2023-04-25 11:30',
      avatar: '/placeholder.svg?height=40&width=40',
    },
  ]

  // Mock subscription history data
  const subscriptionHistory = [
    {
      id: 1,
      userId: 1,
      plan: 'VIP Monthly',
      startDate: '2023-06-01',
      endDate: '2023-12-31',
      amount: '$29.99',
      status: 'active',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_123456789',
    },
    {
      id: 2,
      userId: 1,
      plan: 'VIP Monthly',
      startDate: '2023-01-01',
      endDate: '2023-05-31',
      amount: '$29.99',
      status: 'completed',
      paymentMethod: 'PayPal',
      transactionId: 'txn_987654321',
    },
    {
      id: 3,
      userId: 3,
      plan: 'VIP Monthly',
      startDate: '2023-01-01',
      endDate: '2023-05-31',
      amount: '$29.99',
      status: 'expired',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_567891234',
    },
    {
      id: 4,
      userId: 4,
      plan: 'VIP Yearly',
      startDate: '2022-12-15',
      endDate: '2023-12-15',
      amount: '$299.99',
      status: 'active',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_456789123',
    },
    {
      id: 5,
      userId: 5,
      plan: 'VIP Monthly',
      startDate: '2022-12-01',
      endDate: '2023-04-30',
      amount: '$29.99',
      status: 'expired',
      paymentMethod: 'PayPal',
      transactionId: 'txn_345678912',
    },
  ]

  // Mock user activity data
  const userActivity = [
    {
      id: 1,
      userId: 1,
      action: 'Login',
      timestamp: '2023-06-10 14:30',
      details: 'Logged in from Chrome on Windows',
      ip: '192.168.1.1',
    },
    {
      id: 2,
      userId: 1,
      action: 'Subscription Renewal',
      timestamp: '2023-06-01 10:15',
      details: 'Renewed VIP Monthly subscription',
      ip: '192.168.1.1',
    },
    {
      id: 3,
      userId: 1,
      action: 'Password Change',
      timestamp: '2023-05-20 16:45',
      details: 'Changed account password',
      ip: '192.168.1.1',
    },
    {
      id: 4,
      userId: 2,
      action: 'Login',
      timestamp: '2023-06-09 10:15',
      details: 'Logged in from Safari on macOS',
      ip: '192.168.1.2',
    },
    {
      id: 5,
      userId: 3,
      action: 'Login',
      timestamp: '2023-05-28 09:45',
      details: 'Logged in from Firefox on Windows',
      ip: '192.168.1.3',
    },
  ]

  // Filter users based on search term, status filter, and active tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === 'all' ||
      user.status === filterStatus ||
      user.subscriptionStatus === filterStatus

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'vip' && user.subscriptionStatus === 'vip') ||
      (activeTab === 'free' && user.subscriptionStatus === 'free') ||
      (activeTab === 'expired' && user.subscriptionStatus === 'expired') ||
      (activeTab === 'suspended' && user.status === 'suspended')

    return matchesSearch && matchesFilter && matchesTab
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortColumn === 'username') {
      return sortDirection === 'asc'
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username)
    } else if (sortColumn === 'email') {
      return sortDirection === 'asc'
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email)
    } else if (sortColumn === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status)
    } else if (sortColumn === 'subscriptionStatus') {
      return sortDirection === 'asc'
        ? a.subscriptionStatus.localeCompare(b.subscriptionStatus)
        : b.subscriptionStatus.localeCompare(a.subscriptionStatus)
    } else if (sortColumn === 'joinDate') {
      return sortDirection === 'asc'
        ? new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
        : new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
    }
    return 0
  })

  // Paginate users
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage)

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Handle user selection
  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setIsUserDetailsOpen(true)
  }

  // Handle row selection
  const handleRowSelect = (userId: number) => {
    if (selectedRows.includes(userId)) {
      setSelectedRows(selectedRows.filter((id) => id !== userId))
    } else {
      setSelectedRows([...selectedRows, userId])
    }
  }

  // Handle select all rows
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedUsers.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedUsers.map((user) => user.id))
    }
  }

  // Get user subscription history
  const getUserSubscriptionHistory = (userId: number) => {
    return subscriptionHistory.filter((sub) => sub.userId === userId)
  }

  // Get user activity
  const getUserActivity = (userId: number) => {
    return userActivity.filter((activity) => activity.userId === userId)
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    // In a real app, this would call an API to perform the action
    console.log(`Performing ${action} on users:`, selectedRows)

    // Reset selection after action
    setSelectedRows([])
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
            <BreadcrumbLink href="/admin/users">User Management</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage your platform users and their subscriptions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddUserOpen(true)}
            className="bg-[#1a56db] hover:bg-[#1e40af]"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Tabs for different user views */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-md">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
          <TabsTrigger value="free">Free</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* User Listing Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
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
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                        All Users
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                        Inactive
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('suspended')}>
                        Suspended
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Filter by Subscription</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterStatus('vip')}>
                        VIP
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('free')}>
                        Free
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('expired')}>
                        Expired
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
                        <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction('suspend')}>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Suspend
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={
                            selectedRows.length === paginatedUsers.length &&
                            paginatedUsers.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead className="w-[80px]">Avatar</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('username')}>
                        <div className="flex items-center">
                          Username
                          {sortColumn === 'username' &&
                            (sortDirection === 'asc' ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                        <div className="flex items-center">
                          Email
                          {sortColumn === 'email' &&
                            (sortDirection === 'asc' ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                        <div className="flex items-center">
                          Status
                          {sortColumn === 'status' &&
                            (sortDirection === 'asc' ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort('subscriptionStatus')}
                      >
                        <div className="flex items-center">
                          Subscription
                          {sortColumn === 'subscriptionStatus' &&
                            (sortDirection === 'asc' ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('joinDate')}>
                        <div className="flex items-center">
                          Join Date
                          {sortColumn === 'joinDate' &&
                            (sortDirection === 'asc' ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <Users className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No users found</p>
                            {searchTerm && (
                              <Button
                                variant="link"
                                onClick={() => setSearchTerm('')}
                                className="mt-2"
                              >
                                Clear search
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="w-[40px]">
                            <Checkbox
                              checked={selectedRows.includes(user.id)}
                              onCheckedChange={() => handleRowSelect(user.id)}
                              aria-label={`Select ${user.username}`}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell className="w-[80px]">
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </TableCell>
                          <TableCell className="font-medium" onClick={() => handleUserSelect(user)}>
                            {user.username}
                          </TableCell>
                          <TableCell onClick={() => handleUserSelect(user)}>{user.email}</TableCell>
                          <TableCell onClick={() => handleUserSelect(user)}>
                            <Badge
                              variant={
                                user.status === 'active'
                                  ? 'default'
                                  : user.status === 'inactive'
                                    ? 'secondary'
                                    : 'destructive'
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell onClick={() => handleUserSelect(user)}>
                            <Badge
                              variant={
                                user.subscriptionStatus === 'vip'
                                  ? 'default'
                                  : user.subscriptionStatus === 'free'
                                    ? 'outline'
                                    : 'secondary'
                              }
                            >
                              {user.subscriptionStatus}
                            </Badge>
                          </TableCell>
                          <TableCell onClick={() => handleUserSelect(user)}>
                            {user.joinDate}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleUserSelect(user)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setIsResetPasswordOpen(true)
                                  }}
                                >
                                  <Lock className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                {user.status === 'active' ? (
                                  <DropdownMenuItem onClick={() => handleBulkAction('suspend')}>
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Suspend
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Activate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setIsDeleteConfirmOpen(true)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {paginatedUsers.length} of {filteredUsers.length} users
                  </p>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(parseInt(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">per page</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber =
                        currentPage <= 3
                          ? i + 1
                          : currentPage >= totalPages - 2
                            ? totalPages - 4 + i
                            : currentPage - 2 + i

                      if (pageNumber <= 0 || pageNumber > totalPages) return null

                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? 'default' : 'outline'}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      )
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-muted-foreground">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vip" className="space-y-4">
          {/* VIP users tab content */}
        </TabsContent>
        <TabsContent value="free" className="space-y-4">
          {/* Free users tab content */}
        </TabsContent>
        <TabsContent value="expired" className="space-y-4">
          {/* Expired users tab content */}
        </TabsContent>
        <TabsContent value="suspended" className="space-y-4">
          {/* Suspended users tab content */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
