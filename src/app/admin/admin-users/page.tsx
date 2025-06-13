'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  UserCog,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  KeyRound,
  UserPlus,
  ArrowUpDown,
  Search,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
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

export default function AdminUserManagementPage() {
  // State for admin users
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [sortColumn, setSortColumn] = useState<keyof AdminUser>('username')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')

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
      createdAt: '2022-03-15',
      isSystem: false,
    },
    {
      id: 3,
      name: 'Editor',
      description: 'Manages blog posts and editorial content.',
      permissions: ['create_posts', 'edit_posts', 'publish_posts'],
      usersCount: 1,
      createdBy: 'admin',
      createdAt: '2022-05-20',
      isSystem: false,
    },
    {
      id: 4,
      name: 'Analyst',
      description: 'Views reports and analytics data.',
      permissions: ['view_reports', 'view_analytics'],
      usersCount: 1,
      createdBy: 'admin',
      createdAt: '2022-07-10',
      isSystem: false,
    },
    {
      id: 5,
      name: 'Developer',
      description: 'Provides technical support and development.',
      permissions: ['access_logs', 'manage_code', 'debug_issues'],
      usersCount: 1,
      createdBy: 'admin',
      createdAt: '2022-02-01',
      isSystem: false,
    },
  ]

  // Filtered and paginated data
  const filteredUsers = adminUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const paginatedUsers = filteredUsers.slice(
    0,
    10,
  )

  // Handlers
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
      prevSelected.includes(id) ? prevSelected.filter((rowId) => rowId !== id) : [...prevSelected, id],
    )
  }

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedUsers.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedUsers.map((user) => user.id))
    }
  }

  const handleAddUser = () => {
    // Logic for adding a new user
    console.log('Add new user')
  }

  const handleEditUser = (user: AdminUser) => {
    // Logic for editing a user
    console.log('Edit user:', user)
  }

  const handleDeleteUser = (user: AdminUser) => {
    // Logic for deleting a user
    console.log('Delete user:', user)
  }

  const handle2FASetup = () => {
    // Logic for 2FA setup
    console.log('Setup 2FA for user')
  }

  const handleTransferResponsibilities = () => {
    // Logic for transferring responsibilities
    console.log('Transfer responsibilities for user')
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href="#">Dashboard</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href="#">Users</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href="#">Admin Users</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleAddUser}>
            <UserPlus className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Admin User
            </span>
          </Button>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>Manage your administrative users.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Checkbox
                          checked={selectedRows.length === paginatedUsers.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead onClick={() => handleSort('username')}>
                        Username
                        {sortColumn === 'username' && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('email')}>
                        Email
                        {sortColumn === 'email' && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('role')}>
                        Role
                        {sortColumn === 'role' && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </TableHead>
                      <TableHead onClick={() => handleSort('status')}>
                        Status
                        {sortColumn === 'status' && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </TableHead>
                      <TableHead className="hidden md:table-cell"
                        onClick={() => handleSort('lastLogin')}>
                        Last Login
                        {sortColumn === 'lastLogin' && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(user.id)}
                            onCheckedChange={() => handleRowSelect(user.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Image
                              src={user.avatar || '/placeholder.svg'}
                              alt={user.username}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            {user.username}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.lastLogin}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => console.log('View user details:', user)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handle2FASetup}>
                                <KeyRound className="mr-2 h-4 w-4" /> 2FA Setup
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handleTransferResponsibilities}>
                                <UserCog className="mr-2 h-4 w-4" /> Transfer Responsibilities
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
            <Card x-chunk="dashboard-05-chunk-4">
              <CardHeader className="px-7 pb-3">
                <CardTitle>Roles</CardTitle>
                <CardDescription>Manage user roles and permissions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          {role.name}
                          {role.isSystem && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              System
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{role.usersCount}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => console.log('View role details:', role)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              {!role.isSystem && (
                                <DropdownMenuItem onClick={() => console.log('Edit role:', role)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit Role
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => console.log('Add new role')}>
                  <UserPlus className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add New Role
                  </span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
