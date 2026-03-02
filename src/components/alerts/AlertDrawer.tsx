
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { XMarkIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow, format } from 'date-fns'
import { SuperAdminAlert } from '../../types/alert'

interface AlertDrawerProps {
  isOpen: boolean
  onClose: () => void
  alert: SuperAdminAlert | null
  isLoading: boolean
  onMarkRead?: (id: string) => void
  currentUserId?: string
}

export default function AlertDrawer({ 
  isOpen, 
  onClose, 
  alert, 
  isLoading,
  onMarkRead,
  currentUserId 
}: AlertDrawerProps) {
  const isAlertRead = alert && currentUserId ? alert.readBy.includes(currentUserId) : false

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-secondary-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-secondary-800 shadow-xl"
                  >
                    <div className="flex-1">
                      {/* Header */}
                      <div className="bg-primary-600 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            Alert Details
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-primary-600 text-primary-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-4 py-6 sm:px-6">
                        {isLoading ? (
                          <div className="space-y-4">
                            <div className="animate-pulse">
                              <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4 mb-2"></div>
                              <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2 mb-4"></div>
                              <div className="h-20 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
                            </div>
                          </div>
                        ) : alert ? (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                          >
                            {/* Alert Icon and Status */}
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                                  <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                                    {alert.title}
                                  </h3>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    isAlertRead
                                      ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200'
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  }`}>
                                    {isAlertRead ? 'Read' : 'Unread'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Alert Message */}
                            <div className="bg-secondary-50 dark:bg-secondary-900 rounded-lg p-4">
                              <h4 className="text-sm font-medium text-secondary-900 dark:text-white mb-2">
                                Message
                              </h4>
                              <p className="text-sm text-secondary-700 dark:text-secondary-300 leading-relaxed">
                                {alert.message}
                              </p>
                            </div>

                            {/* Alert Metadata */}
                            <div className="space-y-4">
                              <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400">
                                <ClockIcon className="h-4 w-4 mr-2" />
                                <span>
                                  {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              
                              <div className="text-xs text-secondary-400 dark:text-secondary-500">
                                <p>Created: {format(new Date(alert.createdAt), 'PPpp')}</p>
                                <p>Updated: {format(new Date(alert.updatedAt), 'PPpp')}</p>
                                <p>Alert ID: {alert._id}</p>
                              </div>
                            </div>

                            {/* Actions */}
                            {!isAlertRead && onMarkRead && (
                              <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => onMarkRead(alert._id)}
                                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  Mark as Read
                                </motion.button>
                              </div>
                            )}
                          </motion.div>
                        ) : (
                          <div className="text-center text-secondary-500 dark:text-secondary-400">
                            No alert selected
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
