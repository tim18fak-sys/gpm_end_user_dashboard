import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ChevronRightIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, CubeIcon } from '@heroicons/react/24/solid'
import {
  useDeviceClass,
  useDeviceCategoryGroup,
  useDeviceCategoryByGroupId,
} from '@/hooks/useDeviceCategory'
import { DeviceTypeEnum } from '@/enum/device.enum'

export interface SelectedDevice {
  id: string
  name: string
  description: string
  deviceType: DeviceTypeEnum
  amount: number
}

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (device: SelectedDevice) => void
  currentId?: string
}

type Stage = 'class' | 'group' | 'category'

const stageVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12">
      <div className="w-8 h-8 border-2 border-secondary-200 dark:border-secondary-600 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-xs text-secondary-400">Loading…</p>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-secondary-400">
      <CubeIcon className="w-8 h-8 opacity-30" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-secondary-400">
      <p className="text-sm text-danger-500">Failed to load. Please try again.</p>
      <button onClick={onRetry} className="text-xs text-primary-600 dark:text-primary-400 underline">
        Retry
      </button>
    </div>
  )
}

export default function DevicePickerModal({ open, onClose, onSelect, currentId }: Props) {
  const [stage, setStage] = useState<Stage>('class')
  const [dir, setDir] = useState(1)
  const [search, setSearch] = useState('')

  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedClassName, setSelectedClassName] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedGroupName, setSelectedGroupName] = useState('')

  const classQuery = useDeviceClass({ limit: 50, enabled: open })
  const groupQuery = useDeviceCategoryGroup({
    limit: 50,
    deviceClassId: selectedClassId,
    enabled: !!selectedClassId && stage !== 'class',
  })
  const categoryQuery = useDeviceCategoryByGroupId({
    limit: 50,
    deviceGroupId: selectedGroupId,
    enabled: !!selectedGroupId && stage === 'category',
  })

  const classes = classQuery.data?.data ?? []
  const groups = groupQuery.data?.data ?? []
  const categories = categoryQuery.data?.data ?? []

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
    }, 300)
  }

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

  const goBack = () => {
    setDir(-1)
    setSearch('')
    if (stage === 'category') {
      setStage('group')
    } else {
      setStage('class')
      setSelectedClassId('')
      setSelectedClassName('')
    }
  }

  const pickCategory = (cat: typeof categories[0]) => {
    onSelect({
      id: cat._id,
      name: cat.model,
      description: cat.description,
      deviceType: cat.device_type,
      amount: cat.amount,
    })
    handleClose()
  }

  const stageLabel: Record<Stage, string> = {
    class: 'Select Device Class',
    group: selectedClassName,
    category: selectedGroupName,
  }

  const q = search.toLowerCase()

  const filteredClasses = classes.filter((c) => c.name.toLowerCase().includes(q))
  const filteredGroups = groups.filter((g) => g.name.toLowerCase().includes(q))
  const filteredCategories = categories.filter(
    (c) => c.model.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
  )

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
        {/* Header */}
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
              {stage === 'class' ? 'Step 1 of 3' : stage === 'group' ? 'Step 2 of 3' : 'Step 3 of 3'}
            </p>
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white truncate">
              {stageLabel[stage]}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors flex-shrink-0"
          >
            <XMarkIcon className="w-4 h-4 text-secondary-500" />
          </button>
        </div>

        {/* Breadcrumb pills */}
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-0 flex-shrink-0">
          {[
            { key: 'class', label: 'Class' },
            { key: 'group', label: 'Group' },
            { key: 'category', label: 'Model' },
          ].map((s, i) => {
            const active = s.key === stage
            const done =
              (s.key === 'class' && (stage === 'group' || stage === 'category')) ||
              (s.key === 'group' && stage === 'category')
            return (
              <div key={s.key} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRightIcon className="w-3 h-3 text-secondary-300 dark:text-secondary-600" />}
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                    active
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : done
                      ? 'text-secondary-400 dark:text-secondary-500'
                      : 'text-secondary-300 dark:text-secondary-600'
                  }`}
                >
                  {done && s.key === 'class' ? selectedClassName || s.label : s.label}
                  {done && s.key === 'group' ? ` · ${selectedGroupName}` : ''}
                </span>
              </div>
            )
          })}
        </div>

        {/* Search */}
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

        {/* Content — animated stage panels */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence initial={false} custom={dir} mode="wait">
            {/* ── STAGE: CLASS ─────────────────────────────────── */}
            {stage === 'class' && (
              <motion.div
                key="class"
                custom={dir}
                variants={stageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
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
                        <p className="text-sm font-semibold text-secondary-900 dark:text-white truncate">
                          {cls.name}
                        </p>
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

            {/* ── STAGE: GROUP ─────────────────────────────────── */}
            {stage === 'group' && (
              <motion.div
                key="group"
                custom={dir}
                variants={stageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
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
                        <p className="text-sm font-semibold text-secondary-900 dark:text-white truncate">
                          {grp.name}
                        </p>
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

            {/* ── STAGE: CATEGORY ──────────────────────────────── */}
            {stage === 'category' && (
              <motion.div
                key="category"
                custom={dir}
                variants={stageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute inset-0 overflow-y-auto px-4 pb-4 pt-1"
              >
                {categoryQuery.isLoading && <Spinner />}
                {categoryQuery.isError && <ErrorState onRetry={() => categoryQuery.refetch()} />}
                {!categoryQuery.isLoading && !categoryQuery.isError && filteredCategories.length === 0 && (
                  <EmptyState label="No models found in this group" />
                )}
                <div className="space-y-2 mt-1">
                  {filteredCategories.map((cat) => {
                    const isSelected = cat._id === currentId
                    return (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => pickCategory(cat)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-primary-500'
                              : 'bg-secondary-100 dark:bg-secondary-600'
                          }`}
                        >
                          {isSelected ? (
                            <CheckCircleIcon className="w-5 h-5 text-white" />
                          ) : (
                            <CubeIcon className="w-5 h-5 text-secondary-400 dark:text-secondary-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-secondary-900 dark:text-white'}`}>
                            {cat.model}
                          </p>
                          {cat.description && (
                            <p className="text-xs text-secondary-400 truncate mt-0.5">{cat.description}</p>
                          )}
                          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
                            ₦{cat.amount.toLocaleString()}
                          </p>
                        </div>
                        {!isSelected && (
                          <ChevronRightIcon className="w-4 h-4 text-secondary-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                        )}
                        {isSelected && (
                          <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-full flex-shrink-0">
                            Selected
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
