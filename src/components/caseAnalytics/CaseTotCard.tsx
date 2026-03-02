
import { motion } from 'framer-motion'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import type { BaseTotalCase } from '../../types/caseAnalytics'

interface CaseTotCardProps {
  title: string
  data: BaseTotalCase | undefined
  isLoading: boolean
  colorClass: string
  index: number
}

export default function CaseTotCard({ 
  title, 
  data, 
  isLoading, 
  colorClass, 
  index 
}: CaseTotCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5
      }
    }
  }

  if (isLoading) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-secondary-200 dark:bg-secondary-700 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-1/4"></div>
        </div>
      </motion.div>
    )
  }

  const total = data?.total ?? 0
  const change = data?.change ?? 0
  const isPositive = change >= 0

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
            {title}
          </p>
          <p className={`text-2xl font-bold ${colorClass}`}>
            {total.toLocaleString()}
          </p>
          <div className="flex items-center mt-1">
            {change !== 0 && (
              <>
                {isPositive ? (
                  <ArrowUpIcon className="h-3 w-3 text-success-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 text-danger-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositive 
                      ? 'text-success-600 dark:text-success-400' 
                      : 'text-danger-600 dark:text-danger-400'
                  }`}
                >
                  {Math.abs(change)}
                </span>
              </>
            )}
            {change === 0 && (
              <span className="text-sm text-secondary-500 dark:text-secondary-400">
                No change
              </span>
            )}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-full ${colorClass.replace('text-', 'bg-').replace('-600', '-100')} dark:${colorClass.replace('text-', 'bg-').replace('-600', '-900')} flex items-center justify-center`}>
          <div className={`w-6 h-6 rounded-full ${colorClass.replace('text-', 'bg-')}`}></div>
        </div>
      </div>
    </motion.div>
  )
}
