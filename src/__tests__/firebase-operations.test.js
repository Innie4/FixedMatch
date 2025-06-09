import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  createDocument,
  updateDocument,
  deleteDocument,
  setDocument,
  updateCounter,
  logActivity,
} from '../lib/firestore-operations'
import { db } from '../lib/firebase'

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  db: {
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    runTransaction: vi.fn(),
  },
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'mock-id' }),
  setDoc: vi.fn().mockResolvedValue({}),
  updateDoc: vi.fn().mockResolvedValue({}),
  deleteDoc: vi.fn().mockResolvedValue({}),
  serverTimestamp: vi.fn().mockReturnValue('mock-timestamp'),
  runTransaction: vi.fn().mockImplementation(async (db, callback) => {
    await callback({
      get: vi.fn().mockResolvedValue({
        exists: vi.fn().mockReturnValue(true),
        data: vi.fn().mockReturnValue({ counter: 5 }),
      }),
      update: vi.fn(),
    })
  }),
}))

describe('Firestore Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createDocument', () => {
    it('should add timestamps and return the document with ID', async () => {
      const data = { name: 'Test Document' }
      const result = await createDocument('testCollection', data)

      expect(result).toEqual({
        id: 'mock-id',
        name: 'Test Document',
        createdAt: 'mock-timestamp',
        updatedAt: 'mock-timestamp',
      })
    })
  })

  describe('updateDocument', () => {
    it('should add updatedAt timestamp and return the document with ID', async () => {
      const data = { name: 'Updated Document' }
      const result = await updateDocument('testCollection', 'doc-id', data)

      expect(result).toEqual({
        id: 'doc-id',
        name: 'Updated Document',
        updatedAt: 'mock-timestamp',
      })
    })
  })

  // Add more tests for other operations
})
