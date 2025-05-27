import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface VIPPredictionDialogProps {
  open: boolean
  onClose: () => void
  prediction?: any // Replace with proper type
}

export function VIPPredictionDialog({ open, onClose, prediction }: VIPPredictionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(prediction || {
    categoryId: '',
    homeTeam: '',
    awayTeam: '',
    league: '',
    matchTime: '',
    prediction: '',
    odds: '',
    analysis: '',
    confidence: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/vip-predictions', {
        method: prediction ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prediction ? { ...formData, id: prediction.id } : formData)
      })

      if (!response.ok) throw new Error('Failed to save prediction')
      onClose()
    } catch (error) {
      console.error('Error saving prediction:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{prediction ? 'Edit' : 'Add'} VIP Prediction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {/* Add category options */}
            </SelectContent>
          </Select>

          <Input
            placeholder="Home Team"
            value={formData.homeTeam}
            onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
          />

          <Input
            placeholder="Away Team"
            value={formData.awayTeam}
            onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
          />

          <Input
            placeholder="League"
            value={formData.league}
            onChange={(e) => setFormData({ ...formData, league: e.target.value })}
          />

          <Input
            type="datetime-local"
            value={formData.matchTime}
            onChange={(e) => setFormData({ ...formData, matchTime: e.target.value })}
          />

          <Input
            placeholder="Prediction"
            value={formData.prediction}
            onChange={(e) => setFormData({ ...formData, prediction: e.target.value })}
          />

          <Input
            type="number"
            step="0.01"
            placeholder="Odds"
            value={formData.odds}
            onChange={(e) => setFormData({ ...formData, odds: parseFloat(e.target.value) })}
          />

          <Input
            type="number"
            placeholder="Confidence (%)"
            value={formData.confidence}
            onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) })}
          />

          <Textarea
            placeholder="Analysis"
            value={formData.analysis}
            onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : prediction ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}