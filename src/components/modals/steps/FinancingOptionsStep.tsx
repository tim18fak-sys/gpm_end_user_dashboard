import { FC, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  SparklesIcon,
  ClockIcon,
  ReceiptPercentIcon,
  ChevronDownIcon,
  CalculatorIcon,
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

const periodsPerMonth: Record<DeviceCatetoryPaymentDurationOptionEnum, number> = {
  [DeviceCatetoryPaymentDurationOptionEnum.WEEKLY]: 4,
  [DeviceCatetoryPaymentDurationOptionEnum.MONTHLY]: 1,
}

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-secondary-200 dark:bg-secondary-600 rounded ${className}`} />
)

const FinancingOptionsStep: FC<FinancingOptionsStepProps> = ({
  onNext,
  selectedDeviceCategory,
  isLoading,
}) => {
  const [selectedOption, setSelectedOption] = useState<DeviceCategoryPaymentOptionEnum | null>(null)
  const [selectedMonths, setSelectedMonths] = useState(1)
  const [selectedFrequency, setSelectedFrequency] = useState<DeviceCatetoryPaymentDurationOptionEnum | null>(null)

  const paymentOptions = selectedDeviceCategory?.payment_option ?? []
  const hasOutright = paymentOptions.includes(DeviceCategoryPaymentOptionEnum.OUTRIGHT)
  const hasInstallment = paymentOptions.includes(DeviceCategoryPaymentOptionEnum.INSTALLMENT)
  const currency = selectedDeviceCategory?.currency ?? 'NGN'
  const amount = selectedDeviceCategory?.amount ?? 0
  const maxMonths = selectedDeviceCategory?.installment_duration_available ?? 1
  const interestRate = selectedDeviceCategory?.installment_interest_rate ?? 0
  const initPercentage = selectedDeviceCategory?.installment_initialization_percentage ?? 0
  const frequencyOptions = selectedDeviceCategory?.installment_payment_durations_option ?? []

  const totalDeviceValue = amount * (1 + interestRate / 100)
  const upfrontAmount = totalDeviceValue * (initPercentage / 100)
  const balance = totalDeviceValue - upfrontAmount

  const totalPeriods = selectedFrequency
    ? selectedMonths * periodsPerMonth[selectedFrequency]
    : 0
  const perPeriodPayment = totalPeriods > 0 ? balance / totalPeriods : 0

  const handleSelectOption = useCallback((option: DeviceCategoryPaymentOptionEnum) => {
    setSelectedOption(option)
    if (option !== DeviceCategoryPaymentOptionEnum.INSTALLMENT) {
      setSelectedFrequency(null)
    }
  }, [])

  const handleMonthsChange = (val: number) => {
    setSelectedMonths(Math.min(Math.max(1, val), maxMonths))
  }

  const canContinue =
    selectedOption === DeviceCategoryPaymentOptionEnum.OUTRIGHT ||
    (selectedOption === DeviceCategoryPaymentOptionEnum.INSTALLMENT &&
      selectedMonths >= 1 &&
      selectedFrequency !== null)

  return (
    <div className="px-8 pt-8 pb-6 max-h-[85vh] overflow-y-auto">
      <div className="flex flex-col items-center text-center mb-5">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
          className="mb-4 w-16 h-16 rounded-2xl bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 flex items-center justify-center"
        >
          <BanknotesIcon className="w-9 h-9 text-success-500" />
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
            ? `Choose how you'd like to pay for your ${selectedDeviceCategory.model} package.`
            : 'Choose a payment option for your selected package.'}
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
            <div className="rounded-xl border border-secondary-200 dark:border-secondary-600 p-4 space-y-3">
              <SkeletonBlock className="h-4 w-1/3" />
              <SkeletonBlock className="h-3 w-2/3" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
            <div className="rounded-xl border border-secondary-200 dark:border-secondary-600 p-4 space-y-3">
              <SkeletonBlock className="h-4 w-1/3" />
              <SkeletonBlock className="h-3 w-2/3" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
          </>
        ) : (
          <>
            {hasOutright && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42, duration: 0.35 }}
                onClick={() => handleSelectOption(DeviceCategoryPaymentOptionEnum.OUTRIGHT)}
                className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
                  selectedOption === DeviceCategoryPaymentOptionEnum.OUTRIGHT
                    ? 'border-success-400 dark:border-success-600 bg-success-50 dark:bg-success-900/25 ring-2 ring-success-300 dark:ring-success-700'
                    : 'border-secondary-200 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-700/50 hover:border-success-300 dark:hover:border-success-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-success-100 dark:bg-success-900/40 flex items-center justify-center flex-shrink-0">
                    <CurrencyDollarIcon className="w-4 h-4 text-success-600 dark:text-success-400" />
                  </div>
                  <p className="text-sm font-semibold text-success-800 dark:text-success-300">
                    Outright Purchase
                  </p>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-success-100 dark:bg-success-900/40 text-success-700 dark:text-success-300">
                      <CheckCircleIcon className="w-3 h-3" />
                      No interest
                    </span>
                    {selectedOption === DeviceCategoryPaymentOptionEnum.OUTRIGHT && (
                      <CheckCircleIcon className="w-4 h-4 text-success-500" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-success-600 dark:text-success-500">
                    Pay once, own it outright
                  </p>
                  <span className="text-sm font-bold text-success-800 dark:text-success-200">
                    {formatCurrency(amount, currency)}
                  </span>
                </div>
              </motion.button>
            )}

            {hasInstallment && selectedDeviceCategory && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: hasOutright ? 0.50 : 0.42, duration: 0.35 }}
                className={`rounded-xl border transition-all duration-200 ${
                  selectedOption === DeviceCategoryPaymentOptionEnum.INSTALLMENT
                    ? 'border-primary-400 dark:border-primary-600 ring-2 ring-primary-300 dark:ring-primary-700'
                    : 'border-secondary-200 dark:border-secondary-600'
                }`}
              >
                <button
                  onClick={() => handleSelectOption(DeviceCategoryPaymentOptionEnum.INSTALLMENT)}
                  className={`w-full text-left p-4 rounded-xl transition-colors duration-200 ${
                    selectedOption === DeviceCategoryPaymentOptionEnum.INSTALLMENT
                      ? 'bg-primary-50 dark:bg-primary-900/25'
                      : 'bg-secondary-50 dark:bg-secondary-700/50 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                      <CalendarDaysIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <p className="text-sm font-semibold text-primary-800 dark:text-primary-300">
                      Installment Plan
                    </p>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                        <SparklesIcon className="w-3 h-3" />
                        Flexible
                      </span>
                      <motion.div
                        animate={{ rotate: selectedOption === DeviceCategoryPaymentOptionEnum.INSTALLMENT ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDownIcon className="w-4 h-4 text-primary-500" />
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary-600 dark:text-primary-500">
                      1 – {maxMonths} months · upfront {initPercentage}%
                    </span>
                    {interestRate > 0 && (
                      <span className="text-xs text-primary-500 dark:text-primary-400">
                        +{interestRate}% interest
                      </span>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {selectedOption === DeviceCategoryPaymentOptionEnum.INSTALLMENT && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/25 rounded-b-xl space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-primary-700 dark:text-primary-300 mb-2">
                            How many months?
                            <span className="ml-2 text-primary-500 font-normal">
                              (max {maxMonths} months)
                            </span>
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min={1}
                              max={maxMonths}
                              value={selectedMonths}
                              onChange={(e) => handleMonthsChange(Number(e.target.value))}
                              className="flex-1 h-2 rounded-full accent-primary-600 cursor-pointer"
                            />
                            <div className="flex items-center gap-1 bg-white dark:bg-secondary-800 border border-primary-200 dark:border-primary-700 rounded-lg px-2 py-1 min-w-[64px]">
                              <input
                                type="number"
                                min={1}
                                max={maxMonths}
                                value={selectedMonths}
                                onChange={(e) => handleMonthsChange(Number(e.target.value))}
                                className="w-8 text-center text-sm font-bold text-primary-800 dark:text-primary-200 bg-transparent outline-none"
                              />
                              <span className="text-xs text-primary-500">mo</span>
                            </div>
                          </div>
                        </div>

                        {frequencyOptions.length > 0 && (
                          <div>
                            <label className="block text-xs font-semibold text-primary-700 dark:text-primary-300 mb-2">
                              Payment frequency
                            </label>
                            <div className="flex gap-2">
                              {frequencyOptions.map((freq) => (
                                <button
                                  key={freq}
                                  onClick={() => setSelectedFrequency(freq)}
                                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                                    selectedFrequency === freq
                                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-secondary-800 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:border-primary-400'
                                  }`}
                                >
                                  {durationLabel[freq]}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedFrequency && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="rounded-xl bg-white dark:bg-secondary-800 border border-primary-200 dark:border-primary-700 p-3 space-y-2"
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <CalculatorIcon className="w-3.5 h-3.5 text-primary-500" />
                              <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                                Payment breakdown
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-secondary-500 dark:text-secondary-400">
                                Device value
                              </span>
                              <span className="text-xs font-semibold text-secondary-800 dark:text-secondary-200">
                                {formatCurrency(amount, currency)}
                              </span>
                            </div>

                            {interestRate > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                                  <ReceiptPercentIcon className="w-3 h-3" />
                                  Interest ({interestRate}%)
                                </span>
                                <span className="text-xs font-semibold text-secondary-800 dark:text-secondary-200">
                                  + {formatCurrency(totalDeviceValue - amount, currency)}
                                </span>
                              </div>
                            )}

                            <div className="border-t border-secondary-100 dark:border-secondary-700 pt-2 flex items-center justify-between">
                              <span className="text-xs text-secondary-500 dark:text-secondary-400">
                                Total device value
                              </span>
                              <span className="text-xs font-bold text-secondary-900 dark:text-white">
                                {formatCurrency(totalDeviceValue, currency)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                                <CurrencyDollarIcon className="w-3 h-3" />
                                Upfront ({initPercentage}%)
                              </span>
                              <span className="text-xs font-bold text-warning-600 dark:text-warning-400">
                                {formatCurrency(upfrontAmount, currency)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-secondary-500 dark:text-secondary-400">
                                Remaining balance
                              </span>
                              <span className="text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                                {formatCurrency(balance, currency)}
                              </span>
                            </div>

                            <div className="border-t border-secondary-100 dark:border-secondary-700 pt-2 flex items-center justify-between">
                              <span className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                                <ClockIcon className="w-3 h-3" />
                                {durationLabel[selectedFrequency]} payment
                                <span className="text-secondary-400">
                                  × {totalPeriods}
                                </span>
                              </span>
                              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                {formatCurrency(perPeriodPayment, currency)}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
        whileHover={{ scale: canContinue && !isLoading ? 1.02 : 1 }}
        whileTap={{ scale: canContinue && !isLoading ? 0.97 : 1 }}
        onClick={onNext}
        disabled={isLoading || !canContinue}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        {!canContinue ? 'Select a payment option to continue' : 'Continue'}
        {canContinue && <ArrowRightIcon className="w-4 h-4" />}
      </motion.button>
    </div>
  )
}

export default FinancingOptionsStep
