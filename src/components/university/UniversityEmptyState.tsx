
import { motion } from 'framer-motion'
import { AcademicCapIcon, PlusIcon } from '@heroicons/react/24/outline'

interface UniversityEmptyStateProps {
  onAddUniversity: () => void
}

export default function UniversityEmptyState({ onAddUniversity }: UniversityEmptyStateProps) {
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
        className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mb-6"
      >
        <AcademicCapIcon className="h-12 w-12 text-white" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-semibold text-secondary-900 dark:text-white mb-2"
      >
        No universities yet
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-secondary-600 dark:text-secondary-400 max-w-md mx-auto mb-8"
      >
        Get started by adding your first university to the platform. You can manage all university information, founders, and settings from here.
      </motion.p>
      
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={onAddUniversity}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add First University
      </motion.button>
    </motion.div>
  )
}
