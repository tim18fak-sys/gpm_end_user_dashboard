import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DevicePhoneMobileIcon,
  BoltIcon,
  CreditCardIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  KeyIcon,
} from '@heroicons/react/24/outline'
import { useLinkedDeviceInfo, useCurrentDeviceCode } from '@/hooks/useDeviceCategory'
import { useGetActiveInvoice } from '@/hooks/usePayment'
import { useAuthStore } from '@/store/authStore'
import { Device, PayGoDeviceCode } from '@/types/device.type'
import { Invoice } from '@/types/payment.type'
import { InvoiceStatusEnum } from '@/enum/payment.enum'
import { DevicePaymentPlan } from '@/enum/device.enum'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCurrency = (n: number, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

const formatDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

const planLabel: Record<DevicePaymentPlan, string> = {
  [DevicePaymentPlan.WEEKLY]: 'Weekly',
  [DevicePaymentPlan.MONTHLY]: 'Monthly',
  [DevicePaymentPlan.QUARTER_YEARLY]: 'Quarterly',
  [DevicePaymentPlan.NONE]: 'Outright',
}

const timelineLabel = (tl: string) =>
  tl === 'outright' ? 'Outright Purchase' : `${tl.replace('_', ' ')} Plan`

const splitCode = (code: string) => {
  const clean = code.replace(/\s/g, '')
  const chunks: string[] = []
  for (let i = 0; i < clean.length; i += 3) chunks.push(clean.slice(i, i + 3))
  return chunks.join(' - ')
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse bg-secondary-200 dark:bg-secondary-700 rounded-xl ${className}`} />
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 p-4 space-y-4">
      <div className="flex items-center gap-3 pt-2 pb-1">
        <Pulse className="w-11 h-11 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Pulse className="h-4 w-2/5" />
          <Pulse className="h-3 w-3/5" />
        </div>
      </div>
      <Pulse className="h-44 w-full" />
      <Pulse className="h-36 w-full" />
      <Pulse className="h-28 w-full" />
    </div>
  )
}

// ─── No Device State ─────────────────────────────────────────────────────────

function NoDeviceState() {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 flex items-center justify-center mb-5">
        <DevicePhoneMobileIcon className="w-10 h-10 text-primary-500 dark:text-primary-400" />
      </div>

      <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
        No device assigned yet
      </h2>
      <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed max-w-xs mb-7">
        Once your hub admin assigns a device to your account it will appear here. Check your order status below.
      </p>

      <div className="w-full max-w-sm space-y-3 mb-8">
        <div className="flex items-start gap-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-xl p-4 text-left">
          <DocumentTextIcon className="w-5 h-5 text-warning-500 dark:text-warning-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-warning-800 dark:text-warning-300">Draft order</p>
            <p className="text-xs text-warning-600 dark:text-warning-400 mt-0.5 leading-relaxed">
              You've created an order but haven't made your activation payment yet. Pay to move it forward.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 text-left">
          <ClockIcon className="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-primary-800 dark:text-primary-300">Pending order</p>
            <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5 leading-relaxed">
              Payment received — your hub admin is processing and assigning your device. Hang tight!
            </p>
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/order-list')}
        className="w-full max-w-sm flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-sm transition-colors"
      >
        <ShoppingBagIcon className="w-4 h-4" />
        View My Orders
        <ArrowRightIcon className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}

// ─── Device Info Card ─────────────────────────────────────────────────────────

function DeviceInfoCard({ device }: { device: Device }) {
  const plan = device.payment_plan
  const progress = plan.retail_value > 0
    ? Math.min((plan.amount_paid_already / plan.retail_value) * 100, 100)
    : 0
  const isOutright = plan.plan === DevicePaymentPlan.NONE

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-950 rounded-2xl p-5 shadow-lg text-white"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-primary-200 font-medium uppercase tracking-wider mb-1">Your Device</p>
          <h3 className="text-lg font-bold leading-tight">{device.device_category.model}</h3>
          <p className="text-xs text-primary-200 mt-0.5">{device.device_category.description}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
          <BoltIcon className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-xs text-primary-200">
        <span className="inline-flex items-center gap-1">
          <ChartBarIcon className="w-3.5 h-3.5" />
          {timelineLabel(plan.payment_timeline)}
        </span>
        {!isOutright && (
          <span className="inline-flex items-center gap-1">
            <CalendarDaysIcon className="w-3.5 h-3.5" />
            {planLabel[plan.plan]} payments
          </span>
        )}
      </div>

      {!isOutright && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-primary-200 mb-1.5">
            <span>Payment progress</span>
            <span className="font-semibold text-white">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="h-2 rounded-full bg-white"
            />
          </div>
          <div className="flex justify-between text-xs text-primary-200 mt-1.5">
            <span>{formatCurrency(plan.amount_paid_already)} paid</span>
            <span>{formatCurrency(plan.retail_value)} total</span>
          </div>
        </div>
      )}

      {isOutright && plan.has_completed_payment && (
        <div className="flex items-center gap-1.5 text-xs text-primary-100">
          <CheckCircleIcon className="w-4 h-4 text-success-300" />
          <span>Fully paid — device is yours</span>
        </div>
      )}

      <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs text-primary-200">
        <span>Device ref</span>
        <span className="font-mono text-white">{device.uuid.slice(-8).toUpperCase()}</span>
      </div>
    </motion.div>
  )
}

// ─── Device Code Card ─────────────────────────────────────────────────────────

function DeviceCodeCard({ code, isLoading }: { code: PayGoDeviceCode | null; isLoading: boolean }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!code) return
    navigator.clipboard.writeText(code.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-5 shadow-sm border border-secondary-200 dark:border-secondary-700 space-y-3">
        <Pulse className="h-4 w-1/3" />
        <Pulse className="h-10 w-full" />
        <Pulse className="h-3 w-2/5" />
      </div>
    )
  }

  if (!code) return null

  const daysCovered = code.time_range === 7 ? '7 days' : code.time_range === 30 ? '30 days' : `${code.time_range} days`

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="bg-white dark:bg-secondary-800 rounded-2xl p-5 shadow-sm border border-secondary-200 dark:border-secondary-700"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <KeyIcon className="w-4 h-4 text-primary-500" />
          <p className="text-sm font-semibold text-secondary-900 dark:text-white">Activation Code</p>
        </div>
        {code.is_master_code && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 border border-danger-200 dark:border-danger-700 uppercase tracking-wide">
            Master
          </span>
        )}
        {code.is_disable_code && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-600 uppercase tracking-wide">
            Disable
          </span>
        )}
      </div>

      <button
        onClick={handleCopy}
        className="w-full group"
        aria-label="Copy activation code"
      >
        <div className="bg-secondary-50 dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-xl px-4 py-4 flex items-center justify-between gap-3 transition-colors group-hover:border-primary-400 dark:group-hover:border-primary-600">
          <span className="font-mono text-xl font-bold tracking-widest text-secondary-900 dark:text-white leading-none select-all">
            {splitCode(code.code)}
          </span>
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div key="check" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                <ClipboardDocumentCheckIcon className="w-5 h-5 text-success-500 flex-shrink-0" />
              </motion.div>
            ) : (
              <motion.div key="copy" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                <ClipboardDocumentIcon className="w-5 h-5 text-secondary-400 flex-shrink-0 group-hover:text-primary-500 transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>

      <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-2.5 text-center">
        {copied ? (
          <span className="text-success-600 dark:text-success-400 font-medium">Copied to clipboard!</span>
        ) : (
          `Tap the code to copy · Valid for ${daysCovered}`
        )}
      </p>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-700 text-xs text-secondary-400 dark:text-secondary-500">
        <span>Code #{code.current_counter}</span>
        <span>·</span>
        <span>Next #{code.next_counter}</span>
        {code.is_used && (
          <>
            <span>·</span>
            <span className="text-warning-500">Used</span>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ─── Active Invoice Card ───────────────────────────────────────────────────────

const statusConfig: Record<InvoiceStatusEnum, { label: string; bg: string; text: string; icon: typeof CheckCircleIcon }> = {
  [InvoiceStatusEnum.PAID]: {
    label: 'Paid',
    bg: 'bg-success-100 dark:bg-success-900/30',
    text: 'text-success-700 dark:text-success-300',
    icon: CheckCircleIcon,
  },
  [InvoiceStatusEnum.PENDING]: {
    label: 'Due',
    bg: 'bg-warning-100 dark:bg-warning-900/30',
    text: 'text-warning-700 dark:text-warning-300',
    icon: ClockIcon,
  },
  [InvoiceStatusEnum.OVERDUE]: {
    label: 'Overdue',
    bg: 'bg-danger-100 dark:bg-danger-900/30',
    text: 'text-danger-700 dark:text-danger-300',
    icon: ExclamationTriangleIcon,
  },
}

function ActiveInvoiceCard({ invoice }: { invoice: Invoice }) {
  const navigate = useNavigate()
  const cfg = statusConfig[invoice.status]
  const StatusIcon = cfg.icon
  const isOverdue = invoice.status === InvoiceStatusEnum.OVERDUE
  const isPending = invoice.status === InvoiceStatusEnum.PENDING

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className={`rounded-2xl p-5 shadow-sm border ${
        isOverdue
          ? 'bg-danger-50 dark:bg-danger-900/10 border-danger-200 dark:border-danger-800'
          : 'bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CreditCardIcon className={`w-4 h-4 ${isOverdue ? 'text-danger-500' : 'text-primary-500'}`} />
          <p className="text-sm font-semibold text-secondary-900 dark:text-white">Next Payment</p>
        </div>
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${cfg.bg} ${cfg.text} border-current/20`}>
          <StatusIcon className="w-3 h-3" />
          {cfg.label}
        </span>
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-2xl font-bold text-secondary-900 dark:text-white">
            {formatCurrency(invoice.amount)}
          </p>
          <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5 flex items-center gap-1">
            <CalendarDaysIcon className="w-3.5 h-3.5" />
            Due {formatDate(invoice.nextPaymentDate)}
          </p>
        </div>
      </div>

      {(isPending || isOverdue) && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/payments-history')}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-colors ${
            isOverdue ? 'bg-danger-600 hover:bg-danger-700' : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          Pay Now
          <ArrowRightIcon className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  )
}

// ─── Outright / Paid-off Banner ───────────────────────────────────────────────

function NoInvoiceCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-success-50 dark:bg-success-900/10 border border-success-200 dark:border-success-800 rounded-2xl p-5 flex items-center gap-4"
    >
      <div className="w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center flex-shrink-0">
        <CheckCircleIcon className="w-5 h-5 text-success-500 dark:text-success-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-success-800 dark:text-success-300">All payments complete</p>
        <p className="text-xs text-success-600 dark:text-success-400 mt-0.5 leading-relaxed">
          No outstanding invoices. Your device is fully paid off.
        </p>
      </div>
    </motion.div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { user } = useAuthStore()

  const { data: deviceResponse, isLoading: deviceLoading } = useLinkedDeviceInfo()
  const device =
    deviceResponse?.data.length === 0
      ? null
      : (deviceResponse?.data[0] ?? null);

  const { data: codeResponse, isLoading: codeLoading } = useCurrentDeviceCode(
    device?._id ?? "",
  );
  const deviceCode = codeResponse?.data ?? null

  const { data: invoiceResponse, isLoading: invoiceLoading } = useGetActiveInvoice()
  const activeInvoice = invoiceResponse?.data ?? null

  if (deviceLoading) return <DashboardSkeleton />
  if (!device) return <NoDeviceState />

  const firstName = user?.first_name ?? 'there'

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <div className="bg-white dark:bg-secondary-800 px-5 pt-6 pb-5 border-b border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center gap-3">
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={firstName}
              className="w-11 h-11 rounded-full object-cover border-2 border-primary-200 dark:border-primary-700 flex-shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-200 dark:border-primary-700 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs text-secondary-400 dark:text-secondary-500">Welcome back</p>
            <p className="text-base font-bold text-secondary-900 dark:text-white truncate">
              {user?.full_name ?? firstName}
            </p>
          </div>
          <div className="ml-auto flex-shrink-0">
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2.5 h-2.5 rounded-full bg-success-400"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-8">
        <DeviceInfoCard device={device} />
        <DeviceCodeCard code={deviceCode} isLoading={codeLoading} />

        {invoiceLoading ? (
          <Pulse className="h-28 w-full" />
        ) : activeInvoice ? (
          <ActiveInvoiceCard invoice={activeInvoice} />
        ) : (
          <NoInvoiceCard />
        )}
      </div>
    </div>
  )
}

export default Dashboard
