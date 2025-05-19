"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  UserPlus,
  CreditCard
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { StatCard } from "@/components/admin/ui/stat-card"
import { PageHeader, DateRangeSelector } from "@/components/admin/page-header"
import { ActivityList } from "@/components/admin/activity-list"
import { NotificationList } from "@/components/admin/notification-list"

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState("7d")
  
  // Mock data for the dashboard
  const stats = [
    {
      title: "Active Users",
      value: "12,543",
      change: "+14.2%",
      trend: "up" as const,
      icon: <Users className="h-5 w-5" />,
      color: "blue" as const
    },
    {
      title: "Subscription Revenue",
      value: "$24,853",
      change: "+5.4%",
      trend: "up" as const,
      icon: <CreditCard className="h-5 w-5" />,
      color: "green" as const
    },
    {
      title: "Conversion Rate",
      value: "3.6%",
      change: "-0.8%",
      trend: "down" as const,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "red" as const
    },
    {
      title: "New Signups",
      value: "842",
      change: "+28.4%",
      trend: "up" as const,
      icon: <UserPlus className="h-5 w-5" />,
      color: "purple" as const
    }
  ]
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "New prediction review needed",
      description: "Premier League: Arsenal vs Chelsea prediction awaiting approval",
      time: "10 minutes ago",
      type: "review",
      priority: "high" as const
    },
    {
      id: 2,
      title: "VIP subscription expiring",
      description: "15 VIP subscriptions will expire in the next 7 days",
      time: "2 hours ago",
      type: "subscription",
      priority: "medium" as const
    },
    {
      id: 3,
      title: "System update required",
      description: "New security patch available for the admin dashboard",
      time: "1 day ago",
      type: "system",
      priority: "high" as const
    },
    {
      id: 4,
      title: "New user feedback",
      description: "3 new user reviews need moderation",
      time: "2 days ago",
      type: "feedback",
      priority: "medium" as const
    }
  ]
  
  // Mock recent activity data
  const recentActivity = [
    {
      id: 1,
      action: "Added new prediction",
      admin: "John Doe",
      timestamp: "Today, 10:30 AM",
      details: "Added Bayern Munich vs Dortmund prediction"
    },
    {
      id: 2,
      action: "Updated user status",
      admin: "Sarah Johnson",
      timestamp: "Today, 09:15 AM",
      details: "Changed user #4582 to VIP status"
    },
    {
      id: 3,
      action: "Approved review",
      admin: "Mike Wilson",
      timestamp: "Yesterday, 4:45 PM",
      details: "Approved review #1258 for publication"
    },
    {
      id: 4,
      action: "New user registration",
      admin: "System",
      timestamp: "Yesterday, 2:30 PM",
      details: "User #4892 registered via Google OAuth"
    },
    {
      id: 5,
      action: "Updated system settings",
      admin: "Admin",
      timestamp: "Yesterday, 11:20 AM",
      details: "Changed email notification settings"
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Dashboard" 
        description="Overview of your platform's performance and activity."
      >
        <DateRangeSelector timeRange={timeRange} onChange={setTimeRange} />
        <Button className="h-8 bg-[#1a56db] hover:bg-[#1e40af]">Export</Button>
      </PageHeader>

      {/* Overview Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Performance Metrics */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Performance Metrics</CardTitle>
            <Tabs defaultValue="users" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {/* Chart would go here */}
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Chart visualization would be displayed here
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationList notifications={notifications} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityList title="" activities={recentActivity} />
          </CardContent>
        </Card>

        {/* Subscription Stats */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Subscription Stats</CardTitle>
            <CardDescription>Distribution of subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#1a56db] mr-2"></div>
                    <span>Monthly Premium</span>
                  </div>
                  <span className="font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#10b981] mr-2"></div>
                    <span>Quarterly Pro</span>
                  </div>
                  <span className="font-medium">25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b] mr-2"></div>
                    <span>Weekly Pass</span>
                  </div>
                  <span className="font-medium">10%</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium mb-4">Subscription Growth</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>New subscriptions this month</span>
                  <span className="font-medium">+842</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Renewal rate</span>
                  <span className="font-medium">76%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Churn rate</span>
                  <span className="font-medium">24%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}