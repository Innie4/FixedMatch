'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  BarChart3,
  FileText,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import SEODetailsSheet from './components/SEODetailsSheet'

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
  const [selectedRows, setSelectedRows] = useState<number[]>([])
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

      <Tabs defaultValue="keyword-performance" className="space-y-4">
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
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('tracking')}>
                    Tracking
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('improving')}>
                    Improving
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('declining')}>
                    Declining
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('stagnant')}>
                    Stagnant
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Sort
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSort('keyword')}>
                    Keyword
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('position')}>
                    Position
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('searchVolume')}>
                    Search Volume
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('difficulty')}>
                    Difficulty
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('lastUpdated')}>
                    Last Updated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button size="sm" onClick={() => console.log('Add New Keyword')}>Add New Keyword</Button>
          </div>

          {/* Keyword Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Keyword Ranking</CardTitle>
              <CardDescription>Overall performance of your tracked keywords.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox
                        checked={selectedRows.length === keywords.length && keywords.length > 0}
                        onCheckedChange={() => handleSelectAll(keywords)}
                        disabled={keywords.length === 0}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('keyword')}
                    >
                      Keyword <ArrowUpDown className="ml-1 h-4 w-4 inline-block" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('position')}
                    >
                      Position <ArrowUpDown className="ml-1 h-4 w-4 inline-block" />
                    </TableHead>
                    <TableHead>
                      Change
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('searchVolume')}
                    >
                      Search Volume <ArrowUpDown className="ml-1 h-4 w-4 inline-block" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('difficulty')}
                    >
                      Difficulty <ArrowUpDown className="ml-1 h-4 w-4 inline-block" />
                    </TableHead>
                    <TableHead>Opportunity</TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('lastUpdated')}
                    >
                      Last Updated <ArrowUpDown className="ml-1 h-4 w-4 inline-block" />
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywords.map((keyword) => (
                    <TableRow key={keyword.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(keyword.id)}
                          onCheckedChange={() => handleRowSelect(keyword.id)}
                          aria-label="Select row"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{keyword.keyword}</TableCell>
                      <TableCell>{keyword.position}</TableCell>
                      <TableCell>
                        {keyword.change > 0 ? (
                          <span className="flex items-center text-green-500">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {keyword.change}
                          </span>
                        ) : keyword.change < 0 ? (
                          <span className="flex items-center text-red-500">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            {Math.abs(keyword.change)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell>{keyword.searchVolume}</TableCell>
                      <TableCell>{keyword.difficulty}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {keyword.opportunity}
                        </Badge>
                      </TableCell>
                      <TableCell>{keyword.lastUpdated}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            keyword.status === 'tracking'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : keyword.status === 'improving'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : keyword.status === 'declining'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }
                        >
                          {keyword.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              aria-label="More actions"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => console.log('Edit Keyword')}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('View Details')}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Remove Keyword')}>
                              Remove
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

        <TabsContent value="meta-information" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search meta information..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
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
                  <DropdownMenuLabel>Filter by SEO Score</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    All Scores
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('excellent')}>Excellent (80-100)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('good')}>Good (60-79)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('average')}>Average (40-59)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('poor')}>Poor (0-39)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button size="sm" onClick={() => console.log('Add New Page')}>Add New Page</Button>
          </div>

          {/* Meta Information Table */}
          <Card>
            <CardHeader>
              <CardTitle>Page Meta Information</CardTitle>
              <CardDescription>Optimize titles, descriptions, and headers for search engines.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox
                        checked={selectedRows.length === pages.length && pages.length > 0}
                        onCheckedChange={() => handleSelectAll(pages)}
                        disabled={pages.length === 0}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('url')}
                    >
                      URL <ArrowUpDown className="ml-1 h-4 w-4 inline-block" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('title')}
                    >
                      Title <ArrowUpDown className="ml-1 h-4 w-4 inline-block" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('metaDescription')}
                    >
                      Meta Description <ArrowUpDown className="ml-1 h-4 w-4 inline-block" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('h1')}
                    >
                      H1 <ArrowUpDown className="ml-1 h-4 w-4 inline-block" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('wordCount')}
                    >
                      Word Count <ArrowUpDown className="ml-1 h-4 w-4 inline-block" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('seoScore')}
                    >
                      SEO Score <ArrowUpDown className="ml-1 h-4 w-4 inline-block" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary"
                      onClick={() => handleSort('lastUpdated')}
                    >
                      Last Updated <ArrowUpDown className="ml-1 h-4 w-4 inline-block" />
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id} onClick={() => handlePageSelect(page)} className="cursor-pointer">
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(page.id)}
                          onCheckedChange={() => handleRowSelect(page.id)}
                          aria-label="Select row"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{page.url}</TableCell>
                      <TableCell>{page.title}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{page.metaDescription}</TableCell>
                      <TableCell>{page.h1}</TableCell>
                      <TableCell>{page.wordCount}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            page.seoScore >= 80
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : page.seoScore >= 60
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }
                        >
                          {page.seoScore}
                        </Badge>
                      </TableCell>
                      <TableCell>{page.lastUpdated}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              aria-label="More actions"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => console.log('Edit Page')}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('View Issues')}>View Issues</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Optimize Page')}>Optimize</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => console.log('Delete Page')}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* SEO Details Sheet (for selected page) */}
          {selectedPage && (
            <SEODetailsSheet
              isOpen={!!selectedPage}
              onClose={() => setSelectedPage(null)}
              page={selectedPage}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
