import { FC } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  SparklesIcon,
  ClockIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline'
import { DeviceCategory, DeviceCategoryPaymentOptionEnum, DeviceCatetoryPaymentDurationOptionEnum } from '@/types/deviceCategory'

interface FinancingOptionsStepProps {
  onNext: () => void
  selectedDeviceCategory?: DeviceCategory
  isLoading: boolean
}

const formatCurrency = (amount: number, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)

const durationLabel: Record<DeviceCatetoryPaymentDurationOptionEnum, string> = {
  [DeviceCatetoryPaymentDurationOptionEnum.WEEKLY]: 'Weekly',
  [DeviceCatetoryPaymentDurationOptionEnum.MONTHLY]: 'Monthly',
}

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-secondary-600 rounded ${className}`} />
)

const FinancingOptionsStep: FC<FinancingOptionsStepProps> = ({
  onNext,
  selectedDeviceCategory,
  isLoading,
}) => {
  const paymentOptions = selectedDeviceCategory?.payment_option ?? []
  const hasOutright = paymentOptions.includes(DeviceCategoryPaymentOptionEnum.OUTRIGHT)
  const hasInstallment = paymentOptions.includes(DeviceCategoryPaymentOptionEnum.INSTALLMENT)
  const currency = selectedDeviceCategory?.currency ?? 'NGN'
  const amount = selectedDeviceCategory?.amount ?? 0

  const upfrontAmount = hasInstallment && selectedDeviceCategory
    ? (amount * (selectedDeviceCategory.installment_initialization_percentage / 100))
    : 0

  const interestAmount = hasInstallment && selectedDeviceCategory
    ? (amount * (selectedDeviceCategory.installment_interest_rate / 100))
    : 0

  const totalWithInterest = amount + interestAmount

  return (
    <div className="px-8 pt-8 pb-6">
      <div className="flex flex-col items-center text-center mb-5">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
          className="mb-4 w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center"
        >
          <BanknotesIcon className="w-9 h-9 text-emerald-500" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl font-bold text-secondary-900 dark:text-white"
        >
          Financing Options
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed max-w-sm"
        >
          {isLoading
            ? 'Loading your financing options...'
            : selectedDeviceCategory
            ? `Here are the payment options available for your ${selectedDeviceCategory.model} package.`
            : 'Review the payment options available for your selected package.'}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.4 }}
        className="flex flex-col gap-3 mb-5"
      >
        {isLoading ? (
          <>
            <div className="rounded-xl border border-gray-200 dark:border-secondary-600 p-4 space-y-3">
              <SkeletonBlock className="h-4 w-1/3" />
              <SkeletonBlock className="h-3 w-2/3" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-secondary-600 p-4 space-y-3">
              <SkeletonBlock className="h-4 w-1/3" />
              <SkeletonBlock className="h-3 w-2/3" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
          </>
        ) : (
          <>
            {hasOutright && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42, duration: 0.35 }}
                className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                    <CurrencyDollarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    Outright Purchase
                  </p>
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                    <CheckCircleIcon className="w-3 h-3" />
                    No interest
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-700 dark:text-emerald-400">Total amount</span>
                    <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                      {formatCurrency(amount, currency)}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500 leading-relaxed">
                    Pay once and own your solar package outright — no monthly obligations.
                  </p>
                </div>
              </motion.div>
            )}

            {hasInstallment && selectedDeviceCategory && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: hasOutright ? 0.50 : 0.42, duration: 0.35 }}
                className="rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                    <CalendarDaysIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-sm font-semibold text-primary-800 dark:text-primary-300">
                    Installment Plan
                  </p>
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                    <SparklesIcon className="w-3 h-3" />
                    Flexible
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary-700 dark:text-primary-400 flex items-center gap-1">
                      <CurrencyDollarIcon className="w-3.5 h-3.5" />
                      Upfront deposit
                    </span>
                    <span className="text-sm font-bold text-primary-800 dark:text-primary-200">
                      {formatCurrency(upfrontAmount, currency)}
                      <span className="text-xs font-normal ml-1 text-primary-500">
                        ({selectedDeviceCategory.installment_initialization_percentage}%)
                      </span>
                    </span>
                  </div>

                  {selectedDeviceCategory.installment_interest_rate > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-primary-700 dark:text-primary-400 flex items-center gap-1">
                        <ReceiptPercentIcon className="w-3.5 h-3.5" />
                        Total with interest
                      </span>
                      <span className="text-sm font-semibold text-primary-800 dark:text-primary-200">
                        {formatCurrency(totalWithInterest, currency)}
                        <span className="text-xs font-normal ml-1 text-primary-500">
                          ({selectedDeviceCategory.installment_interest_rate}% rate)
                        </span>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary-700 dark:text-primary-400 flex items-center gap-1">
                      <ClockIcon className="w-3.5 h-3.5" />
                      Plan duration
                    </span>
                    <span className="text-xs font-semibold text-primary-800 dark:text-primary-200">
                      1 – {selectedDeviceCategory.installment_duration_available} months
                    </span>
                  </div>
                  <p className="text-xs text-primary-600 dark:text-primary-500 leading-relaxed">
                    Choose any duration between 1 and {selectedDeviceCategory.installment_duration_available} months that suits your budget.
                  </p>

                  {selectedDeviceCategory.installment_payment_durations_option.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-primary-700 dark:text-primary-400">Payment schedule</span>
                      <div className="flex gap-1">
                        {selectedDeviceCategory.installment_payment_durations_option.map((d) => (
                          <span
                            key={d}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                          >
                            {durationLabel[d]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {!hasOutright && !hasInstallment && (
              <div className="text-center py-6 text-sm text-secondary-400 dark:text-secondary-500">
                No financing options are available for this package at the moment.
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
        Continue
        <ArrowRightIcon className="w-4 h-4" />
      </motion.button>
    </div>
  )
}

export default FinancingOptionsStep
