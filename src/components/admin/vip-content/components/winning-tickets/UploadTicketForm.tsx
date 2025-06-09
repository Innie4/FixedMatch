import { useState } from 'react'
import { ImagePlus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface UploadTicketFormProps {
  isOpen: boolean
  onClose: () => void
}

interface Match {
  teams: string
  prediction: string
  result: string
}

export function UploadTicketForm({ isOpen, onClose }: UploadTicketFormProps) {
  const [title, setTitle] = useState('')
  const [odds, setOdds] = useState('')
  const [stake, setStake] = useState('')
  const [winnings, setWinnings] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [matches, setMatches] = useState<Match[]>([{ teams: '', prediction: '', result: '' }])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addMatch = () => {
    setMatches([...matches, { teams: '', prediction: '', result: '' }])
  }

  const removeMatch = (index: number) => {
    const updatedMatches = [...matches]
    updatedMatches.splice(index, 1)
    setMatches(updatedMatches)
  }

  const updateMatch = (index: number, field: keyof Match, value: string) => {
    const updatedMatches = [...matches]
    updatedMatches[index][field] = value
    setMatches(updatedMatches)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create ticket object
    const ticket = {
      title,
      odds,
      stake,
      winnings,
      featured: isFeatured,
      matches,
      image: imagePreview || '/placeholder.svg',
    }

    console.log('Submitting ticket:', ticket)

    // Reset form and close dialog
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setTitle('')
    setOdds('')
    setStake('')
    setWinnings('')
    setIsFeatured(false)
    setMatches([{ teams: '', prediction: '', result: '' }])
    setImagePreview(null)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Winning Ticket</DialogTitle>
          <DialogDescription>Add a new winning ticket to showcase to VIP members</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="ticket-image">Ticket Image</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="Ticket preview"
                      className="w-full h-auto rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setImagePreview(null)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PNG, JPG or WEBP (max. 2MB)</p>
                  </div>
                )}
                <Input
                  id="ticket-image"
                  type="file"
                  accept="image/*"
                  className={imagePreview ? 'hidden' : 'absolute inset-0 opacity-0 cursor-pointer'}
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Ticket Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Premier League Accumulator"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="odds">Odds</Label>
                  <Input
                    id="odds"
                    placeholder="e.g. 12.50"
                    value={odds}
                    onChange={(e) => setOdds(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stake">Stake</Label>
                  <Input
                    id="stake"
                    placeholder="e.g. $50.00"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="winnings">Winnings</Label>
                  <Input
                    id="winnings"
                    placeholder="e.g. $625.00"
                    value={winnings}
                    onChange={(e) => setWinnings(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                <Label htmlFor="featured">Feature this ticket</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Matches</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMatch}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Match
                </Button>
              </div>

              {matches.map((match, index) => (
                <div key={index} className="grid gap-3 p-3 border rounded-md">
                  <div className="grid gap-2">
                    <Label htmlFor={`teams-${index}`}>Teams</Label>
                    <Input
                      id={`teams-${index}`}
                      placeholder="e.g. Arsenal vs Chelsea"
                      value={match.teams}
                      onChange={(e) => updateMatch(index, 'teams', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor={`prediction-${index}`}>Prediction</Label>
                      <Input
                        id={`prediction-${index}`}
                        placeholder="e.g. Home Win"
                        value={match.prediction}
                        onChange={(e) => updateMatch(index, 'prediction', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`result-${index}`}>Result</Label>
                      <Input
                        id={`result-${index}`}
                        placeholder="e.g. 3-1"
                        value={match.result}
                        onChange={(e) => updateMatch(index, 'result', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  {matches.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="justify-self-end text-red-500 hover:text-red-600"
                      onClick={() => removeMatch(index)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Upload Ticket</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
