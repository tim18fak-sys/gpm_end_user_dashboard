import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeftIcon,
  PlusIcon,
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  BoltIcon,
  XMarkIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'
import { useGetAllOrders, useCancelOrder } from '@/hooks/useOrder'
import { useActivateOrder } from '@/hooks/usePayment'
import { StandardOrder } from '@/types/order.types'
import { OrderStatusEnum } from '@/enum/order.enum'
import { GetAllOrderCursorPaginationDTO } from '@/services/order.api'
import { DevicePaymentPlan } from '@/enum/device.enum'
import { NewOrderModal } from '@/components/modals/NewOrderModal'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n)

const planLabel: Record<DevicePaymentPlan, string> = {
  [DevicePaymentPlan.WEEKLY]: 'Weekly',
  [DevicePaymentPlan.MONTHLY]: 'Monthly',
  [DevicePaymentPlan.QUARTER_YEARLY]: 'Quarterly',
  [DevicePaymentPlan.NONE]: 'Outright',
}

const timelineLabel = (tl: string) =>
  tl
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')

// ─── Status config ────────────────────────────────────────────────────────────

type StatusConfig = {
  label: string
  description: string
  iconBg: string
  iconColor: string
  pillBg: string
  pillText: string
  pillBorder: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  canCancel: boolean
  canActivate: boolean
}

const statusConfig: Record<OrderStatusEnum, StatusConfig> = {
  [OrderStatusEnum.DRAFT]: {
    label: 'Draft',
    description: 'Pay your activation fee to start processing',
    iconBg: 'bg-warning-100 dark:bg-warning-900/30',
    iconColor: 'text-warning-500 dark:text-warning-400',
    pillBg: 'bg-warning-100 dark:bg-warning-900/30',
    pillText: 'text-warning-700 dark:text-warning-300',
    pillBorder: 'border-warning-200 dark:border-warning-700',
    icon: DocumentTextIcon,
    canCancel: true,
    canActivate: true,
  },
  [OrderStatusEnum.PENDING]: {
    label: 'Pending',
    description: 'Payment received — processing your order',
    iconBg: 'bg-primary-100 dark:bg-primary-900/30',
    iconColor: 'text-primary-500 dark:text-primary-400',
    pillBg: 'bg-primary-100 dark:bg-primary-900/30',
    pillText: 'text-primary-700 dark:text-primary-300',
    pillBorder: 'border-primary-200 dark:border-primary-700',
    icon: ClockIcon,
    canCancel: false,
    canActivate: false,
  },
  [OrderStatusEnum.IN_PROGRESS]: {
    label: 'In Progress',
    description: 'Being assigned to you',
    iconBg: 'bg-primary-100 dark:bg-primary-900/30',
    iconColor: 'text-primary-500 dark:text-primary-400',
    pillBg: 'bg-primary-100 dark:bg-primary-900/30',
    pillText: 'text-primary-700 dark:text-primary-300',
    pillBorder: 'border-primary-200 dark:border-primary-700',
    icon: ArrowPathIcon,
    canCancel: false,
    canActivate: false,
  },
  [OrderStatusEnum.COMPLETED]: {
    label: 'Completed',
    description: 'Device has been assigned',
    iconBg: 'bg-success-100 dark:bg-success-900/30',
    iconColor: 'text-success-500 dark:text-success-400',
    pillBg: 'bg-success-100 dark:bg-success-900/30',
    pillText: 'text-success-700 dark:text-success-300',
    pillBorder: 'border-success-200 dark:border-success-700',
    icon: CheckCircleIcon,
    canCancel: false,
    canActivate: false,
  },
  [OrderStatusEnum.CANCELLED]: {
    label: 'Cancelled',
    description: 'Order was cancelled',
    iconBg: 'bg-secondary-100 dark:bg-secondary-700',
    iconColor: 'text-secondary-400 dark:text-secondary-500',
    pillBg: 'bg-secondary-100 dark:bg-secondary-700',
    pillText: 'text-secondary-600 dark:text-secondary-400',
    pillBorder: 'border-secondary-200 dark:border-secondary-600',
    icon: XCircleIcon,
    canCancel: false,
    canActivate: false,
  },
  [OrderStatusEnum.REJECTED]: {
    label: 'Rejected',
    description: 'Order was rejected',
    iconBg: 'bg-danger-100 dark:bg-danger-900/30',
    iconColor: 'text-danger-500 dark:text-danger-400',
    pillBg: 'bg-danger-100 dark:bg-danger-900/30',
    pillText: 'text-danger-700 dark:text-danger-300',
    pillBorder: 'border-danger-200 dark:border-danger-700',
    icon: XCircleIcon,
    canCancel: false,
    canActivate: false,
  },
  [OrderStatusEnum.ON_HOLD]: {
    label: 'On Hold',
    description: 'Order is temporarily on hold',
    iconBg: 'bg-warning-100 dark:bg-warning-900/30',
    iconColor: 'text-warning-500 dark:text-warning-400',
    pillBg: 'bg-warning-100 dark:bg-warning-900/30',
    pillText: 'text-warning-700 dark:text-warning-300',
    pillBorder: 'border-warning-200 dark:border-warning-700',
    icon: ExclamationTriangleIcon,
    canCancel: false,
    canActivate: false,
  },
  [OrderStatusEnum.FAILED]: {
    label: 'Failed',
    description: 'Order failed to process',
    iconBg: 'bg-danger-100 dark:bg-danger-900/30',
    iconColor: 'text-danger-500 dark:text-danger-400',
    pillBg: 'bg-danger-100 dark:bg-danger-900/30',
    pillText: 'text-danger-700 dark:text-danger-300',
    pillBorder: 'border-danger-200 dark:border-danger-700',
    icon: XCircleIcon,
    canCancel: false,
    canActivate: false,
  },
  [OrderStatusEnum.PARTIALLY_COMPLETED]: {
    label: 'Partial',
    description: 'Partially completed',
    iconBg: 'bg-warning-100 dark:bg-warning-900/30',
    iconColor: 'text-warning-500 dark:text-warning-400',
    pillBg: 'bg-warning-100 dark:bg-warning-900/30',
    pillText: 'text-warning-700 dark:text-warning-300',
    pillBorder: 'border-warning-200 dark:border-warning-700',
    icon: ExclamationTriangleIcon,
    canCancel: false,
    canActivate: false,
  },
  [OrderStatusEnum.PARTIALLY_CANCELLED]: {
    label: 'Part. Cancelled',
    description: 'Partially cancelled',
    iconBg: 'bg-warning-100 dark:bg-warning-900/30',
    iconColor: 'text-warning-500 dark:text-warning-400',
    pillBg: 'bg-warning-100 dark:bg-warning-900/30',
    pillText: 'text-warning-700 dark:text-warning-300',
    pillBorder: 'border-warning-200 dark:border-warning-700',
    icon: ExclamationTriangleIcon,
    canCancel: false,
    canActivate: false,
  },
  [OrderStatusEnum.PARTIALLY_REJECTED]: {
    label: 'Part. Rejected',
    description: 'Partially rejected',
    iconBg: 'bg-danger-100 dark:bg-danger-900/30',
    iconColor: 'text-danger-500 dark:text-danger-400',
    pillBg: 'bg-danger-100 dark:bg-danger-900/30',
    pillText: 'text-danger-700 dark:text-danger-300',
    pillBorder: 'border-danger-200 dark:border-danger-700',
    icon: XCircleIcon,
    canCancel: false,
    canActivate: false,
  },
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Pulse({ className }: { className: string }) {
  return (
    <div className={`animate-pulse bg-secondary-200 dark:bg-secondary-700 rounded-xl ${className}`} />
  )
}

function OrderSkeleton() {
  return (
    <div className="space-y-3 px-4 pt-4">
      {[0, 1, 2, 3].map((i) => (
        <Pulse key={i} className="h-28 w-full" />
      ))}
    </div>
  )
}

// ─── Cancel Confirmation Sheet ────────────────────────────────────────────────

function CancelConfirmSheet({
  onConfirm,
  onCancel,
  isLoading,
}: {
  orderId: string
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative bg-white dark:bg-secondary-800 rounded-t-3xl p-6 space-y-4 pb-14"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 rounded-full bg-secondary-200 dark:bg-secondary-600 mx-auto -mt-1 mb-4" />
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center flex-shrink-0">
            <XCircleIcon className="w-6 h-6 text-danger-500" />
          </div>
          <div>
            <p className="text-base font-bold text-secondary-900 dark:text-white">
              Cancel this order?
            </p>
            <p className="text-sm text-secondary-400 dark:text-secondary-500 mt-0.5 leading-relaxed">
              This draft order will be cancelled. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 text-sm font-semibold text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
          >
            Keep order
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-danger-600 hover:bg-danger-700 disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                Cancelling…
              </>
            ) : (
              'Yes, cancel'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  index,
  onCancel,
  onActivate,
  isActivating,
}: {
  order: StandardOrder & { _id?: string }
  index: number
  onCancel: (id: string) => void
  onActivate: (id: string) => void
  isActivating: boolean
}) {
  const cfg = statusConfig[order.status] ?? statusConfig[OrderStatusEnum.PENDING]
  const Icon = cfg.icon
  const isOutright = order.metadata.plan === DevicePaymentPlan.NONE
  const orderId = (order as any)._id ?? order.deviceCategoryId

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-2xl overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Status icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
            <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-secondary-900 dark:text-white truncate">
                  {order.metadata.customerProfile?.firstName}{' '}
                  {order.metadata.customerProfile?.lastName}
                </p>
                <p className="text-[10px] font-mono text-secondary-400 dark:text-secondary-500 mt-0.5">
                  ref: {order.deviceCategoryId.slice(-8).toUpperCase()}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${cfg.pillBg} ${cfg.pillText} ${cfg.pillBorder}`}
              >
                {cfg.label}
              </span>
            </div>

            {/* Tags row */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400">
                <BoltIcon className="w-3 h-3" />
                {timelineLabel(order.metadata.paymentTimeline)}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400">
                <CalendarDaysIcon className="w-3 h-3" />
                {planLabel[order.metadata.plan]}
              </span>
            </div>
          </div>
        </div>

        {/* Amounts row */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-700">
          <div className="flex-1">
            <p className="text-[10px] text-secondary-400 dark:text-secondary-500">
              {isOutright ? 'Total amount' : 'Activation fee'}
            </p>
            <p className="text-sm font-bold text-secondary-900 dark:text-white">
              {formatCurrency(order.metadata.initializationAmount)}
            </p>
          </div>
          {!isOutright && (
            <div className="flex-1">
              <p className="text-[10px] text-secondary-400 dark:text-secondary-500">
                Per installment
              </p>
              <p className="text-sm font-bold text-secondary-900 dark:text-white">
                {formatCurrency(order.metadata.installmentValue)}
              </p>
            </div>
          )}
          <div className="flex-1">
            <p className="text-[10px] text-secondary-400 dark:text-secondary-500">Device total</p>
            <p className="text-sm font-bold text-secondary-900 dark:text-white">
              {formatCurrency(order.metadata.deviceAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* ── DRAFT footer: Activate + Cancel ── */}
      {cfg.canActivate && (
        <div className="border-t border-secondary-100 dark:border-secondary-700 px-4 pt-3 pb-4 space-y-2.5">
          <p className="text-xs text-secondary-400 dark:text-secondary-500 leading-relaxed">
            {cfg.description}
          </p>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onActivate(orderId)}
              disabled={isActivating}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-bold transition-colors"
            >
              {isActivating ? (
                <>
                  <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                  Getting link…
                </>
              ) : (
                <>
                  <CreditCardIcon className="w-3.5 h-3.5" />
                  Activate Order
                </>
              )}
            </motion.button>
            <button
              onClick={() => onCancel(orderId)}
              disabled={isActivating}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-danger-200 dark:border-danger-800 text-xs font-semibold text-danger-500 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 disabled:opacity-40 transition-colors flex-shrink-0"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Non-DRAFT footer: status label ── */}
      {!cfg.canActivate && (
        <div className="border-t border-secondary-100 dark:border-secondary-700 px-4 py-2.5 flex items-center justify-between">
          <p className="text-xs text-secondary-400 dark:text-secondary-500 italic">
            {cfg.description}
          </p>
          {order.status === OrderStatusEnum.COMPLETED && (
            <ChevronRightIcon className="w-4 h-4 text-secondary-300 dark:text-secondary-600" />
          )}
        </div>
      )}
    </motion.div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyOrders({ onNewOrder }: { onNewOrder: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 flex items-center justify-center mb-4">
        <ShoppingBagIcon className="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
      </div>
      <p className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
        No orders yet
      </p>
      <p className="text-xs text-secondary-400 dark:text-secondary-500 leading-relaxed mb-6">
        Place your first order to get your solar device and start your plan.
      </p>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNewOrder}
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        Place an order
      </motion.button>
    </motion.div>
  )
}

// ─── Order List Page ──────────────────────────────────────────────────────────

function OrderList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [showNewOrder, setShowNewOrder] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  const [activatingId, setActivatingId] = useState<string | null>(null)

  const [params] = useState<GetAllOrderCursorPaginationDTO>({
    prevCursor: null,
    nextCursor: null,
    search: null,
    limit: 20,
  })

  const { data: ordersData, isLoading } = useGetAllOrders(params)
  const { mutate: cancelOrder, isPending: cancelling } = useCancelOrder()
  const { mutate: activateOrder } = useActivateOrder()

  const orders = ordersData?.data ?? []

  // ── Activate an order: get Paystack URL then redirect ──
  const handleActivate = (orderId: string) => {
    setActivatingId(orderId)
    activateOrder(orderId, {
      onSuccess: (response) => {
        const url = response?.data?.authorization_url
        if (url) {
          // Redirect in same tab — most reliable on mobile
          window.location.href = url
        } else {
          toast.error('Payment link not available. Please try again.')
          setActivatingId(null)
        }
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message ||
          'Failed to get payment link. Please try again.'
        toast.error(message)
        setActivatingId(null)
      },
    })
  }

  const handleCancelConfirm = () => {
    if (!cancelTarget) return
    cancelOrder(
      { orderId: cancelTarget },
      {
        onSuccess: () => {
          toast.success('Order cancelled.')
          setCancelTarget(null)
          queryClient.invalidateQueries({ queryKey: ['all-orders'] })
        },
        onError: () => {
          toast.error('Failed to cancel order. Please try again.')
        },
      },
    )
  }

  const handleOrderSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['all-orders'] })
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <div className="bg-white dark:bg-secondary-800 px-5 pt-6 pb-4 border-b border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl border border-secondary-200 dark:border-secondary-700 flex items-center justify-center flex-shrink-0 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-300" />
            </button>
            <div>
              <h1 className="text-base font-bold text-secondary-900 dark:text-white">My Orders</h1>
              <p className="text-xs text-secondary-400 dark:text-secondary-500">
                {isLoading
                  ? 'Loading…'
                  : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewOrder(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            New order
          </motion.button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <OrderSkeleton />
      ) : orders.length === 0 ? (
        <EmptyOrders onNewOrder={() => setShowNewOrder(true)} />
      ) : (
        <div className="px-4 pt-4 pb-8 space-y-3">
          {orders.map((order, i) => (
            <OrderCard
              key={(order as any)._id ?? i}
              order={order as StandardOrder & { _id?: string }}
              index={i}
              onCancel={(id) => setCancelTarget(id)}
              onActivate={handleActivate}
              isActivating={activatingId === ((order as any)._id ?? order.deviceCategoryId)}
            />
          ))}
        </div>
      )}

      {/* New Order Modal */}
      <AnimatePresence>
        {showNewOrder && (
          <NewOrderModal
            onClose={() => setShowNewOrder(false)}
            onSuccess={handleOrderSuccess}
          />
        )}
      </AnimatePresence>

      {/* Cancel Confirmation */}
      <AnimatePresence>
        {cancelTarget && (
          <CancelConfirmSheet
            orderId={cancelTarget}
            onConfirm={handleCancelConfirm}
            onCancel={() => setCancelTarget(null)}
            isLoading={cancelling}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrderList
