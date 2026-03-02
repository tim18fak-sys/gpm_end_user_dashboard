
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAlerts, useUnreadAlerts, useAlert, useMarkAlertRead, useNewAlertDetection } from '../hooks/useAlerts'
import { useAuthStore } from '../store/authStore'
import { SuperAdminAlert } from '../types/alert'
import AlertTable from '../components/alerts/AlertTable'
import AlertDrawer from '../components/alerts/AlertDrawer'
import NewAlertPopup from '../components/alerts/NewAlertPopup'
import AlertEmptyState from '../components/alerts/AlertEmptyState'
import Pagination from '../components/ui/Pagination'

export default function AlertCenter() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
  const [showNewAlertPopup, setShowNewAlertPopup] = useState(false)
  
  const { user } = useAuthStore()
  const currentUserId = user?._id

  // Queries
  const { data: allAlertsData, isLoading: isLoadingAllAlerts } = useAlerts(currentPage, 10)
  const { data: unreadAlerts, isLoading: isLoadingUnreadAlerts } = useUnreadAlerts()
  const { data: selectedAlert, isLoading: isLoadingSelectedAlert } = useAlert(selectedAlertId)
  
  // Mutations
  const markAlertReadMutation = useMarkAlertRead()
  
  // New alert detection
  const { hasNewAlert, latestAlert } = useNewAlertDetection()

  // Show popup when new alert is detected
  React.useEffect(() => {
    if (hasNewAlert && latestAlert) {
      setShowNewAlertPopup(true)
    }
  }, [hasNewAlert, latestAlert])

  // Event handlers
  const handleTabChange = (tab: 'all' | 'unread') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewAlert = (alert: SuperAdminAlert) => {
    setSelectedAlertId(alert._id)
  }

  const handleCloseDrawer = () => {
    setSelectedAlertId(null)
  }

  const handleMarkAlertRead = async (id: string) => {
    await markAlertReadMutation.mutateAsync(id)
  }

  const handleMarkNewAlertSeen = async () => {
    if (latestAlert) {
      await markAlertReadMutation.mutateAsync(latestAlert._id)
    }
    setShowNewAlertPopup(false)
  }

  const handleDismissNewAlert = () => {
    setShowNewAlertPopup(false)
  }

  // Determine what data to show
  const isLoading = activeTab === 'all' ? isLoadingAllAlerts : isLoadingUnreadAlerts
  const alerts = activeTab === 'all' ? (allAlertsData?.data || []) : (unreadAlerts ? unreadAlerts.data || []:[])
  const totalPages = activeTab === 'all' ? (allAlertsData?.totalPages || 1) : 1
  const isEmpty = alerts.length === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Alert Center
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Monitor and manage system alerts
          </p>
        </div>
      </div>

      {/* Header Tabs */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="border-b border-secondary-200 dark:border-secondary-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => handleTabChange('all')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400 dark:hover:text-secondary-300'
              }`}
            >
              All Alerts
              {allAlertsData?.data && (
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400">
                  {allAlertsData.data.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('unread')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'unread'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400 dark:hover:text-secondary-300'
              }`}
            >
              Unread
              {unreadAlerts && unreadAlerts.data.length > 0 && (
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                  {unreadAlerts.data.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Alert Table or Empty State */}
      <AnimatePresence mode="wait">
        {isEmpty && !isLoading ? (
          <AlertEmptyState hasFilters={false} />
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AlertTable
              alerts={alerts}
              isLoading={isLoading}
              onView={handleViewAlert}
              onMarkRead={handleMarkAlertRead}
              currentUserId={currentUserId}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!isEmpty && !isLoading && activeTab === 'all' && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Alert Drawer */}
      <AlertDrawer
        isOpen={!!selectedAlertId}
        onClose={handleCloseDrawer}
        alert={selectedAlert || null}
        isLoading={isLoadingSelectedAlert}
        onMarkRead={handleMarkAlertRead}
        currentUserId={currentUserId}
      />

      {/* New Alert Popup */}
      <NewAlertPopup
        isVisible={showNewAlertPopup}
        alert={latestAlert}
        onMarkSeen={handleMarkNewAlertSeen}
        onDismiss={handleDismissNewAlert}
      />
    </motion.div>
  )
}
