import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  DevicePhoneMobileIcon,
  CalendarDaysIcon,
  BoltIcon,
  SparklesIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useDeviceCategories, useAllDeviceCategories } from '@/hooks/useDeviceCategory'
import { useCreateNewOrder } from '@/hooks/useOrder'
import { useAuthStore } from '@/store/authStore'
import {
  DeviceCategory,
  DeviceCategoryPaymentOptionEnum,
  DeviceCatetoryPaymentDurationOptionEnum,
} from '@/types/deviceCategory'
import { DevicePaymentPlan, DevicePaymentTimelineEnum } from '@/enum/device.enum'
import toast from 'react-hot-toast'

// ─── Types ────────────────────────────────────────────────────────────────────

type WizardStep = 1 | 2 | 3 | 4

interface WizardState {
  selectedCategory: DeviceCategory | null
  selectedOption: DeviceCategoryPaymentOptionEnum | null
  selectedMonths: number
  selectedFrequency: DeviceCatetoryPaymentDurationOptionEnum | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n)

function calcInstallment(
  amount: number,
  initPct: number,
  interestRate: number,
  months: number,
  freq: DeviceCatetoryPaymentDurationOptionEnum,
) {
  const initAmount = amount * (initPct / 100)
  const remaining = amount - initAmount
  const totalInterestRate = interestRate * months
  const interest = remaining * (totalInterestRate / 100)
  const totalOwed = remaining + interest
  const periods =
    freq === DeviceCatetoryPaymentDurationOptionEnum.WEEKLY ? months * 4 : months
  const perPeriod = totalOwed / periods
  return { initAmount, remaining, interest, totalOwed, perPeriod, periods, totalInterestRate }
}

const planFromFrequency = (freq: DeviceCatetoryPaymentDurationOptionEnum): DevicePaymentPlan =>
  freq === DeviceCatetoryPaymentDurationOptionEnum.WEEKLY
    ? DevicePaymentPlan.WEEKLY
    : DevicePaymentPlan.MONTHLY

const timelineLabel = (tl: string) =>
  tl
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDots({
  current,
  total,
}: {
  current: number
  total: number
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i + 1 === current ? 20 : 6,
            backgroundColor: i + 1 <= current ? 'rgb(var(--color-primary-500))' : 'rgb(var(--color-secondary-300))',
          }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  )
}

// ─── Step 1: Device Category Selection ───────────────────────────────────────

function Step1SelectCategory({
  selected,
  onSelect,
}: {
  selected: DeviceCategory | null
  onSelect: (c: DeviceCategory) => void
}) {
  const { user } = useAuthStore()
  const paymentTimeline = user?.paymentTimeline as DevicePaymentTimelineEnum | undefined

  const { data: timelineData, isLoading: timelineLoading } = useDeviceCategories(
    { paymentTimeline: paymentTimeline ?? '' },
    !!paymentTimeline,
  )

  const timelineCats = timelineData?.data ?? []
  const needsFallback = !timelineLoading && timelineCats.length === 0

  const { data: allData, isLoading: allLoading } = useAllDeviceCategories(needsFallback)
  const fallbackCats = allData?.data ?? []

  const categories = timelineCats.length > 0 ? timelineCats : fallbackCats
  const isLoading = timelineLoading || (needsFallback && allLoading)
  const isFallback = !timelineLoading && timelineCats.length === 0 && fallbackCats.length > 0

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-secondary-100 dark:bg-secondary-700 rounded-2xl h-28"
          />
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <ExclamationTriangleIcon className="w-10 h-10 text-warning-400 mb-3" />
        <p className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
          No device categories found
        </p>
        <p className="text-xs text-secondary-400 dark:text-secondary-500 leading-relaxed">
          No devices are currently available for your plan. Contact your hub admin.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {isFallback && (
        <div className="flex items-start gap-2 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-xl p-3">
          <InformationCircleIcon className="w-4 h-4 text-warning-500 dark:text-warning-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-warning-700 dark:text-warning-300 leading-relaxed">
            Showing all available devices — none matched your specific payment plan.
          </p>
        </div>
      )}
      {categories.map((cat) => {
        const isSelected = selected?._id === cat._id
        return (
          <motion.button
            key={cat._id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(cat)}
            className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
              isSelected
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:border-primary-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? 'bg-primary-500'
                    : 'bg-secondary-100 dark:bg-secondary-700'
                }`}
              >
                {isSelected ? (
                  <CheckIcon className="w-5 h-5 text-white" />
                ) : (
                  <DevicePhoneMobileIcon className="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm font-bold leading-tight ${
                      isSelected
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-secondary-900 dark:text-white'
                    }`}
                  >
                    {cat.model}
                  </p>
                  <p className="text-sm font-bold text-secondary-900 dark:text-white flex-shrink-0">
                    {formatCurrency(cat.amount)}
                  </p>
                </div>
                <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cat.payment_option.map((opt) => (
                    <span
                      key={opt}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400 uppercase tracking-wide"
                    >
                      {opt === DeviceCategoryPaymentOptionEnum.OUTRIGHT ? 'Outright' : 'Installment'}
                    </span>
                  ))}
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                    {cat.device_type}
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

// ─── Step 2: Payment Option ───────────────────────────────────────────────────

function Step2PaymentOption({
  category,
  selected,
  onSelect,
}: {
  category: DeviceCategory
  selected: DeviceCategoryPaymentOptionEnum | null
  onSelect: (o: DeviceCategoryPaymentOptionEnum) => void
}) {
  const options = category.payment_option

  return (
    <div className="space-y-4">
      {/* Device summary */}
      <div className="bg-secondary-50 dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <DevicePhoneMobileIcon className="w-5 h-5 text-primary-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-secondary-900 dark:text-white">{category.model}</p>
            <p className="text-xs text-secondary-400 dark:text-secondary-500">{category.device_type} · {formatCurrency(category.amount)}</p>
          </div>
        </div>
      </div>

      <p className="text-xs font-semibold text-secondary-400 dark:text-secondary-500 uppercase tracking-wider">
        How would you like to pay?
      </p>

      {/* Outright option */}
      {options.includes(DeviceCategoryPaymentOptionEnum.OUTRIGHT) && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(DeviceCategoryPaymentOptionEnum.OUTRIGHT)}
          className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
            selected === DeviceCategoryPaymentOptionEnum.OUTRIGHT
              ? 'border-success-500 bg-success-50 dark:bg-success-900/20'
              : 'border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                selected === DeviceCategoryPaymentOptionEnum.OUTRIGHT
                  ? 'bg-success-500'
                  : 'bg-secondary-100 dark:bg-secondary-700'
              }`}
            >
              {selected === DeviceCategoryPaymentOptionEnum.OUTRIGHT ? (
                <CheckIcon className="w-5 h-5 text-white" />
              ) : (
                <BoltIcon className="w-5 h-5 text-secondary-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-secondary-900 dark:text-white">Outright Purchase</p>
              <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5 leading-relaxed">
                Pay the full amount upfront. No installments, no interest.
              </p>
              <p className="text-sm font-bold text-success-600 dark:text-success-400 mt-2">
                {formatCurrency(category.amount)}
              </p>
            </div>
          </div>
        </motion.button>
      )}

      {/* Installment option */}
      {options.includes(DeviceCategoryPaymentOptionEnum.INSTALLMENT) && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(DeviceCategoryPaymentOptionEnum.INSTALLMENT)}
          className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
            selected === DeviceCategoryPaymentOptionEnum.INSTALLMENT
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                selected === DeviceCategoryPaymentOptionEnum.INSTALLMENT
                  ? 'bg-primary-500'
                  : 'bg-secondary-100 dark:bg-secondary-700'
              }`}
            >
              {selected === DeviceCategoryPaymentOptionEnum.INSTALLMENT ? (
                <CheckIcon className="w-5 h-5 text-white" />
              ) : (
                <CalendarDaysIcon className="w-5 h-5 text-secondary-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-secondary-900 dark:text-white">Installment Plan</p>
              <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5 leading-relaxed">
                Pay a small activation amount, then spread the rest over{' '}
                <span className="font-semibold">
                  up to {category.installment_duration_available} months
                </span>
                .
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-1.5 font-medium">
                {category.installment_initialization_percentage}% activation ·{' '}
                {category.installment_interest_rate}% monthly interest
              </p>
            </div>
          </div>
        </motion.button>
      )}
    </div>
  )
}

// ─── Step 3: Installment Configuration ───────────────────────────────────────

function Step3InstallmentConfig({
  category,
  selectedMonths,
  selectedFrequency,
  onMonthsChange,
  onFrequencyChange,
}: {
  category: DeviceCategory
  selectedMonths: number
  selectedFrequency: DeviceCatetoryPaymentDurationOptionEnum | null
  onMonthsChange: (m: number) => void
  onFrequencyChange: (f: DeviceCatetoryPaymentDurationOptionEnum) => void
}) {
  const freq = selectedFrequency ?? DeviceCatetoryPaymentDurationOptionEnum.MONTHLY
  const calc = calcInstallment(
    category.amount,
    category.installment_initialization_percentage,
    category.installment_interest_rate,
    selectedMonths,
    freq,
  )
  const maxMonths = category.installment_duration_available
  const freqOptions = category.installment_payment_durations_option

  return (
    <div className="space-y-5">
      {/* Month selector */}
      <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-secondary-900 dark:text-white">Repayment period</p>
          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
            {selectedMonths} month{selectedMonths !== 1 ? 's' : ''}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={maxMonths}
          value={selectedMonths}
          onChange={(e) => onMonthsChange(Number(e.target.value))}
          className="w-full accent-primary-500"
        />
        <div className="flex justify-between text-[10px] text-secondary-400 dark:text-secondary-500 mt-1">
          <span>1 month</span>
          <span>{maxMonths} months</span>
        </div>
      </div>

      {/* Payment frequency */}
      {freqOptions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-secondary-400 dark:text-secondary-500 uppercase tracking-wider mb-2">
            Payment frequency
          </p>
          <div className="flex gap-3">
            {freqOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => onFrequencyChange(opt)}
                className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  selectedFrequency === opt
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300'
                }`}
              >
                {opt === DeviceCatetoryPaymentDurationOptionEnum.WEEKLY ? 'Weekly' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live payment breakdown */}
      <div className="bg-secondary-50 dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider flex items-center gap-1.5">
          <SparklesIcon className="w-3.5 h-3.5" />
          Payment breakdown
        </p>

        <BreakdownRow label="Device price" value={formatCurrency(category.amount)} />
        <BreakdownRow
          label={`Activation payment (${category.installment_initialization_percentage}%)`}
          value={formatCurrency(calc.initAmount)}
          highlight
        />
        <BreakdownRow label="Remaining balance" value={formatCurrency(calc.remaining)} />
        <BreakdownRow
          label={`Interest (${category.installment_interest_rate}% × ${selectedMonths} mo = ${calc.totalInterestRate.toFixed(0)}%)`}
          value={formatCurrency(calc.interest)}
        />
        <div className="border-t border-secondary-200 dark:border-secondary-700 pt-2 mt-1">
          <BreakdownRow
            label={`Per ${freq === DeviceCatetoryPaymentDurationOptionEnum.WEEKLY ? 'week' : 'month'} (${calc.periods} periods)`}
            value={formatCurrency(calc.perPeriod)}
            strong
          />
        </div>
      </div>

      {/* Activation callout */}
      <div className="flex items-start gap-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-xl p-3">
        <InformationCircleIcon className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-warning-700 dark:text-warning-300 leading-relaxed">
          You'll need to pay{' '}
          <span className="font-bold">{formatCurrency(calc.initAmount)}</span> to activate your order and receive your device.
        </p>
      </div>
    </div>
  )
}

function BreakdownRow({
  label,
  value,
  highlight,
  strong,
}: {
  label: string
  value: string
  highlight?: boolean
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-secondary-500 dark:text-secondary-400 leading-tight">{label}</span>
      <span
        className={`text-xs font-semibold flex-shrink-0 ${
          highlight
            ? 'text-primary-600 dark:text-primary-400'
            : strong
            ? 'text-secondary-900 dark:text-white text-sm'
            : 'text-secondary-700 dark:text-secondary-300'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

// ─── Step 4: Review & Submit ──────────────────────────────────────────────────

function Step4Review({
  category,
  option,
  selectedMonths,
  selectedFrequency,
  paymentTimeline,
  isSubmitting,
  onSubmit,
}: {
  category: DeviceCategory
  option: DeviceCategoryPaymentOptionEnum
  selectedMonths: number
  selectedFrequency: DeviceCatetoryPaymentDurationOptionEnum | null
  paymentTimeline: string
  isSubmitting: boolean
  onSubmit: () => void
}) {
  const isInstallment = option === DeviceCategoryPaymentOptionEnum.INSTALLMENT
  const freq = selectedFrequency ?? DeviceCatetoryPaymentDurationOptionEnum.MONTHLY

  const calc = isInstallment
    ? calcInstallment(
        category.amount,
        category.installment_initialization_percentage,
        category.installment_interest_rate,
        selectedMonths,
        freq,
      )
    : null

  const activationAmount = isInstallment ? (calc?.initAmount ?? 0) : category.amount
  const plan = isInstallment
    ? planFromFrequency(freq)
    : DevicePaymentPlan.NONE

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-950 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <DevicePhoneMobileIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-primary-200 uppercase tracking-wider">Selected device</p>
            <p className="text-base font-bold">{category.model}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[10px] text-primary-200 uppercase tracking-wide mb-0.5">Payment type</p>
            <p className="text-sm font-bold">
              {isInstallment ? 'Installment' : 'Outright'}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[10px] text-primary-200 uppercase tracking-wide mb-0.5">Plan</p>
            <p className="text-sm font-bold">
              {plan === DevicePaymentPlan.WEEKLY
                ? 'Weekly'
                : plan === DevicePaymentPlan.MONTHLY
                ? 'Monthly'
                : 'One-time'}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[10px] text-primary-200 uppercase tracking-wide mb-0.5">Timeline</p>
            <p className="text-sm font-bold capitalize">{timelineLabel(paymentTimeline)}</p>
          </div>
          {isInstallment && (
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-[10px] text-primary-200 uppercase tracking-wide mb-0.5">Duration</p>
              <p className="text-sm font-bold">{selectedMonths} months</p>
            </div>
          )}
        </div>
      </div>

      {/* Activation amount callout */}
      <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-2xl p-4">
        <p className="text-xs text-warning-600 dark:text-warning-400 font-medium mb-1">
          Amount to pay now (activation)
        </p>
        <p className="text-2xl font-bold text-warning-800 dark:text-warning-200">
          {formatCurrency(activationAmount)}
        </p>
        {isInstallment && calc && (
          <p className="text-xs text-warning-600 dark:text-warning-400 mt-1">
            Then {formatCurrency(calc.perPeriod)}{' '}
            {freq === DeviceCatetoryPaymentDurationOptionEnum.WEEKLY ? 'per week' : 'per month'} for{' '}
            {selectedMonths} months
          </p>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-secondary-400 dark:text-secondary-500 text-center leading-relaxed px-2">
        By creating this order you agree to the payment terms above. Your hub admin will process and assign your device after payment.
      </p>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-bold transition-colors shadow-sm"
      >
        {isSubmitting ? (
          <>
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
            Creating order…
          </>
        ) : (
          <>
            <CheckCircleIcon className="w-4 h-4" />
            Create Order
          </>
        )}
      </motion.button>
    </div>
  )
}

// ─── Slide animation ──────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0 }),
}

const stepTitles: Record<WizardStep, string> = {
  1: 'Choose a device',
  2: 'Payment option',
  3: 'Installment details',
  4: 'Review & confirm',
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface NewOrderModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function NewOrderModal({ onClose, onSuccess }: NewOrderModalProps) {
  const { user } = useAuthStore()
  const paymentTimeline = (user?.paymentTimeline ?? '') as DevicePaymentTimelineEnum
  const { mutate: createOrder, isPending } = useCreateNewOrder()

  const [step, setStep] = useState<WizardStep>(1)
  const [dir, setDir] = useState(1)
  const [state, setState] = useState<WizardState>({
    selectedCategory: null,
    selectedOption: null,
    selectedMonths: 1,
    selectedFrequency: null,
  })

  const isInstallment = state.selectedOption === DeviceCategoryPaymentOptionEnum.INSTALLMENT
  const totalSteps = isInstallment ? 4 : 3
  const displayStep = step === 4 ? totalSteps : isInstallment ? step : step === 3 ? 3 : step

  const goTo = (next: WizardStep) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
  }

  const handleNext = () => {
    if (step === 1) {
      if (!state.selectedCategory) return
      goTo(2)
    } else if (step === 2) {
      if (!state.selectedOption) return
      if (state.selectedOption === DeviceCategoryPaymentOptionEnum.INSTALLMENT) {
        const cat = state.selectedCategory!
        setState((s) => ({
          ...s,
          selectedMonths: Math.min(1, cat.installment_duration_available),
          selectedFrequency: cat.installment_payment_durations_option[0] ?? DeviceCatetoryPaymentDurationOptionEnum.MONTHLY,
        }))
        goTo(3)
      } else {
        goTo(4)
      }
    } else if (step === 3) {
      if (!state.selectedFrequency) return
      goTo(4)
    }
  }

  const handleBack = () => {
    if (step === 2) goTo(1)
    else if (step === 3) goTo(2)
    else if (step === 4) goTo(isInstallment ? 3 : 2)
  }

  const handleSubmit = () => {
    if (!state.selectedCategory || !state.selectedOption) return

    const plan =
      state.selectedOption === DeviceCategoryPaymentOptionEnum.OUTRIGHT
        ? DevicePaymentPlan.NONE
        : planFromFrequency(state.selectedFrequency ?? DeviceCatetoryPaymentDurationOptionEnum.MONTHLY)

    createOrder(
      {
        deviceCategoryId: state.selectedCategory._id,
        paymentTimeline,
        plan,
      },
      {
        onSuccess: () => {
          toast.success('Order created successfully!')
          onSuccess()
          onClose()
        },
        onError: () => {
          toast.error('Failed to create order. Please try again.')
        },
      },
    )
  }

  const canNext = useMemo(() => {
    if (step === 1) return !!state.selectedCategory
    if (step === 2) return !!state.selectedOption
    if (step === 3) return !!state.selectedFrequency
    return false
  }, [step, state])

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-secondary-800 rounded-t-3xl flex flex-col"
        style={{ maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-secondary-200 dark:bg-secondary-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-secondary-100 dark:border-secondary-700 flex-shrink-0">
          <div>
            <p className="text-base font-bold text-secondary-900 dark:text-white">
              {stepTitles[step]}
            </p>
            <div className="mt-1.5">
              <StepDots current={displayStep} total={totalSteps} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
          >
            <XMarkIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-300" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              {step === 1 && (
                <Step1SelectCategory
                  selected={state.selectedCategory}
                  onSelect={(c) => setState((s) => ({ ...s, selectedCategory: c, selectedOption: null }))}
                />
              )}
              {step === 2 && state.selectedCategory && (
                <Step2PaymentOption
                  category={state.selectedCategory}
                  selected={state.selectedOption}
                  onSelect={(o) => setState((s) => ({ ...s, selectedOption: o }))}
                />
              )}
              {step === 3 && state.selectedCategory && (
                <Step3InstallmentConfig
                  category={state.selectedCategory}
                  selectedMonths={state.selectedMonths}
                  selectedFrequency={state.selectedFrequency}
                  onMonthsChange={(m) => setState((s) => ({ ...s, selectedMonths: m }))}
                  onFrequencyChange={(f) => setState((s) => ({ ...s, selectedFrequency: f }))}
                />
              )}
              {step === 4 && state.selectedCategory && state.selectedOption && (
                <Step4Review
                  category={state.selectedCategory}
                  option={state.selectedOption}
                  selectedMonths={state.selectedMonths}
                  selectedFrequency={state.selectedFrequency}
                  paymentTimeline={paymentTimeline}
                  isSubmitting={isPending}
                  onSubmit={handleSubmit}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer nav — not shown on review step (has its own submit button) */}
        {step !== 4 && (
          <div className="flex gap-3 px-5 py-4 border-t border-secondary-100 dark:border-secondary-700 flex-shrink-0 mb-14">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 text-sm font-semibold text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors flex-shrink-0"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Back
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              disabled={!canNext}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white text-sm font-bold transition-colors"
            >
              Continue
              <ChevronRightIcon className="w-4 h-4" />
            </motion.button>
          </div>
        )}
        {step === 4 && (
          <div className="px-5 pb-4 pt-1 flex-shrink-0 mb-14">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 transition-colors py-1"
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
              Back to edit
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
