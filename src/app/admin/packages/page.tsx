'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  Package,
  Search,
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
  AlertCircle,
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
import { useToast } from '@/components/ui/use-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useVirtualizer } from '@tanstack/react-virtual'
import { usePackageUpdates } from '@/hooks/usePackageUpdates'
import { performanceAnalytics } from '@/lib/analytics'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import WebSocketService from '@/services/websocket'

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

// Define AxiosError structure for type safety
interface CustomAxiosError extends Error {
  response?: {
    data?: {
      error?: string;
    };
  };
  isAxiosError: boolean;
}

// Type guard to check if an error is an AxiosError
const isCustomAxiosError = (error: unknown): error is CustomAxiosError => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error && (error as CustomAxiosError).isAxiosError === true;
};

// Add error handling utility
const handleApiError = (error: unknown): never => {
  if (isCustomAxiosError(error)) {
    const message = error.response?.data?.error || 'An unexpected error occurred';
    throw new Error(message);
  }
  throw error;
};

// Add type for the query response
type PackagesResponse = SubscriptionPackage[]

// Add type for package update data
type PackageUpdateData = Omit<SubscriptionPackage, 'id' | 'subscribers' | 'revenue' | 'createdAt' | 'updatedAt'>;

// Update API functions with error handling
async function fetchPackages(): Promise<PackagesResponse> {
  try {
    const response = await axios.get('/api/admin/packages')
    return response.data as PackagesResponse
  } catch (error) {
    return handleApiError(error)
  }
}

async function createPackage(data: Omit<SubscriptionPackage, 'id' | 'subscribers' | 'revenue' | 'createdAt' | 'updatedAt'>): Promise<SubscriptionPackage> {
  try {
    const response = await axios.post('/api/admin/packages', data)
    return response.data as SubscriptionPackage
  } catch (error) {
    return handleApiError(error)
  }
}

async function updatePackage(id: number, data: Omit<SubscriptionPackage, 'id' | 'subscribers' | 'revenue' | 'createdAt' | 'updatedAt'>): Promise<SubscriptionPackage> {
  try {
    const response = await axios.put(`/api/admin/packages/${id}`, data)
    return response.data as SubscriptionPackage
  } catch (error) {
    return handleApiError(error)
  }
}

async function deletePackage(id: number): Promise<void> {
  try {
    await axios.delete(`/api/admin/packages/${id}`)
  } catch (error) {
    return handleApiError(error)
  }
}

export default function PackageManagementPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCountry, setFilterCountry] = useState('all')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Fixed value, no setter needed

  // Dialog states
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false)
  const [isEditPackageOpen, setIsEditPackageOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isPackageDetailsOpen, setIsPackageDetailsOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null)

  // Update useQuery with retry and error handling
  const { data: packagesData = [] as SubscriptionPackage[], isLoading, error } = useQuery<PackagesResponse, Error>({
    queryKey: ['packages'],
    queryFn: fetchPackages,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Update mutations with optimistic updates
  const createMutation = useMutation({
    mutationFn: createPackage,
    onMutate: async (newPackage) => {
      await queryClient.cancelQueries({ queryKey: ['packages'] })
      const previousPackages = queryClient.getQueryData<PackagesResponse>(['packages'])
      
      queryClient.setQueryData<PackagesResponse>(['packages'], (old = []) => [
        ...old,
        { ...newPackage, id: Date.now(), subscribers: 0, revenue: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as SubscriptionPackage
      ])
      
      return { previousPackages }
    },
    onError: (error, newPackage, context) => {
      queryClient.setQueryData(['packages'], context?.previousPackages)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
      toast({
        title: 'Success',
        description: 'Package created successfully'
      })
      WebSocketService.send({
        type: 'PACKAGE_ADDED',
        payload: data,
        timestamp: new Date().toISOString(),
        adminAction: true
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PackageUpdateData }) => updatePackage(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['packages'] })
      const previousPackages = queryClient.getQueryData<PackagesResponse>(['packages'])
      
      queryClient.setQueryData<PackagesResponse>(['packages'], (old = []) =>
        old.map(pkg => pkg.id === id ? { ...pkg, ...data, updatedAt: new Date().toISOString() } as SubscriptionPackage : pkg)
      )
      
      return { previousPackages }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['packages'], context?.previousPackages)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
      toast({
        title: 'Success',
        description: 'Package updated successfully'
      })
      WebSocketService.send({
        type: 'PACKAGE_UPDATED',
        payload: data,
        timestamp: new Date().toISOString(),
        adminAction: true
      })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['packages'] })
      const previousPackages = queryClient.getQueryData<PackagesResponse>(['packages'])
      
      queryClient.setQueryData<PackagesResponse>(['packages'], (old = []) =>
        old.filter(pkg => pkg.id !== id)
      )
      
      return { previousPackages }
    },
    onError: (error, id, context) => {
      queryClient.setQueryData(['packages'], context?.previousPackages)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
      toast({
        title: 'Success',
        description: 'Package deleted successfully'
      })
      WebSocketService.send({
        type: 'PACKAGE_DELETED',
        payload: { id: id },
        timestamp: new Date().toISOString(),
        adminAction: true
      })
    }
  })

  // Add real-time updates
  usePackageUpdates()

  // Memoize filtered and sorted packages
  const filteredAndSortedPackages = useMemo(() => {
    const filtered = packagesData?.filter((pkg: SubscriptionPackage) => {
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

    return [...filtered].sort((a, b) => {
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
  }, [packagesData, searchTerm, filterStatus, filterCountry, sortColumn, sortDirection])

  // Memoize paginated packages
  const paginatedPackages = useMemo(() => {
    return filteredAndSortedPackages.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  }, [filteredAndSortedPackages, currentPage, itemsPerPage])

  // Memoize handlers
  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }, [sortColumn, sortDirection])

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedPackages.map((pkg) => pkg.id))
    } else {
      setSelectedRows([])
    }
  }, [paginatedPackages])

  const handleSelectRow = useCallback((id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id])
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id))
    }
  }, [])

  // Track page load performance
  useEffect(() => {
    const startTime = performance.now()
    return () => {
      const loadTime = performance.now() - startTime
      performanceAnalytics.trackPageLoad('package_management', loadTime)
    }
  }, [])

  // Create a ref for the virtualizer
  const scrollRef = useRef<HTMLDivElement>(null)

  // Update the virtualizer to use the correct ref
  const rowVirtualizer = useVirtualizer({
    count: paginatedPackages.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 50, // Estimated row height
    overscan: 5,
  })

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
      deleteMutation.mutate(selectedPackage.id)
      setIsDeleteConfirmOpen(false)
      setSelectedPackage(null)
    }
  }

  const handleSavePackage = async (
    packageData: Omit<SubscriptionPackage, 'id' | 'subscribers' | 'revenue' | 'createdAt' | 'updatedAt'>
  ) => {
    if (selectedPackage) {
      updateMutation.mutate({ id: selectedPackage.id, data: packageData })
    } else {
      createMutation.mutate(packageData)
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

  // Add loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Add error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading packages</AlertTitle>
          <AlertDescription>
            {error.message || 'Failed to load packages. Please try again later.'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <ErrorBoundary>
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
              <div className="text-2xl font-bold">{(packagesData as SubscriptionPackage[]).length}</div>
              <p className="text-xs text-muted-foreground">
                {(packagesData as SubscriptionPackage[]).filter((p: SubscriptionPackage) => p.status === 'active').length} active
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
                {(packagesData as SubscriptionPackage[]).reduce((sum: number, pkg: SubscriptionPackage) => sum + pkg.subscribers, 0)}
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
                ${(packagesData as SubscriptionPackage[]).reduce((sum: number, pkg: SubscriptionPackage) => sum + pkg.revenue, 0).toLocaleString()}
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
                {(packagesData as SubscriptionPackage[]).filter((p: SubscriptionPackage) => p.countries.length === 0).length}
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
            <div className="rounded-md border" ref={scrollRef}>
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
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const pkg = paginatedPackages[virtualRow.index]
                      return (
                        <TableRow
                          key={pkg.id}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
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
                      )
                    })}
                  </div>
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredAndSortedPackages.length)} of{' '}
                {filteredAndSortedPackages.length} packages
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
                  {Array.from({ length: Math.ceil(filteredAndSortedPackages.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
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
                  onClick={() => setCurrentPage(Math.min(Math.ceil(filteredAndSortedPackages.length / itemsPerPage), currentPage + 1))}
                  disabled={currentPage === Math.ceil(filteredAndSortedPackages.length / itemsPerPage)}
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
          initialData={null}
        />

        <PackageFormDialog
          isOpen={isEditPackageOpen}
          onClose={() => {
            setIsEditPackageOpen(false)
            setSelectedPackage(null)
          }}
          onSave={handleSavePackage}
          initialData={selectedPackage}
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
    </ErrorBoundary>
  )
}
