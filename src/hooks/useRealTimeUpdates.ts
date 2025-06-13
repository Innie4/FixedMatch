import { useEffect, useState } from 'react'
import websocketService from '@/services/websocket'
import type { WebSocketMessage } from '@/types'

interface RealTimeUpdateHook<T> {
  data: T | null;
  error: Error | null;
  lastUpdate: string | null;
}

export function useRealTimeUpdates<T>(eventType: string): RealTimeUpdateHook<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  useEffect(() => {
    const handleMessage = (message: WebSocketMessage) => {
      if (message.type === eventType || message.type === 'GLOBAL_UPDATE') {
        try {
          setData(message.payload as T)
          setLastUpdate(message.timestamp)
          setError(null)
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to process update'))
        }
      }
    }

    // Subscribe to WebSocket messages
    const unsubscribe = websocketService.subscribe(handleMessage)

    // Cleanup subscription on unmount
    return () => {
      unsubscribe()
    }
  }, [eventType])

  return { data, error, lastUpdate }
} 