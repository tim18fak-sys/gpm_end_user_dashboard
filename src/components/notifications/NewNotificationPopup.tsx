
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline'
import { SuperAdminNotification } from '../../types/notification'
import { useMarkAsRead } from '../../hooks/useNotifications'

interface NewNotificationPopupProps {
  notification: SuperAdminNotification | null
  onClose: () => void
  onMarkAsSeen: () => void
}

export default function NewNotificationPopup({ 
  notification, 
  onClose, 
  onMarkAsSeen 
}: NewNotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const markAsReadMutation = useMarkAsRead()

  useEffect(() => {
    if (notification) {
      setIsVisible(true)
      // Play notification sound (optional)
      try {
        const audio = new Audio()
        audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiMzfTOeSsFJHHJ8d+WQwsTYrTq9KdXFCtEn9/+sGIZBTyY2e3PehgFKmqX2+3BcSsGK27u9+OaRg0YqObm7uOeTg0Q=="
        audio.play().catch(() => {
          // Ignore audio play errors (e.g., user hasn't interacted with page yet)
        })
      } catch (error) {
        // Ignore audio errors
      }

      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [notification, onClose])

  const handleMarkAsSeen = async () => {
    if (notification) {
      await markAsReadMutation.mutateAsync(notification._id)
      onMarkAsSeen()
    }
    setIsVisible(false)
  }

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  if (!notification) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0, x: 100 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0.9, opacity: 0, x: 100 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm w-full"
        >
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <BellIcon className="h-6 w-6 text-primary-500" />
              </div>
              <div className="ml-3 w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    New Notification
                  </p>
                  <button
                    onClick={handleClose}
                    className="ml-4 text-secondary-400 hover:text-secondary-500 focus:outline-none"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm font-medium text-secondary-900 dark:text-white mt-1">
                  {notification.title}
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1 line-clamp-2">
                  {notification.message}
                </p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={handleMarkAsSeen}
                    disabled={markAsReadMutation.isPending}
                    className="text-xs bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {markAsReadMutation.isPending ? 'Marking...' : 'Mark as Seen'}
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-xs text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
