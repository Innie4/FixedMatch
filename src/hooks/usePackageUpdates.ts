import { useState, useEffect, useCallback } from 'react'
import type { Package } from '@/types'
import { packageAnalytics } from '@/lib/analytics'

interface PackageUpdateHook {
  packages: Package[];
  loading: boolean;
  error: Error | null;
  updatePackage: (id: string, data: Partial<Package>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
}

export function usePackageUpdates(): PackageUpdateHook {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/packages')
      if (!response.ok) {
        throw new Error('Failed to fetch packages')
      }
      const data = await response.json()
      setPackages(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch packages'))
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePackage = useCallback(async (id: string, data: Partial<Package>) => {
    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to update package')
      }
      await fetchPackages()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update package'))
    }
  }, [fetchPackages])

  const deletePackage = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete package')
      }
      await fetchPackages()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete package'))
    }
  }, [fetchPackages])

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  return {
    packages,
    loading,
    error,
    updatePackage,
    deletePackage,
  }
} 