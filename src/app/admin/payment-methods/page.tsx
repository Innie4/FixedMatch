'use client'

import { useState } from 'react'
import {
  CreditCard,
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Plus,
  Globe,
  Settings,
  TestTube,
  Shield,
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
import { PaymentMethodFormDialog } from './components/PaymentMethodFormDialog'
import { CountryAssignmentDialog } from './components/CountryAssignmentDialog'
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog'
import { TestConnectionDialog } from './components/TestConnectionDialog'
import { countries } from '@/lib/countries'

interface PaymentMethod {
  id: number
  name: string
  provider: 'flutterwave' | 'paystack' | 'stripe' | 'razorpay' | 'paypal' | 'square'
  type: 'card' | 'bank_transfer' | 'mobile_money' | 'crypto' | 'wallet'
  status: 'active' | 'inactive' | 'testing'
  countries: string[] // Country codes
  configuration: {
    publicKey?: string
    secretKey?: string
    merchantId?: string
    webhookUrl?: string
    testMode: boolean
  }
  supportedCurrencies: string[]
  transactionFee: number
  createdAt: string
  updatedAt: string
  lastTested?: string
  testStatus?: 'success' | 'failed' | 'pending'
}

interface CountryPaymentMethods {
  countryCode: string
  countryName: string
  paymentMethods: PaymentMethod[]
  defaultCurrency: string
  fallbackToUSD: boolean
}

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      name: 'Flutterwave Nigeria',
      provider: 'flutterwave',
      type: 'card',
      status: 'active',
      countries: ['NG', 'GH', 'KE'],
      configuration: {
        publicKey: 'FLWPUBK_TEST-***',
        secretKey: 'FLWSECK_TEST-***',
        testMode: false,
      },
      supportedCurrencies: ['NGN', 'GHS', 'KES'],
      transactionFee: 1.4,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      lastTested: '2024-01-20',
      testStatus: 'success',
    },
    {
      id: 2,
      name: 'Paystack West Africa',
      provider: 'paystack',
      type: 'card',
      status: 'active',
      countries: ['NG', 'GH'],
      configuration: {
        publicKey: 'pk_test_***',
        secretKey: 'sk_test_***',
        testMode: false,
      },
      supportedCurrencies: ['NGN', 'GHS'],
      transactionFee: 1.5,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      lastTested: '2024-01-18',
      testStatus: 'success',
    },
    {
      id: 3,
      name: 'Stripe Global',
      provider: 'stripe',
      type: 'card',
      status: 'active',
      countries: ['US', 'GB', 'CA', 'AU'],
      configuration: {
        publicKey: 'pk_test_***',
        secretKey: 'sk_test_***',
        testMode: true,
      },
      supportedCurrencies: ['USD', 'GBP', 'CAD', 'AUD'],
      transactionFee: 2.9,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-15',
      lastTested: '2024-01-15',
      testStatus: 'success',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterProvider, setFilterProvider] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState('methods')

  // Dialog states
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false)
  const [isEditMethodOpen, setIsEditMethodOpen] = useState(false)
  const [isCountryAssignmentOpen, setIsCountryAssignmentOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isTestConnectionOpen, setIsTestConnectionOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)

  // Filter and search logic
  const filteredMethods = paymentMethods.filter((method) => {
    const matchesSearch =
      method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvider = filterProvider === 'all' || method.provider === filterProvider
    const matchesStatus = filterStatus === 'all' || method.status === filterStatus
    return matchesSearch && matchesProvider && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredMethods.length / itemsPerPage)
  const paginatedMethods = filteredMethods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Country-based view data
  const getCountryPaymentMethods = (): CountryPaymentMethods[] => {
    return countries.map((country) => {
      const countryMethods = paymentMethods.filter(
        (method) => method.countries.includes(country.code) && method.status === 'active'
      )
      return {
        countryCode: country.code,
        countryName: country.name,
        paymentMethods: countryMethods,
        defaultCurrency:
          countryMethods.length > 0 ? countryMethods[0].supportedCurrencies[0] : 'USD',
        fallbackToUSD: countryMethods.length === 0,
      }
    })
  }

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setIsEditMethodOpen(true)
  }

  const handleDelete = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setIsDeleteConfirmOpen(true)
  }

  const handleTestConnection = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setIsTestConnectionOpen(true)
  }

  const handleCountryAssignment = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setIsCountryAssignmentOpen(true)
  }

  const handleSaveMethod = (methodData: Partial<PaymentMethod>) => {
    if (selectedMethod) {
      setPaymentMethods((methods) =>
        methods.map((method) =>
          method.id === selectedMethod.id
            ? { ...method, ...methodData, updatedAt: new Date().toISOString().split('T')[0] }
            : method
        )
      )
    } else {
      const newMethod: PaymentMethod = {
        ...methodData,
        id: Math.max(...paymentMethods.map((m) => m.id)) + 1,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      } as PaymentMethod
      setPaymentMethods((methods) => [...methods, newMethod])
    }
    setIsAddMethodOpen(false)
    setIsEditMethodOpen(false)
    setSelectedMethod(null)
  }

  // const handleDeleteConfirm = () => {
  //   if (selectedMethod) {
  //     // Implement actual delete logic here
  //     setPaymentMethods((prev) => prev.filter((method) => method.id !== selectedMethod.id))
  //     toast({
  //       title: 'Payment Method Deleted',
  //       description: `${selectedMethod.name} has been successfully deleted.`,
  //     })
  //     setIsDeleteConfirmOpen(false)
  //     setSelectedMethod(null)
  //   }
  // }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'flutterwave':
        return '🟢'
      case 'paystack':
        return '🔵'
      case 'stripe':
        return '🟣'
      case 'razorpay':
        return '🔴'
      case 'paypal':
        return '🟡'
      case 'square':
        return '⚫'
      default:
        return '💳'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      case 'testing':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getTestStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
      case 'pending':
        return 'text-yellow-600'
      default:
        return 'text-gray-400'
    }
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
          <BreadcrumbItem>Payment Methods</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
          <p className="text-muted-foreground">
            Manage payment gateways and assign them to countries
          </p>
        </div>
        <Button onClick={() => setIsAddMethodOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentMethods.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Methods</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentMethods.filter((m) => m.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries Covered</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(paymentMethods.flatMap((m) => m.countries)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Transaction Fee</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                paymentMethods.reduce((acc, m) => acc + m.transactionFee, 0) / paymentMethods.length
              ).toFixed(1)}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="countries">Country Assignment</TabsTrigger>
        </TabsList>

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex flex-1 items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payment methods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select value={filterProvider} onValueChange={setFilterProvider}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="flutterwave">Flutterwave</SelectItem>
                  <SelectItem value="paystack">Paystack</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="razorpay">Razorpay</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Methods Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedRows.length === paginatedMethods.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRows(paginatedMethods.map((method) => method.id))
                        } else {
                          setSelectedRows([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Countries</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Test Status</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMethods.map((method) => (
                  <TableRow key={method.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(method.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRows([...selectedRows, method.id])
                          } else {
                            setSelectedRows(selectedRows.filter((id) => id !== method.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getProviderIcon(method.provider)}</span>
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-muted-foreground">{method.type}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{method.provider}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {method.countries.slice(0, 3).map((code) => (
                          <Badge key={code} variant="secondary" className="text-xs">
                            {code}
                          </Badge>
                        ))}
                        {method.countries.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{method.countries.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(method.status)}>{method.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center gap-1 ${getTestStatusColor(method.testStatus)}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            method.testStatus === 'success'
                              ? 'bg-green-600'
                              : method.testStatus === 'failed'
                                ? 'bg-red-600'
                                : method.testStatus === 'pending'
                                  ? 'bg-yellow-600'
                                  : 'bg-gray-400'
                          }`}
                        />
                        {method.testStatus || 'Not tested'}
                      </div>
                    </TableCell>
                    <TableCell>{method.transactionFee}%</TableCell>
                    <TableCell>{method.updatedAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(method)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCountryAssignment(method)}>
                            <Globe className="mr-2 h-4 w-4" />
                            Assign Countries
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTestConnection(method)}>
                            <TestTube className="mr-2 h-4 w-4" />
                            Test Connection
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(method)}
                            className="text-red-600"
                          >
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
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredMethods.length)} of{' '}
              {filteredMethods.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Country Assignment Tab */}
        <TabsContent value="countries" className="space-y-4">
          <div className="grid gap-4">
            {getCountryPaymentMethods()
              .slice(0, 20)
              .map((countryData) => (
                <Card key={countryData.countryCode}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {countries.find((c) => c.code === countryData.countryCode)?.flag}
                        </span>
                        <div>
                          <CardTitle className="text-lg">{countryData.countryName}</CardTitle>
                          <CardDescription>
                            {countryData.fallbackToUSD
                              ? 'Using USD fallback - No specific payment methods assigned'
                              : `${countryData.paymentMethods.length} payment method(s) assigned`}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={countryData.fallbackToUSD ? 'outline' : 'default'}>
                        {countryData.defaultCurrency}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {countryData.paymentMethods.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {countryData.paymentMethods.map((method) => (
                          <Badge
                            key={method.id}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <span>{getProviderIcon(method.provider)}</span>
                            {method.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No payment methods assigned. Users will see USD pricing with general payment
                        options.
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <PaymentMethodFormDialog
        mode="add"
        isOpen={isAddMethodOpen}
        onClose={() => {
          setIsAddMethodOpen(false)
          setSelectedMethod(null)
        }}
        onSave={handleSaveMethod}
        method={null}
      />

      <PaymentMethodFormDialog
        mode={selectedMethod ? 'edit' : 'add'}
        isOpen={isEditMethodOpen}
        onClose={() => {
          setIsEditMethodOpen(false)
          setSelectedMethod(null)
        }}
        onSave={handleSaveMethod}
        method={selectedMethod}
      />

      <CountryAssignmentDialog
        isOpen={isCountryAssignmentOpen}
        onClose={() => {
          setIsCountryAssignmentOpen(false)
          setSelectedMethod(null)
        }}
        method={selectedMethod}
        onSave={(methodId, countries) => {
          setPaymentMethods((methods) =>
            methods.map((method) => (method.id === methodId ? { ...method, countries } : method))
          )
          setIsCountryAssignmentOpen(false)
        }}
      />

      <TestConnectionDialog
        isOpen={isTestConnectionOpen}
        onClose={() => {
          setIsTestConnectionOpen(false)
          setSelectedMethod(null)
        }}
        method={selectedMethod}
        onTestComplete={(methodId, status) => {
          setPaymentMethods((methods) =>
            methods.map((method) =>
              method.id === methodId
                ? {
                    ...method,
                    testStatus: status,
                    lastTested: new Date().toISOString().split('T')[0],
                  }
                : method
            )
          )
        }}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          setPaymentMethods((methods) => methods.filter((m) => m.id !== selectedMethod?.id))
          setIsDeleteConfirmOpen(false)
        }}
        paymentMethodName={selectedMethod?.name || ''}
      />
    </div>
  )
}
