'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AvatarCategory, Avatar, AvatarError } from './types'

interface AvatarSelectorProps {
  currentAvatar: string
  onSelect: (avatar: string) => Promise<void>
  onClose: () => void
  isOpen: boolean
}

const AVATAR_CATEGORIES: AvatarCategory[] = ['all', 'abstract', 'animals', 'people', 'sports']

export function AvatarSelector({ currentAvatar, onSelect, onClose, isOpen }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState<AvatarCategory>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AvatarError | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!gridRef.current) return

    const buttons = Array.from(gridRef.current.querySelectorAll('button'))
    const currentIndex = buttons.findIndex((button) => button === document.activeElement)

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % buttons.length
        buttons[nextIndex]?.focus()
        break
      case 'ArrowLeft':
        e.preventDefault()
        const prevIndex = currentIndex - 1 < 0 ? buttons.length - 1 : currentIndex - 1
        buttons[prevIndex]?.focus()
        break
      case 'ArrowDown':
        e.preventDefault()
        const downIndex = currentIndex + 4 < buttons.length ? currentIndex + 4 : currentIndex
        buttons[downIndex]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        const upIndex = currentIndex - 4 >= 0 ? currentIndex - 4 : currentIndex
        buttons[upIndex]?.focus()
        break
    }
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setError(null)

    try {
      await onSelect(selectedAvatar)
      onClose()
    } catch (err) {
      setError({
        message: 'Failed to update avatar. Please try again.',
        code: 'UPDATE_ERROR',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px]"
        role="dialog"
        aria-labelledby="avatar-dialog-title"
      >
        <DialogHeader>
          <DialogTitle id="avatar-dialog-title">Choose Your Avatar</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search avatars..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search avatars"
              />
            </div>
            <select
              className="rounded-md border p-2"
              value={category}
              onChange={(e) => setCategory(e.target.value as AvatarCategory)}
              aria-label="Filter by category"
            >
              {AVATAR_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div
            ref={gridRef}
            className="grid grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2"
            role="grid"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {Array.from({ length: 20 }).map((_, index) => (
              <button
                key={index}
                className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all
                  ${selectedAvatar === `/avatars/avatar-${index + 1}.png` ? 'border-primary' : 'border-transparent hover:border-muted'}`}
                onClick={() => setSelectedAvatar(`/avatars/avatar-${index + 1}.png`)}
                role="gridcell"
                aria-label={`Avatar ${index + 1}`}
                aria-selected={selectedAvatar === `/avatars/avatar-${index + 1}.png`}
              >
                <Image
                  src={`/avatars/avatar-${index + 1}.png`}
                  alt={`Avatar option ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 20vw"
                  priority={index < 8} // Load first 8 images immediately
                  loading={index >= 8 ? 'lazy' : undefined}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-4">
              <div
                className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-muted"
                role="img"
                aria-label="Selected avatar preview"
              >
                <Image
                  src={selectedAvatar}
                  alt="Selected avatar preview"
                  fill
                  className="object-cover"
                  priority
                  onError={() => {
                    setError({
                      message: 'Failed to load avatar image',
                      code: 'LOAD_ERROR',
                    })
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground">Preview</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading} aria-busy={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
