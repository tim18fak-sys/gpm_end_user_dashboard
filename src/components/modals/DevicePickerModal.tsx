import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon as CheckCircleOutline,
  BanknotesIcon,
  CalendarDaysIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon, CubeIcon } from '@heroicons/react/24/solid'
import {
  useDeviceClass,
  useDeviceCategoryGroup,
  useDeviceCategoryByGroupId,
} from '@/hooks/useDeviceCategory'
import { DeviceTypeEnum } from '@/enum/device.enum'
import {
  DeviceCategory,
  DeviceCategoryPaymentOptionEnum,
  DeviceCategoryPaymentDurationOptionEnum,
} from '@/types/deviceCategory'
import { useDebounce } from "@/hooks/useDebounce";

// ─── Public contract ─────────────────────────────────────────────────────────

export interface SelectedDevice {
  id: string
  name: string
  description: string
  deviceType: DeviceTypeEnum
  amount: number
  paymentOption: DeviceCategoryPaymentOptionEnum
  paymentDuration?: DeviceCategoryPaymentDurationOptionEnum
  initializationAmount: number
  installmentAmount?: number
  installmentDurationMonths?: number
}

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (device: SelectedDevice) => void
  currentId?: string
}

// ─── Stage type ───────────────────────────────────────────────────────────────

type Stage = 'class' | 'group' | 'category' | 'details' | 'installment'

const BROWSE_STAGES: Stage[] = ['class', 'group', 'category']

// ─── Animations ───────────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -64 : 64, opacity: 0 }),
}

// ─── Small helper components ──────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16">
      <div className="w-8 h-8 border-2 border-secondary-200 dark:border-secondary-600 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-xs text-secondary-400">Loading…</p>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-secondary-400">
      <CubeIcon className="w-10 h-10 opacity-20" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <p className="text-sm text-danger-500">Failed to load. Please try again.</p>
      <button onClick={onRetry} className="text-xs text-primary-600 dark:text-primary-400 underline">
        Retry
      </button>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-secondary-100 dark:border-secondary-700 last:border-0">
      <span className="text-xs text-secondary-500 dark:text-secondary-400">{label}</span>
      <span className="text-xs font-semibold text-secondary-800 dark:text-secondary-200">{value}</span>
    </div>
  )
}

// ─── Calculation helpers ──────────────────────────────────────────────────────

function calcInitAmount(cat: DeviceCategory): number {
  return cat.amount * (cat.installment_initialization_percentage / 100)
}

function calcInstallmentAmount(
  cat: DeviceCategory,
  duration: DeviceCategoryPaymentDurationOptionEnum,
): number {
  if (cat.allow_manual_calculation_for_installment_payment) {
    const opt = cat.installment_payment_durations_option.find(
      (o) => o.duration_option === duration,
    )
    return opt?.amount ?? 0
  }
  const init = calcInitAmount(cat)
  const remaining = cat.amount - init
  const interest = remaining * (cat.installment_interest_rate / 100)
  const total = remaining + interest
  if (duration === DeviceCategoryPaymentDurationOptionEnum.MONTHLY) {
    return total / cat.installment_duration_available
  }
  return total / (cat.installment_duration_available * 4)
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DevicePickerModal({ open, onClose, onSelect, currentId }: Props) {
  const [stage, setStage] = useState<Stage>('class')
  const [dir, setDir] = useState(1)
  const [search, setSearch] = useState('')

  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedClassName, setSelectedClassName] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedGroupName, setSelectedGroupName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<DeviceCategoryPaymentDurationOptionEnum | null>(null)

  const searchedClassDebounce = useDebounce(search, 300);
  const searchedGroupDebounce = useDebounce(search, 300);
  const searchedCategoryDebounce = useDebounce(search, 300);
  const classQuery = useDeviceClass({
    limit: 50,
    enabled: open,
    search: searchedClassDebounce,
  });
  const groupQuery = useDeviceCategoryGroup({
    limit: 50,
    deviceClassId: selectedClassId,
    enabled: !!selectedClassId && stage !== "class",
    search: searchedGroupDebounce,
  });
  const categoryQuery = useDeviceCategoryByGroupId({
    limit: 50,
    deviceGroupId: selectedGroupId,
    enabled:
      !!selectedGroupId &&
      (stage === "category" || stage === "details" || stage === "installment"),
    search: searchedCategoryDebounce,
  });

  const classes = classQuery.data?.data ?? []
  const groups = groupQuery.data?.data ?? []
  const categories = categoryQuery.data?.data ?? []

  // ── Reset on close ────────────────────────────────────────────────────────

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStage('class')
      setDir(1)
      setSearch('')
      setSelectedClassId('')
      setSelectedClassName('')
      setSelectedGroupId('')
      setSelectedGroupName('')
      setSelectedCategory(null)
      setSelectedDuration(null)
    }, 300)
  }

  // ── Browse navigation ─────────────────────────────────────────────────────

  const pickClass = (id: string, name: string) => {
    setSelectedClassId(id)
    setSelectedClassName(name)
    setDir(1)
    setSearch('')
    setStage('group')
  }

  const pickGroup = (id: string, name: string) => {
    setSelectedGroupId(id)
    setSelectedGroupName(name)
    setDir(1)
    setSearch('')
    setStage('category')
  }

  const pickCategory = (cat: DeviceCategory) => {
    setSelectedCategory(cat)
    setSelectedDuration(null)
    setDir(1)
    setStage('details')
  }

  // ── Payment navigation ────────────────────────────────────────────────────

  const pickOutright = () => {
    if (!selectedCategory) return
    onSelect({
      id: selectedCategory._id,
      name: selectedCategory.model,
      description: selectedCategory.description,
      deviceType: selectedCategory.device_type,
      amount: selectedCategory.amount,
      paymentOption: DeviceCategoryPaymentOptionEnum.OUTRIGHT,
      initializationAmount: 0,
      
    })
    handleClose()
  }

  const goToInstallment = () => {
    setDir(1)
    setStage('installment')
  }

  const confirmInstallment = (duration: DeviceCategoryPaymentDurationOptionEnum) => {
    if (!selectedCategory) return
    const initAmt = calcInitAmount(selectedCategory)
    const perPeriod = calcInstallmentAmount(selectedCategory, duration)
    onSelect({
      id: selectedCategory._id,
      name: selectedCategory.model,
      description: selectedCategory.description,
      deviceType: selectedCategory.device_type,
      amount: selectedCategory.amount,
      paymentOption: DeviceCategoryPaymentOptionEnum.INSTALLMENT,
      paymentDuration: duration,
      initializationAmount: initAmt,
      installmentAmount: perPeriod,
      installmentDurationMonths: selectedCategory.installment_duration_available,
    })
    handleClose()
  }

  const goBack = () => {
    setDir(-1)
    setSearch('')
    if (stage === 'installment') {
      setStage('details')
    } else if (stage === 'details') {
      setSelectedCategory(null)
      setStage('category')
    } else if (stage === 'category') {
      setStage('group')
    } else {
      setStage('class')
      setSelectedClassId('')
      setSelectedClassName('')
    }
  }

  // ── Derived data ──────────────────────────────────────────────────────────

  const q = search.toLowerCase()
  const filteredClasses = classes.filter((c) => c.name.toLowerCase().includes(q))
  const filteredGroups = groups.filter((g) => g.name.toLowerCase().includes(q))
  const filteredCategories = categories.filter(
    (c) => c.model.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
  )

  const isBrowseStage = BROWSE_STAGES.includes(stage)

  // ── Header labels ─────────────────────────────────────────────────────────

  const headerLabels: Record<Stage, { step: string; title: string }> = {
    class: { step: 'Step 1 of 3', title: 'Select Device Class' },
    group: { step: 'Step 2 of 3', title: selectedClassName },
    category: { step: 'Step 3 of 3', title: selectedGroupName },
    details: { step: 'Device Details', title: selectedCategory?.model ?? '' },
    installment: { step: 'Payment Plan', title: "Choose how you'll pay" },
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Sheet */}
      <motion.div
        key="sheet"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-secondary-800 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ height: '80vh', maxHeight: '80vh' }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-secondary-100 dark:border-secondary-700 flex-shrink-0">
          {stage !== 'class' && (
            <button
              onClick={goBack}
              className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-secondary-400 uppercase tracking-wider">
              {headerLabels[stage].step}
            </p>
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white truncate">
              {headerLabels[stage].title}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors flex-shrink-0"
          >
            <XMarkIcon className="w-4 h-4 text-secondary-500" />
          </button>
        </div>

        {/* ── Breadcrumbs (browse stages only) ───────────────────────────── */}
        {isBrowseStage && (
          <div className="flex items-center gap-1.5 px-4 pt-3 pb-0 flex-shrink-0">
            {(['class', 'group', 'category'] as Stage[]).map((s, i) => {
              const active = s === stage
              const done =
                (s === 'class' && (stage === 'group' || stage === 'category')) ||
                (s === 'group' && stage === 'category')
              const labels: Record<string, string> = {
                class: selectedClassName || 'Class',
                group: selectedGroupName || 'Group',
                category: 'Model',
              }
              return (
                <div key={s} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRightIcon className="w-3 h-3 text-secondary-300 dark:text-secondary-600" />
                  )}
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                      active
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : done
                        ? 'text-secondary-500 dark:text-secondary-400'
                        : 'text-secondary-300 dark:text-secondary-600'
                    }`}
                  >
                    {labels[s]}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Search (browse stages only) ─────────────────────────────────── */}
        {isBrowseStage && (
          <div className="px-4 pt-3 pb-2 flex-shrink-0">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-secondary-50 dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-secondary-900 dark:text-white placeholder:text-secondary-400"
              />
            </div>
          </div>
        )}

        {/* ── Content area ────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden relative min-h-0">
          <AnimatePresence initial={false} custom={dir} mode="wait">

            {/* ── CLASS ───────────────────────────────────────────────────── */}
            {stage === 'class' && (
              <motion.div
                key="class"
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.18 }}
                className="absolute inset-0 overflow-y-auto px-4 pb-4 pt-1"
              >
                {classQuery.isLoading && <Spinner />}
                {classQuery.isError && <ErrorState onRetry={() => classQuery.refetch()} />}
                {!classQuery.isLoading && !classQuery.isError && filteredClasses.length === 0 && (
                  <EmptyState label="No device classes found" />
                )}
                <div className="space-y-2 mt-1">
                  {filteredClasses.map((cls) => (
                    <button
                      key={cls._id}
                      type="button"
                      onClick={() => pickClass(cls._id, cls.name)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-left group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <CubeIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-secondary-900 dark:text-white truncate">{cls.name}</p>
                        {cls.description && (
                          <p className="text-xs text-secondary-400 truncate mt-0.5">{cls.description}</p>
                        )}
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-secondary-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── GROUP ───────────────────────────────────────────────────── */}
            {stage === 'group' && (
              <motion.div
                key="group"
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.18 }}
                className="absolute inset-0 overflow-y-auto px-4 pb-4 pt-1"
              >
                {groupQuery.isLoading && <Spinner />}
                {groupQuery.isError && <ErrorState onRetry={() => groupQuery.refetch()} />}
                {!groupQuery.isLoading && !groupQuery.isError && filteredGroups.length === 0 && (
                  <EmptyState label="No groups found under this class" />
                )}
                <div className="space-y-2 mt-1">
                  {filteredGroups.map((grp) => (
                    <button
                      key={grp._id}
                      type="button"
                      onClick={() => pickGroup(grp._id, grp.name)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-left group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-secondary-100 dark:bg-secondary-600 flex items-center justify-center flex-shrink-0">
                        <CubeIcon className="w-5 h-5 text-secondary-500 dark:text-secondary-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-secondary-900 dark:text-white truncate">{grp.name}</p>
                        {grp.description && (
                          <p className="text-xs text-secondary-400 truncate mt-0.5">{grp.description}</p>
                        )}
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-secondary-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── CATEGORY ────────────────────────────────────────────────── */}
            {stage === 'category' && (
              <motion.div
                key="category"
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.18 }}
                className="absolute inset-0 overflow-y-auto px-4 pb-4 pt-1"
              >
                {categoryQuery.isLoading && <Spinner />}
                {categoryQuery.isError && <ErrorState onRetry={() => categoryQuery.refetch()} />}
                {!categoryQuery.isLoading && !categoryQuery.isError && filteredCategories.length === 0 && (
                  <EmptyState label="No models found in this group" />
                )}
                <div className="space-y-2 mt-1">
                  {filteredCategories.map((cat) => {
                    const isActive = cat._id === currentId
                    return (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => pickCategory(cat)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
                          isActive
                            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-primary-500' : 'bg-secondary-100 dark:bg-secondary-600'}`}>
                          {isActive
                            ? <CheckCircleIcon className="w-5 h-5 text-white" />
                            : <CubeIcon className="w-5 h-5 text-secondary-400 dark:text-secondary-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-secondary-900 dark:text-white'}`}>
                            {cat.model}
                          </p>
                          {cat.description && (
                            <p className="text-xs text-secondary-400 truncate mt-0.5">{cat.description}</p>
                          )}
                          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
                            ₦{cat.amount.toLocaleString()}
                          </p>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-secondary-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* ── DETAILS ─────────────────────────────────────────────────── */}
            {stage === 'details' && selectedCategory && (
              <motion.div
                key="details"
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.18 }}
                className="absolute inset-0 overflow-y-auto px-4 pb-6 pt-4"
              >
                {/* Device summary card */}
                <div className="rounded-2xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-700/50 p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                      <CubeIcon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-secondary-900 dark:text-white leading-tight">
                        {selectedCategory.model}
                      </h4>
                      {selectedCategory.description && (
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 leading-relaxed">
                          {selectedCategory.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-0 rounded-xl overflow-hidden bg-white dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 px-3">
                    <InfoRow
                      label="Price"
                      value={`₦${selectedCategory.amount.toLocaleString()} ${selectedCategory.currency}`}
                    />
                    <InfoRow label="Device type" value={selectedCategory.device_type} />
                    {selectedCategory.payment_option.includes(DeviceCategoryPaymentOptionEnum.INSTALLMENT) && (
                      <InfoRow
                        label="Installment duration"
                        value={`${selectedCategory.installment_duration_available} month${selectedCategory.installment_duration_available !== 1 ? 's' : ''}`}
                      />
                    )}
                  </div>
                </div>

                {/* Payment option selection */}
                <p className="text-[10px] font-bold text-secondary-400 dark:text-secondary-500 uppercase tracking-wider mb-3">
                  Choose Payment Option
                </p>

                <div className="space-y-3">
                  {/* OUTRIGHT */}
                  {selectedCategory.payment_option.includes(DeviceCategoryPaymentOptionEnum.OUTRIGHT) && (
                    <button
                      type="button"
                      onClick={pickOutright}
                      className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-success-300 dark:border-success-700 bg-success-50 dark:bg-success-900/20 hover:border-success-400 hover:bg-success-100 dark:hover:bg-success-900/30 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-success-500 flex items-center justify-center flex-shrink-0">
                        <BanknotesIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-success-700 dark:text-success-400">Pay Outright</p>
                        <p className="text-xs text-success-600 dark:text-success-500 mt-0.5">
                          Full payment of{' '}
                          <span className="font-semibold">₦{selectedCategory.amount.toLocaleString()}</span>
                        </p>
                      </div>
                      <CheckCircleOutline className="w-5 h-5 text-success-500 flex-shrink-0" />
                    </button>
                  )}

                  {/* INSTALLMENT */}
                  {selectedCategory.payment_option.includes(DeviceCategoryPaymentOptionEnum.INSTALLMENT) && (
                    <button
                      type="button"
                      onClick={goToInstallment}
                      className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 hover:border-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <CalendarDaysIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-primary-700 dark:text-primary-400">Installment Plan</p>
                        <p className="text-xs text-primary-600 dark:text-primary-500 mt-0.5">
                          {selectedCategory.installment_duration_available}-month plan · choose weekly or monthly
                        </p>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── INSTALLMENT ──────────────────────────────────────────────── */}
            {stage === 'installment' && selectedCategory && (() => {
              const initAmt = calcInitAmount(selectedCategory)
              const options = selectedCategory.installment_payment_durations_option

              return (
                <motion.div
                  key="installment"
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.18 }}
                  className="absolute inset-0 overflow-y-auto px-4 pb-6 pt-4"
                >
                  {/* Down payment banner */}
                  <div className="rounded-2xl bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 p-4 mb-5">
                    <p className="text-[10px] font-bold text-warning-600 dark:text-warning-400 uppercase tracking-wider mb-1">
                      Down Payment Required
                    </p>
                    <p className="text-2xl font-black text-warning-700 dark:text-warning-300">
                      ₦{initAmt.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-warning-600 dark:text-warning-400 mt-1">
                      {selectedCategory.installment_initialization_percentage}% of ₦{selectedCategory.amount.toLocaleString()} upfront
                    </p>
                  </div>

                  {/* Device total & interest summary */}
                  <div className="rounded-xl border border-secondary-100 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 mb-5 space-y-0">
                    {(() => {
                      const remaining = selectedCategory.amount - initAmt
                      const interest = remaining * (selectedCategory.installment_interest_rate / 100)
                      const total = remaining + interest
                      return (
                        <>
                          <InfoRow label="Device price" value={`₦${selectedCategory.amount.toLocaleString()}`} />
                          <InfoRow label="After down payment" value={`₦${remaining.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                          <InfoRow label={`Interest (${selectedCategory.installment_interest_rate}%)`} value={`₦${interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                          <InfoRow label="Total to finance" value={`₦${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                        </>
                      )
                    })()}
                  </div>

                  {/* Duration options */}
                  <p className="text-[10px] font-bold text-secondary-400 dark:text-secondary-500 uppercase tracking-wider mb-3">
                    Payment Frequency — {selectedCategory.installment_duration_available} months
                  </p>

                  <div className="space-y-3">
                    {options.map((opt) => {
                      const perPeriod = calcInstallmentAmount(selectedCategory, opt.duration_option)
                      const isWeekly = opt.duration_option === DeviceCategoryPaymentDurationOptionEnum.WEEKLY
                      const isSelected = selectedDuration === opt.duration_option
                      const periodLabel = isWeekly ? 'week' : 'month'
                      const periodsTotal = isWeekly
                        ? selectedCategory.installment_duration_available * 4
                        : selectedCategory.installment_duration_available

                      return (
                        <button
                          key={opt.duration_option}
                          type="button"
                          onClick={() => setSelectedDuration(opt.duration_option)}
                          className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 hover:border-primary-300 dark:hover:border-primary-700'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary-500' : 'bg-secondary-100 dark:bg-secondary-600'}`}>
                            {isSelected
                              ? <CheckCircleIcon className="w-5 h-5 text-white" />
                              : <TagIcon className="w-5 h-5 text-secondary-400 dark:text-secondary-300" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-secondary-900 dark:text-white'}`}>
                              {isWeekly ? 'Weekly' : 'Monthly'}
                            </p>
                            <p className={`text-xs mt-0.5 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-500 dark:text-secondary-400'}`}>
                              ₦{perPeriod.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / {periodLabel}
                              {' · '}{periodsTotal} {periodLabel}s total
                            </p>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 px-2 py-0.5 rounded-full flex-shrink-0">
                              Selected
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Confirm button */}
                  {selectedDuration && (
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="button"
                      onClick={() => confirmInstallment(selectedDuration)}
                      className="mt-5 w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm"
                    >
                      Confirm — {selectedDuration === DeviceCategoryPaymentDurationOptionEnum.WEEKLY ? 'Weekly' : 'Monthly'} Plan
                    </motion.button>
                  )}
                </motion.div>
              )
            })()}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
