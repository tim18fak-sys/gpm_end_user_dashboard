
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { SuperAdminAlert } from '../../types/alert'

interface NewAlertPopupProps {
  isVisible: boolean
  alert: SuperAdminAlert | null
  onMarkSeen: () => void
  onDismiss: () => void
}

export default function NewAlertPopup({ isVisible, alert, onMarkSeen, onDismiss }: NewAlertPopupProps) {
  return (
    <AnimatePresence>
      {isVisible && alert && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm w-full"
          role="alert"
          aria-live="polite"
        >
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-white" />
                  <span className="text-sm font-medium text-white">New Alert</span>
                </div>
                <button
                  onClick={onDismiss}
                  className="text-white hover:text-amber-100 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="font-medium text-secondary-900 dark:text-white mb-2 line-clamp-2">
                {alert.title}
              </h4>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4 line-clamp-3">
                {alert.message}
              </p>

              {/* Actions */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onMarkSeen}
                  className="flex-1 px-3 py-2 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Mark Seen
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDismiss}
                  className="px-3 py-2 text-xs font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  Dismiss
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
