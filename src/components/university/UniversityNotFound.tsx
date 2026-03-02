
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface UniversityNotFoundProps {
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export default function UniversityNotFound({ onClearFilters, hasActiveFilters }: UniversityNotFoundProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-6"
      >
        <MagnifyingGlassIcon className="h-12 w-12 text-white" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-semibold text-secondary-900 dark:text-white mb-2"
      >
        No universities found
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-secondary-600 dark:text-secondary-400 max-w-md mx-auto mb-8"
      >
        {hasActiveFilters 
          ? "No universities match your current search criteria. Try adjusting your filters or search terms to find what you're looking for."
          : "We couldn't find any universities. This might be due to a temporary issue or your search criteria."
        }
      </motion.p>
      
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={onClearFilters}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Clear All Filters
        </motion.button>
      )}
    </motion.div>
  )
}
