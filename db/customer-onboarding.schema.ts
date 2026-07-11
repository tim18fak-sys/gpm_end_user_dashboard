import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsArray,
  IsDateString,
  ValidateNested,
  Min,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum UserGenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export enum IdTypeEnum {
  NATIONAL_ID_NIN = 'national_id_nin',
  VOTERS_CARD = 'voters_card',
  DRIVERS_LICENSE = 'drivers_license',
  INTERNATIONAL_PASSPORT = 'international_passport',
}

export enum DeviceTypeEnum {
  SIM = 'SIM',
  PAYGO = 'PAYGO',
  IOT = 'IOT',
  MANUAL_PAYGO = 'MANUAL_PAYGO',
}

export enum DeviceCategoryPaymentOptionEnum {
  OUTRIGHT = 'OUTRIGHT',
  INSTALLMENT = 'INSTALLMENT',
}

export enum DeviceCategoryPaymentDurationOptionEnum {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum DevicePaymentTimelineEnum {
  OUTRIGHT = 'outright',
  ONE_MONTH = '1_month',
  TWO_MONTH = '2_month',
  THREE_MONTH = '3_month',
  FOUR_MONTH = '4_month',
  FIVE_MONTH = '5_month',
  SIX_MONTH = '6_month',
  SEVEN_MONTH = '7_month',
  EIGHT_MONTH = '8_month',
  NINE_MONTH = '9_month',
  TEN_MONTH = '10_month',
  ELEVEN_MONTH = '11_month',
  TWELVE_MONTH = '12_month',
  THIRTEEN_MONTH = '13_month',
  FOURTEEN_MONTH = '14_month',
  FIFTEEN_MONTH = '15_month',
  SIXTEEN_MONTH = '16_month',
  SEVENTEEN_MONTH = '17_month',
  EIGHTEEN_MONTH = '18_month',
  NINETEEN_MONTH = '19_month',
  TWENTY_MONTH = '20_month',
  TWENTY_ONE_MONTH = '21_month',
  TWENTY_TWO_MONTH = '22_month',
  TWENTY_THREE_MONTH = '23_month',
  TWENTY_FOUR_MONTH = '24_month',
  TWENTY_FIVE_MONTH = '25_month',
  TWENTY_SIX_MONTH = '26_month',
  TWENTY_SEVEN_MONTH = '27_month',
  TWENTY_EIGHT_MONTH = '28_month',
  TWENTY_NINE_MONTH = '29_month',
  THIRTY_MONTH = '30_month',
  THIRTY_ONE_MONTH = '31_month',
  THIRTY_TWO_MONTH = '32_month',
  THIRTY_THREE_MONTH = '33_month',
  THIRTY_FOUR_MONTH = '34_month',
  THIRTY_FIVE_MONTH = '35_month',
  THIRTY_SIX_MONTH = '36_month',
}

export enum IntendedUseEnum {
  PHARMACY = 'pharmacy',
  BEER_PARLOUR = 'beer_parlour',
  FROZEN_FOODS = 'frozen_foods',
  SOFT_DRINK_CHEMIST = 'soft_drink_chemist',
  RESTAURANT = 'restaurant',
  MINI_MART = 'mini_mart',
  HOME_USE = 'home_use',
  OTHER = 'other',
}

export enum IncomeStabilityEnum {
  VERY_STABLE = 'very_stable',
  FAIRLY_STABLE = 'fairly_stable',
  SEASONAL = 'seasonal',
  UNSTABLE = 'unstable',
}

export enum LoanTypeEnum {
  BANK = 'bank',
  MFI = 'mfi',
  COOPERATIVE = 'cooperative',
  ONLINE_APP = 'online_app',
  FAMILY_FRIENDS = 'family_friends',
}

export enum LoanStatusEnum {
  FULLY_REPAID = 'fully_repaid',
  CURRENTLY_PAYING = 'currently_paying',
  DEFAULTED = 'defaulted',
  RESTRUCTURED = 'restructured',
}

export enum PowerProblemEnum {
  HIGH_FUEL_EXPENSES = 'high_fuel_expenses',
  GENERATOR_BREAKDOWN = 'generator_breakdown',
  LOSS_OF_CUSTOMERS = 'loss_of_customers',
  FOOD_MEDICINE_SPOILAGE = 'food_medicine_spoilage',
  REDUCED_OPERATING_HOURS = 'reduced_operating_hours',
  NOISE_AIR_POLLUTION = 'noise_air_pollution',
  UNRELIABLE_NEPA = 'unreliable_nepa',
  HIGH_RUNNING_COST = 'high_running_cost',
  EXPAND_BUSINESS = 'expand_business',
  OTHER = 'other',
}

export enum ProductBenefitEnum {
  INCREASE_SALES = 'increase_sales',
  REDUCE_COSTS = 'reduce_costs',
  IMPROVE_SERVICE = 'improve_service',
  EXTEND_HOURS = 'extend_hours',
  COLD_STORAGE = 'cold_storage',
  NEW_INCOME_SOURCE = 'new_income_source',
  OTHER = 'other',
}

export enum BusinessTypeEnum {
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  PARTNERSHIP = 'partnership',
  REGISTERED = 'registered',
}

export enum BusinessDurationEnum {
  LESS_THAN_6_MONTHS = 'less_than_6_months',
  SIX_TO_12_MONTHS = '6_to_12_months',
  ONE_TO_3_YEARS = '1_to_3_years',
  THREE_PLUS_YEARS = '3_plus_years',
}

export enum CustomerTrafficEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum DeviceUserOnboardingStatusEnum {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

// ─── Sub-document: Guarantor ──────────────────────────────────────────────────

@Schema({ _id: false })
export class Guarantor {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  relationship: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  occupation: string;

  @Prop({ required: true, enum: IdTypeEnum })
  id_type: IdTypeEnum;

  @Prop({ required: true, trim: true })
  id_number: string;
}

export const GuarantorSchema = SchemaFactory.createForClass(Guarantor);

// ─── Sub-document: ProductInfo ────────────────────────────────────────────────

@Schema({ _id: false })
export class ProductInfo {
  @Prop({ required: true, enum: DeviceTypeEnum })
  interested_device_type: DeviceTypeEnum;

  @Prop({ required: true, type: Types.ObjectId })
  interested_device_category_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  interested_device_category_name: string;

  @Prop({ required: true, enum: DeviceCategoryPaymentOptionEnum })
  device_payment_option: DeviceCategoryPaymentOptionEnum;

  @Prop({ enum: DeviceCategoryPaymentDurationOptionEnum, default: null })
  device_payment_duration: DeviceCategoryPaymentDurationOptionEnum | null;

  @Prop({ required: true, type: Number, default: 0 })
  device_initialization_amount: number;

  @Prop({ type: Number, default: null })
  device_installment_amount: number | null;

  @Prop({ type: Number, default: null })
  device_installment_duration_months: number | null;

  @Prop({ required: true, enum: DevicePaymentTimelineEnum })
  payment_timeline: DevicePaymentTimelineEnum;

  @Prop({ required: true, enum: IntendedUseEnum })
  intended_use: IntendedUseEnum;

  @Prop({ trim: true, default: null })
  intended_use_other: string | null;
}

export const ProductInfoSchema = SchemaFactory.createForClass(ProductInfo);

// ─── Sub-document: IncomeProfile ──────────────────────────────────────────────

@Schema({ _id: false })
export class IncomeProfile {
  @Prop({ required: true, trim: true })
  income_source: string;

  @Prop({ required: true, type: Number, min: 0 })
  daily_income: number;

  @Prop({ required: true, type: Number, min: 0 })
  weekly_income: number;

  @Prop({ required: true, type: Number, min: 0 })
  monthly_income: number;

  @Prop({ required: true, type: Number, min: 0 })
  monthly_expenses: number;

  @Prop({ required: true, enum: IncomeStabilityEnum })
  income_stability: IncomeStabilityEnum;

  @Prop({ required: true, type: Number, min: 0, default: 0 })
  monthly_rent: number;

  @Prop({ required: true, type: Number, min: 0, default: 0 })
  school_fees: number;

  @Prop({ type: Number, default: null })
  loan_repayment_amount: number | null;

  @Prop({ trim: true, default: null })
  loan_repayment_lender: string | null;

  @Prop({ required: true, type: Number, min: 0, default: 0 })
  fuel_expenses: number;

  @Prop({ required: true, type: Number, min: 0, default: 0 })
  electricity_bill: number;

  @Prop({ type: Number, default: null })
  other_expenses: number | null;
}

export const IncomeProfileSchema = SchemaFactory.createForClass(IncomeProfile);

// ─── Sub-document: CreditHistory ─────────────────────────────────────────────

@Schema({ _id: false })
export class CreditHistory {
  @Prop({ required: true, type: Boolean })
  has_taken_loan: boolean;

  @Prop({ enum: LoanTypeEnum, default: null })
  loan_type: LoanTypeEnum | null;

  @Prop({ enum: LoanStatusEnum, default: null })
  loan_status: LoanStatusEnum | null;

  @Prop({ required: true, type: Boolean })
  has_outstanding_debt: boolean;

  @Prop({ type: Number, default: null })
  outstanding_debt_amount: number | null;

  @Prop({ required: true, type: Boolean })
  willing_to_provide_bank_statement: boolean;

  @Prop({ trim: true, default: null })
  bank_statement_refusal_reason: string | null;
}

export const CreditHistorySchema = SchemaFactory.createForClass(CreditHistory);

// ─── Sub-document: CompellingNeed ─────────────────────────────────────────────

@Schema({ _id: false })
export class CompellingNeed {
  @Prop({ type: [String], enum: PowerProblemEnum, default: [] })
  power_problems: PowerProblemEnum[];

  @Prop({ type: [String], enum: ProductBenefitEnum, default: [] })
  product_benefits: ProductBenefitEnum[];
}

export const CompellingNeedSchema = SchemaFactory.createForClass(CompellingNeed);

// ─── Sub-document: BusinessVerification ──────────────────────────────────────

@Schema({ _id: false })
export class BusinessVerification {
  @Prop({ required: true, type: Boolean })
  is_business_owner: boolean;

  @Prop({ enum: BusinessTypeEnum, default: null })
  business_type: BusinessTypeEnum | null;

  @Prop({ enum: BusinessDurationEnum, default: null })
  business_duration: BusinessDurationEnum | null;

  @Prop({ enum: CustomerTrafficEnum, default: null })
  daily_customer_traffic: CustomerTrafficEnum | null;

  @Prop({ type: Boolean, default: null })
  has_power_equipment: boolean | null;

  @Prop({ type: Boolean, default: null })
  is_permanent_location: boolean | null;

  @Prop({ type: Number, default: null })
  hub_distance_km: number | null;
}

export const BusinessVerificationSchema =
  SchemaFactory.createForClass(BusinessVerification);

// ─── Root document: CustomerOnboarding ───────────────────────────────────────

export type CustomerOnboardingDocument = CustomerOnboarding & Document;

@Schema({ timestamps: true, collection: 'customer_onboardings' })
export class CustomerOnboarding {
  // ── Section 1: Customer Identification ──────────────────────────────────────
  @Prop({ required: true, trim: true })
  first_name: string;

  @Prop({ required: true, trim: true })
  last_name: string;

  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone_number: string;

  @Prop({ trim: true, default: null })
  whatsapp_number: string | null;

  @Prop({ trim: true, default: null })
  alternative_number: string | null;

  @Prop({ required: true, enum: UserGenderEnum })
  gender: UserGenderEnum;

  @Prop({ required: true })
  dob: Date;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ trim: true, default: null })
  business_address: string | null;

  @Prop({ required: true, trim: true })
  occupation: string;

  @Prop({ required: true, enum: IdTypeEnum })
  id_type: IdTypeEnum;

  @Prop({ required: true, trim: true })
  id_number: string;

  @Prop({ trim: true, default: null })
  profile_picture: string | null;

  // ── Section 2: Product Information ──────────────────────────────────────────
  @Prop({ type: ProductInfoSchema, required: true })
  product_info: ProductInfo;

  // ── Section 3: Income & Expenditure ─────────────────────────────────────────
  @Prop({ type: IncomeProfileSchema, required: true })
  income_profile: IncomeProfile;

  // ── Section 4: Credit History ────────────────────────────────────────────────
  @Prop({ type: CreditHistorySchema, required: true })
  credit_history: CreditHistory;

  // ── Section 5: Compelling Need ───────────────────────────────────────────────
  @Prop({ type: CompellingNeedSchema, required: true })
  compelling_need: CompellingNeed;

  // ── Section 6: Business Verification ─────────────────────────────────────────
  @Prop({ type: BusinessVerificationSchema, required: true })
  business_verification: BusinessVerification;

  // ── Section 7: Guarantors ─────────────────────────────────────────────────────
  @Prop({ type: [GuarantorSchema], required: true })
  guarantors: [Guarantor, Guarantor];

  // ── Section 8: Consent & Credentials ─────────────────────────────────────────
  @Prop({ required: true, type: Boolean })
  consent_agreed: boolean;

  @Prop({ required: true })
  password_hash: string;

  // ── Meta ──────────────────────────────────────────────────────────────────────
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  onboarding_agent_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Hub' })
  onboarding_hub_id: Types.ObjectId;

  @Prop({
    required: true,
    enum: DeviceUserOnboardingStatusEnum,
    default: DeviceUserOnboardingStatusEnum.PENDING,
  })
  status: DeviceUserOnboardingStatusEnum;

  // ── Timestamps (managed by { timestamps: true }) ──────────────────────────────
  createdAt: Date;
  updatedAt: Date;
}

export const CustomerOnboardingSchema =
  SchemaFactory.createForClass(CustomerOnboarding);

// ─── Indexes ──────────────────────────────────────────────────────────────────

CustomerOnboardingSchema.index({ email: 1 }, { unique: true });
CustomerOnboardingSchema.index({ phone_number: 1 });
CustomerOnboardingSchema.index({ status: 1 });
CustomerOnboardingSchema.index({ onboarding_agent_id: 1 });
CustomerOnboardingSchema.index({ onboarding_hub_id: 1 });
CustomerOnboardingSchema.index({ createdAt: -1 });

// =============================================================================
// DTOs  (flat wire format sent by the frontend)
// Install:  npm i class-validator class-transformer
// =============================================================================

// ─── Guarantor DTO ────────────────────────────────────────────────────────────

export class GuarantorDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  relationship: string;

  @IsString()
  address: string;

  @IsString()
  occupation: string;

  @IsEnum(IdTypeEnum)
  id_type: IdTypeEnum;

  @IsString()
  id_number: string;
}

// ─── Main onboarding DTO ──────────────────────────────────────────────────────

export class CreateCustomerOnboardingDto {
  // ── Section 1: Customer Identification ──────────────────────────────────────

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone_number: string;

  @IsOptional()
  @IsString()
  whatsapp_number?: string;

  @IsOptional()
  @IsString()
  alternative_number?: string;

  @IsEnum(UserGenderEnum)
  gender: UserGenderEnum;

  @IsDateString()
  dob: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  business_address?: string;

  @IsString()
  occupation: string;

  @IsEnum(IdTypeEnum)
  id_type: IdTypeEnum;

  @IsString()
  id_number: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;

  // ── Section 2: Product Information ──────────────────────────────────────────

  @IsEnum(DeviceTypeEnum)
  interested_device_type: DeviceTypeEnum;

  @IsString()
  interested_device_category_id: string;

  @IsString()
  interested_device_category_name: string;

  @IsEnum(DeviceCategoryPaymentOptionEnum)
  device_payment_option: DeviceCategoryPaymentOptionEnum;

  @IsOptional()
  @IsEnum(DeviceCategoryPaymentDurationOptionEnum)
  device_payment_duration?: DeviceCategoryPaymentDurationOptionEnum;

  @IsNumber()
  @Min(0)
  device_initialization_amount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  device_installment_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  device_installment_duration_months?: number;

  @IsEnum(DevicePaymentTimelineEnum)
  paymentTimeline: DevicePaymentTimelineEnum;

  @IsEnum(IntendedUseEnum)
  intended_use: IntendedUseEnum;

  @IsOptional()
  @IsString()
  intended_use_other?: string;

  // ── Section 3A: Income ───────────────────────────────────────────────────────

  @IsString()
  income_source: string;

  @IsNumber()
  @Min(0)
  daily_income: number;

  @IsNumber()
  @Min(0)
  weekly_income: number;

  @IsNumber()
  @Min(0)
  monthly_income: number;

  @IsNumber()
  @Min(0)
  monthly_expenses: number;

  @IsEnum(IncomeStabilityEnum)
  income_stability: IncomeStabilityEnum;

  // ── Section 3B: Expenditure & Liabilities ───────────────────────────────────

  @IsNumber()
  @Min(0)
  monthly_rent: number;

  @IsNumber()
  @Min(0)
  school_fees: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  loan_repayment_amount?: number;

  @IsOptional()
  @IsString()
  loan_repayment_lender?: string;

  @IsNumber()
  @Min(0)
  fuel_expenses: number;

  @IsNumber()
  @Min(0)
  electricity_bill: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  other_expenses?: number;

  // ── Section 4: Credit History ────────────────────────────────────────────────

  @IsBoolean()
  has_taken_loan: boolean;

  @IsOptional()
  @IsEnum(LoanTypeEnum)
  loan_type?: LoanTypeEnum;

  @IsOptional()
  @IsEnum(LoanStatusEnum)
  loan_status?: LoanStatusEnum;

  @IsBoolean()
  has_outstanding_debt: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  outstanding_debt_amount?: number;

  @IsBoolean()
  willing_to_provide_bank_statement: boolean;

  @IsOptional()
  @IsString()
  bank_statement_refusal_reason?: string;

  // ── Section 5: Compelling Need ───────────────────────────────────────────────

  @IsArray()
  @IsEnum(PowerProblemEnum, { each: true })
  power_problems: PowerProblemEnum[];

  @IsArray()
  @IsEnum(ProductBenefitEnum, { each: true })
  product_benefits: ProductBenefitEnum[];

  // ── Section 6: Business Verification ─────────────────────────────────────────

  @IsBoolean()
  is_business_owner: boolean;

  @IsOptional()
  @IsEnum(BusinessTypeEnum)
  business_type?: BusinessTypeEnum;

  @IsOptional()
  @IsEnum(BusinessDurationEnum)
  business_duration?: BusinessDurationEnum;

  @IsOptional()
  @IsEnum(CustomerTrafficEnum)
  daily_customer_traffic?: CustomerTrafficEnum;

  @IsOptional()
  @IsBoolean()
  has_power_equipment?: boolean;

  @IsOptional()
  @IsBoolean()
  is_permanent_location?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hub_distance_km?: number;

  // ── Section 7: Guarantors ─────────────────────────────────────────────────────

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => GuarantorDto)
  guarantors: [GuarantorDto, GuarantorDto];

  // ── Section 8: Consent & Credentials ─────────────────────────────────────────

  @IsBoolean()
  consent_agreed: boolean;

  @IsString()
  password: string;

  // ── Meta (from onboarding link) ───────────────────────────────────────────────

  @IsString()
  onboarding_agent_id: string;

  @IsString()
  onboarding_hub_id: string;
}
