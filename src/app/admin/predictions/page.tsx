"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  FileText, 
  Search, 
  Filter, 
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
  BarChart3,
  Star,
  ListFilter,
  CalendarDays,
  Grid3X3,
  ToggleLeft,
  ToggleRight
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function PredictionManagementPage() {
  const [isAddPredictionOpen, setIsAddPredictionOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false)
  const [selectedPrediction, setSelectedPrediction] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [viewMode, setViewMode] = useState("table")
  
  // Mock predictions data
  const predictions = [
    {
      id: 1,
      homeTeam: "Manchester United",
      homeTeamLogo: "/placeholder.svg?height=32&width=32",
      awayTeam: "Liverpool",
      awayTeamLogo: "/placeholder.svg?height=32&width=32",
      competition: "Premier League",
      date: "2023-06-15",
      time: "15:00",
      prediction: "Home Win",
      odds: "2.10",
      status: "upcoming",
      result: null,
      isVip: true,
      createdBy: "Admin",
      createdAt: "2023-06-10 14:30",
    },
    {
      id: 2,
      homeTeam: "Bayern Munich",
      homeTeamLogo: "/placeholder.svg?height=32&width=32",
      awayTeam: "Borussia Dortmund",
      awayTeamLogo: "/placeholder.svg?height=32&width=32",
      competition: "Bundesliga",
      date: "2023-06-16",
      time: "17:30",
      prediction: "Over 2.5 Goals",
      odds: "1.85",
      status: "upcoming",
      result: null,
      isVip: false,
      createdBy: "Admin",
      createdAt: "2023-06-10 15:45",
    },
    {
      id: 3,
      homeTeam: "Real Madrid",
      homeTeamLogo: "/placeholder.svg?height=32&width=32",
      awayTeam: "Barcelona",
      awayTeamLogo: "/placeholder.svg?height=32&width=32",
      competition: "La Liga",
      date: "2023-06-14",
      time: "20:00",
      prediction: "Draw",
      odds: "3.50",
      status: "upcoming",
      result: null,
      isVip: true,
      createdBy: "Admin",
      createdAt: "2023-06-09 11:20",
    },
    {
      id: 4,
      homeTeam: "Arsenal",
      homeTeamLogo: "/placeholder.svg?height=32&width=32",
      awayTeam: "Chelsea",
      awayTeamLogo: "/placeholder.svg?height=32&width=32",
      competition: "Premier League",
      date: "2023-06-12",
      time: "19:45",
      prediction: "Away Win",
      odds: "2.75",
      status: "completed",
      result: "won",
      isVip: false,
      createdBy: "Admin",
      createdAt: "2023-06-08 09:30",
    },
    // Add more mock predictions as needed
  ]
  
  // Filter predictions based on search term and status filter
  const filteredPredictions = predictions.filter(prediction => {
    const matchesSearch = 
      prediction.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.competition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.prediction.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" || 
      prediction.status === filterStatus ||
      (filterStatus === "vip" && prediction.isVip);
    
    return matchesSearch && matchesFilter;
  });
  
  // Sort predictions
  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    if (sortColumn === "date") {
      return sortDirection === "asc" 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    // Add more sorting options as needed
    return 0;
  });
  
  // Paginate predictions
  const totalPages = Math.ceil(sortedPredictions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPredictions = sortedPredictions.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle row selection
  const handleRowSelect = (predictionId) => {
    if (selectedRows.includes(predictionId)) {
      setSelectedRows(selectedRows.filter(id => id !== predictionId));
    } else {
      setSelectedRows([...selectedRows, predictionId]);
    }
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedPredictions.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedPredictions.map(prediction => prediction.id));
    }
  };
  
  // Handle sort
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  // Handle bulk actions
  const handleBulkAction = (action) => {
    // In a real app, this would call an API to perform the action
    console.log(`Performing ${action} on predictions:`, selectedRows);
    
    // Reset selection after action
    setSelectedRows([]);
  };
  
  // Handle prediction preview
  const handlePreview = (prediction) => {
    setSelectedPrediction(prediction);
    setIsPreviewOpen(true);
  };
  
  // Handle prediction edit
  const handleEdit = (prediction) => {
    setSelectedPrediction(prediction);
    setIsAddPredictionOpen(true);
  };
  
  // Handle prediction delete
  const handleDelete = (prediction) => {
    setSelectedPrediction(prediction);
    setIsDeleteConfirmOpen(true);
  };
  
  return (
    // ... existing code ...