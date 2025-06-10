import { useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { packageAnalytics } from '@/lib/analytics'

export function usePackageUpdates() {
  const queryClient = useQueryClient()

  const handleUpdate = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      
      // Update the cache based on the event type
      switch (data.type) {
        case 'create':
          queryClient.setQueryData(['packages'], (old: any) => [...old, data.data])
          packageAnalytics.trackPackageCreated(data.data)
          break
        case 'update':
          queryClient.setQueryData(['packages'], (old: any) =>
            old.map((pkg: any) => (pkg.id === data.data.id ? data.data : pkg))
          )
          packageAnalytics.trackPackageUpdated(data.data.id, data.data)
          break
        case 'delete':
          queryClient.setQueryData(['packages'], (old: any) =>
            old.filter((pkg: any) => pkg.id !== data.data.id)
          )
          packageAnalytics.trackPackageDeleted(data.data.id, data.data.name)
          break
      }
    } catch (error) {
      console.error('Error processing package update:', error)
    }
  }, [queryClient])

  useEffect(() => {
    const eventSource = new EventSource('/api/packages/updates')

    eventSource.onmessage = handleUpdate
    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [handleUpdate])
} 