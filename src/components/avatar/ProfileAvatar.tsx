'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AvatarSelector } from './AvatarSelector'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AvatarSize, AvatarError } from './types'

interface ProfileAvatarProps {
  currentAvatar: string
  onAvatarChange: (avatar: string) => Promise<void>
  size?: AvatarSize
  className?: string
}

const SIZES: Record<AvatarSize, string> = {
  sm: 'h-10 w-10',
  md: 'h-16 w-16',
  lg: 'h-24 w-24'
}

export function ProfileAvatar({ 
  currentAvatar, 
  onAvatarChange, 
  size = 'md',
  className = ''
}: ProfileAvatarProps) {
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false)
  const [avatar, setAvatar] = useState(currentAvatar)
  const [error, setError] = useState<AvatarError | null>(null)

  const handleAvatarChange = async (newAvatar: string) => {
    setError(null)
    try {
      await onAvatarChange(newAvatar)
      setAvatar(newAvatar)
    } catch (err) {
      setError({
        message: 'Failed to update avatar. Please try again.',
        code: 'UPDATE_ERROR'
      })
    }
  }

  return (
    <div className="relative">
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      
      <button
        onClick={() => setIsSelectingAvatar(true)}
        className={`relative ${SIZES[size]} rounded-full overflow-hidden border-2 border-muted hover:border-primary transition-colors ${className}`}
        aria-label="Change avatar"
        role="button"
      >
        <Image
          src={avatar}
          alt="Profile avatar"
          fill
          className="object-cover"
          sizes={`(max-width: 768px) ${size === 'lg' ? '96px' : size === 'md' ? '64px' : '40px'}, ${size === 'lg' ? '96px' : size === 'md' ? '64px' : '40px'}`}
          priority
          onError={() => {
            setError({
              message: 'Failed to load avatar image',
              code: 'LOAD_ERROR'
            })
            // Fallback to default avatar
            const img = document.createElement('img')
            img.src = '/avatars/default.png'
            img.onload = () => setAvatar('/avatars/default.png')
          }}
        />
      </button>

      <AvatarSelector
        currentAvatar={avatar}
        onSelect={handleAvatarChange}
        onClose={() => setIsSelectingAvatar(false)}
        isOpen={isSelectingAvatar}
      />
    </div>
  )
}