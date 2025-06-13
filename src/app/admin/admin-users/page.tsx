'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  UserCog,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  ArrowUpDown,
  KeyRound,
  UserPlus,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
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

// Define Admin User type
type AdminUser = {
  id: number
  username: string
  email: string
  name: string
  role: string
  status: string
  lastLogin: string
  lastActivity: string
  createdAt: string
  avatar: string
  twoFactorEnabled: boolean
  notes?: string
  contactPhone?: string
}

// Define Role type
type Role = {
  id: number
  name: string
  description: string
  permissions: string[]
  usersCount: number
  createdBy: string
  createdAt: string
  isSystem: boolean
}

export default function AdminUserManagementPage() {
  // State for admin users
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState<keyof AdminUser>('username')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false)

  // Mock admin users data
  const adminUsers: AdminUser[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      name: 'System Administrator',
      role: 'Super Admin',
      status: 'active',
      lastLogin: '2023-06-10 14:30',
      lastActivity: '2023-06-10 15:45',
      createdAt: '2022-01-01',
      avatar: '/placeholder.svg?height=40&width=40',
      twoFactorEnabled: true,
      notes: 'Main system administrator account',
      contactPhone: '+1234567890',
    },
    {
      id: 2,
      username: 'john.manager',
      email: 'john@example.com',
      name: 'John Smith',
      role: 'Content Manager',
      status: 'active',
      lastLogin: '2023-06-09 10:15',
      lastActivity: '2023-06-09 11:30',
      createdAt: '2022-03-15',
      avatar: '/placeholder.svg?height=40&width=40',
      twoFactorEnabled: true,
      contactPhone: '+1987654321',
    },
    {
      id: 3,
      username: 'sarah.editor',
      email: 'sarah@example.com',
      name: 'Sarah Brown',
      role: 'Editor',
      status: 'active',
      lastLogin: '2023-06-08 16:00',
      lastActivity: '2023-06-08 17:15',
      createdAt: '2022-05-20',
      avatar: '/placeholder.svg?height=40&width=40',
      twoFactorEnabled: false,
    },
    {
      id: 4,
      username: 'guest.analyst',
      email: 'guest@example.com',
      name: 'Guest Analyst',
      role: 'Analyst',
      status: 'inactive',
      lastLogin: '2023-06-05 09:00',
      lastActivity: '2023-06-05 10:00',
      createdAt: '2022-07-10',
      avatar: '/placeholder.svg?height=40&width=40',
      twoFactorEnabled: false,
    },
    {
      id: 5,
      username: 'dev.support',
      email: 'dev@example.com',
      name: 'Dev Support',
      role: 'Developer',
      status: 'active',
      lastLogin: '2023-06-10 09:30',
      lastActivity: '2023-06-10 10:00',
      createdAt: '2022-02-01',
      avatar: '/placeholder.svg?height=40&width=40',
      twoFactorEnabled: true,
    },
  ]

  // Mock roles data
  const roles: Role[] = [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full administrative access to all features.',
      permissions: ['manage_users', 'manage_roles', 'manage_content', 'view_logs', 'manage_settings'],
      usersCount: 1,
      createdBy: 'System',
      createdAt: '2022-01-01',
      isSystem: true,
    },
    {
      id: 2,
      name: 'Content Manager',
      description: 'Manages predictions, matches, and VIP content.',
      permissions: ['create_predictions', 'edit_predictions', 'publish_content', 'manage_vip'],
      usersCount: 1,
      createdBy: 'admin',
      createdAt: '2022-03-01',
      isSystem: false,
    },
    {
      id: 3,
      name: 'Editor',
      description: 'Manages predictions and basic content.',
      permissions: ['create_predictions', 'edit_predictions', 'publish_content'],
      usersCount: 1,
      createdBy: 'admin',
      createdAt: '2022-05-01',
      isSystem: false,
    },
    {
      id: 4,
      name: 'Analyst',
      description: 'Views analytics and reports.',
      permissions: ['view_analytics', 'view_reports'],
      usersCount: 1,
      createdBy: 'admin',
      createdAt: '2022-07-01',
      isSystem: false,
    },
    {
      id: 5,
      name: 'Developer',
      description: 'Provides technical support and development.',
      permissions: ['manage_users', 'view_logs', 'technical_support'],
      usersCount: 1,
      createdBy: 'System',
      createdAt: '2022-02-01',
      isSystem: false,
    },
  ]

  // Filter and sort users
  const filteredUsers = adminUsers
    .filter((user) => {
      const matchesSearch =
        searchTerm === '' ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus
      const matchesRole = filterRole === 'all' || user.role === filterRole
      return matchesSearch && matchesStatus && matchesRole
    })
    .sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  const handleSort = (column: keyof AdminUser) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleRowSelect = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((rowId) => rowId !== id) : [...prevSelected, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedUsers.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedUsers.map((user) => user.id))
    }
  }

  const handleViewUserDetails = (user: AdminUser) => {
    setSelectedUser(user)
    setIsUserDetailsOpen(true)
  }

  const handleAddUser = () => {
    setSelectedUser(null) // Clear any selected user for adding a new one
    // Open add user dialog
  }

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user) // Set user for editing
    // Open edit user dialog
  }

  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user) // Set user for deletion
    // Open delete confirmation dialog
  }

  const handleRoleDetails = (roleData: Role) => {
    // console.log('View Role Details:', roleData);
  }

  const handleAddRole = () => {
    // Open add role dialog
  }

  const handleEditRole = (roleData: Role) => {
    // Open edit role dialog
  }

  const handle2FASetup = (user: AdminUser) => {
    // console.log('Setup 2FA for:', user);
  }

  const handleTransferResponsibilities = (user: AdminUser) => {
    // console.log('Transfer responsibilities for:', user);
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/users">Admin Users</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-6 w-6" /> Admin User Management
          </CardTitle>
          <CardDescription>Manage your internal administrative users and their roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddUser} className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Add User
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">
                  <Checkbox
                    checked={selectedRows.length === paginatedUsers.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead onClick={() => handleSort('username')} className="cursor-pointer">
                  Username {sortColumn === 'username' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                  Email {sortColumn === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('role')} className="cursor-pointer">
                  Role {sortColumn === 'role' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                  Status {sortColumn === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('lastLogin')} className="cursor-pointer hidden md:table-cell">
                  Last Login {sortColumn === 'lastLogin' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedRows.includes(user.id)}
                        onCheckedChange={() => handleRowSelect(user.id)}
                      />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === 'active'
                            ? 'default'
                            : user.status === 'suspended'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handle2FASetup(user)}>
                            <KeyRound className="mr-2 h-4 w-4" /> Setup 2FA
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div>
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
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
            <Select
              value={String(itemsPerPage)}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="10 per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog (Placeholder) */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View the full profile and details of {selectedUser?.name || 'this user'}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedUser ? (
              <div className="space-y-2">
                <p><strong>Username:</strong> {selectedUser.username}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Status:</strong> {selectedUser.status}</p>
                <p><strong>Last Login:</strong> {selectedUser.lastLogin}</p>
                <p><strong>Created At:</strong> {selectedUser.createdAt}</p>
                {selectedUser.notes && <p><strong>Notes:</strong> {selectedUser.notes}</p>}
                {selectedUser.contactPhone && <p><strong>Phone:</strong> {selectedUser.contactPhone}</p>}
              </div>
            ) : (
              <p>No user selected.</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsUserDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog (Placeholder) */}
      <Dialog>
        <DialogTrigger asChild>
          {/* This trigger will be connected to the handleAddUser function */}
          {/* <Button variant="outline">Add User</Button> */}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new admin user.
            </DialogDescription>
          </DialogHeader>
          {/* Add your form for adding a user here */}
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Sheet (Placeholder) */}
      <Sheet>
        <SheetTrigger asChild>
          {/* This trigger will be connected to the handleEditUser function */}
          {/* <Button variant="outline">Edit User</Button> */}
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Make changes to {selectedUser?.name || 'the selected user'} here.
            </SheetDescription>
          </SheetHeader>
          {/* Add your form for editing a user here */}
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete User Confirmation Dialog (Placeholder) */}
      <Dialog>
        <DialogTrigger asChild>
          {/* This trigger will be connected to the handleDeleteUser function */}
          {/* <Button variant="destructive">Delete User</Button> */}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              <strong> {selectedUser?.name || 'selected user'}</strong> account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
