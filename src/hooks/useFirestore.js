import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Hook for fetching a single document with real-time updates
export function useFirestoreDoc(collectionName, docId, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!docId) {
      setData(null)
      setLoading(false)
      return
    }

    setLoading(true)

    const docRef = doc(db, collectionName, docId)

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() })
        } else {
          setData(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error(`Error fetching ${collectionName} document:`, err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [collectionName, docId])

  return { data, loading, error }
}

// Hook for fetching a collection with real-time updates
export function useFirestoreCollection(collectionName, options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    setLoading(true)

    // Build query
    let q = collection(db, collectionName)

    // Apply filters
    if (options.filters) {
      options.filters.forEach((filter) => {
        if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
          if (filter.value === 'all') return // Skip 'all' filters
          q = query(q, where(filter.field, filter.operator || '==', filter.value))
        }
      })
    }

    // Apply sorting
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'))
    }

    // Apply pagination
    if (options.limit) {
      q = query(q, limit(options.limit))
    }

    // Get total count (for pagination)
    if (options.getTotalCount) {
      const countQuery = collection(db, collectionName)
      getDocs(countQuery)
        .then((snapshot) => {
          setTotalCount(snapshot.size)
        })
        .catch((err) => {
          console.error(`Error getting count for ${collectionName}:`, err)
        })
    }

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = []
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() })
        })
        setData(items)
        setLoading(false)
      },
      (err) => {
        console.error(`Error fetching ${collectionName} collection:`, err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [
    collectionName,
    options.filters && JSON.stringify(options.filters),
    options.orderBy && JSON.stringify(options.orderBy),
    options.limit,
  ])

  return { data, loading, error, totalCount }
}

// Hook for fetching analytics data with real-time updates
export function useFirestoreAnalytics(timeRange = '7d') {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)

    // Calculate date range based on timeRange
    const endDate = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      case '6m':
        startDate.setMonth(startDate.getMonth() - 6)
        break
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    // Query analytics within date range
    const q = query(
      collection(db, 'analytics'),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const analyticsData = []
        snapshot.forEach((doc) => {
          analyticsData.push({ id: doc.id, ...doc.data() })
        })
        setData(analyticsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching analytics:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [timeRange])

  return { data, loading, error }
}
