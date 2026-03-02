
import { motion } from 'framer-motion'
import { EyeIcon, ClockIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { SuperAdminAlert } from '../../types/alert'

interface AlertTableProps {
  alerts: SuperAdminAlert[]
  isLoading: boolean
  onView: (alert: SuperAdminAlert) => void
  onMarkRead: (id: string) => void
  currentUserId?: string
}

export default function AlertTable({ alerts, isLoading, onView, onMarkRead, currentUserId }: AlertTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/4"></div>
              <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2"></div>
              <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/6"></div>
              <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/8"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const isAlertRead = (alert: SuperAdminAlert) => {
    return currentUserId ? alert.readBy.includes(currentUserId) : false
  }

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
          <thead className="bg-secondary-50 dark:bg-secondary-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
            {alerts.map((alert, index) => {
              const isRead = isAlertRead(alert)
              
              return (
                <motion.tr
                  key={alert._id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors duration-200 ${
                    !isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {!isRead && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                      )}
                      <div className="text-sm font-medium text-secondary-900 dark:text-white">
                        {alert.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-secondary-900 dark:text-secondary-200 max-w-xs truncate">
                      {alert.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isRead
                        ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onView(alert)}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        aria-label="View alert details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </motion.button>
                      {!isRead && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onMarkRead(alert._id)}
                          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-xs px-2 py-1 rounded bg-green-50 dark:bg-green-900/20"
                          aria-label="Mark as read"
                        >
                          Mark Read
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
