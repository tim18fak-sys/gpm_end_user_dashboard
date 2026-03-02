import { motion } from 'framer-motion'
import { ArrowUpIcon, ArrowDownIcon, } from '@heroicons/react/24/outline'

interface TotalsCardProps {
  title: string
  total: number
  change: number
  icon: React.ComponentType<{ className?: string }>
  isLoading?: boolean
  index?: number
}

export default function TotalsCard({ title, total, change, icon: Icon, isLoading = false, index = 0 }: TotalsCardProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-zinc-800/60 rounded-lg sm:rounded-xl border border-secondary-200 dark:border-zinc-700 p-3 sm:p-4 lg:p-6"
      >
        <div className="h-3 sm:h-4 bg-secondary-200 dark:bg-zinc-600 rounded animate-pulse mb-2"></div>
        <div className="h-6 sm:h-8 bg-secondary-200 dark:bg-zinc-600 rounded animate-pulse mb-2"></div>
        <div className="h-3 sm:h-4 bg-secondary-200 dark:bg-zinc-600 rounded animate-pulse w-12 sm:w-16"></div>
      </motion.div>
    )
  }

const formatChangeValue = (value: number) => {
    return value > 0 ? `+${value}%` : `${value}%`
  }

  const getChangeType = (value: number) => {
    return value >= 0 ? 'increase' : 'decrease'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden bg-white dark:bg-secondary-800 rounded-xl sm:rounded-2xl border border-secondary-200 dark:border-secondary-700 p-4 sm:p-6 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl dark:shadow-secondary-900/25 dark:hover:shadow-secondary-900/40 shadow-primary-500/5 dark:shadow-primary-500/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1 truncate">
            {title}
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-900 dark:text-white">
            {total.toLocaleString()}
          </p>
          <div className={`flex items-center mt-1 sm:mt-2 text-xs sm:text-sm ${
            getChangeType(change) === 'increase' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {getChangeType(change) === 'increase' ? (
              <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            )}
            <span>{formatChangeValue(change)}</span>
          </div>
        </div>
        <div className="ml-2 sm:ml-3 lg:ml-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}