import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getCachedDoc,
  getCachedCollection,
  getCachedQuery,
  invalidateDoc,
  invalidateCollection,
  clearCache,
  getCacheStats,
} from '../lib/firestore-cache'

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  db: {
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
  },
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn().mockReturnValue({}),
  collection: vi.fn().mockReturnValue({}),
  getDoc: vi.fn().mockResolvedValue({
    exists: vi.fn().mockReturnValue(true),
    id: 'mock-id',
    data: vi.fn().mockReturnValue({ name: 'Test Document' }),
  }),
  getDocs: vi.fn().mockResolvedValue({
    forEach: vi.fn().mockImplementation((callback) => {
      callback({
        id: 'mock-id',
        data: vi.fn().mockReturnValue({ name: 'Test Document' }),
      })
    }),
  }),
  query: vi.fn().mockReturnValue({}),
  where: vi.fn().mockReturnValue({}),
  orderBy: vi.fn().mockReturnValue({}),
  limit: vi.fn().mockReturnValue({}),
}))

describe('Firestore Cache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear cache before each test
    clearCache()
  })

  describe('getCachedDoc', () => {
    it('should fetch and cache a document', async () => {
      const doc = await getCachedDoc('testCollection', 'doc-id')

      expect(doc).toEqual({
        id: 'mock-id',
        name: 'Test Document',
      })

      // Check cache stats
      const stats = getCacheStats()
      expect(stats.docs).toBe(1)
    })

    it('should return cached document on second call', async () => {
      // First call to cache the document
      await getCachedDoc('testCollection', 'doc-id')

      // Second call should use cache
      const doc = await getCachedDoc('testCollection', 'doc-id')

      expect(doc).toEqual({
        id: 'mock-id',
        name: 'Test Document',
      })
    })
  })

  // Add more tests for other cache functions
})
