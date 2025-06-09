'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'

export default function NotificationPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    // Check if user has already interacted with the popup
    const hasSeenPopup = localStorage.getItem('hasSeenNotificationPopup')

    if (!hasSeenPopup) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('hasSeenNotificationPopup', 'true')
    localStorage.setItem('notificationsEnabled', 'true')
    setHasInteracted(true)
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('hasSeenNotificationPopup', 'true')
    localStorage.setItem('notificationsEnabled', 'false')
    setHasInteracted(true)
    setIsVisible(false)
  }

  const handleClose = () => {
    localStorage.setItem('hasSeenNotificationPopup', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 animate-fade-in-up">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-[#1a56db] text-white p-2 rounded-full mr-3">
          <Bell className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 dark:text-white">Enable Notifications</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
            Get instant alerts for match updates, new predictions, and special offers.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="bg-[#1a56db] hover:bg-[#1e40af] text-white text-sm font-medium py-2 px-4 rounded transition-colors"
            >
              Enable
            </button>
            <button
              onClick={handleDecline}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium py-2 px-4 rounded transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
