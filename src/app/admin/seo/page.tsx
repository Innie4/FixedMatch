"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  ChevronDown, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Eye, 
  ArrowUpDown, 
  Globe, 
  BarChart3, 
  FileText, 
  Image, 
  Link2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Zap, 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  Save, 
  Plus
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function SEOManagementPage() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortColumn, setSortColumn] = useState("position")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("keyword-performance")
  const [isAddKeywordOpen, setIsAddKeywordOpen] = useState(false)
  const [isEditMetaOpen, setIsEditMetaOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState<any>(null)
  const [isAuditScheduleOpen, setIsAuditScheduleOpen] = useState(false)
  const [timeRange, setTimeRange] = useState("30d")
  
  // Mock data for keywords
  const keywords = [
    {
      id: 1,
      keyword: "sports prediction",
      position: 12,
      previousPosition: 15,
      change: 3,
      searchVolume: 8200,
      difficulty: 68,
      opportunity: "high",
      lastUpdated: "2023-06-10",
      status: "tracking"
    },
    {
      id: 2,
      keyword: "football predictions today",
      position: 8,
      previousPosition: 10,
      change: 2,
      searchVolume: 12500,
      difficulty: 72,
      opportunity: "medium",
      lastUpdated: "2023-06-10",
      status: "tracking"
    },
    {
      id: 3,
      keyword: "best prediction site",
      position: 18,
      previousPosition: 22,
      change: 4,
      searchVolume: 5400,
      difficulty: 65,
      opportunity: "high",
      lastUpdated: "2023-06-10",
      status: "tracking"
    },
    {
      id: 4,
      keyword: "soccer betting tips",
      position: 25,
      previousPosition: 28,
      change: 3,
      searchVolume: 9800,
      difficulty: 70,
      opportunity: "medium",
      lastUpdated: "2023-06-10",
      status: "tracking"
    },
    {
      id: 5,
      keyword: "premier league predictions",
      position: 15,
      previousPosition: 14,
      change: -1,
      searchVolume: 7600,
      difficulty: 75,
      opportunity: "low",
      lastUpdated: "2023-06-10",
      status: "tracking"
    }
  ]
  
  // Mock data for competitors
  const competitors = [
    {
      id: 1,
      domain: "competitor1.com",
      keywordsInCommon: 42,
      avgPosition: 5.2,
      topKeywords: ["sports prediction", "football predictions", "betting tips"]
    },
    {
      id: 2,
      domain: "competitor2.com",
      keywordsInCommon: 38,
      avgPosition: 7.8,
      topKeywords: ["soccer predictions", "football betting tips", "match predictions"]
    },
    {
      id: 3,
      domain: "competitor3.com",
      keywordsInCommon: 29,
      avgPosition: 9.3,
      topKeywords: ["sports betting predictions", "football tips", "premier league predictions"]
    }
  ]
  
  // Mock data for pages
  const pages = [
    {
      id: 1,
      url: "/",
      title: "Sports Prediction Platform | Best Predictions & Betting Tips",
      metaDescription: "Get accurate sports predictions and betting tips from expert analysts. Join our community for premium predictions across all major sports.",
      h1: "Expert Sports Predictions & Betting Tips",
      wordCount: 1250,
      seoScore: 85,
      issues: ["Meta description could be more specific", "Add more internal links"],
      lastUpdated: "2023-05-15"
    },
    {
      id: 2,
      url: "/football-predictions",
      title: "Football Predictions | Expert Soccer Betting Tips & Analysis",
      metaDescription: "Daily football predictions and soccer betting tips with detailed analysis. Get expert predictions for Premier League, La Liga, Champions League and more.",
      h1: "Football Predictions & Soccer Betting Tips",
      wordCount: 1850,
      seoScore: 92,
      issues: [],
      lastUpdated: "2023-06-01"
    },
    {
      id: 3,
      url: "/basketball-predictions",
      title: "Basketball Predictions | NBA Betting Tips & Expert Analysis",
      metaDescription: "Expert basketball predictions and NBA betting tips. Daily analysis and predictions for NBA, EuroLeague and other major basketball leagues.",
      h1: "Basketball Predictions & NBA Betting Tips",
      wordCount: 1450,
      seoScore: 78,
      issues: ["Title tag too long", "Low keyword density", "Missing alt text on images"],
      lastUpdated: "2023-04-20"
    },
    {
      id: 4,
      url: "/tennis-predictions",
      title: "Tennis Predictions | ATP & WTA Betting Tips",
      metaDescription: "Professional tennis predictions for ATP, WTA and Grand Slam tournaments. Expert betting tips and analysis for all major tennis events.",
      h1: "Tennis Predictions & Betting Tips",
      wordCount: 1100,
      seoScore: 81,
      issues: ["Add more internal links", "Improve content depth"],
      lastUpdated: "2023-05-10"
    },
    {
      id: 5,
      url: "/vip-predictions",
      title: "VIP Predictions | Premium Betting Tips & Expert Analysis",
      metaDescription: "Exclusive VIP predictions with higher accuracy and detailed analysis. Premium betting tips for serious bettors with proven success rate.",
      h1: "VIP Predictions & Premium Betting Tips",
      wordCount: 1650,
      seoScore: 88,
      issues: ["Add more testimonials", "Update statistics"],
      lastUpdated: "2023-06-05"
    }
  ]
  
  // Mock data for SEO health checks
  const seoHealthChecks = [
    {
      id: 1,
      name: "Mobile Friendliness",
      status: "passed",
      score: 92,
      issues: 2,
      lastChecked: "2023-06-10",
      details: "Minor issues with tap targets on mobile devices"
    },
    {
      id: 2,
      name: "Page Speed",
      status: "warning",
      score: 68,
      issues: 5,
      lastChecked: "2023-06-10",
      details: "Large image files, render-blocking resources"
    },
    {
      id: 3,
      name: "Structured Data",
      status: "passed",
      score: 95,
      issues: 1,
      lastChecked: "2023-06-10",
      details: "Missing author information in article schema"
    },
    {
      id: 4,
      name: "Crawlability",
      status: "passed",
      score: 98,
      issues: 0,
      lastChecked: "2023-06-10",
      details: "No issues detected"
    },
    {
      id: 5,
      name: "HTTPS Security",
      status: "passed",
      score: 100,
      issues: 0,
      lastChecked: "2023-06-10",
      details: "No issues detected"
    },
    {
      id: 6,
      name: "Broken Links",
      status: "failed",
      score: 45,
      issues: 12,
      lastChecked: "2023-06-10",
      details: "12 broken internal links detected"
    }
  ]
  
  // Handle row selection
  const handleRowSelect = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  
  // Handle select all
  const handleSelectAll = (items: any[]) => {
    if (selectedRows.length === items.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(items.map(item => item.id));
    }
  };
  
  // Handle edit meta
  const handleEditMeta = (page: any) => {
    setSelectedPage(page);
    setIsEditMetaOpen(true);
  };
  
  // Handle schedule audit
  const handleScheduleAudit = () => {
    setIsAuditScheduleOpen(true);
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
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Overview Cards */}
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,853</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8%</div>
            <p className="text-xs text-muted-foreground">+0.6% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indexed Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
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
          <TabsTrigger value="content-optimization">
            <Edit className="h-4 w-4 mr-2" />
            Content Optimization
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <LineChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="health-checks">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Health Checks
          </TabsTrigger>
        </TabsList>
        
        {/* Keyword Performance Tab */}
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
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    All Keywords
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("high")}>
                    High Opportunity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("medium")}>
                    Medium Opportunity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("low")}>
                    Low Opportunity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button onClick={() => setIsAddKeywordOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Keyword
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Keyword Rankings</CardTitle>
                <CardDescription>
                  Track your position for target keywords over time
                </CardDescription>
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
                        <div className="flex items-center space-x-1" onClick={() => {
                          setSortColumn("position");
                          setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                        }}>
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
                          <Badge variant={
                            keyword.opportunity === "high" ? "default" :
                            keyword.opportunity === "medium" ? "secondary" : "outline"
                          }>
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
                              <DropdownMenuItem>View SERP</DropdownMenuItem>
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
            
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>
                  Compare your rankings with top competitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitors.map((competitor) => (
                    <div key={competitor.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{competitor.domain}</div>
                        <div className="text-sm text-muted-foreground">
                          {competitor.keywordsInCommon} keywords in common
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Avg. Position: {competitor.avgPosition}</div>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Keyword Opportunities</CardTitle>
              <CardDescription>
                Suggested keywords to target based on your current content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 border rounded-md p-3">
                  <div className="font-medium">football prediction app</div>
                  <div className="flex justify-between text-sm">
                    <span>Volume: 4,800</span>
                    <span>Difficulty: 62</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Currently ranking: #32
                  </div>
                  <Button size="sm" className="w-full">Add to Tracking</Button>
                </div>
                
                <div className="space-y-2 border rounded-md p-3">
                  <div className="font-medium">best football tips site</div>
                  <div className="flex justify-between text-sm">
                    <span>Volume: 3,200</span>
                    <span>Difficulty: 58</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Currently ranking: #28
                  </div>
                  <Button size="sm" className="w-full">Add to Tracking</Button>
                </div>
                
                <div className="space-y-2 border rounded-md p-3">
                  <div className="font-medium">accurate soccer predictions</div>
                  <div className="flex justify-between text-sm">
                    <span>Volume: 5,100</span>
                    <span>Difficulty: 65</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Currently ranking: #25
                  </div>
                  <Button size="sm" className="w-full">Add to Tracking</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Meta Information Tab */}
        <TabsContent value="meta-information" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search pages..."
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
                  <DropdownMenuLabel>Filter by SEO Score</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    All Pages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("high")}>
                    High (90-100)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("medium")}>
                    Medium (70-89)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("low")}>
                    Low (0-69)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Page Meta Information</CardTitle>
              <CardDescription>
                Edit and optimize meta titles and descriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox 
                        checked={selectedRows.length === pages.length} 
                        onCheckedChange={() => handleSelectAll(pages)}
                      />
                    </TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>SEO Score</TableHead>
                    <TableHead>Issues</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedRows.includes(page.id)} 
                          onCheckedChange={() => handleRowSelect(page.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{page.url}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{page.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={page.seoScore} className="h-2 w-[60px]" />
                          <span>{page.seoScore}</span>
                        </div>
                      </TableCell>
                      <TableCell>{page.issues.length}</TableCell>
                      <TableCell>{page.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditMeta(page)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Title Tag Length</CardTitle>
                <CardDescription>
                  Optimal length: 50-60 characters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div key={page.id} className="space-y-2">
                      <div className="flex items-center justify-between"></div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{page.url}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Visit</span>
                        </Button>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Keywords in common:</span>
                          <span className="ml-1 font-medium">{page.keywordsInCommon}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg. position:</span>
                          <span className="ml-1 font-medium">{page.avgPosition}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground">Top keywords:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {page.topKeywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Add other TabsContent sections for other tabs */}
        <TabsContent value="meta-information" className="space-y-4">
          {/* Meta Information Tab Content */}
        </TabsContent>
        
        <TabsContent value="content-optimization" className="space-y-4">
          {/* Content Optimization Tab Content */}
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics Tab Content */}
        </TabsContent>
        
        <TabsContent value="health-checks" className="space-y-4">
          {/* Health Checks Tab Content */}
        </TabsContent>
      </Tabs>
      
      {/* Add Keyword Dialog */}
      <Dialog open={isAddKeywordOpen} onOpenChange={setIsAddKeywordOpen}>
        {/* ... existing code ... */}
      </Dialog>
      
      {/* Edit Meta Dialog */}
      <Dialog open={isEditMetaOpen} onOpenChange={setIsEditMetaOpen}>
        {/* ... existing code ... */}
      </Dialog>
      
      {/* Audit Schedule Dialog */}
      <Dialog open={isAuditScheduleOpen} onOpenChange={setIsAuditScheduleOpen}>
        {/* ... existing code ... */}
      </Dialog>
    </div>
  );
}