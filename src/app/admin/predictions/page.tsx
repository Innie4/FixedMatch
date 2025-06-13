'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  Trash2,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Upload,
  FileUp,
  Star,
  ListFilter,
  CalendarDays,
  Grid3X3,
  LayoutGrid, // Add this import
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
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Label } from '@/components/ui/label' // Add this import

// Type definition for prediction data
type Prediction = {
  id: number
  homeTeam: string
  homeTeamLogo: string
  awayTeam: string
  awayTeamLogo: string
  competition: string
  date: string
  time: string
  prediction: string
  odds: string
  status: string
  result: string | null
  isVip: boolean
  createdBy: string
  createdAt: string
}

export default function PredictionManagementPage() {
  const [isAddPredictionOpen, setIsAddPredictionOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false)
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('table')

  // Mock predictions data
  const predictions: Prediction[] = [
    {
      id: 1,
      homeTeam: 'Manchester United',
      homeTeamLogo: '/placeholder.svg?height=32&width=32',
      awayTeam: 'Liverpool',
      awayTeamLogo: '/placeholder.svg?height=32&width=32',
      competition: 'Premier League',
      date: '2023-06-15',
      time: '15:00',
      prediction: 'Home Win',
      odds: '2.10',
      status: 'upcoming',
      result: null,
      isVip: true,
      createdBy: 'Admin',
      createdAt: '2023-06-10 14:30',
    },
    {
      id: 2,
      homeTeam: 'Bayern Munich',
      homeTeamLogo: '/placeholder.svg?height=32&width=32',
      awayTeam: 'Borussia Dortmund',
      awayTeamLogo: '/placeholder.svg?height=32&width=32',
      competition: 'Bundesliga',
      date: '2023-06-16',
      time: '17:30',
      prediction: 'Over 2.5 Goals',
      odds: '1.85',
      status: 'upcoming',
      result: null,
      isVip: false,
      createdBy: 'Admin',
      createdAt: '2023-06-10 15:45',
    },
    {
      id: 3,
      homeTeam: 'Real Madrid',
      homeTeamLogo: '/placeholder.svg?height=32&width=32',
      awayTeam: 'Barcelona',
      awayTeamLogo: '/placeholder.svg?height=32&width=32',
      competition: 'La Liga',
      date: '2023-06-14',
      time: '20:00',
      prediction: 'Draw',
      odds: '3.50',
      status: 'upcoming',
      result: null,
      isVip: true,
      createdBy: 'Admin',
      createdAt: '2023-06-09 11:20',
    },
    {
      id: 4,
      homeTeam: 'Arsenal',
      homeTeamLogo: '/placeholder.svg?height=32&width=32',
      awayTeam: 'Chelsea',
      awayTeamLogo: '/placeholder.svg?height=32&width=32',
      competition: 'Premier League',
      date: '2023-06-12',
      time: '19:45',
      prediction: 'Away Win',
      odds: '2.75',
      status: 'completed',
      result: 'won',
      isVip: false,
      createdBy: 'Admin',
      createdAt: '2023-06-08 09:30',
    },
  ]

  // Filter predictions based on search term and status filter
  const filteredPredictions = predictions.filter((prediction) => {
    const matchesSearch =
      prediction.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.competition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.prediction.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === 'all' ||
      prediction.status === filterStatus ||
      (filterStatus === 'vip' && prediction.isVip)

    return matchesSearch && matchesFilter
  })

  // Sort predictions
  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    if (sortColumn === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    // Add more sorting options as needed
    return 0
  })

  // Paginate predictions
  const totalPages = Math.ceil(sortedPredictions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPredictions = sortedPredictions.slice(startIndex, startIndex + itemsPerPage)

  // Handle row selection
  const handleRowSelect = (predictionId: number) => {
    if (selectedRows.includes(predictionId)) {
      setSelectedRows(selectedRows.filter((id) => id !== predictionId))
    } else {
      setSelectedRows([...selectedRows, predictionId])
    }
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedPredictions.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedPredictions.map((prediction) => prediction.id))
    }
  }

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    // In a real app, this would call an API to perform the action
    console.log(`Performing ${action} on predictions:`, selectedRows)

    // Reset selection after action
    setSelectedRows([])
  }

  // Handle prediction preview
  const handlePreview = (prediction: Prediction) => {
    setSelectedPrediction(prediction)
    setIsPreviewOpen(true)
  }

  // Handle prediction edit
  const handleEdit = (prediction: Prediction) => {
    setSelectedPrediction(prediction)
    setIsAddPredictionOpen(true)
  }

  // Handle prediction delete
  const handleDelete = (prediction: Prediction) => {
    setSelectedPrediction(prediction)
    setIsDeleteConfirmOpen(true)
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prediction Management</h1>
          <Breadcrumb className="mt-1">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/predictions">Predictions</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2">
          <Button onClick={() => setIsBatchUploadOpen(true)} variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Batch Upload
          </Button>
          <Button onClick={() => setIsAddPredictionOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Prediction
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search predictions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Predictions</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="vip">VIP Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ListFilter className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>View Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setViewMode('table')}>
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    Table View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode('cards')}>
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Card View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedRows.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="mr-2 h-4 w-4" />
                      Bulk Actions ({selectedRows.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('markVIP')}>
                      <Star className="mr-2 h-4 w-4" />
                      Mark as VIP
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        paginatedPredictions.length > 0 &&
                        selectedRows.length === paginatedPredictions.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[180px]">
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      <span>Date/Time</span>
                      {sortColumn === 'date' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Competition</TableHead>
                  <TableHead>Prediction</TableHead>
                  <TableHead>Odds</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPredictions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No predictions found. Try adjusting your filters or add a new prediction.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPredictions.map((prediction) => (
                    <TableRow key={prediction.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(prediction.id)}
                          onCheckedChange={() => handleRowSelect(prediction.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span className="text-sm">{prediction.date}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span className="text-sm">{prediction.time}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-col items-center space-y-1">
                            <Image
                              src={prediction.homeTeamLogo}
                              alt={prediction.homeTeam}
                              width={24}
                              height={24}
                            />
                            <span className="text-xs">{prediction.homeTeam}</span>
                          </div>
                          <span className="text-sm font-medium">vs</span>
                          <div className="flex flex-col items-center space-y-1">
                            <Image
                              src={prediction.awayTeamLogo}
                              alt={prediction.awayTeam}
                              width={24}
                              height={24}
                            />
                            <span className="text-xs">{prediction.awayTeam}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{prediction.competition}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{prediction.prediction}</span>
                          {prediction.isVip && (
                            <Badge variant="secondary">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              VIP
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{prediction.odds}</TableCell>
                      <TableCell>
                        {prediction.status === 'upcoming' ? (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            <CalendarDays className="h-3 w-3 mr-1" />
                            Upcoming
                          </Badge>
                        ) : prediction.status === 'completed' && prediction.result === 'won' ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Won
                          </Badge>
                        ) : prediction.status === 'completed' && prediction.result === 'lost' ? (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Lost
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePreview(prediction)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(prediction)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(prediction)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {paginatedPredictions.length} of {filteredPredictions.length} predictions
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedPredictions.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="text-center text-muted-foreground">
                  No predictions found. Try adjusting your filters or add a new prediction.
                </div>
              </CardContent>
            </Card>
          ) : (
            paginatedPredictions.map((prediction) => (
              <Card key={prediction.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{prediction.competition}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {prediction.date} • {prediction.time}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    {prediction.isVip && (
                      <Badge variant="secondary" className="mr-2">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        VIP
                      </Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(prediction)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(prediction)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(prediction)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col items-center">
                      <Image
                        src={prediction.homeTeamLogo}
                        alt={prediction.homeTeam}
                        width={40}
                        height={40}
                      />
                      <span className="text-sm mt-1 text-center">{prediction.homeTeam}</span>
                    </div>
                    <div className="text-lg font-bold">vs</div>
                    <div className="flex flex-col items-center">
                      <Image
                        src={prediction.awayTeamLogo}
                        alt={prediction.awayTeam}
                        width={40}
                        height={40}
                      />
                      <span className="text-sm mt-1 text-center">{prediction.awayTeam}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">Prediction</div>
                      <div>{prediction.prediction}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Odds</div>
                      <div>{prediction.odds}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  {prediction.status === 'upcoming' ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      Upcoming
                    </Badge>
                  ) : prediction.status === 'completed' && prediction.result === 'won' ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Won
                    </Badge>
                  ) : prediction.status === 'completed' && prediction.result === 'lost' ? (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <XCircle className="h-3 w-3 mr-1" />
                      Lost
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-200"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Created by {prediction.createdBy}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
          <div className="col-span-full flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {paginatedPredictions.length} of {filteredPredictions.length} predictions
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Prediction Dialog */}
      <Dialog open={isAddPredictionOpen} onOpenChange={setIsAddPredictionOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPrediction ? 'Edit Prediction' : 'Add New Prediction'}
            </DialogTitle>
            <DialogDescription>
              {selectedPrediction
                ? 'Update the prediction details below.'
                : 'Fill in the details to add a new prediction.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="homeTeam">Home Team</Label>
                <Input id="homeTeam" defaultValue={selectedPrediction?.homeTeam || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayTeam">Away Team</Label>
                <Input id="awayTeam" defaultValue={selectedPrediction?.awayTeam || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="competition">Competition</Label>
                <Input id="competition" defaultValue={selectedPrediction?.competition || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" defaultValue={selectedPrediction?.date || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" defaultValue={selectedPrediction?.time || ''} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prediction">Prediction</Label>
                <Select defaultValue={selectedPrediction?.prediction || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select prediction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home Win">Home Win</SelectItem>
                    <SelectItem value="Away Win">Away Win</SelectItem>
                    <SelectItem value="Draw">Draw</SelectItem>
                    <SelectItem value="Over 2.5 Goals">Over 2.5 Goals</SelectItem>
                    <SelectItem value="Under 2.5 Goals">Under 2.5 Goals</SelectItem>
                    <SelectItem value="Both Teams to Score">Both Teams to Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="odds">Odds</Label>
                <Input id="odds" defaultValue={selectedPrediction?.odds || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={selectedPrediction?.status || 'upcoming'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedPrediction?.status === 'completed' && (
                <div className="space-y-2">
                  <Label htmlFor="result">Result</Label>
                  <Select defaultValue={selectedPrediction?.result || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="void">Void</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="isVip" defaultChecked={selectedPrediction?.isVip || false} />
                <Label htmlFor="isVip">VIP Prediction</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPredictionOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{selectedPrediction ? 'Update' : 'Add'} Prediction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prediction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                console.log(`Deleting prediction ${selectedPrediction?.id}`)
                setIsDeleteConfirmOpen(false)
                // In a real app, this would call an API to delete the prediction
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prediction Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Prediction Preview</DialogTitle>
          </DialogHeader>
          {selectedPrediction && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Image
                    src={selectedPrediction.homeTeamLogo}
                    alt={selectedPrediction.homeTeam}
                    width={32}
                    height={32}
                  />
                  <span className="font-medium">{selectedPrediction.homeTeam}</span>
                </div>
                <span>vs</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{selectedPrediction.awayTeam}</span>
                  <Image
                    src={selectedPrediction.awayTeamLogo}
                    alt={selectedPrediction.awayTeam}
                    width={32}
                    height={32}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Competition:</span>
                  <p>{selectedPrediction.competition}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date & Time:</span>
                  <p>
                    {selectedPrediction.date} {selectedPrediction.time}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Prediction:</span>
                  <p>{selectedPrediction.prediction}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Odds:</span>
                  <p>{selectedPrediction.odds}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="capitalize">{selectedPrediction.status}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">VIP:</span>
                  <p>{selectedPrediction.isVip ? 'Yes' : 'No'}</p>
                </div>
                {selectedPrediction.status === 'completed' && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Result:</span>
                    <p className="capitalize">{selectedPrediction.result || 'Not available'}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Upload Sheet */}
      <Sheet open={isBatchUploadOpen} onOpenChange={setIsBatchUploadOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Batch Upload Predictions</SheetTitle>
            <SheetDescription>
              Upload multiple predictions at once using a CSV or Excel file.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Upload File</Label>
              <Input id="file" type="file" accept=".csv,.xlsx,.xls" />
              <p className="text-xs text-muted-foreground">
                Accepted formats: CSV, Excel (.xlsx, .xls)
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Template</Label>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsBatchUploadOpen(false)}>
              Cancel
            </Button>
            <Button>
              <FileUp className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
