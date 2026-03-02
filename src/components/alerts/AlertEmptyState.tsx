
import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface AlertEmptyStateProps {
  hasFilters: boolean
  onClearFilters?: () => void
}

export default function AlertEmptyState({ hasFilters, onClearFilters }: AlertEmptyStateProps) {
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
          No alerts found
        </h3>
        
        <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto">
          We couldn't find any alerts matching your current filters. Try adjusting your search criteria.
        </p>
        
        {onClearFilters && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClearFilters}
            className="inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-600 text-sm font-medium rounded-lg text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            Clear Filters
          </motion.button>
        )}
      </motion.div>
    )
  }

  // No alerts at all - success state
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: 0.1,
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
        className="mx-auto h-20 w-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full flex items-center justify-center mb-6"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ExclamationTriangleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
        </motion.div>
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-secondary-900 dark:text-white mb-3"
      >
        You're all caught up! 🎉
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-secondary-600 dark:text-secondary-400 mb-8 max-w-md mx-auto"
      >
        No alerts to review at the moment. The system is running smoothly and all issues have been addressed.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-8 border-t border-secondary-200 dark:border-secondary-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-secondary-600 dark:text-secondary-400">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center space-x-2"
          >
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span>System monitoring active</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center space-x-2"
          >
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span>All services operational</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center space-x-2"
          >
            <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
            <span>Real-time alerts enabled</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
