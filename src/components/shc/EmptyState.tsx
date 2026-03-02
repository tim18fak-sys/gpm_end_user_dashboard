
import { motion } from 'framer-motion';
import { ShieldCheckIcon, UsersIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
  onOnboardCommittee?: () => void;
}

export default function EmptyState({ hasFilters, onClearFilters,onOnboardCommittee }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16 bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mb-6 relative"
      >
        <ShieldCheckIcon className="h-12 w-12 text-white" />
        
        {/* Floating decorative elements */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-secondary-400 flex items-center justify-center"
        >
          <UsersIcon className="h-3 w-3 text-white" />
        </motion.div>
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-semibold text-secondary-900 dark:text-white mb-2"
      >
        {hasFilters ? 'No committees found' : 'No Sexual Harassment Committees yet'}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-secondary-600 dark:text-secondary-400 max-w-md mx-auto mb-8"
      >
        {hasFilters 
          ? "No Sexual Harassment Committees match your current search criteria. Try adjusting your filters to find what you're looking for."
          : "No Sexual Harassment Committees have been onboarded yet. Start by inviting your first one!"
        }
      </motion.p>
      
      {hasFilters && onClearFilters && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={onClearFilters}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Clear filters
        </motion.button>
      )}

      {!hasFilters && onOnboardCommittee && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={onOnboardCommittee}
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <ShieldCheckIcon className="h-5 w-5 mr-2" />
          Onboard First Committee
        </motion.button>
      )}

      {/* Animated elements */}
      <div className="mt-8 flex justify-center space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
            className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}
