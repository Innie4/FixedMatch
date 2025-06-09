'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar, Filter, Search, RefreshCw } from 'lucide-react'
import { VIPPredictionList } from '@/components/vip/VIPPredictionList'
import { SubscriptionStatus } from '@/components/vip/SubscriptionStatus'

export default function VIPPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('today')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">VIP Predictions</h1>

      <SubscriptionStatus />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Today</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search teams or leagues..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <Tabs defaultValue="daily-2-odds" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="daily-2-odds">Daily 2 Odds</TabsTrigger>
          <TabsTrigger value="daily-10-odds">Daily 10 Odds</TabsTrigger>
          <TabsTrigger value="draw-odds">Draw Odds</TabsTrigger>
          <TabsTrigger value="over-under">Over/Under</TabsTrigger>
          <TabsTrigger value="btts">BTTS</TabsTrigger>
        </TabsList>

        <TabsContent value="daily-2-odds" className="mt-0">
          <VIPPredictionList category="daily-2-odds" filter={dateFilter} search={searchTerm} />
        </TabsContent>
        {/* Add other TabsContent components for each category */}
      </Tabs>
    </div>
  )
}
