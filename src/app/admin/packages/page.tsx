'use client'

import { useState } from 'react'
import {
  Package,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  ArrowUpDown,
  Plus,
  DollarSign,
  Users,
  Globe,
  Calendar,
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { PackageFormDialog } from './components/PackageFormDialog'
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog'
import { PackageDetailsDialog } from './components/PackageDetailsDialog'

interface SubscriptionPackage {
  id: number
  name: string
  description: string
  durations: {
    twoWeeks: { price: number; enabled: boolean }
    oneMonth: { price: number; enabled: boolean }
    threeMonths: { price: number; enabled: boolean }
    sixMonths: { price: number; enabled: boolean }
  }
  countries: string[] // Country codes, empty array means global
  status: 'active' | 'inactive'
  subscribers: number
  revenue: number
  createdAt: string
  updatedAt: string
}

export default function PackageManagementPage() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([
    {
      id: 1,
      name: 'Daily 2 Odds',
      description: 'Daily predictions with 2+ odds',
      durations: {
        twoWeeks: { price: 15, enabled: true },
        oneMonth: { price: 25, enabled: true },
        threeMonths: { price: 65, enabled: true },
        sixMonths: { price: 120, enabled: true },
      },
      countries: [], // Global
      status: 'active',
      subscribers: 245,
      revenue: 6125,
      createdAt: '2023-01-15',
      updatedAt: '2023-06-10',
    },
    {
      id: 2,
      name: 'Daily 10 Odds',
      description: 'High odds daily predictions',
      durations: {
        twoWeeks: { price: 35, enabled: true },
        oneMonth: { price: 60, enabled: true },
        threeMonths: { price: 150, enabled: true },
        sixMonths: { price: 280, enabled: true },
      },
      countries: ['US', 'UK', 'CA'],
      status: 'active',
      subscribers: 128,
      revenue: 7680,
      createdAt: '2023-02-20',
      updatedAt: '2023-06-08',
    },
    {
      id: 3,
      name: 'Draw Odds',
      description: 'Specialized draw predictions',
      durations: {
        twoWeeks: { price: 20, enabled: true },
        oneMonth: { price: 35, enabled: true },
        threeMonths: { price: 90, enabled: false },
        sixMonths: { price: 160, enabled: false },
      },
      countries: ['NG', 'GH', 'KE'],
      status: 'inactive',
      subscribers: 89,
      revenue: 3115,
      createdAt: '2023-03-10',
      updatedAt: '2023-05-15',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCountry, setFilterCountry] = useState('all')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Dialog states
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false)
  const [isEditPackageOpen, setIsEditPackageOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isPackageDetailsOpen, setIsPackageDetailsOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null)

  // Filter and sort packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || pkg.status === filterStatus
    const matchesCountry =
      filterCountry === 'all' ||
      (filterCountry === 'global' && pkg.countries.length === 0) ||
      pkg.countries.includes(filterCountry)
    return matchesSearch && matchesStatus && matchesCountry
  })

  const sortedPackages = [...filteredPackages].sort((a, b) => {
    const aValue = a[sortColumn as keyof SubscriptionPackage]
    const bValue = b[sortColumn as keyof SubscriptionPackage]
    const direction = sortDirection === 'asc' ? 1 : -1

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * direction
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * direction
    }
    return 0
  })

  const paginatedPackages = sortedPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(sortedPackages.length / itemsPerPage)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedPackages.map((pkg) => pkg.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id])
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    }
  }

  const handleEdit = (pkg: SubscriptionPackage) => {
    setSelectedPackage(pkg)
    setIsEditPackageOpen(true)
  }

  const handleDelete = (pkg: SubscriptionPackage) => {
    setSelectedPackage(pkg)
    setIsDeleteConfirmOpen(true)
  }

  const handleView = (pkg: SubscriptionPackage) => {
    setSelectedPackage(pkg)
    setIsPackageDetailsOpen(true)
  }

  const confirmDelete = () => {
    if (selectedPackage) {
      setPackages(packages.filter((pkg) => pkg.id !== selectedPackage.id))
      setIsDeleteConfirmOpen(false)
      setSelectedPackage(null)
    }
  }

  const handleSavePackage = (
    packageData: Omit<
      SubscriptionPackage,
      'id' | 'subscribers' | 'revenue' | 'createdAt' | 'updatedAt'
    >
  ) => {
    if (selectedPackage) {
      // Edit existing package
      setPackages(
        packages.map((pkg) =>
          pkg.id === selectedPackage.id
            ? { ...pkg, ...packageData, updatedAt: new Date().toISOString().split('T')[0] }
            : pkg
        )
      )
    } else {
      // Add new package
      const newPackage: SubscriptionPackage = {
        ...packageData,
        id: Math.max(...packages.map((p) => p.id)) + 1,
        subscribers: 0,
        revenue: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
      setPackages([...packages, newPackage])
    }
    setIsAddPackageOpen(false)
    setIsEditPackageOpen(false)
    setSelectedPackage(null)
  }

  const getCountryDisplay = (countries: string[]) => {
    if (countries.length === 0) return 'Global'
    if (countries.length <= 3) return countries.join(', ')
    return `${countries.slice(0, 3).join(', ')} +${countries.length - 3}`
  }

  const getLowestPrice = (durations: SubscriptionPackage['durations']) => {
    const enabledPrices = Object.values(durations)
      .filter((d) => d.enabled)
      .map((d) => d.price)
    return enabledPrices.length > 0 ? Math.min(...enabledPrices) : 0
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Package Management</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Package Management</h1>
          <p className="text-muted-foreground">Create and manage subscription packages</p>
        </div>
        <Button onClick={() => setIsAddPackageOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Package
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{packages.length}</div>
            <p className="text-xs text-muted-foreground">
              {packages.filter((p) => p.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {packages.reduce((sum, pkg) => sum + pkg.subscribers, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all packages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${packages.reduce((sum, pkg) => sum + pkg.revenue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Packages</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {packages.filter((p) => p.countries.length === 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Available worldwide</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Packages</CardTitle>
          <CardDescription>Manage your subscription packages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4 mb-4">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="NG">Nigeria</SelectItem>
                  <SelectItem value="GH">Ghana</SelectItem>
                  <SelectItem value="KE">Kenya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedRows.length > 0 && (
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedRows.length})
              </Button>
            )}
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedRows.length === paginatedPackages.length &&
                        paginatedPackages.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Package Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Countries</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('subscribers')}>
                    <div className="flex items-center">
                      Subscribers
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Starting Price</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('revenue')}>
                    <div className="flex items-center">
                      Revenue
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('updatedAt')}>
                    <div className="flex items-center">
                      Last Updated
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(pkg.id)}
                        onCheckedChange={(checked) => handleSelectRow(pkg.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pkg.name}</div>
                        <div className="text-sm text-muted-foreground">{pkg.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {pkg.countries.length === 0 ? (
                          <Badge variant="secondary">
                            <Globe className="mr-1 h-3 w-3" />
                            Global
                          </Badge>
                        ) : (
                          <span className="text-sm">{getCountryDisplay(pkg.countries)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        {pkg.subscribers}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${getLowestPrice(pkg.durations)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                        {pkg.revenue.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pkg.status === 'active' ? 'default' : 'secondary'}>
                        {pkg.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {pkg.updatedAt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleView(pkg)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(pkg)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Package
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(pkg)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Package
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, sortedPackages.length)} of{' '}
              {sortedPackages.length} packages
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
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

      {/* Dialogs */}
      <PackageFormDialog
        isOpen={isAddPackageOpen}
        onClose={() => {
          setIsAddPackageOpen(false)
          setSelectedPackage(null)
        }}
        onSave={handleSavePackage}
        package={null}
      />

      <PackageFormDialog
        isOpen={isEditPackageOpen}
        onClose={() => {
          setIsEditPackageOpen(false)
          setSelectedPackage(null)
        }}
        onSave={handleSavePackage}
        package={selectedPackage}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false)
          setSelectedPackage(null)
        }}
        onConfirm={confirmDelete}
        packageName={selectedPackage?.name || ''}
      />

      <PackageDetailsDialog
        isOpen={isPackageDetailsOpen}
        onClose={() => {
          setIsPackageDetailsOpen(false)
          setSelectedPackage(null)
        }}
        package={selectedPackage}
      />
    </div>
  )
}
