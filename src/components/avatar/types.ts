export type AvatarSize = 'sm' | 'md' | 'lg'

export type AvatarCategory = 'all' | 'abstract' | 'animals' | 'people' | 'sports'

export interface Avatar {
  id: string
  src: string
  alt: string
  category: AvatarCategory
}

export interface AvatarError {
  message: string
  code: 'LOAD_ERROR' | 'UPDATE_ERROR' | 'INVALID_FILE'
}