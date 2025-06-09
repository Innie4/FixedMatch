import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from './firebase'

// Cache configuration
const CACHE_CONFIG = {
  // Cache duration in milliseconds
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  settings: 30 * 60 * 1000, // 30 minutes for settings
  packages: 60 * 60 * 1000, // 1 hour for packages
  vipPredictionCategories: 60 * 60 * 1000, // 1 hour for categories
}

// In-memory cache
const cache = {
  docs: new Map(),
  collections: new Map(),
  queries: new Map(),
}

// Get TTL for a collection
function getTTL(collectionName) {
  return CACHE_CONFIG[collectionName] || CACHE_CONFIG.defaultTTL
}

// Check if cache entry is valid
function isCacheValid(entry) {
  return entry && Date.now() - entry.timestamp < entry.ttl
}

// Cache a single document
export async function getCachedDoc(collectionName, docId, forceRefresh = false) {
  const cacheKey = `${collectionName}/${docId}`
  const cachedEntry = cache.docs.get(cacheKey)

  // Return cached data if valid and not forcing refresh
  if (!forceRefresh && isCacheValid(cachedEntry)) {
    return cachedEntry.data
  }

  // Fetch fresh data
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    const data = docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null

    // Update cache
    cache.docs.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: getTTL(collectionName),
    })

    return data
  } catch (error) {
    console.error(`Error fetching ${collectionName}/${docId}:`, error)
    // If we have stale data, return it as fallback
    if (cachedEntry) {
      return cachedEntry.data
    }
    throw error
  }
}

// Cache a collection
export async function getCachedCollection(collectionName, forceRefresh = false) {
  const cachedEntry = cache.collections.get(collectionName)

  // Return cached data if valid and not forcing refresh
  if (!forceRefresh && isCacheValid(cachedEntry)) {
    return cachedEntry.data
  }

  // Fetch fresh data
  try {
    const querySnapshot = await getDocs(collection(db, collectionName))

    const data = []
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() })
    })

    // Update cache
    cache.collections.set(collectionName, {
      data,
      timestamp: Date.now(),
      ttl: getTTL(collectionName),
    })

    return data
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error)
    // If we have stale data, return it as fallback
    if (cachedEntry) {
      return cachedEntry.data
    }
    throw error
  }
}

// Cache a query result
// Enhanced query function with optimizations
export async function getCachedQuery(collectionName, queryParams, forceRefresh = false) {
  const queryKey = `${collectionName}:${JSON.stringify(queryParams)}`
  const cachedEntry = cache.queries.get(queryKey)

  // Return cached data if valid and not forcing refresh
  if (!forceRefresh && isCacheValid(cachedEntry)) {
    return cachedEntry.data
  }

  // Build query
  let q = collection(db, collectionName)

  // Apply compound queries for better performance
  if (queryParams.filters) {
    // Group filters by field for potential compound queries
    const filterGroups = {}
    queryParams.filters.forEach((filter) => {
      if (
        filter.value !== undefined &&
        filter.value !== null &&
        filter.value !== '' &&
        filter.value !== 'all'
      ) {
        if (!filterGroups[filter.field]) {
          filterGroups[filter.field] = []
        }
        filterGroups[filter.field].push(filter)
      }
    })

    // Apply filters
    Object.values(filterGroups).forEach((filters) => {
      if (filters.length === 1) {
        const filter = filters[0]
        q = query(q, where(filter.field, filter.operator || '==', filter.value))
      } else if (filters.length > 1) {
        // For multiple filters on the same field, use in/array-contains-any if possible
        const firstFilter = filters[0]
        if (firstFilter.operator === '==' && filters.every((f) => f.operator === '==')) {
          const values = filters.map((f) => f.value)
          q = query(q, where(firstFilter.field, 'in', values))
        } else {
          // Apply individual filters if we can't use 'in' operator
          filters.forEach((filter) => {
            q = query(q, where(filter.field, filter.operator || '==', filter.value))
          })
        }
      }
    })
  }

  // Apply sorting
  if (queryParams.orderBy) {
    q = query(q, orderBy(queryParams.orderBy.field, queryParams.orderBy.direction || 'asc'))
  }

  // Apply pagination with cursor if provided
  if (queryParams.startAfter) {
    q = query(q, startAfter(queryParams.startAfter))
  }

  // Apply limit
  if (queryParams.limit) {
    q = query(q, limit(queryParams.limit))
  }

  // Fetch fresh data
  try {
    const querySnapshot = await getDocs(q)

    const data = []
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]

    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() })
    })

    // Update cache with pagination info
    cache.queries.set(queryKey, {
      data,
      lastDoc,
      timestamp: Date.now(),
      ttl: getTTL(collectionName),
    })

    return data
  } catch (error) {
    console.error(`Error fetching query ${queryKey}:`, error)
    // If we have stale data, return it as fallback
    if (cachedEntry) {
      return cachedEntry.data
    }
    throw error
  }
}

// Get the last document for pagination
export function getLastDocFromQuery(collectionName, queryParams) {
  const queryKey = `${collectionName}:${JSON.stringify(queryParams)}`
  const cachedEntry = cache.queries.get(queryKey)

  return cachedEntry?.lastDoc || null
}

// Invalidate cache for a document
export function invalidateDoc(collectionName, docId) {
  const cacheKey = `${collectionName}/${docId}`
  cache.docs.delete(cacheKey)

  // Also invalidate related collections and queries
  invalidateCollection(collectionName)
}

// Invalidate cache for a collection
export function invalidateCollection(collectionName) {
  cache.collections.delete(collectionName)

  // Also invalidate related queries
  for (const queryKey of cache.queries.keys()) {
    if (queryKey.startsWith(`${collectionName}:`)) {
      cache.queries.delete(queryKey)
    }
  }
}

// Clear entire cache
export function clearCache() {
  cache.docs.clear()
  cache.collections.clear()
  cache.queries.clear()
}

// Get cache statistics
export function getCacheStats() {
  return {
    docs: cache.docs.size,
    collections: cache.collections.size,
    queries: cache.queries.size,
    totalEntries: cache.docs.size + cache.collections.size + cache.queries.size,
  }
}

// Prefetch frequently accessed collections
export async function prefetchFrequentData() {
  try {
    // Prefetch settings
    await getCachedCollection('settings')

    // Prefetch active packages
    await getCachedQuery('packages', {
      filters: [{ field: 'isActive', value: true }],
    })

    // Prefetch VIP prediction categories
    await getCachedCollection('vipPredictionCategories')

    console.log('Prefetched frequent data successfully')
    return true
  } catch (error) {
    console.error('Error prefetching data:', error)
    return false
  }
}

// Cache warming function to be called on app initialization
export function initializeCache() {
  prefetchFrequentData()

  // Set up periodic cache refresh for critical data
  const refreshInterval = 5 * 60 * 1000 // 5 minutes

  const intervalId = setInterval(() => {
    // Refresh settings in the background
    getCachedCollection('settings', true) // force refresh
      .catch((err) => console.error('Background refresh error:', err))
  }, refreshInterval)

  // Return cleanup function
  return () => clearInterval(intervalId)
}
