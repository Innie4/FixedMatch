import { db } from './firebase'
import {
  doc,
  setDoc,
  increment,
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'
import { logToFirestore, LogLevel } from './firebase-monitoring'

// Track page view
export async function trackPageView(page) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dateStr = today.toISOString().split('T')[0]
    const analyticsRef = doc(db, 'analytics', `pageviews_${dateStr}`)

    await setDoc(
      analyticsRef,
      {
        [`pages.${page}`]: increment(1),
        total: increment(1),
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    )

    return true
  } catch (error) {
    await logToFirestore(LogLevel.ERROR, 'Error tracking page view', { page, error: error.message })
    return false
  }
}

// Track user action
export async function trackUserAction(action, metadata = {}) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dateStr = today.toISOString().split('T')[0]
    const analyticsRef = doc(db, 'analytics', `actions_${dateStr}`)

    await setDoc(
      analyticsRef,
      {
        [`actions.${action}`]: increment(1),
        total: increment(1),
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    )

    // Log detailed action for analysis
    await addDoc(collection(db, 'userActions'), {
      action,
      metadata,
      timestamp: serverTimestamp(),
    })

    return true
  } catch (error) {
    await logToFirestore(LogLevel.ERROR, 'Error tracking user action', {
      action,
      metadata,
      error: error.message,
    })
    return false
  }
}

// Get analytics data for a date range
export async function getAnalyticsData(startDate, endDate) {
  try {
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)

    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    const pageViewsData = {}
    const actionsData = {}

    // Loop through each day in the range
    const currentDate = new Date(start)
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0]

      // Get page views
      const pageViewsRef = doc(db, 'analytics', `pageviews_${dateStr}`)
      const pageViewsSnap = await getDoc(pageViewsRef)

      if (pageViewsSnap.exists()) {
        pageViewsData[dateStr] = pageViewsSnap.data()
      }

      // Get actions
      const actionsRef = doc(db, 'analytics', `actions_${dateStr}`)
      const actionsSnap = await getDoc(actionsRef)

      if (actionsSnap.exists()) {
        actionsData[dateStr] = actionsSnap.data()
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return {
      pageViews: pageViewsData,
      actions: actionsData,
    }
  } catch (error) {
    await logToFirestore(LogLevel.ERROR, 'Error fetching analytics data', {
      startDate,
      endDate,
      error: error.message,
    })
    return { pageViews: {}, actions: {} }
  }
}
