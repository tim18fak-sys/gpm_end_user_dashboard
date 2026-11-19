import { useState } from 'react'
import { CubeIcon } from '@heroicons/react/24/solid'
import { useDeviceCategoryDetails } from '@/hooks/useDeviceCategory'
import DevicePickerModal, { SelectedDevice } from '@/components/modals/DevicePickerModal'
import {
  DeviceCategoryPaymentDurationOptionEnum,
  DeviceCategoryPaymentOptionEnum,
} from '@/types/deviceCategory'
import UniversalError from './UniversalError'
import UniversalLoadingSkeleton from './UniversalLoadingSkeleton'

interface PaymentSummary {
  option: DeviceCategoryPaymentOptionEnum
  duration: DeviceCategoryPaymentDurationOptionEnum | ''
  initializationAmount: number | null
  installmentAmount: number | null
  months: number | null
}

interface Props {
  productModelId: string
  paymentPlan: PaymentSummary | null
  onSelect: (device: SelectedDevice) => void
}

export default function PreselectedDeviceField({ productModelId, paymentPlan, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const query = useDeviceCategoryDetails(productModelId)
  const category = query.data?.data

  if (!productModelId) {
    return <UniversalError compact title="Missing linked device"
      message="This link does not include a valid product model. Please request a new link from your agent." />
  }
  if (query.isPending) {
    return <UniversalLoadingSkeleton variant="card" label="Loading your device details" />
  }
  if (query.isError || !category || category._id !== productModelId || !Array.isArray(category.payment_option)) {
    return <UniversalError compact title="Unable to load your device"
      message="We couldn't load the device attached to this link. Retry, or ask your agent to check the link."
      onRetry={() => { void query.refetch() }} />
  }
  const available = category.payment_option.some((option) =>
    option === DeviceCategoryPaymentOptionEnum.OUTRIGHT || option === DeviceCategoryPaymentOptionEnum.INSTALLMENT)
  if (!available) {
    return <UniversalError compact title="No payment plans available"
      message="This device has no available payment plans. Please contact your agent."
      onRetry={() => { void query.refetch() }} />
  }

  return (
    <section aria-label="Preselected device and payment plan" className="space-y-3">
      <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 dark:border-primary-700 dark:bg-primary-900/20">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">Device Details</p>
        <div className="mt-3 flex items-start gap-3">
          <div className="rounded-xl bg-primary-100 p-2.5 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
            <CubeIcon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-secondary-900 dark:text-white">{category.model}</h3>
            <p className="mt-1 text-xs capitalize text-secondary-500 dark:text-secondary-400">{category.device_type}</p>
            {category.description && <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-300">{category.description}</p>}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-secondary-200 p-4 dark:border-secondary-600">
        <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">Payment Plan</h3>
        <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">Choose how you'll pay</p>
        {paymentPlan && (
          <div role="status" className="mt-3 space-y-1 text-sm text-primary-700 dark:text-primary-300">
            <p className="font-semibold">
              {paymentPlan.option === DeviceCategoryPaymentOptionEnum.OUTRIGHT ? 'Outright payment' : 'Installment payment'}
            </p>
            {paymentPlan.option === DeviceCategoryPaymentOptionEnum.INSTALLMENT && (
              <p className="text-xs">
                {paymentPlan.initializationAmount != null && <>Down payment: {category.currency || 'NGN'} {paymentPlan.initializationAmount.toLocaleString()} · </>}
                {paymentPlan.installmentAmount != null && <>{category.currency || 'NGN'} {paymentPlan.installmentAmount.toLocaleString()} / {paymentPlan.duration === DeviceCategoryPaymentDurationOptionEnum.WEEKLY ? 'week' : 'month'}</>}
                {paymentPlan.months != null && <> · {paymentPlan.months} months</>}
              </p>
            )}
          </div>
        )}
        <button type="button" onClick={() => setOpen(true)}
          className="mt-3 w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
          {paymentPlan ? 'Change payment plan' : 'Choose payment plan'}
        </button>
      </div>
      {open && (
        <DevicePickerModal
          key={productModelId}
          open
          preselectedCategory={category}
          currentId={productModelId}
          onClose={() => setOpen(false)}
          onSelect={(device) => {
            if (device.id !== productModelId) return
            onSelect(device)
            setOpen(false)
          }}
        />
      )}
    </section>
  )
}
