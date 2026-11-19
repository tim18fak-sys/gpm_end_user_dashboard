import type { SelectedDevice } from '@/components/modals/DevicePickerModal'
import { DevicePaymentTimelineEnum } from '@/enum/device.enum'
import { DeviceCategoryPaymentOptionEnum } from '@/types/deviceCategory'

/** Update the device and its complete payment plan together after confirmation. */
export function deviceSelectionFields(device: SelectedDevice) {
  return {
    interested_device_category_id: device.id,
    interested_device_category_name: device.name,
    interested_device_type: device.deviceType,
    device_payment_option: device.paymentOption,
    device_payment_duration: device.paymentDuration ?? '',
    device_initialization_amount: device.initializationAmount,
    device_installment_amount: device.installmentAmount ?? null,
    device_installment_duration_months: device.installmentDurationMonths ?? null,
    paymentTimeline: device.paymentOption === DeviceCategoryPaymentOptionEnum.OUTRIGHT
      ? DevicePaymentTimelineEnum.OUTRIGHT
      : device.installmentDurationMonths
        ? `${device.installmentDurationMonths}_month` as DevicePaymentTimelineEnum
        : '',
  } as const
}
