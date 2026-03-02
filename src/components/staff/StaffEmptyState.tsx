
import { motion } from 'framer-motion'
import { UserGroupIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'

interface StaffEmptyStateProps {
  hasFilters: boolean
  onAddStaff: () => void
  onClearFilters: () => void
}

export default function StaffEmptyState({ hasFilters, onAddStaff, onClearFilters }: StaffEmptyStateProps) {
  if (hasFilters) {
    // Empty state due to filters
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mx-auto h-16 w-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mb-6"
        >
          <MagnifyingGlassIcon className="h-8 w-8 text-secondary-400 dark:text-secondary-500" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
          No staff found
        </h3>
        
        <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto">
          We couldn't find any staff members matching your current filters. Try adjusting your search criteria or clearing the filters to see all staff.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClearFilters}
            className="inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-600 text-sm font-medium rounded-lg text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            Clear Filters
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddStaff}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Staff Member
          </motion.button>
        </div>
      </motion.div>
    )
  }

  // Empty state - no staff in database
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-full flex items-center justify-center mb-6"
      >
        <UserGroupIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">
        Welcome to Staff Management
      </h3>
      
      <p className="text-secondary-600 dark:text-secondary-400 mb-8 max-w-lg mx-auto">
        You haven't added any staff members yet. Start building your team by adding your first staff member to manage your platform effectively.
      </p>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddStaff}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Your First Staff Member
      </motion.button>
      
      <div className="mt-8 pt-8 border-t border-secondary-200 dark:border-secondary-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-secondary-600 dark:text-secondary-400">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span>Assign roles & privileges</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span>Manage access control</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
            <span>Track staff activity</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
