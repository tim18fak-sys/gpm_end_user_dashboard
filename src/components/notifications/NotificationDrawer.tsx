
import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, InformationCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { SuperAdminNotification } from '../../types/notification'
import { useMarkAsRead } from '../../hooks/useNotifications'

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
  notification: SuperAdminNotification | null
  currentUserId: string
}

export default function NotificationDrawer({ 
  isOpen, 
  onClose, 
  notification,
  currentUserId 
}: NotificationDrawerProps) {
  const markAsReadMutation = useMarkAsRead()

  if (!notification) return null

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-rose-500" />
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />
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

  const isRead = notification.readBy.includes(currentUserId)

  const handleMarkAsRead = async () => {
    if (!isRead) {
      await markAsReadMutation.mutateAsync(notification._id)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-secondary-800 shadow-xl"
                  >
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-secondary-900 dark:text-white">
                          Notification Details
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white dark:bg-secondary-800 text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <div className="space-y-6">
                            {/* Type and Status */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {getTypeIcon(notification.type)}
                                <span className={`ml-2 inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                                  {notification.type}
                                </span>
                              </div>
                              <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
                                isRead 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                              }`}>
                                {isRead ? 'Read' : 'Unread'}
                              </span>
                            </div>

                            {/* Title */}
                            <div>
                              <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                                {notification.title}
                              </h3>
                            </div>

                            {/* Message */}
                            <div>
                              <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                Message
                              </h4>
                              <div className="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-4">
                                <p className="text-secondary-900 dark:text-white whitespace-pre-wrap">
                                  {notification.message}
                                </p>
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                  Created
                                </h4>
                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                  {format(new Date(notification.createdAt), 'MMMM dd, yyyy at HH:mm')}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                  Scope
                                </h4>
                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                  {notification.isGlobal ? 'Global' : 'Personal'}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                  Read by
                                </h4>
                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                  {notification.readBy.length} {notification.readBy.length === 1 ? 'person' : 'people'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-secondary-200 dark:border-secondary-700 px-4 py-6 sm:px-6">
                      <div className="flex justify-end space-x-3">
                        {!isRead && (
                          <button
                            onClick={handleMarkAsRead}
                            disabled={markAsReadMutation.isPending}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                          >
                            {markAsReadMutation.isPending ? 'Marking...' : 'Mark as Read'}
                          </button>
                        )}
                        <button
                          onClick={onClose}
                          className="inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-600 text-sm font-medium rounded-md text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
