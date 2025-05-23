"use client"

import { useState } from "react"
import Image from "next/image"
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
  Mail
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
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


// Define Admin User type
type AdminUser = {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  status: string;
  lastLogin: string;
  lastActivity: string;
  createdAt: string;
  avatar: string;
  twoFactorEnabled: boolean;
  notes?: string;
  contactPhone?: string;
}

// Define Role type
type Role = {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  usersCount: number;
  createdBy: string;
  createdAt: string;
  isSystem: boolean;
}

// Define Access Log type
type AccessLog = {
  id: number;
  userId: number;
  username: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: string;
  details?: string;
}

export default function AdminUserManagementPage() {
  // State for admin users
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isTransferResponsibilitiesOpen, setIsTransferResponsibilitiesOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState("username")
  const [sortDirection, setSortDirection] = useState("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRole, setFilterRole] = useState("all")
  
  // State for roles
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isRoleDetailsOpen, setIsRoleDetailsOpen] = useState(false)
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  
  // State for 2FA
  const [is2FASetupOpen, setIs2FASetupOpen] = useState(false)
  const [is2FABackupCodesOpen, setIs2FABackupCodesOpen] = useState(false)
  const [isDeviceManagementOpen, setIsDeviceManagementOpen] = useState(false)
  
  // State for access logs
  const [logFilterUser, setLogFilterUser] = useState("all")
  const [logFilterAction, setLogFilterAction] = useState("all")
  const [logFilterDateRange, setLogFilterDateRange] = useState("all")
  const [isExportLogsOpen, setIsExportLogsOpen] = useState(false)
  
  // State for active tab
  const [activeTab, setActiveTab] = useState("admin-accounts")
  
  // Mock admin users data
  const adminUsers: AdminUser[] = [
    {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      name: "System Administrator",
      role: "Super Admin",
      status: "active",
      lastLogin: "2023-06-10 14:30",
      lastActivity: "2023-06-10 15:45",
      createdAt: "2022-01-01",
      avatar: "/placeholder.svg?height=40&width=40",
      twoFactorEnabled: true,
      notes: "Main system administrator account",
      contactPhone: "+1234567890"
    },
    {
      id: 2,
      username: "john.manager",
      email: "john@example.com",
      name: "John Smith",
      role: "Content Manager",
      status: "active",
      lastLogin: "2023-06-09 10:15",
      lastActivity: "2023-06-09 11:30",
      createdAt: "2022-03-15",
      avatar: "/placeholder.svg?height=40&width=40",
      twoFactorEnabled: true,
      contactPhone: "+1987654321"
    },
    {
      id: 3,
      username: "sarah.editor",
      email: "sarah@example.com",
      name: "Sarah Johnson",
      role: "Editor",
      status: "active",
      lastLogin: "2023-06-08 09:45",
      lastActivity: "2023-06-08 12:30",
      createdAt: "2022-05-20",
      avatar: "/placeholder.svg?height=40&width=40",
      twoFactorEnabled: false
    },
    {
      id: 4,
      username: "mike.support",
      email: "mike@example.com",
      name: "Mike Wilson",
      role: "Support Agent",
      status: "inactive",
      lastLogin: "2023-05-28 14:20",
      lastActivity: "2023-05-28 16:45",
      createdAt: "2022-06-10",
      avatar: "/placeholder.svg?height=40&width=40",
      twoFactorEnabled: false,
      notes: "On leave until July 15th"
    },
    {
      id: 5,
      username: "david.analyst",
      email: "david@example.com",
      name: "David Brown",
      role: "Data Analyst",
      status: "active",
      lastLogin: "2023-06-10 08:30",
      lastActivity: "2023-06-10 13:15",
      createdAt: "2022-08-05",
      avatar: "/placeholder.svg?height=40&width=40",
      twoFactorEnabled: true
    }
  ]
  
  // Mock roles data
  const roles: Role[] = [
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access with all permissions",
      permissions: ["all"],
      usersCount: 1,
      createdBy: "System",
      createdAt: "2022-01-01",
      isSystem: true
    },
    {
      id: 2,
      name: "Content Manager",
      description: "Manage all content including predictions and VIP content",
      permissions: ["predictions.manage", "vip-content.manage", "reviews.manage", "users.view"],
      usersCount: 1,
      createdBy: "admin",
      createdAt: "2022-03-10",
      isSystem: false
    },
    {
      id: 3,
      name: "Editor",
      description: "Edit and publish content",
      permissions: ["predictions.edit", "vip-content.edit", "reviews.edit"],
      usersCount: 1,
      createdBy: "admin",
      createdAt: "2022-05-15",
      isSystem: false
    },
    {
      id: 4,
      name: "Support Agent",
      description: "Handle user support and manage reviews",
      permissions: ["users.view", "reviews.manage", "reviews.respond"],
      usersCount: 1,
      createdBy: "admin",
      createdAt: "2022-06-05",
      isSystem: false
    },
    {
      id: 5,
      name: "Data Analyst",
      description: "View and analyze system data and performance",
      permissions: ["dashboard.view", "reports.view", "analytics.view"],
      usersCount: 1,
      createdBy: "admin",
      createdAt: "2022-08-01",
      isSystem: false
    }
  ]
  
  // Mock access logs data
  const accessLogs: AccessLog[] = [
    {
      id: 1,
      userId: 1,
      username: "admin",
      action: "Login",
      timestamp: "2023-06-10 14:30",
      ipAddress: "192.168.1.1",
      userAgent: "Chrome/Windows",
      status: "success"
    },
    {
      id: 2,
      userId: 1,
      username: "admin",
      action: "Settings Update",
      timestamp: "2023-06-10 15:45",
      ipAddress: "192.168.1.1",
      userAgent: "Chrome/Windows",
      status: "success",
      details: "Updated payment gateway settings"
    },
    {
      id: 3,
      userId: 2,
      username: "john.manager",
      action: "Login",
      timestamp: "2023-06-09 10:15",
      ipAddress: "192.168.1.2",
      userAgent: "Firefox/macOS",
      status: "success"
    },
    {
      id: 4,
      userId: 2,
      username: "john.manager",
      action: "Content Create",
      timestamp: "2023-06-09 11:30",
      ipAddress: "192.168.1.2",
      userAgent: "Firefox/macOS",
      status: "success",
      details: "Created new prediction"
    },
    {
      id: 5,
      userId: 3,
      username: "sarah.editor",
      action: "Login",
      timestamp: "2023-06-08 09:45",
      ipAddress: "192.168.1.3",
      userAgent: "Safari/iOS",
      status: "success"
    },
    {
      id: 6,
      userId: 4,
      username: "mike.support",
      action: "Login",
      timestamp: "2023-05-28 14:20",
      ipAddress: "192.168.1.4",
      userAgent: "Chrome/Android",
      status: "success"
    },
    {
      id: 7,
      userId: 5,
      username: "david.analyst",
      action: "Login",
      timestamp: "2023-06-10 08:30",
      ipAddress: "192.168.1.5",
      userAgent: "Edge/Windows",
      status: "success"
    },
    {
      id: 8,
      userId: 3,
      username: "sarah.editor",
      action: "Content Edit",
      timestamp: "2023-06-08 10:30",
      ipAddress: "192.168.1.3",
      userAgent: "Safari/iOS",
      status: "success",
      details: "Edited prediction #123"
    },
    {
      id: 9,
      userId: 5,
      username: "david.analyst",
      action: "Report Export",
      timestamp: "2023-06-10 11:45",
      ipAddress: "192.168.1.5",
      userAgent: "Edge/Windows",
      status: "success",
      details: "Exported user activity report"
    },
    {
      id: 10,
      userId: 0,
      username: "unknown",
      action: "Login",
      timestamp: "2023-06-09 22:15",
      ipAddress: "203.0.113.42",
      userAgent: "Chrome/Windows",
      status: "failed",
      details: "Invalid credentials"
    }
  ]
  
  // Filter admin users based on search term, status filter, and role filter
  const filteredAdminUsers = adminUsers.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" || 
      user.status === filterStatus;
      
    const matchesRole = 
      filterRole === "all" || 
      user.role === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });
  
  // Sort admin users
  const sortedAdminUsers = [...filteredAdminUsers].sort((a, b) => {
    if (sortColumn === "username") {
      return sortDirection === "asc" 
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username);
    } else if (sortColumn === "lastLogin") {
      return sortDirection === "asc" 
        ? new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()
        : new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
    } else if (sortColumn === "role") {
      return sortDirection === "asc" 
        ? a.role.localeCompare(b.role)
        : b.role.localeCompare(a.role);
    }
    return 0;
  });
  
  // Filter access logs
  const filteredAccessLogs = accessLogs.filter(log => {
    const matchesUser = 
      logFilterUser === "all" || 
      log.userId.toString() === logFilterUser;
    
    const matchesAction = 
      logFilterAction === "all" || 
      log.action === logFilterAction;
      
    // For date range filtering, we would implement actual date comparison
    // This is simplified for the mock
    const matchesDateRange = true;
    
    return matchesUser && matchesAction && matchesDateRange;
  });
  
  // Pagination for admin users
  const paginatedAdminUsers = sortedAdminUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };
  
  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  // Handle row selection
  const handleRowSelect = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === filteredAdminUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredAdminUsers.map(user => user.id));
    }
  };
  
  // Handle view user details
  const handleViewUserDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };
  
  // Handle add new admin user
  const handleAddUser = () => {
    setIsAddUserOpen(true);
  };
  
  // Handle edit user
  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsAddUserOpen(true);
  };
  
  // Handle delete user
  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteConfirmOpen(true);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    console.log(`Deleting user: ${selectedUser?.username}`);
    setIsDeleteConfirmOpen(false);
    // In a real app, you would call an API to delete the user
  };
  
  // Handle role details
  const handleRoleDetails = (role: Role) => {
    setSelectedRole(role);
    setIsRoleDetailsOpen(true);
  };
  
  // Handle add role
  const handleAddRole = () => {
    setIsAddRoleOpen(true);
  };
  
  // Handle edit role
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditRoleOpen(true);
  };
  
  // Handle 2FA setup
  const handle2FASetup = (user: AdminUser) => {
    setSelectedUser(user);
    setIs2FASetupOpen(true);
  };
  
  // Handle export logs
  const handleExportLogs = () => {
    setIsExportLogsOpen(true);
  };
  
  // Handle transfer responsibilities
  const handleTransferResponsibilities = (user: AdminUser) => {
    setSelectedUser(user);
    setIsTransferResponsibilitiesOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/admin-users">Admin User Management</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold tracking-tight">Admin User Management</h1>
          <p className="text-muted-foreground">
            Manage administrator accounts, roles, permissions, and access logs.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={handleAddUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Admin User
          </Button>
        </div>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="admin-accounts" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="admin-accounts">
            <UserCog className="h-4 w-4 mr-2" />
            Admin Accounts
          </TabsTrigger>
          </TabsList>
        
        {/* Admin Accounts Tab */}
        <TabsContent value="admin-accounts" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search admin users..."
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
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                    Active Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                    Inactive Only
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterRole("all")}>
                    All Roles
                  </DropdownMenuItem>
                  {roles.map((role) => (
                    <DropdownMenuItem 
                      key={role.id} 
                      onClick={() => setFilterRole(role.name)}
                    >
                      {role.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {selectedRows.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions ({selectedRows.length})
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Activate Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <XCircle className="mr-2 h-4 w-4" />
                    Deactivate Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {/* Admin Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox 
                      checked={selectedRows.length === filteredAdminUsers.length && filteredAdminUsers.length > 0} 
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>2FA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAdminUsers.length > 0 ? (
                  paginatedAdminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedRows.includes(user.id)} 
                          onCheckedChange={() => handleRowSelect(user.id)}
                          aria-label={`Select ${user.username}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "Super Admin" ? "default" : "outline"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "secondary" : "outline"}>
                          {user.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        {user.twoFactorEnabled ? (
                          <Badge variant="secondary">Enabled</Badge>
                        ) : (
                          <Badge variant="outline">Disabled</Badge>
                        )}
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
                            <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handle2FASetup(user)}>
                              <KeyRound className="mr-2 h-4 w-4" />
                              Manage 2FA
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleTransferResponsibilities(user)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Transfer Responsibilities
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No admin users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          {/* Admin Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox 
                      checked={selectedRows.length === filteredAdminUsers.length && filteredAdminUsers.length > 0} 
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>2FA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAdminUsers.length > 0 ? (
                  paginatedAdminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedRows.includes(user.id)} 
                          onCheckedChange={() => handleRowSelect(user.id)}
                          aria-label={`Select ${user.username}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "Super Admin" ? "default" : "outline"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "secondary" : "outline"}>
                          {user.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        {user.twoFactorEnabled ? (
                          <Badge variant="secondary">Enabled</Badge>
                        ) : (
                          <Badge variant="outline">Disabled</Badge>
                        )}
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
                            <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handle2FASetup(user)}>
                              <KeyRound className="mr-2 h-4 w-4" />
                              Manage 2FA
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleTransferResponsibilities(user)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Transfer Responsibilities
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No admin users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Access Logs Tab */}
        <TabsContent value="access-logs" className="space-y-4">
          {/* Admin Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox 
                      checked={selectedRows.length === filteredAdminUsers.length && filteredAdminUsers.length > 0} 
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>2FA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAdminUsers.length > 0 ? (
                  paginatedAdminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedRows.includes(user.id)} 
                          onCheckedChange={() => handleRowSelect(user.id)}
                          aria-label={`Select ${user.username}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "Super Admin" ? "default" : "outline"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "secondary" : "outline"}>
                          {user.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        {user.twoFactorEnabled ? (
                          <Badge variant="secondary">Enabled</Badge>
                        ) : (
                          <Badge variant="outline">Disabled</Badge>
                        )}
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
                            <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handle2FASetup(user)}>
                              <KeyRound className="mr-2 h-4 w-4" />
                              Manage 2FA
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleTransferResponsibilities(user)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Transfer Responsibilities
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No admin users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          {/* Admin Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox 
                      checked={selectedRows.length === filteredAdminUsers.length && filteredAdminUsers.length > 0} 
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>2FA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAdminUsers.length > 0 ? (
                  paginatedAdminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedRows.includes(user.id)} 
                          onCheckedChange={() => handleRowSelect(user.id)}
                          aria-label={`Select ${user.username}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "Super Admin" ? "default" : "outline"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "secondary" : "outline"}>
                          {user.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        {user.twoFactorEnabled ? (
                          <Badge variant="secondary">Enabled</Badge>
                        ) : (
                          <Badge variant="outline">Disabled</Badge>
                        )}
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
                            <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handle2FASetup(user)}>
                              <KeyRound className="mr-2 h-4 w-4" />
                              Manage 2FA
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleTransferResponsibilities(user)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Transfer Responsibilities
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No admin users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}