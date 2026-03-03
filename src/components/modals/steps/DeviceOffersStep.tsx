import { FC, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  BoltIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  TagIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { DeviceCategory, DeviceCategoryPaymentOptionEnum } from '@/types/deviceCategory'

interface DeviceOffersStepProps {
  onNext: () => void
  selectedDeviceCategory?: DeviceCategory
  isAvailableInInventory: boolean
  otherDeviceCategories: DeviceCategory[]
  isLoading: boolean
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)

const DeviceCategoryCard: FC<{ category: DeviceCategory; isSelected?: boolean }> = ({
  category,
  isSelected = false,
}) => (
  <div
    className={`rounded-xl border p-4 ${
      isSelected
        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700'
        : 'bg-gray-50 dark:bg-secondary-700/50 border-gray-200 dark:border-secondary-600'
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-secondary-900 dark:text-white truncate">
            {category.model}
          </p>
          {isSelected && (
            <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
              <CheckCircleIcon className="w-3 h-3" />
              Your Choice
            </span>
          )}
        </div>
        {category.description && (
          <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed mb-2 line-clamp-2">
            {category.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary-700 dark:text-secondary-300">
            <CurrencyDollarIcon className="w-3.5 h-3.5 text-primary-500" />
            {formatCurrency(category.amount)}
          </span>
          {category.payment_option === DeviceCategoryPaymentOptionEnum.INSTALLMENT && (
            <>
              <span className="text-secondary-300 dark:text-secondary-600">·</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary-700 dark:text-secondary-300">
                <CalendarDaysIcon className="w-3.5 h-3.5 text-amber-500" />
                {category.installment_duration_available}mo installment
              </span>
              <span className="text-secondary-300 dark:text-secondary-600">·</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary-700 dark:text-secondary-300">
                <TagIcon className="w-3.5 h-3.5 text-emerald-500" />
                {category.installment_initialization_percentage}% upfront
              </span>
            </>
          )}
          {category.payment_option === DeviceCategoryPaymentOptionEnum.OUTRIGHT && (
            <>
              <span className="text-secondary-300 dark:text-secondary-600">·</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                Outright purchase
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)

const SkeletonCard = () => (
  <div className="rounded-xl border border-gray-200 dark:border-secondary-600 bg-gray-50 dark:bg-secondary-700/50 p-4 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-secondary-600 rounded w-1/2 mb-2" />
    <div className="h-3 bg-gray-200 dark:bg-secondary-600 rounded w-3/4 mb-3" />
    <div className="flex gap-2">
      <div className="h-3 bg-gray-200 dark:bg-secondary-600 rounded w-20" />
      <div className="h-3 bg-gray-200 dark:bg-secondary-600 rounded w-24" />
    </div>
  </div>
)

const DeviceOffersStep: FC<DeviceOffersStepProps> = ({
  onNext,
  selectedDeviceCategory,
  isAvailableInInventory,
  otherDeviceCategories,
  isLoading,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasMoreToScroll = otherDeviceCategories.length > 2

  return (
    <div className="px-8 pt-8 pb-6">
      <div className="flex flex-col items-center text-center mb-5">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
          className={`mb-4 w-16 h-16 rounded-2xl flex items-center justify-center ${
            isAvailableInInventory
              ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
              : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
          }`}
        >
          {isAvailableInInventory ? (
            <BoltIcon className="w-9 h-9 text-primary-500" />
          ) : (
            <ExclamationTriangleIcon className="w-9 h-9 text-amber-500" />
          )}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl font-bold text-secondary-900 dark:text-white"
        >
          {isLoading ? 'Checking availability...' : isAvailableInInventory ? 'Your Device Package' : "Let's Find You an Option"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed max-w-sm"
        >
          {isLoading
            ? 'Checking availability for your selected package...'
            : isAvailableInInventory
            ? 'Great news — your selected package is available and ready to go.'
            : selectedDeviceCategory
            ? `${selectedDeviceCategory.model} is currently out of stock. Here are available alternatives.`
            : 'Browse the packages available for your application.'}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.4 }}
        className="mb-5"
      >
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : isAvailableInInventory && selectedDeviceCategory ? (
          <DeviceCategoryCard category={selectedDeviceCategory} isSelected />
        ) : (
          <>
            {selectedDeviceCategory && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-3">
                <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  <span className="font-semibold">{selectedDeviceCategory.model}</span> is currently
                  unavailable. Please choose from the options below.
                </p>
              </div>
            )}

            {otherDeviceCategories.length > 0 ? (
              <div className="relative">
                <div
                  ref={scrollRef}
                  className="flex flex-col gap-3 max-h-52 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-secondary-600 scrollbar-track-transparent"
                >
                  {otherDeviceCategories.map((cat, i) => (
                    <motion.div
                      key={cat._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
                    >
                      <DeviceCategoryCard category={cat} />
                    </motion.div>
                  ))}
                </div>

                {hasMoreToScroll && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-secondary-800 to-transparent rounded-b-xl flex items-end justify-center pb-1">
                    <ChevronDownIcon className="w-4 h-4 text-secondary-400 animate-bounce" />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-secondary-400 dark:text-secondary-500">
                No alternative packages found at this time.
              </div>
            )}
          </>
        )}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.35 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        {isAvailableInInventory ? 'Explore My Offers' : 'Continue'}
        <ArrowRightIcon className="w-4 h-4" />
      </motion.button>
    </div>
  )
}

export default DeviceOffersStep
