"use client"

import { useState } from "react"
import { 
  Star, 
  Search, 
  Filter, 
  ChevronDown, 
  ImagePlus, 
  Megaphone, 
  Package, 
  BarChart3,
  Trophy
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { WinningTicketsTab } from "./components/WinningTicketsTab"
import { PackagesTab } from "./components/PackagesTab"
import { PerformanceTab } from "./components/PerformanceTab"
import { AnnouncementsTab } from "./components/AnnouncementsTab"
import { SubscriptionPackage, WinningTicket, Announcement, VipPredictionPerformance } from "./types"

export default function VIPContentManagementPage() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDateRange, setFilterDateRange] = useState("all")
  const [sortColumn, setSortColumn] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [predictionTimeRange, setPredictionTimeRange] = useState("month")
  
  // Mock data for each tab
  const winningTickets: WinningTicket[] = [
    {
      id: 1,
      title: "Premier League Accumulator",
      image: "/placeholder.svg?height=80&width=80",
      odds: "12.50",
      winnings: "$625.00",
      stake: "$50.00",
      date: "2023-06-10",
      status: "active",
      featured: true,
      matches: [
        { teams: "Arsenal vs Chelsea", prediction: "Home Win", result: "won" },
        { teams: "Liverpool vs Man City", prediction: "Over 2.5", result: "won" },
        { teams: "Newcastle vs Tottenham", prediction: "BTTS", result: "won" }
      ],
      uploadedBy: "Admin",
      uploadedAt: "2023-06-10 14:30"
    },
    {
      id: 2,
      title: "Champions League Special",
      image: "/placeholder.svg?height=80&width=80",
      odds: "8.75",
      winnings: "$437.50",
      stake: "$50.00",
      date: "2023-06-05",
      status: "active",
      featured: false,
      matches: [
        { teams: "Real Madrid vs Bayern", prediction: "Away Win", result: "won" },
        { teams: "PSG vs Man United", prediction: "Home Win", result: "won" }
      ],
      uploadedBy: "Admin",
      uploadedAt: "2023-06-05 10:15"
    }
  ]
  
  const packages: SubscriptionPackage[] = [
    {
      id: 1,
      name: "VIP Monthly",
      description: "Access to all premium predictions for 30 days",
      price: 29.99,
      discountedPrice: 24.99,
      duration: 30,
      durationType: "days",
      features: ["Daily premium picks", "Winning ticket access", "Email notifications"],
      status: "active",
      subscribers: 245,
      conversionRate: 8.5,
      featured: true,
      popular: true
    },
    {
      id: 2,
      name: "VIP Weekly",
      description: "Access to all premium predictions for 7 days",
      price: 9.99,
      discountedPrice: null,
      duration: 7,
      durationType: "days",
      features: ["Daily premium picks", "Winning ticket access"],
      status: "active",
      subscribers: 178,
      conversionRate: 12.3,
      featured: false,
      popular: false
    }
  ]
  
  const announcements: Announcement[] = [
    {
      id: 1,
      title: "New VIP Package Available",
      content: "We've launched a new quarterly VIP package with special discounts!",
      publishDate: "2023-06-10",
      expiryDate: "2023-07-10",
      targetAudience: "all",
      views: 342,
      clicks: 87,
      status: "published",
      author: "Admin",
      createdAt: "2023-06-09"
    },
    {
      id: 2,
      title: "Maintenance Scheduled",
      content: "The site will be down for maintenance on June 15th from 2-4 AM UTC.",
      publishDate: "2023-06-08",
      expiryDate: "2023-06-15",
      targetAudience: "vip",
      views: 156,
      clicks: 23,
      status: "published",
      author: "System",
      createdAt: "2023-06-07"
    }
  ]
  
  // Mock performance data
  const vipPredictionPerformanceData: VipPredictionPerformance[] = [
    {
      period: "Jan 2023",
      totalPredictions: 124,
      successRate: 68.5,
      averageOdds: 1.95,
      profit: 42.8,
      roi: 12.4,
      comparison: {
        vip: { successRate: 68.5, roi: 12.4 },
        free: { successRate: 52.3, roi: 5.8 }
      }
    },
    {
      period: "Feb 2023",
      totalPredictions: 118,
      successRate: 72.1,
      averageOdds: 2.05,
      profit: 56.2,
      roi: 15.8,
      comparison: {
        vip: { successRate: 72.1, roi: 15.8 },
        free: { successRate: 54.7, roi: 7.2 }
      }
    },
    {
      period: "Mar 2023",
      totalPredictions: 132,
      successRate: 65.9,
      averageOdds: 1.88,
      profit: 38.5,
      roi: 10.2,
      comparison: {
        vip: { successRate: 65.9, roi: 10.2 },
        free: { successRate: 50.1, roi: 4.5 }
      }
    }
  ]
  
  // Calculate overall performance from the array data
  const vipPredictionPerformance = {
    overall: {
      total: vipPredictionPerformanceData.reduce((sum, item) => sum + item.totalPredictions, 0),
      won: vipPredictionPerformanceData.reduce((sum, item) => sum + Math.round(item.totalPredictions * item.successRate / 100), 0),
      lost: vipPredictionPerformanceData.reduce((sum, item) => sum + Math.round(item.totalPredictions * (100 - item.successRate) / 100), 0),
      successRate: vipPredictionPerformanceData.reduce((sum, item) => sum + item.successRate, 0) / vipPredictionPerformanceData.length,
      averageOdds: vipPredictionPerformanceData.reduce((sum, item) => sum + item.averageOdds, 0) / vipPredictionPerformanceData.length,
      roi: vipPredictionPerformanceData.reduce((sum, item) => sum + item.roi, 0) / vipPredictionPerformanceData.length
    },
    comparison: {
      vip: {
        successRate: vipPredictionPerformanceData.reduce((sum, item) => sum + item.comparison.vip.successRate, 0) / vipPredictionPerformanceData.length,
        roi: vipPredictionPerformanceData.reduce((sum, item) => sum + item.comparison.vip.roi, 0) / vipPredictionPerformanceData.length
      },
      free: {
        successRate: vipPredictionPerformanceData.reduce((sum, item) => sum + item.comparison.free.successRate, 0) / vipPredictionPerformanceData.length,
        roi: vipPredictionPerformanceData.reduce((sum, item) => sum + item.comparison.free.roi, 0) / vipPredictionPerformanceData.length
      }
    }
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = (type: string, id: number) => {
    console.log(`Deleting ${type} with ID: ${id}`)
    // In a real app, you would call an API to delete the item
  }
  
  // Handle edit
  const handleEdit = (item: any) => {
    console.log("Editing item:", item)
    // In a real app, you would open an edit modal/form
  }
  
  // Handle feature toggle
  const handleFeatureToggle = (id: number, type: string) => {
    console.log(`Toggling feature status for ${type} with ID: ${id}`)
    // In a real app, you would call an API to update the item
  }
  
  // Handle create announcement
  const handleCreateAnnouncement = () => {
    console.log("Creating new announcement")
    // In a real app, you would open a creation modal/form
  }

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
                <BreadcrumbLink href="/admin/vip-content">VIP Content</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold tracking-tight">VIP Content Management</h1>
          <p className="text-muted-foreground">
            Manage all VIP content including packages, winning tickets, and announcements.
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Items
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Active Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                Inactive Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total VIP Subscribers</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">423</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Revenue</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,543</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2%</div>
            <p className="text-xs text-muted-foreground">+1.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Winning Tickets</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages">
            <Package className="h-4 w-4 mr-2" />
            Packages
          </TabsTrigger>
          <TabsTrigger value="winning-tickets">
            <Trophy className="h-4 w-4 mr-2" />
            Winning Tickets
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <Megaphone className="h-4 w-4 mr-2" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="packages" className="space-y-4">
          <PackagesTab
            packages={packages}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onDeleteConfirm={handleDeleteConfirm}
            onEdit={handleEdit}
            onFeatureToggle={handleFeatureToggle}
          />
        </TabsContent>
        
        <TabsContent value="winning-tickets" className="space-y-4">
          <WinningTicketsTab
            tickets={winningTickets}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterDateRange={filterDateRange}
            setFilterDateRange={setFilterDateRange}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onDeleteConfirm={handleDeleteConfirm}
            onEdit={handleEdit}
            onFeatureToggle={handleFeatureToggle}
          />
        </TabsContent>
        
        <TabsContent value="announcements" className="space-y-4">
          <AnnouncementsTab
            announcements={announcements}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onDeleteConfirm={handleDeleteConfirm}
            onEdit={handleEdit}
            onCreateAnnouncement={handleCreateAnnouncement}
          />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <PerformanceTab 
            predictionTimeRange={predictionTimeRange}
            setPredictionTimeRange={setPredictionTimeRange}
            vipPredictionPerformance={vipPredictionPerformance}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}