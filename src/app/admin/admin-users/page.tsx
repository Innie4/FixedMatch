'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  UserCog,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  RefreshCw,
  KeyRound,
  UserPlus,
  Mail,
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

// Define Access Log type
type AccessLog = {
  id: number
  userId: number
  username: string
  action: string
  timestamp: string
  ipAddress: string
  userAgent: string
  status: string
  details?: string
}

export default function AdminUserManagementPage() {
  // State for admin users
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState('username')
  const [sortDirection, setSortDirection] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRole, setFilterRole] = useState('all')

  // State for active tab
  const [activeTab, setActiveTab] = useState('admin-accounts')

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
      description: 'Edits and reviews content, no publishing rights.',
      permissions: ['edit_predictions', 'review_content'],
      usersCount: 1,
      createdBy: 'admin',
      createdAt: '2022-05-01',
      isSystem: false,
    },
    {
      id: 4,
      name: 'Analyst',
      description: 'Provides data analysis and insights for predictions.',
      permissions: ['view_data', 'suggest_predictions'],
      usersCount: 1,
      createdBy: 'admin',
      createdAt: '2022-07-01',
      isSystem: false,
    },
    {
      id: 5,
      name: 'Developer',
      description: 'Manages technical aspects and system development.',
      permissions: ['access_codebase', 'deploy_updates', 'view_logs', 'manage_tech_settings'],
      usersCount: 1,
      createdBy: 'admin',
      createdAt: '2022-02-01',
      isSystem: false,
    },
  ]

  // Mock access logs data
  const accessLogs: AccessLog[] = [
    {
      id: 1,
      userId: 1,
      username: 'admin',
      action: 'Login Success',
      timestamp: '2023-06-10 14:30:00',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      status: 'success',
      details: 'Admin user logged in from new IP address.',
    },
    {
      id: 2,
      userId: 2,
      username: 'john.manager',
      action: 'Update Prediction',
      timestamp: '2023-06-09 11:30:00',
      ipAddress: '192.168.1.5',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      status: 'success',
      details: 'Updated prediction ID 123.',
    },
    {
      id: 3,
      userId: 1,
      username: 'admin',
      action: 'Failed Login Attempt',
      timestamp: '2023-06-08 09:00:00',
      ipAddress: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/114.0',
      status: 'failed',
      details: 'Incorrect password entered.',
    },
    {
      id: 4,
      userId: 3,
      username: 'sarah.editor',
      action: 'View Logs',
      timestamp: '2023-06-08 17:15:00',
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
      status: 'success',
    },
  ]

  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = searchTerm === '' || user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesStatus && matchesRole
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortColumn as keyof AdminUser]
    const bValue = b[sortColumn as keyof AdminUser]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    } else {
      return 0
    }
  })

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleRowSelect = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedUsers.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedUsers.map(user => user.id))
    }
  }

  const handleViewUserDetails = (user: AdminUser) => {
    setSelectedUser(user)
  }

  const handleAddUser = () => {
    setSelectedUser(null)
  }

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user)
  }

  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user)
  }

  const handleDeleteConfirm = () => {
    console.log('Deleting user:', selectedUser?.id)
    setSelectedUser(null)
  }

  const handleRoleDetails = (role: Role) => {
    // setSelectedRole(role) // Removed selectedRole state
    // setIsRoleDetailsOpen(true)
  }

  const handleAddRole = () => {
    // setSelectedRole(null) // Removed selectedRole state
    // setIsAddRoleOpen(true)
  }

  const handleEditRole = (role: Role) => {
    // setSelectedRole(role) // Removed selectedRole state
    // setIsEditRoleOpen(true)
  }

  const handle2FASetup = (user: AdminUser) => {
    setSelectedUser(user)
    // setIs2FASetupOpen(true)
  }

  const handleExportLogs = () => {
    console.log('Exporting logs...')
  }

  const handleTransferResponsibilities = (user: AdminUser) => {
    setSelectedUser(user)
    // setIsTransferResponsibilitiesOpen(true)
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/admin-users">User Management</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin User Management</h1>

      <Tabs defaultValue="admin-accounts" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="admin-accounts">Admin Accounts</TabsTrigger>
          <TabsTrigger value="roles-permissions">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="admin-accounts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Admin Accounts</CardTitle>
              <CardDescription>View, add, edit, and delete administrator accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddUser} className="w-full md:w-auto">
                  <UserPlus className="mr-2 h-4 w-4" /> Add New User
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedRows.length === paginatedUsers.length && paginatedUsers.length > 0}
                        onCheckedChange={handleSelectAll}
                        disabled={paginatedUsers.length === 0}
                      />
                    </TableHead>
                    <TableHead className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('username')}>Username {sortColumn === 'username' && (sortDirection === 'asc' ? <ArrowUpDown className="inline h-4 w-4 ml-1" /> : <ArrowUpDown className="inline h-4 w-4 ml-1 transform rotate-180" />)}</TableHead>
                    <TableHead className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('email')}>Email</TableHead>
                    <TableHead className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('role')}>Role</TableHead>
                    <TableHead className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('status')}>Status</TableHead>
                    <TableHead className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('lastLogin')}>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(user.id)}
                            onCheckedChange={() => handleRowSelect(user.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Image
                              src={user.avatar}
                              alt={user.username}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            {user.username}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
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
                                <KeyRound className="mr-2 h-4 w-4" /> {user.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTransferResponsibilities(user)}>
                                <UserCog className="mr-2 h-4 w-4" /> Transfer Responsibilities
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No admin users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles-permissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Roles & Permissions</CardTitle>
              <CardDescription>Define roles and their permissions for administrator accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleAddRole} className="mb-4">
                <UserPlus className="mr-2 h-4 w-4" /> Add New Role
              </Button>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('name')}>Role Name {sortColumn === 'name' && (sortDirection === 'asc' ? <ArrowUpDown className="inline h-4 w-4 ml-1" /> : <ArrowUpDown className="inline h-4 w-4 ml-1 transform rotate-180" />)}</TableHead>
                    <TableHead className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('usersCount')}>Users</TableHead>
                    <TableHead className="cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('createdBy')}>Created By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.length > 0 ? (
                    roles.map(role => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.usersCount}</TableCell>
                        <TableCell>{role.createdBy}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleRoleDetails(role)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditRole(role)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Role
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No roles found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
