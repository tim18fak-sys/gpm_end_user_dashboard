import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ReceiptPercentIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import { useGetActiveInvoice, useGetAllInvoices, useInitializeInvoicePayment } from '@/hooks/usePayment'
import { Invoice } from '@/types/payment.type'
import { InvoiceStatusEnum } from '@/enum/payment.enum'
import { BaseCursorPaginationInterface } from '@/types/shared'
import toast from 'react-hot-toast'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)

const formatDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

const getInvoiceId = (invoice: Invoice): string => (invoice as any)._id ?? ''

const canPay = (status: InvoiceStatusEnum) =>
  status === InvoiceStatusEnum.PENDING || status === InvoiceStatusEnum.OVERDUE

// ─── Status config ────────────────────────────────────────────────────────────

type StatusCfg = {
  label: string
  pillBg: string
  pillText: string
  pillBorder: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  rowBg: string
}

const statusConfig: Record<InvoiceStatusEnum, StatusCfg> = {
  [InvoiceStatusEnum.PAID]: {
    label: 'Paid',
    pillBg: 'bg-success-100 dark:bg-success-900/30',
    pillText: 'text-success-700 dark:text-success-300',
    pillBorder: 'border-success-200 dark:border-success-700',
    icon: CheckCircleIcon,
    rowBg: '',
  },
  [InvoiceStatusEnum.PENDING]: {
    label: 'Due',
    pillBg: 'bg-warning-100 dark:bg-warning-900/30',
    pillText: 'text-warning-700 dark:text-warning-300',
    pillBorder: 'border-warning-200 dark:border-warning-700',
    icon: ClockIcon,
    rowBg: '',
  },
  [InvoiceStatusEnum.OVERDUE]: {
    label: 'Overdue',
    pillBg: 'bg-danger-100 dark:bg-danger-900/30',
    pillText: 'text-danger-700 dark:text-danger-300',
    pillBorder: 'border-danger-200 dark:border-danger-700',
    icon: ExclamationTriangleIcon,
    rowBg: 'bg-danger-50 dark:bg-danger-900/10',
  },
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse bg-secondary-200 dark:bg-secondary-700 rounded-xl ${className}`} />
}

function HistorySkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Pulse className="h-28 w-full" />
      {[0, 1, 2, 3].map((i) => (
        <Pulse key={i} className="h-20 w-full" />
      ))}
    </div>
  )
}

// ─── Active Invoice Banner ─────────────────────────────────────────────────────

function ActiveInvoiceBanner({
  invoice,
  onPayNow,
  isPaying,
}: {
  invoice: Invoice
  onPayNow: (id: string) => void
  isPaying: boolean
}) {
  const cfg = statusConfig[invoice.status]
  const Icon = cfg.icon
  const isOverdue = invoice.status === InvoiceStatusEnum.OVERDUE
  const invoiceId = getInvoiceId(invoice)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`mx-4 mt-4 rounded-2xl p-5 ${
        isOverdue
          ? 'bg-danger-600 dark:bg-danger-700'
          : 'bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-950'
      } text-white shadow-lg`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CreditCardIcon className="w-4 h-4 text-white/80" />
          <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
            {isOverdue ? 'Overdue Payment' : 'Current Invoice'}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wide">
          <Icon className="w-3 h-3" />
          {cfg.label}
        </span>
      </div>

      <p className="text-3xl font-bold mb-1">{formatCurrency(invoice.amount)}</p>
      <p className="text-xs text-white/70 flex items-center gap-1">
        <CalendarDaysIcon className="w-3.5 h-3.5" />
        Due {formatDate(invoice.nextPaymentDate)}
      </p>

      {canPay(invoice.status) && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onPayNow(invoiceId)}
          disabled={isPaying}
          className="mt-4 w-full py-2.5 rounded-xl bg-white disabled:opacity-70 text-primary-700 text-sm font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
        >
          {isPaying ? (
            <>
              <ArrowPathIcon className="w-4 h-4 animate-spin text-primary-600" />
              <span>Getting payment link…</span>
            </>
          ) : (
            <>
              <CreditCardIcon className="w-4 h-4 text-primary-600" />
              <span>Pay Now</span>
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  )
}

// ─── Invoice Row ──────────────────────────────────────────────────────────────

function InvoiceRow({
  invoice,
  index,
  onPayNow,
  isPaying,
}: {
  invoice: Invoice
  index: number
  onPayNow: (id: string) => void
  isPaying: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const cfg = statusConfig[invoice.status]
  const Icon = cfg.icon
  const invoiceId = getInvoiceId(invoice)
  const showPayButton = canPay(invoice.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`rounded-2xl border border-secondary-200 dark:border-secondary-700 overflow-hidden ${
        cfg.rowBg || 'bg-white dark:bg-secondary-800'
      }`}
    >
      <button
        className="w-full text-left px-4 py-4"
        onClick={() => invoice.history.length > 0 && setExpanded((v) => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.pillBg}`}>
              <Icon className={`w-4 h-4 ${cfg.pillText}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-secondary-900 dark:text-white">
                {formatCurrency(invoice.amount)}
              </p>
              <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5 flex items-center gap-1">
                <CalendarDaysIcon className="w-3 h-3 flex-shrink-0" />
                {formatDate(invoice.nextPaymentDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.pillBg} ${cfg.pillText} ${cfg.pillBorder}`}>
              {invoice.status === InvoiceStatusEnum.PAID ? (
                <CheckCircleSolid className="w-3 h-3" />
              ) : (
                <Icon className="w-3 h-3" />
              )}
              {cfg.label}
            </span>
            {invoice.history.length > 0 && (
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDownIcon className="w-4 h-4 text-secondary-400 dark:text-secondary-500" />
              </motion.div>
            )}
          </div>
        </div>
      </button>

      {/* Pay Now — for unpaid invoices in the list */}
      {showPayButton && (
        <div className="px-4 pb-3 -mt-1">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onPayNow(invoiceId)}
            disabled={isPaying}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-60 ${
              invoice.status === InvoiceStatusEnum.OVERDUE
                ? 'bg-danger-600 hover:bg-danger-700 text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {isPaying ? (
              <>
                <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                Getting payment link…
              </>
            ) : (
              <>
                <CreditCardIcon className="w-3.5 h-3.5" />
                Pay Now
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* Expanded history */}
      <AnimatePresence>
        {expanded && invoice.history.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-secondary-100 dark:border-secondary-700">
              <p className="text-[10px] font-semibold text-secondary-400 dark:text-secondary-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <ReceiptPercentIcon className="w-3 h-3" />
                Payment history
              </p>
              <div className="space-y-2">
                {invoice.history.map((h, hi) => {
                  const hCfg = statusConfig[h.status as InvoiceStatusEnum] ?? statusConfig[InvoiceStatusEnum.PAID]
                  return (
                    <div key={hi} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-secondary-500 dark:text-secondary-400">
                        <span className={`w-1.5 h-1.5 rounded-full ${hCfg.pillBg}`} />
                        <span>{formatDate(h.dueDate)}</span>
                        {h.paymentDate && (
                          <span className="text-secondary-400">→ paid {formatDate(h.paymentDate)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-secondary-700 dark:text-secondary-300">
                          {formatCurrency(h.amount)}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${hCfg.pillBg} ${hCfg.pillText}`}>
                          {h.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyInvoices() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 flex items-center justify-center mb-4">
        <ReceiptPercentIcon className="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
      </div>
      <p className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">No invoices yet</p>
      <p className="text-xs text-secondary-400 dark:text-secondary-500 leading-relaxed">
        Your payment history will appear here once invoices are generated.
      </p>
    </div>
  )
}

// ─── Payment History Page ─────────────────────────────────────────────────────

function PaymentHistory() {
  const navigate = useNavigate()

  const [params, setParams] = useState<BaseCursorPaginationInterface>({
    prevCursor: null,
    nextCursor: null,
    search: null,
    limit: 10,
  })

  // Tracks which invoice is currently going through payment init (for per-card loading state)
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null)

  const { data: activeData, isLoading: activeLoading } = useGetActiveInvoice()
  const { data: allData, isLoading: allLoading, isFetching } = useGetAllInvoices(params)
  const { mutate: initializePayment, isPending: paymentFetching } = useInitializeInvoicePayment()

  const activeInvoice = activeData?.data ?? null
  const invoices: Invoice[] = allData?.data ?? []
  const nextCursor = allData?.nextCursor ?? null
  const pastInvoices = invoices.filter((inv) => !inv.isCurrent)

  const handlePayNow = (invoiceId: string) => {
    if (!invoiceId) {
      toast.error('Invoice ID not available. Please refresh and try again.')
      return
    }
    setPayingInvoiceId(invoiceId)
    initializePayment(invoiceId, {
      onSuccess: (response) => {
        const url = response?.data?.authorization_url
        if (url) {
          // Redirect in same tab — most reliable on mobile
          window.location.href = url
        } else {
          toast.error('Payment link not available. Please try again.')
          setPayingInvoiceId(null)
        }
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message ||
          'Failed to get payment link. Please try again.'
        toast.error(message)
        setPayingInvoiceId(null)
      },
    })
  }

  const handleLoadMore = () => {
    if (nextCursor) setParams((p) => ({ ...p, nextCursor }))
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <div className="bg-white dark:bg-secondary-800 px-5 pt-6 pb-4 border-b border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl border border-secondary-200 dark:border-secondary-700 flex items-center justify-center flex-shrink-0 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-300" />
          </button>
          <div>
            <h1 className="text-base font-bold text-secondary-900 dark:text-white">Payment History</h1>
            <p className="text-xs text-secondary-400 dark:text-secondary-500">Your invoices & payments</p>
          </div>
        </div>
      </div>

      {/* Active invoice banner */}
      {activeLoading ? (
        <div className="p-4">
          <Pulse className="h-36 w-full" />
        </div>
      ) : activeInvoice ? (
        <ActiveInvoiceBanner
          invoice={activeInvoice}
          onPayNow={handlePayNow}
          isPaying={payingInvoiceId === getInvoiceId(activeInvoice) && paymentFetching}
        />
      ) : null}

      {/* Past invoices section */}
      <div className="px-4 pt-5 pb-2">
        <p className="text-xs font-semibold text-secondary-400 dark:text-secondary-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <ReceiptPercentIcon className="w-3.5 h-3.5" />
          Invoice history
        </p>
      </div>

      {allLoading ? (
        <HistorySkeleton />
      ) : pastInvoices.length === 0 ? (
        <EmptyInvoices />
      ) : (
        <div className="px-4 space-y-3 pb-8">
          {pastInvoices.map((inv, i) => (
            <InvoiceRow
              key={`${getInvoiceId(inv)}-${i}`}
              invoice={inv}
              index={i}
              onPayNow={handlePayNow}
              isPaying={payingInvoiceId === getInvoiceId(inv) && paymentFetching}
            />
          ))}

          {nextCursor && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLoadMore}
              disabled={isFetching}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 text-sm font-medium text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors disabled:opacity-50"
            >
              {isFetching ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Loading…
                </>
              ) : (
                <>
                  Load more
                  <ChevronDownIcon className="w-4 h-4" />
                </>
              )}
            </motion.button>
          )}
        </div>
      )}
    </div>
  )
}

export default PaymentHistory
