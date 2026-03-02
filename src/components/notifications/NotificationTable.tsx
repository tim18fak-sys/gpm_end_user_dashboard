
import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { 
  EyeIcon, 
  TrashIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline'
import { SuperAdminNotification } from '../../types/notification'
import { useMarkAsRead, useDeleteNotification } from '../../hooks/useNotifications'

interface NotificationTableProps {
  notifications: {
    data:SuperAdminNotification[]
  }
  isLoading: boolean
  onViewNotification: (notification: SuperAdminNotification) => void
  currentUserId: string
}

export default function NotificationTable({ 
  notifications, 
  isLoading, 
  onViewNotification,
  currentUserId 
}: NotificationTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const markAsReadMutation = useMarkAsRead()
  const deleteNotificationMutation = useDeleteNotification()

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-rose-500" />
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
      case 'error':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
    }
  }

  const isRead = (notification: SuperAdminNotification) => {
    console.log(notification.readBy, currentUserId)
    return notification.readBy.includes(currentUserId)
  }

  const handleMarkAsRead = async (id: string) => {
    await markAsReadMutation.mutateAsync(id)
  }

  const handleDelete = async (id: string) => {
    await deleteNotificationMutation.mutateAsync(id)
    setConfirmDeleteId(null)
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-secondary-800 shadow-sm rounded-lg overflow-hidden">
        <div className="animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-secondary-200 dark:border-secondary-700 p-4">
              <div className="flex items-center space-x-4">
                <div className="h-5 w-5 bg-secondary-300 dark:bg-secondary-600 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary-300 dark:bg-secondary-600 rounded w-1/4"></div>
                  <div className="h-3 bg-secondary-300 dark:bg-secondary-600 rounded w-3/4"></div>
                </div>
                <div className="h-6 w-16 bg-secondary-300 dark:bg-secondary-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-secondary-800 shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
          <thead className="bg-secondary-50 dark:bg-secondary-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
            {notifications.data.map((notification, index) => (
              <motion.tr
                key={notification._id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200 ${
                  !isRead(notification) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-secondary-900 dark:text-white">
                    {notification.title}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-secondary-500 dark:text-secondary-400 max-w-xs truncate">
                    {notification.message}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTypeIcon(notification.type)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                  {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    isRead(notification) 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                  }`}>
                    {isRead(notification) ? 'Read' : 'Unread'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewNotification(notification)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      aria-label="View notification"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    {!isRead(notification) && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        disabled={markAsReadMutation.isPending}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                        aria-label="Mark as read"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmDeleteId(notification._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      aria-label="Delete notification"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
              Delete Notification
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">
              Are you sure you want to delete this notification? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md hover:bg-secondary-50 dark:hover:bg-secondary-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleteNotificationMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteNotificationMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
