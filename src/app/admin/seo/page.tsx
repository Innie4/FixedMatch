'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Edit,
  ArrowUpDown,
  BarChart3,
  FileText,
  LineChart,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Plus,
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

interface Page {
  id: number
  url: string
  title: string
  metaDescription: string
  h1: string
  wordCount: number
  seoScore: number
  issues: string[]
  lastUpdated: string
  keywordsInCommon?: number
  avgPosition?: number
  topKeywords?: string[]
}

interface Keyword {
  id: number
  keyword: string
  position: number
  previousPosition: number
  change: number
  searchVolume: number
  difficulty: number
  opportunity: string
  lastUpdated: string
  status: string
}

export default function SEOManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortColumn, setSortColumn] = useState('position')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState('keyword-performance')
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [timeRange, setTimeRange] = useState('30d')

  const keywords: Keyword[] = [
    {
      id: 1,
      keyword: 'sports prediction',
      position: 12,
      previousPosition: 15,
      change: 3,
      searchVolume: 8200,
      difficulty: 68,
      opportunity: 'high',
      lastUpdated: '2023-06-10',
      status: 'tracking',
    },
    // ... Add more keywords as needed
  ]

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (items: Keyword[]) => {
    setSelectedRows((prev) => (prev.length === items.length ? [] : items.map((item) => item.id)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/seo">SEO Management</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold tracking-tight">SEO Management</h1>
          <p className="text-muted-foreground">
            Monitor and optimize your site's search engine performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Position</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.6</div>
            <p className="text-xs text-muted-foreground">+2.3 from last month</p>
          </CardContent>
        </Card>
        {/* Add other metric cards as needed */}
      </div>

      <Tabs defaultValue="keyword-performance" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="keyword-performance">
            <BarChart3 className="h-4 w-4 mr-2" />
            Keyword Performance
          </TabsTrigger>
          <TabsTrigger value="meta-information">
            <FileText className="h-4 w-4 mr-2" />
            Meta Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keyword-performance" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-1 items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by Opportunity</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    All Keywords
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('high')}>
                    High Opportunity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('medium')}>
                    Medium Opportunity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('low')}>
                    Low Opportunity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Keyword Rankings</CardTitle>
              <CardDescription>Track your position for target keywords over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedRows.length === keywords.length}
                        onCheckedChange={() => handleSelectAll(keywords)}
                      />
                    </TableHead>
                    <TableHead>Keyword</TableHead>
                    <TableHead>
                      <div
                        className="flex items-center space-x-1"
                        onClick={() => {
                          setSortColumn('position')
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                        }}
                      >
                        <span>Position</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Opportunity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywords.map((keyword) => (
                    <TableRow key={keyword.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(keyword.id)}
                          onCheckedChange={() => handleRowSelect(keyword.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{keyword.keyword}</TableCell>
                      <TableCell>{keyword.position}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {keyword.change > 0 ? (
                            <>
                              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                              <span className="text-green-500">+{keyword.change}</span>
                            </>
                          ) : keyword.change < 0 ? (
                            <>
                              <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                              <span className="text-red-500">{keyword.change}</span>
                            </>
                          ) : (
                            <span>0</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{keyword.searchVolume.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            keyword.opportunity === 'high'
                              ? 'default'
                              : keyword.opportunity === 'medium'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {keyword.opportunity}
                        </Badge>
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Tracking</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Remove Tracking
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
