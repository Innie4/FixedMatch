import { db } from './firebase'
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'

// Error levels
export const LogLevel = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
}

// Log entry to Firestore
export async function logToFirestore(level, message, details = {}) {
  try {
    const logEntry = {
      level,
      message,
      details,
      timestamp: serverTimestamp(),
      environment: process.env.NODE_ENV || 'development',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    }

    await addDoc(collection(db, 'systemLogs'), logEntry)
    return true
  } catch (error) {
    // Log to console as fallback
    console.error('Error logging to Firestore:', error)
    console.error('Original log:', { level, message, details })
    return false
  }
}

// Monitor Firestore quota usage
export async function monitorFirestoreUsage() {
  // This is a simplified example - in a real app, you would use Firebase Admin SDK
  // to access usage metrics or integrate with Google Cloud Monitoring

  // For now, we'll log the number of documents in key collections
  try {
    const collections = ['users', 'vipPredictions', 'packages', 'activityLogs', 'systemLogs']

    const stats = {}

    for (const collectionName of collections) {
      const q = query(collection(db, collectionName), limit(1000))
      const snapshot = await getDocs(q)
      stats[collectionName] = snapshot.size
    }

    // Log the stats
    await logToFirestore(LogLevel.INFO, 'Firestore usage stats', { stats })

    return stats
  } catch (error) {
    console.error('Error monitoring Firestore usage:', error)
    return null
  }
}

// Get recent system logs
export async function getRecentLogs(level = null, limit = 100) {
  try {
    let q = collection(db, 'systemLogs')

    if (level) {
      q = query(q, where('level', '==', level))
    }

    q = query(q, orderBy('timestamp', 'desc'), limit(limit))

    const snapshot = await getDocs(q)
    const logs = []

    snapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return logs
  } catch (error) {
    console.error('Error fetching system logs:', error)
    return []
  }
}
