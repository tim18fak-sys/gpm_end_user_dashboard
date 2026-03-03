import { DeviceTypeEnum } from "@/enum/device.enum"

export enum DeviceCategoryPaymentOptionEnum {
  OUTRIGHT = 'OUTRIGHT',
  INSTALLMENT = 'INSTALLMENT',
}

export enum DeviceCatetoryPaymentDurationOptionEnum {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export interface DeviceCategoryCommissionStructure {
  hub_manager_commission_percentage: number
  assigned_agent_commission_percentage: number
  sales_agent_commission_percentage: number
}

export interface DeviceCategory {
  _id: string
  model: string
  description: string
  amount: number
  status: 'activated' | 'deactivated'
  is_soft_delete: boolean
  device_type: DeviceTypeEnum
  payment_option: DeviceCategoryPaymentOptionEnum
  commission_outright_structure: DeviceCategoryCommissionStructure
  commission_installment_structure: DeviceCategoryCommissionStructure
  commission_installment_duration_in_months: number
  installment_duration_available: number
  installment_payment_durations_option: DeviceCatetoryPaymentDurationOptionEnum[]
  installment_initialization_percentage: number
  installment_interest_rate: number
  createdAt: string
  updatedAt: string
}

export interface DeviceCategoryPagination {
  data: DeviceCategory[]
  limit: number
  nextCursor: string | null
  prevCursor: string | null
}