import { useState, useEffect, useCallback } from 'react'
import type { Prediction } from '@/types'

interface PredictionUpdateHook {
  predictions: Prediction[];
  loading: boolean;
  error: Error | null;
  updatePrediction: (id: string, data: Partial<Prediction>) => Promise<void>;
  deletePrediction: (id: string) => Promise<void>;
}

export function usePredictionUpdates(): PredictionUpdateHook {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/predictions')
      if (!response.ok) {
        throw new Error('Failed to fetch predictions')
      }
      const data = await response.json()
      setPredictions(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch predictions'))
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePrediction = useCallback(async (id: string, data: Partial<Prediction>) => {
    try {
      const response = await fetch(`/api/predictions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to update prediction')
      }
      await fetchPredictions()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update prediction'))
    }
  }, [fetchPredictions])

  const deletePrediction = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/predictions/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete prediction')
      }
      await fetchPredictions()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete prediction'))
    }
  }, [fetchPredictions])

  useEffect(() => {
    fetchPredictions()
  }, [fetchPredictions])

  return {
    predictions,
    loading,
    error,
    updatePrediction,
    deletePrediction,
  }
} 