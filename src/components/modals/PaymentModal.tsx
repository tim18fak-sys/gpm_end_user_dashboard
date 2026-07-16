import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import {
  useActivateOrder,
  useInitializeInvoicePayment,
  useGetActiveBankAccount,
  useUploadActivateOrderPaymentReceipt,
  useUploadInvoicePaymentReceipt,
} from '@/hooks/usePayment'
import { BankAccount } from '@/types/payment.type'
import PresignedUpload from '@/components/smart_components/PresignUpload'
import { api } from '@/services/api'

// =============================================================================
// Types
// =============================================================================

export type PaymentModalMode = 'activate-order' | 'pay-invoice'

type SlideId =
  | 'selection'
  | 'paystack'
  | 'manual-bank-select'
  | 'manual-receipt'
  | 'success'

// =============================================================================
// Strategy: Payment Options
// =============================================================================
// To add a new payment method:
//   1. Add an entry to PAYMENT_OPTIONS with a unique `id` and `targetSlide`.
//   2. Add a case for `targetSlide` inside `renderSlide()` in PaymentModal.
//   3. Implement the corresponding slide component below this block.

interface PaymentOptionConfig {
  id: string
  label: string
  description: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any
  badge?: string
  targetSlide: Exclude<SlideId, 'selection' | 'success'>
}

const PAYMENT_OPTIONS: PaymentOptionConfig[] = [
  {
    id: 'paystack',
    label: 'Pay with Paystack',
    description: 'Card, bank transfer, or USSD — secured by Paystack',
    Icon: CreditCardIcon,
    badge: 'Recommended',
    targetSlide: 'paystack',
  },
  {
    id: 'manual',
    label: 'Manual Bank Transfer',
    description: 'Transfer directly to our account and upload your proof of payment',
    Icon: BuildingLibraryIcon,
    targetSlide: 'manual-bank-select',
  },
]

// =============================================================================
// Shared slide context (passed as props to every slide component)
// =============================================================================

interface SlideProps {
  mode: PaymentModalMode
  orderId?: string
  invoiceId?: string
  amount: number
  selectedBank: BankAccount | null
  onSelectBank: (bank: BankAccount) => void
  receiptUrl: string
  onReceiptUploaded: (url: string) => void
  amountPaid: string
  onAmountPaidChange: (v: string) => void
  onNavigate: (slide: SlideId, dir?: number) => void
  onSuccess: () => void
  onClose: () => void
}

// =============================================================================
// Animation
// =============================================================================

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0 }),
}

// =============================================================================
// Navigation config
// =============================================================================

const BACK_TARGETS: Partial<Record<SlideId, SlideId>> = {
  paystack: 'selection',
  'manual-bank-select': 'selection',
  'manual-receipt': 'manual-bank-select',
}

const SLIDE_LABELS: Record<SlideId, { step: string; title: string }> = {
  selection: { step: 'Payment', title: 'Choose payment method' },
  paystack: { step: 'Online Payment', title: 'Pay with Paystack' },
  'manual-bank-select': { step: 'Manual Transfer · 1 of 2', title: 'Select Bank Account' },
  'manual-receipt': { step: 'Manual Transfer · 2 of 2', title: 'Upload Receipt' },
  success: { step: 'Complete', title: 'Payment Submitted' },
}

// =============================================================================
// Slide: Selection
// =============================================================================

function SelectionSlide({ amount, onNavigate }: SlideProps) {
  return (
    <div className="px-4 py-5 space-y-3">
      <p className="text-xs text-secondary-400 dark:text-secondary-500 text-center pb-1">
        Amount due:{' '}
        <span className="text-sm font-bold text-secondary-900 dark:text-white">
          ₦{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </p>

      {PAYMENT_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onNavigate(opt.targetSlide, 1)}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-secondary-200 dark:border-secondary-600 hover:border-primary-400 dark:hover:border-primary-600 bg-white dark:bg-secondary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-secondary-100 dark:bg-secondary-600 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 flex items-center justify-center flex-shrink-0 transition-colors">
            <opt.Icon className="w-6 h-6 text-secondary-500 dark:text-secondary-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-secondary-800 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                {opt.label}
              </p>
              {opt.badge && (
                <span className="text-[10px] font-bold bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded-full">
                  {opt.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">{opt.description}</p>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-secondary-300 group-hover:text-primary-400 transition-colors flex-shrink-0" />
        </button>
      ))}
    </div>
  )
}

// =============================================================================
// Slide: Paystack
// =============================================================================

function PaystackSlide({ mode, orderId, invoiceId, amount, onClose, onSuccess }: SlideProps) {
  const { mutate: activateOrder, isPending: activatingOrder } = useActivateOrder()
  const { mutate: initInvoice, isPending: initializingInvoice } = useInitializeInvoicePayment()
  const [initiated, setInitiated] = useState(false)

  const isPending = activatingOrder || initializingInvoice

  const handlePay = () => {
    if (mode === 'activate-order') {
      if (!orderId) { toast.error('Order ID is missing'); return }
      activateOrder(orderId, {
        onSuccess: (res) => {
          const url = (res as any)?.data?.authorization_url
          if (url) window.open(url, '_blank', 'noopener,noreferrer')
          setInitiated(true)
          onSuccess()
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Failed to initialize payment')
        },
      })
    } else {
      if (!invoiceId) { toast.error('Invoice ID is missing'); return }
      initInvoice(invoiceId, {
        onSuccess: (res) => {
          const url = (res as any)?.data?.authorization_url
          if (url) window.open(url, '_blank', 'noopener,noreferrer')
          setInitiated(true)
          onSuccess()
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Failed to initialize payment')
        },
      })
    }
  }

  if (initiated) {
    return (
      <div className="px-4 py-10 flex flex-col items-center text-center gap-4">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center"
        >
          <CheckCircleIcon className="w-9 h-9 text-success-500" />
        </motion.div>
        <div>
          <p className="text-base font-semibold text-secondary-900 dark:text-white">Payment Page Opened</p>
          <p className="text-sm text-secondary-400 dark:text-secondary-500 mt-1">
            Complete your payment in the Paystack tab that just opened.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors"
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-5 space-y-4">
      {/* Amount banner */}
      <div className="rounded-xl bg-secondary-50 dark:bg-secondary-700/60 p-4 flex items-center justify-between">
        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400">Amount to pay</p>
        <p className="text-xl font-bold text-secondary-900 dark:text-white">
          ₦{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-secondary-200 dark:border-secondary-600 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <CreditCardIcon className="w-4 h-4 text-primary-500 flex-shrink-0" />
          <p className="text-xs font-semibold text-secondary-700 dark:text-secondary-300">Powered by Paystack</p>
        </div>
        <p className="text-xs text-secondary-400 dark:text-secondary-500">
          You'll be redirected to Paystack's secure checkout. Supports debit/credit cards, instant bank transfer, and USSD.
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handlePay}
        disabled={isPending}
        className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
      >
        {isPending ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
            Initializing...
          </>
        ) : (
          'Pay Now →'
        )}
      </button>
    </div>
  )
}

// =============================================================================
// Slide: Manual — Bank Selection
// =============================================================================

function ManualBankSelectSlide({ onSelectBank, onNavigate }: SlideProps) {
  const { data, isLoading, isError, refetch } = useGetActiveBankAccount()
  const banks: BankAccount[] = (data as any)?.data ?? []

  if (isLoading) {
    return (
      <div className="px-4 py-5 space-y-3">
        <div className="h-3 w-36 rounded bg-secondary-100 dark:bg-secondary-700 animate-pulse mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[72px] rounded-xl bg-secondary-100 dark:bg-secondary-700 animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="px-4 py-12 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-danger-500">Failed to load bank accounts.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs font-semibold text-primary-600 dark:text-primary-400 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (banks.length === 0) {
    return (
      <div className="px-4 py-12 flex flex-col items-center gap-3 text-center">
        <BuildingLibraryIcon className="w-10 h-10 text-secondary-300 dark:text-secondary-600" />
        <p className="text-sm text-secondary-500 dark:text-secondary-400">No active bank accounts available right now.</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-5 space-y-3">
      <p className="text-xs text-secondary-400 dark:text-secondary-500">
        Select the account you transferred to:
      </p>
      {banks.map((bank) => (
        <button
          key={bank._id}
          type="button"
          onClick={() => {
            onSelectBank(bank)
            onNavigate('manual-receipt', 1)
          }}
          className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-secondary-200 dark:border-secondary-600 hover:border-primary-400 dark:hover:border-primary-600 bg-white dark:bg-secondary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <BuildingLibraryIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-secondary-800 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors truncate">
              {bank.accountHolderName}
            </p>
            <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">
              {bank.bankName} · {bank.accountNumber}
            </p>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-secondary-300 group-hover:text-primary-400 transition-colors flex-shrink-0" />
        </button>
      ))}
    </div>
  )
}

// =============================================================================
// Slide: Manual — Receipt Upload
// =============================================================================

function ManualReceiptSlide({
  mode, orderId, invoiceId, amount,
  selectedBank, receiptUrl, onReceiptUploaded,
  amountPaid, onAmountPaidChange,
  onNavigate, onSuccess,
}: SlideProps) {
  const { mutate: uploadOrderReceipt, isPending: uploadingOrder } = useUploadActivateOrderPaymentReceipt()
  const { mutate: uploadInvoiceReceipt, isPending: uploadingInvoice } = useUploadInvoicePaymentReceipt()
  const isPending = uploadingOrder || uploadingInvoice

  const canSubmit = !!receiptUrl && !!amountPaid && parseFloat(amountPaid) > 0 && !!selectedBank

  const handleSubmit = () => {
    if (!canSubmit) return
    const amt = parseFloat(amountPaid)

    if (mode === 'activate-order') {
      if (!orderId) { toast.error('Order ID is missing'); return }
      uploadOrderReceipt(
        { orderId, amountPaid: amt, receiptUrl, bankId: selectedBank!._id },
        {
          onSuccess: () => { onNavigate('success', 1); onSuccess() },
          onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to submit receipt'),
        },
      )
    } else {
      if (!invoiceId) { toast.error('Invoice ID is missing'); return }
      uploadInvoiceReceipt(
        { invoiceId, amountPaid: amt, receiptUrl, bankId: selectedBank!._id },
        {
          onSuccess: () => { onNavigate('success', 1); onSuccess() },
          onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to submit receipt'),
        },
      )
    }
  }

  return (
    <div className="px-4 py-5 space-y-4">
      {/* Selected bank summary */}
      {selectedBank && (
        <div className="rounded-xl bg-secondary-50 dark:bg-secondary-700/60 p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <BuildingLibraryIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-secondary-800 dark:text-white truncate">
              {selectedBank.accountHolderName}
            </p>
            <p className="text-[11px] text-secondary-400 dark:text-secondary-500">
              {selectedBank.bankName} · {selectedBank.accountNumber}
            </p>
          </div>
        </div>
      )}

      {/* Amount paid */}
      <div>
        <label className="block text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wide mb-1.5">
          Amount Paid
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-secondary-400 pointer-events-none">
            ₦
          </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={amountPaid}
            onChange={(e) => onAmountPaidChange(e.target.value)}
            placeholder={amount.toFixed(2)}
            className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-sm text-secondary-900 dark:text-white placeholder:text-secondary-300 dark:placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Receipt upload */}
      <div>
        <label className="block text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wide mb-1.5">
          Payment Receipt
        </label>
        <div
          className={`rounded-xl overflow-hidden border-2 transition-colors ${
            receiptUrl
              ? 'border-success-400 dark:border-success-600'
              : 'border-secondary-200 dark:border-secondary-600'
          }`}
        >
          <PresignedUpload
            axiosInstance={api}
            resourceType="image"
            label="Upload your payment receipt (screenshot or photo)"
            acceptedFormats={['image/jpeg', 'image/png', 'image/webp', 'application/pdf']}
            onUploadSuccess={({ url }) => onReceiptUploaded(url)}
          />
        </div>
        {receiptUrl && (
          <p className="mt-1.5 text-xs text-success-600 dark:text-success-400 flex items-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
            Receipt uploaded successfully
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || isPending}
        className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
      >
        {isPending ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
            Submitting...
          </>
        ) : (
          'Submit Payment'
        )}
      </button>
    </div>
  )
}

// =============================================================================
// Slide: Success
// =============================================================================

function SuccessSlide({ onClose }: SlideProps) {
  return (
    <div className="px-4 py-12 flex flex-col items-center text-center gap-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center"
      >
        <CheckCircleIcon className="w-11 h-11 text-success-500" />
      </motion.div>
      <div>
        <p className="text-base font-bold text-secondary-900 dark:text-white">Receipt Submitted!</p>
        <p className="text-sm text-secondary-400 dark:text-secondary-500 mt-1 max-w-xs mx-auto">
          Your payment receipt has been submitted. We'll review and confirm your payment shortly.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="w-full mt-2 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors"
      >
        Done
      </button>
    </div>
  )
}

// =============================================================================
// Main: PaymentModal
// =============================================================================

export interface PaymentModalProps {
  open: boolean
  onClose: () => void
  mode: PaymentModalMode
  orderId?: string
  invoiceId?: string
  amount: number
  onSuccess?: () => void
}

export default function PaymentModal({
  open,
  onClose,
  mode,
  orderId,
  invoiceId,
  amount,
  onSuccess,
}: PaymentModalProps) {
  const [slide, setSlide] = useState<SlideId>('selection')
  const [dir, setDir] = useState(1)
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null)
  const [receiptUrl, setReceiptUrl] = useState('')
  const [amountPaid, setAmountPaid] = useState('')

  // Sync amount input when modal opens
  useEffect(() => {
    if (open) setAmountPaid(amount > 0 ? String(amount) : '')
  }, [open, amount])

  const navigate = (target: SlideId, direction = 1) => {
    setDir(direction)
    setSlide(target)
  }

  const handleBack = () => {
    const target = BACK_TARGETS[slide]
    if (target) navigate(target, -1)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setSlide('selection')
      setDir(1)
      setSelectedBank(null)
      setReceiptUrl('')
      setAmountPaid(amount > 0 ? String(amount) : '')
    }, 300)
  }

  const sharedProps: SlideProps = {
    mode,
    orderId,
    invoiceId,
    amount,
    selectedBank,
    onSelectBank: setSelectedBank,
    receiptUrl,
    onReceiptUploaded: setReceiptUrl,
    amountPaid,
    onAmountPaidChange: setAmountPaid,
    onNavigate: navigate,
    onSuccess: () => onSuccess?.(),
    onClose: handleClose,
  }

  // ── Slide registry ──────────────────────────────────────────────────────────
  // Add a new case here when registering a new payment option slide.
  const renderSlide = (): JSX.Element => {
    switch (slide) {
      case 'selection':         return <SelectionSlide {...sharedProps} />
      case 'paystack':          return <PaystackSlide {...sharedProps} />
      case 'manual-bank-select': return <ManualBankSelectSlide {...sharedProps} />
      case 'manual-receipt':    return <ManualReceiptSlide {...sharedProps} />
      case 'success':           return <SuccessSlide {...sharedProps} />
    }
  }

  if (!open) return null

  const hasBack = slide in BACK_TARGETS
  const { step, title } = SLIDE_LABELS[slide]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-secondary-800 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-secondary-100 dark:border-secondary-700 flex-shrink-0">
          {hasBack ? (
            <button
              onClick={handleBack}
              className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
            </button>
          ) : (
            <div className="w-7 h-7" />
          )}
          <div className="flex-1 min-w-0 text-center">
            <p className="text-[10px] font-semibold text-secondary-400 dark:text-secondary-500 uppercase tracking-wider">
              {step}
            </p>
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white truncate">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
          >
            <XMarkIcon className="w-4 h-4 text-secondary-500" />
          </button>
        </div>

        {/* ── Slide content ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence initial={false} custom={dir} mode="wait">
            <motion.div
              key={slide}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.32, 0, 0.67, 0] }}
              className="overflow-y-auto h-full"
            >
              {renderSlide()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
