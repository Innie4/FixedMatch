'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Filter, Search, Archive } from 'lucide-react'
import { VIPPredictionDialog } from './components/VIPPredictionDialog'

interface VIPPrediction {
  id: number
  homeTeam: string
  awayTeam: string
  prediction: string
  odds: number
  status: string
  category: {
    name: string
  }
  matchTime: string
}

export default function VIPPredictionsAdmin() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [predictions, setPredictions] = useState<VIPPrediction[]>([])
  const [selectedPrediction, setSelectedPrediction] = useState<VIPPrediction | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    startDate: '',
    endDate: '',
    archived: false
  })

  const fetchPredictions = async () => {
    const params = new URLSearchParams({
      ...filters,
      archived: filters.archived.toString()
    })
    const response = await fetch(`/api/admin/vip-predictions?${params}`)
    const data = await response.json()
    setPredictions(data)
  }

  useEffect(() => {
    fetchPredictions()
  }, [filters])

  const handleStatusUpdate = async (id: number, status: string, result: string) => {
    await fetch('/api/admin/vip-predictions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, result })
    })
    fetchPredictions()
  }

  const handleArchive = async (id: number) => {
    await fetch('/api/admin/vip-predictions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isArchived: true })
    })
    fetchPredictions()
  }

  const columns = [
    { accessorKey: 'matchTime', header: 'Date & Time' },
    { accessorKey: 'category.name', header: 'Category' },
    { accessorKey: 'homeTeam', header: 'Home Team' },
    { accessorKey: 'awayTeam', header: 'Away Team' },
    { accessorKey: 'prediction', header: 'Prediction' },
    { accessorKey: 'odds', header: 'Odds' },
    { accessorKey: 'status', header: 'Status' },
    { 
      id: 'actions',
      cell: ({ row }: { row: { original: VIPPrediction } }) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedPrediction(row.original)
              setShowAddDialog(true)
            }}
          >
            Edit
          </Button>
          {row.original.status === 'pending' && (
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="bg-green-50"
                onClick={() => handleStatusUpdate(row.original.id, 'won', 'won')}
              >
                Won
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-red-50"
                onClick={() => handleStatusUpdate(row.original.id, 'lost', 'lost')}
              >
                Lost
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleArchive(row.original.id)}
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">VIP Predictions</h1>
        <Button onClick={() => {
          setSelectedPrediction(null)
          setShowAddDialog(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Prediction
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search teams or leagues..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="max-w-xs"
        />
        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
        <Button
          variant="outline"
          onClick={() => setFilters({ ...filters, archived: !filters.archived })}
        >
          {filters.archived ? 'Show Active' : 'Show Archived'}
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={predictions}
      />
      
      <VIPPredictionDialog 
        open={showAddDialog} 
        onClose={() => {
          setShowAddDialog(false)
          setSelectedPrediction(null)
        }}
        prediction={selectedPrediction}
      />
    </div>
  )
}