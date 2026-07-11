import { DeviceTypeEnum } from "@/enum/device.enum"
import { BaseStatusEnum } from "@/enum/base.enum"

export enum DeviceCategoryPaymentOptionEnum {
  OUTRIGHT = 'OUTRIGHT',
  INSTALLMENT = 'INSTALLMENT',
}

export enum DeviceCategoryPaymentDurationOptionEnum {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export interface DeviceCategoryCommissionStructure {
  hub_manager_commission_percentage: number
  assigned_agent_commission_percentage: number
  sales_agent_commission_percentage: number
}


interface InstallmentPaymentDurationOption {
  duration_option: DeviceCategoryPaymentDurationOptionEnum;
  amount: number;
}
export interface DeviceCategory {
  _id: string;
  model: string;
  description: string;
  amount: number;
  currency: string;
  status: BaseStatusEnum;
  is_soft_delete: boolean;
  device_type: DeviceTypeEnum;
  payment_option: DeviceCategoryPaymentOptionEnum[];
  commission_outright_structure: DeviceCategoryCommissionStructure;
  commission_installment_structure: DeviceCategoryCommissionStructure;
  commission_installment_duration_in_months: number;
  installment_duration_available: number;
  installment_payment_durations_option: InstallmentPaymentDurationOption[];
  installment_initialization_percentage: number;
  installment_interest_rate: number;
  createdAt: string;
  updatedAt: string;
  allow_manual_calculation_for_installment_payment:boolean
}

export interface DeviceCategoryPagination {
  data: DeviceCategory[]
  limit: number
  nextCursor: string | null
  prevCursor: string | null
}
