import { DevicePaymentTimelineEnum, DeviceTypeEnum } from "@/enum/device.enum";
import { UserGenderEnum } from "./user.types";
import { DeviceUserOnboardingStatusEnum } from "@/enum/user.enum";
import {
  IdTypeEnum,
  IntendedUseEnum,
  IncomeStabilityEnum,
  LoanTypeEnum,
  LoanStatusEnum,
  PowerProblemEnum,
  ProductBenefitEnum,
  BusinessTypeEnum,
  BusinessDurationEnum,
  CustomerTrafficEnum,
} from "@/enum/kyc.enum";

export interface GuarantorDto {
  name: string;
  phone: string;
  relationship: string;
  address: string;
  occupation: string;
  id_type: IdTypeEnum;
  id_number: string;
}

export interface DeviceUserOnboardingDto {
  // ── Section 1: Customer Identification ──────────────────────────────────────
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  whatsapp_number?: string;
  alternative_number?: string;
  gender: UserGenderEnum;
  dob: string;
  address: string;               // home address
  business_address?: string;
  occupation: string;
  id_type: IdTypeEnum;
  id_number: string;
  profile_picture?: string;

  // ── Section 2: Product Information ──────────────────────────────────────────
  interested_device_type: DeviceTypeEnum;
  interested_device_category_id: string;
  interested_device_category_name: string;
  device_payment_option: string;
  device_payment_duration?: string;
  device_initialization_amount: number;
  device_installment_amount?: number;
  device_installment_duration_months?: number;
  paymentTimeline: DevicePaymentTimelineEnum;
  intended_use: IntendedUseEnum;
  intended_use_other?: string;   // only when intended_use === OTHER

  // ── Section 3A: Income ───────────────────────────────────────────────────────
  income_source: string;
  daily_income: number;
  weekly_income: number;
  monthly_income: number;
  monthly_expenses: number;
  income_stability: IncomeStabilityEnum;

  // ── Section 3B: Expenditure & Liabilities ───────────────────────────────────
  monthly_rent: number;
  school_fees: number;
  loan_repayment_amount?: number;
  loan_repayment_lender?: string;
  fuel_expenses: number;
  electricity_bill: number;
  other_expenses?: number;

  // ── Section 4: Credit History ────────────────────────────────────────────────
  has_taken_loan: boolean;
  loan_type?: LoanTypeEnum;
  loan_status?: LoanStatusEnum;
  has_outstanding_debt: boolean;
  outstanding_debt_amount?: number;
  willing_to_provide_bank_statement: boolean;
  bank_statement_refusal_reason?: string;

  // ── Section 5: Compelling Need ───────────────────────────────────────────────
  power_problems: PowerProblemEnum[];
  product_benefits: ProductBenefitEnum[];

  // ── Section 6: Business Verification (conditional on is_business_owner) ─────
  is_business_owner: boolean;
  business_type?: BusinessTypeEnum;
  business_duration?: BusinessDurationEnum;
  daily_customer_traffic?: CustomerTrafficEnum;
  has_power_equipment?: boolean;
  is_permanent_location?: boolean;
  hub_distance_km?: number;

  // ── Section 7: Guarantors ────────────────────────────────────────────────────
  guarantors: [GuarantorDto, GuarantorDto];

  // ── Section 9: Consent ───────────────────────────────────────────────────────
  consent_agreed: boolean;

  // ── Account credentials ──────────────────────────────────────────────────────
  password: string;

  // ── Meta (from onboarding link) ──────────────────────────────────────────────
  onboarding_agent_id: string;
  onboarding_hub_id: string;
}

// ── DB record (returned from server) ─────────────────────────────────────────
export interface DeviceUserOnboarding {
  _id: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_picture?: string;
  date_birth: Date;
  gender: UserGenderEnum;
  status: DeviceUserOnboardingStatusEnum;
  onboarding_agent_id: string;
  onboarding_hub_id: string;
  paymentTimeline: DevicePaymentTimelineEnum;
}
