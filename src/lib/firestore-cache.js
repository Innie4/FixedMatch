import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

// Cache configuration
const CACHE_CONFIG = {
  // Cache duration in milliseconds
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  settings: 30 * 60 * 1000,  // 30 minutes for settings
  packages: 60 * 60 * 1000,  // 1 hour for packages
  vipPredictionCategories: 60 * 60 * 1000, // 1 hour for categories
};

// In-memory cache
const cache = {
  docs: new Map(),
  collections: new Map(),
  queries: new Map()
};

// Get TTL for a collection
function getTTL(collectionName) {
  return CACHE_CONFIG[collectionName] || CACHE_CONFIG.defaultTTL;
}

// Check if cache entry is valid
function isCacheValid(entry) {
  return entry && (Date.now() - entry.timestamp) < entry.ttl;
}

// Cache a single document
export async function getCachedDoc(collectionName, docId, forceRefresh = false) {
  const cacheKey = `${collectionName}/${docId}`;
  const cachedEntry = cache.docs.get(cacheKey);
  
  // Return cached data if valid and not forcing refresh
  if (!forceRefresh && isCacheValid(cachedEntry)) {
    return cachedEntry.data;
  }
  
  // Fetch fresh data
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    const data = docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    
    // Update cache
    cache.docs.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: getTTL(collectionName)
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${collectionName}/${docId}:`, error);
    // If we have stale data, return it as fallback
    if (cachedEntry) {
      return cachedEntry.data;
    }
    throw error;
  }
}

// Cache a collection
export async function getCachedCollection(collectionName, forceRefresh = false) {
  const cachedEntry = cache.collections.get(collectionName);
  
  // Return cached data if valid and not forcing refresh
  if (!forceRefresh && isCacheValid(cachedEntry)) {
    return cachedEntry.data;
  }
  
  // Fetch fresh data
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    
    const data = [];
    querySnapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });
    
    // Update cache
    cache.collections.set(collectionName, {
      data,
      timestamp: Date.now(),
      ttl: getTTL(collectionName)
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    // If we have stale data, return it as fallback
    if (cachedEntry) {
      return cachedEntry.data;
    }
    throw error;
  }
}

// Cache a query result
export async function getCachedQuery(collectionName, queryParams, forceRefresh = false) {
  const queryKey = `${collectionName}:${JSON.stringify(queryParams)}`;
  const cachedEntry = cache.queries.get(queryKey);
  
  // Return cached data if valid and not forcing refresh
  if (!forceRefresh && isCacheValid(cachedEntry)) {
    return cachedEntry.data;
  }
  
  // Build query
  let q = collection(db, collectionName);
  
  // Apply filters
  if (queryParams.filters) {
    queryParams.filters.forEach(filter => {
      if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
        if (filter.value === 'all') return; // Skip 'all' filters
        q = query(q, where(filter.field, filter.operator || '==', filter.value));
      }
    });
  }
  
  // Apply sorting
  if (queryParams.orderBy) {
    q = query(q, orderBy(queryParams.orderBy.field, queryParams.orderBy.direction || 'asc'));
  }
  
  // Apply pagination
  if (queryParams.limit) {
    q = query(q, limit(queryParams.limit));
  }
  
  // Fetch fresh data
  try {
    const querySnapshot = await getDocs(q);
    
    const data = [];
    querySnapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });
    
    // Update cache
    cache.queries.set(queryKey, {
      data,
      timestamp: Date.now(),
      ttl: getTTL(collectionName)
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching query ${queryKey}:`, error);
    // If we have stale data, return it as fallback
    if (cachedEntry) {
      return cachedEntry.data;
    }
    throw error;
  }
}

// Invalidate cache for a document
export function invalidateDoc(collectionName, docId) {
  const cacheKey = `${collectionName}/${docId}`;
  cache.docs.delete(cacheKey);
  
  // Also invalidate related collections and queries
  invalidateCollection(collectionName);
}

// Invalidate cache for a collection
export function invalidateCollection(collectionName) {
  cache.collections.delete(collectionName);
  
  // Also invalidate related queries
  for (const queryKey of cache.queries.keys()) {
    if (queryKey.startsWith(`${collectionName}:`)) {
      cache.queries.delete(queryKey);
    }
  }
}

// Clear entire cache
export function clearCache() {
  cache.docs.clear();
  cache.collections.clear();
  cache.queries.clear();
}

// Get cache statistics
export function getCacheStats() {
  return {
    docs: cache.docs.size,
    collections: cache.collections.size,
    queries: cache.queries.size,
    totalEntries: cache.docs.size + cache.collections.size + cache.queries.size
  };
}