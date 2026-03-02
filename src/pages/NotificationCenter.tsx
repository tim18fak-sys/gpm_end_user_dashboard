
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BellIcon } from '@heroicons/react/24/outline'
import { useNotifications, useUnreadNotifications } from '../hooks/useNotifications'
import { SuperAdminNotification } from '../types/notification'
import NotificationTable from '../components/notifications/NotificationTable'
import NotificationDrawer from '../components/notifications/NotificationDrawer'
import NotificationEmptyState from '../components/notifications/NotificationEmptyState'
import NewNotificationPopup from '../components/notifications/NewNotificationPopup'
import Pagination from '../components/ui/Pagination'
import { useAuthStore } from '../store/authStore'

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedNotification, setSelectedNotification] = useState<SuperAdminNotification | null>(null)
  const [previousAllCount, setPreviousAllCount] = useState(0)
  const [newNotification, setNewNotification] = useState<SuperAdminNotification | null>(null)
  
  const { user } = useAuthStore()
  const currentUserId = user?._id || ''

  const pageSize = 10

  // Queries based on active tab
  const allNotificationsQuery = useNotifications({ 
    page: activeTab === 'all' ? currentPage : 1, 
    limit: pageSize 
  })
  
  const unreadNotificationsQuery = useUnreadNotifications({ 
    page: activeTab === 'unread' ? currentPage : 1, 
    limit: pageSize 
  })

  // Determine which query to use
  const activeQuery = activeTab === 'all' ? allNotificationsQuery : unreadNotificationsQuery
  const notifications = activeQuery.data || {
    data:[]
  }

  const totalCount = activeQuery.data?.totalPages || 0
  const totalPages = Math.ceil(totalCount)
  console.log(activeQuery.data, totalCount)

  // Detect new notifications
  useEffect(() => {
    if (allNotificationsQuery.data && !allNotificationsQuery.isLoading) {
      const currentCount = allNotificationsQuery.data.total
      
      if (previousAllCount > 0 && currentCount > previousAllCount) {
        // New notification detected
        const latestNotification = allNotificationsQuery.data.data[0]
        if (latestNotification && !latestNotification.readBy.includes(currentUserId)) {
          setNewNotification(latestNotification)
        }
      }
      
      setPreviousAllCount(currentCount)
    }
  }, [allNotificationsQuery.data, allNotificationsQuery.isLoading, previousAllCount, currentUserId])

  const handleTabChange = (tab: 'all' | 'unread') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewNotification = (notification: SuperAdminNotification) => {
    setSelectedNotification(notification)
  }

  const handleCloseDrawer = () => {
    setSelectedNotification(null)
  }

  const handleCloseNewNotificationPopup = () => {
    setNewNotification(null)
  }

  const handleMarkNewNotificationAsSeen = () => {
    setNewNotification(null)
    // Refresh queries
    allNotificationsQuery.refetch()
    unreadNotificationsQuery.refetch()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const isEmpty = notifications.data.length == 0 && !activeQuery.isLoading
  

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center">
          <BellIcon className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
              Notification Center
            </h1>
            <p className="text-secondary-600 dark:text-secondary-300">
              Stay updated with the latest notifications and alerts
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm">
        <div className="border-b border-secondary-200 dark:border-secondary-700">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => handleTabChange('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400 dark:hover:text-secondary-300'
              }`}
            >
              All Notifications
              {allNotificationsQuery.data && (
                <span className="ml-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-white px-2 py-1 text-xs rounded-full">
                  {allNotificationsQuery.data.totalPages * 10}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('unread')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'unread'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400 dark:hover:text-secondary-300'
              }`}
            >
              Unread
              {unreadNotificationsQuery.data && (
                <span className="ml-2 bg-primary-100 dark:bg-primary-900/20 text-primary-900 dark:text-primary-300 px-2 py-1 text-xs rounded-full">
                  {unreadNotificationsQuery.data.data.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {isEmpty ? (
            <NotificationEmptyState isUnreadTab={activeTab === 'unread'} />
          ) : (
            <NotificationTable
              notifications={notifications}
              isLoading={activeQuery.isLoading}
              onViewNotification={handleViewNotification}
              currentUserId={currentUserId}
            />
          )}
        </div>
      </motion.div>

      {/* Pagination */}
      {!isEmpty && !activeQuery.isLoading && totalPages > 1 && (
        <motion.div 
          variants={itemVariants}
          className="flex justify-center"
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </motion.div>
      )}

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={!!selectedNotification}
        onClose={handleCloseDrawer}
        notification={selectedNotification}
        currentUserId={currentUserId}
      />

      {/* New Notification Popup */}
      <NewNotificationPopup
        notification={newNotification}
        onClose={handleCloseNewNotificationPopup}
        onMarkAsSeen={handleMarkNewNotificationAsSeen}
      />
    </motion.div>
  )
}
