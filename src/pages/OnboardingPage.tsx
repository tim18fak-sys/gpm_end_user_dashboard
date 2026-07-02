import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  CameraIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  CalendarDaysIcon,
  DevicePhoneMobileIcon,
  IdentificationIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { useCheckAgentExist, useCheckHubExist, useOnboarding } from '@/hooks/useOnboarding'
import { DeviceTypeEnum, DevicePaymentTimelineEnum } from '@/enum/device.enum'
import { UserGenderEnum } from '@/types/user.types'
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
} from '@/enum/kyc.enum'

// ─── Step config ──────────────────────────────────────────────────────────────

const STEP_META = [
  { label: 'Personal',    icon: UserIcon },
  { label: 'ID & Use',    icon: IdentificationIcon },
  { label: 'Income',      icon: BanknotesIcon },
  { label: 'Expenses',    icon: BanknotesIcon },
  { label: 'Credit',      icon: ClipboardDocumentCheckIcon },
  { label: 'Need & Biz',  icon: BoltIcon },
  { label: 'Guarantors',  icon: UserGroupIcon },
  { label: 'Finish',      icon: ShieldCheckIcon },
] as const

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
const TOTAL_STEPS = STEP_META.length

// ─── Label maps ───────────────────────────────────────────────────────────────

const idTypeLabels: Record<IdTypeEnum, string> = {
  [IdTypeEnum.NATIONAL_ID_NIN]: 'National ID (NIN)',
  [IdTypeEnum.VOTERS_CARD]: "Voter's Card",
  [IdTypeEnum.DRIVERS_LICENSE]: "Driver's License",
  [IdTypeEnum.INTERNATIONAL_PASSPORT]: 'Intl. Passport',
}

const intendedUseLabels: Record<IntendedUseEnum, string> = {
  [IntendedUseEnum.PHARMACY]: 'Pharmacy',
  [IntendedUseEnum.BEER_PARLOUR]: 'Beer Parlour',
  [IntendedUseEnum.FROZEN_FOODS]: 'Frozen Foods',
  [IntendedUseEnum.SOFT_DRINK_CHEMIST]: 'Soft Drink / Chemist',
  [IntendedUseEnum.RESTAURANT]: 'Restaurant',
  [IntendedUseEnum.MINI_MART]: 'Mini-mart',
  [IntendedUseEnum.HOME_USE]: 'Home Use',
  [IntendedUseEnum.OTHER]: 'Other',
}

const paymentTimelineLabels: Record<DevicePaymentTimelineEnum, string> = {
  [DevicePaymentTimelineEnum.OUTRIGHT]: 'Outright (Pay in full)',
  [DevicePaymentTimelineEnum.ONE_MONTH]: '1 Month', [DevicePaymentTimelineEnum.TWO_MONTH]: '2 Months',
  [DevicePaymentTimelineEnum.THREE_MONTH]: '3 Months', [DevicePaymentTimelineEnum.FOUR_MONTH]: '4 Months',
  [DevicePaymentTimelineEnum.FIVE_MONTH]: '5 Months', [DevicePaymentTimelineEnum.SIX_MONTH]: '6 Months',
  [DevicePaymentTimelineEnum.SEVEN_MONTH]: '7 Months', [DevicePaymentTimelineEnum.EIGHT_MONTH]: '8 Months',
  [DevicePaymentTimelineEnum.NINE_MONTH]: '9 Months', [DevicePaymentTimelineEnum.TEN_MONTH]: '10 Months',
  [DevicePaymentTimelineEnum.ELEVEN_MONTH]: '11 Months', [DevicePaymentTimelineEnum.TWELVE_MONTH]: '12 Months',
  [DevicePaymentTimelineEnum.THIRTEEN_MONTH]: '13 Months', [DevicePaymentTimelineEnum.FOURTEEN_MONTH]: '14 Months',
  [DevicePaymentTimelineEnum.FIFTEEN_MONTH]: '15 Months', [DevicePaymentTimelineEnum.SIXTEEN_MONTH]: '16 Months',
  [DevicePaymentTimelineEnum.SEVENTEEN_MONTH]: '17 Months', [DevicePaymentTimelineEnum.EIGHTEEN_MONTH]: '18 Months',
  [DevicePaymentTimelineEnum.NINETEEN_MONTH]: '19 Months', [DevicePaymentTimelineEnum.TWENTY_MONTH]: '20 Months',
  [DevicePaymentTimelineEnum.TWENTY_ONE_MONTH]: '21 Months', [DevicePaymentTimelineEnum.TWENTY_TWO_MONTH]: '22 Months',
  [DevicePaymentTimelineEnum.TWENTY_THREE_MONTH]: '23 Months', [DevicePaymentTimelineEnum.TWENTY_FOUR_MONTH]: '24 Months',
  [DevicePaymentTimelineEnum.TWENTY_FIVE_MONTH]: '25 Months', [DevicePaymentTimelineEnum.TWENTY_SIX_MONTH]: '26 Months',
  [DevicePaymentTimelineEnum.TWENTY_SEVEN_MONTH]: '27 Months', [DevicePaymentTimelineEnum.TWENTY_EIGHT_MONTH]: '28 Months',
  [DevicePaymentTimelineEnum.TWENTY_NINE_MONTH]: '29 Months', [DevicePaymentTimelineEnum.THIRTY_MONTH]: '30 Months',
  [DevicePaymentTimelineEnum.THIRTY_ONE_MONTH]: '31 Months', [DevicePaymentTimelineEnum.THIRTY_TWO_MONTH]: '32 Months',
  [DevicePaymentTimelineEnum.THIRTY_THREE_MONTH]: '33 Months', [DevicePaymentTimelineEnum.THIRTY_FOUR_MONTH]: '34 Months',
  [DevicePaymentTimelineEnum.THIRTY_FIVE_MONTH]: '35 Months', [DevicePaymentTimelineEnum.THIRTY_SIX_MONTH]: '36 Months',
}

const powerProblemLabels: Record<PowerProblemEnum, string> = {
  [PowerProblemEnum.HIGH_FUEL_EXPENSES]: 'High fuel expenses',
  [PowerProblemEnum.GENERATOR_BREAKDOWN]: 'Frequent generator breakdown',
  [PowerProblemEnum.LOSS_OF_CUSTOMERS]: 'Loss of customers',
  [PowerProblemEnum.FOOD_MEDICINE_SPOILAGE]: 'Food/medicine spoilage',
  [PowerProblemEnum.REDUCED_OPERATING_HOURS]: 'Reduced operating hours',
  [PowerProblemEnum.NOISE_AIR_POLLUTION]: 'Noise/air pollution',
  [PowerProblemEnum.UNRELIABLE_NEPA]: 'Unreliable NEPA supply',
  [PowerProblemEnum.HIGH_RUNNING_COST]: 'High running cost',
  [PowerProblemEnum.EXPAND_BUSINESS]: 'Wants to expand business',
  [PowerProblemEnum.OTHER]: 'Other',
}

const productBenefitLabels: Record<ProductBenefitEnum, string> = {
  [ProductBenefitEnum.INCREASE_SALES]: 'Increase sales',
  [ProductBenefitEnum.REDUCE_COSTS]: 'Reduce costs',
  [ProductBenefitEnum.IMPROVE_SERVICE]: 'Improve service delivery',
  [ProductBenefitEnum.EXTEND_HOURS]: 'Extend business hours',
  [ProductBenefitEnum.COLD_STORAGE]: 'Enable cold storage',
  [ProductBenefitEnum.NEW_INCOME_SOURCE]: 'New income source',
  [ProductBenefitEnum.OTHER]: 'Other',
}

// ─── Yup schemas (one per step) ───────────────────────────────────────────────

const boolRequired = (msg: string) =>
  Yup.mixed<boolean>()
    .nullable()
    .test('answered', msg, (v) => v === true || v === false)

const dobSchema = Yup.string()
  .required('Date of birth is required')
  .test('dob-future', 'Date of birth cannot be in the future', (v) => !v || new Date(v) < new Date())
  .test('dob-min-age', 'You must be at least 18 years old', (v) => {
    if (!v) return true
    const b = new Date(v)
    const t = new Date()
    const age = t.getFullYear() - b.getFullYear() -
      (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate()) ? 1 : 0)
    return age >= 18
  })
  .test('dob-max-age', 'Please enter a valid date of birth', (v) => !v || (new Date().getFullYear() - new Date(v).getFullYear() <= 120))

const stepSchemas: Yup.AnyObjectSchema[] = [
  // Step 0: Personal Info
  Yup.object({
    first_name: Yup.string().trim().required('First name is required'),
    last_name: Yup.string().trim().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone_number: Yup.string().matches(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number').required('Phone number is required'),
    gender: Yup.mixed<UserGenderEnum>().oneOf(Object.values(UserGenderEnum)).required('Gender is required'),
    dob: dobSchema,
    address: Yup.string().trim().min(5, 'Enter a full address').required('Home address is required'),
    occupation: Yup.string().trim().required('Occupation / business type is required'),
  }),
  // Step 1: ID + Product
  Yup.object({
    id_type: Yup.string().required('Please select your ID type'),
    id_number: Yup.string().trim().required('ID number is required'),
    interested_device_type: Yup.string().required('Please select a device type'),
    paymentTimeline: Yup.string().required('Please select a payment timeline'),
    intended_use: Yup.string().required('Please select intended use'),
  }),
  // Step 2: Income
  Yup.object({
    income_source: Yup.string().trim().required('Income source is required'),
    monthly_income: Yup.string().required('Monthly income is required'),
    income_stability: Yup.string().required('Please indicate income stability'),
  }),
  // Step 3: Expenses
  Yup.object({
    monthly_rent: Yup.string().required('Monthly rent is required'),
    fuel_expenses: Yup.string().required('Fuel/generator expenses are required'),
    electricity_bill: Yup.string().required('Electricity bill is required'),
  }),
  // Step 4: Credit History
  Yup.object({
    has_taken_loan: boolRequired('Please answer this question'),
    has_outstanding_debt: boolRequired('Please answer this question'),
    willing_to_provide_bank_statement: boolRequired('Please answer this question'),
  }),
  // Step 5: Power Need + Business
  Yup.object({
    power_problems: Yup.array().of(Yup.string()).min(1, 'Select at least one power problem'),
    product_benefits: Yup.array().of(Yup.string()).min(1, 'Select at least one benefit'),
    is_business_owner: boolRequired('Please indicate if you are a business owner'),
  }),
  // Step 6: Guarantors
  Yup.object({
    guarantor_1_name: Yup.string().trim().required('Name is required'),
    guarantor_1_phone: Yup.string().trim().required('Phone number is required'),
    guarantor_1_relationship: Yup.string().trim().required('Relationship is required'),
    guarantor_1_address: Yup.string().trim().required('Address is required'),
    guarantor_1_occupation: Yup.string().trim().required('Occupation is required'),
    guarantor_1_id_type: Yup.string().required('ID type is required'),
    guarantor_1_id_number: Yup.string().trim().required('ID number is required'),
    guarantor_2_name: Yup.string().trim().required('Name is required'),
    guarantor_2_phone: Yup.string().trim().required('Phone number is required'),
    guarantor_2_relationship: Yup.string().trim().required('Relationship is required'),
    guarantor_2_address: Yup.string().trim().required('Address is required'),
    guarantor_2_occupation: Yup.string().trim().required('Occupation is required'),
    guarantor_2_id_type: Yup.string().required('ID type is required'),
    guarantor_2_id_number: Yup.string().trim().required('ID number is required'),
  }),
  // Step 7: Finish (password + consent)
  Yup.object({
    password: Yup.string().min(8, 'At least 8 characters').required('Password is required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Please confirm your password'),
    consent_agreed: Yup.boolean()
      .oneOf([true], 'You must agree to the terms to continue')
      .required(),
  }),
]

// ─── Form types ───────────────────────────────────────────────────────────────

interface FormValues {
  // Step 0
  first_name: string; last_name: string; email: string; phone_number: string
  whatsapp_number: string; alternative_number: string
  gender: UserGenderEnum | ''; dob: string; address: string
  business_address: string; occupation: string
  // Step 1
  id_type: IdTypeEnum | ''; id_number: string; profile_picture: string
  interested_device_type: DeviceTypeEnum | ''; paymentTimeline: DevicePaymentTimelineEnum | ''
  intended_use: IntendedUseEnum | ''; intended_use_other: string
  // Step 2
  income_source: string; daily_income: string; weekly_income: string
  monthly_income: string; monthly_expenses: string; income_stability: IncomeStabilityEnum | ''
  // Step 3
  monthly_rent: string; school_fees: string
  loan_repayment_amount: string; loan_repayment_lender: string
  fuel_expenses: string; electricity_bill: string; other_expenses: string
  // Step 4
  has_taken_loan: boolean | null; loan_type: LoanTypeEnum | ''; loan_status: LoanStatusEnum | ''
  has_outstanding_debt: boolean | null; outstanding_debt_amount: string
  willing_to_provide_bank_statement: boolean | null; bank_statement_refusal_reason: string
  // Step 5
  power_problems: PowerProblemEnum[]; product_benefits: ProductBenefitEnum[]
  is_business_owner: boolean | null; business_type: BusinessTypeEnum | ''
  business_duration: BusinessDurationEnum | ''; daily_customer_traffic: CustomerTrafficEnum | ''
  has_power_equipment: boolean | null; is_permanent_location: boolean | null; hub_distance_km: string
  // Step 6
  guarantor_1_name: string; guarantor_1_phone: string; guarantor_1_relationship: string
  guarantor_1_address: string; guarantor_1_occupation: string
  guarantor_1_id_type: IdTypeEnum | ''; guarantor_1_id_number: string
  guarantor_2_name: string; guarantor_2_phone: string; guarantor_2_relationship: string
  guarantor_2_address: string; guarantor_2_occupation: string
  guarantor_2_id_type: IdTypeEnum | ''; guarantor_2_id_number: string
  // Step 7
  password: string; confirm_password: string; consent_agreed: boolean
}

// ─── Shared UI tokens ────────────────────────────────────────────────────────

const inputClass =
  'mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm shadow-sm'
const labelClass = 'block text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide'
const errorClass = 'mt-1 text-xs text-danger-500'
const sectionTitle = 'text-xs font-bold text-secondary-400 dark:text-secondary-500 uppercase tracking-wider flex items-center gap-1.5 mb-3'

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex-1 h-px bg-secondary-200 dark:bg-secondary-600" />
      <span className="text-[10px] font-semibold text-secondary-400 dark:text-secondary-500 uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-secondary-200 dark:bg-secondary-600" />
    </div>
  )
}

function AmountInput({ name, placeholder = '0' }: { name: string; placeholder?: string }) {
  return (
    <div className="relative mt-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-secondary-400 pointer-events-none select-none">
        ₦
      </span>
      <Field name={name} type="number" min="0" placeholder={placeholder} className={`${inputClass} !mt-0 pl-7`} />
    </div>
  )
}

function YesNo({
  value,
  onChange,
}: {
  value: boolean | null
  onChange: (v: boolean) => void
}) {
  const base = 'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all duration-150'
  const active = 'bg-primary-600 border-primary-600 text-white shadow-sm'
  const inactive = 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:border-primary-400'
  return (
    <div className="mt-1.5 flex gap-2">
      <button type="button" onClick={() => onChange(true)} className={`${base} ${value === true ? active : inactive}`}>Yes</button>
      <button type="button" onClick={() => onChange(false)} className={`${base} ${value === false ? active : inactive}`}>No</button>
    </div>
  )
}

// ─── Link validation states ───────────────────────────────────────────────────

type LinkValidationState = 'loading' | 'valid' | 'invalid'

// ─── Page ─────────────────────────────────────────────────────────────────────

function OnboardingPage() {
  const [linkValidation, setLinkValidation] = useState<LinkValidationState>('loading')
  const [invalidReason, setInvalidReason] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [step, setStep] = useState<StepIndex>(0)
  const [direction, setDirection] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mutate: onboard } = useOnboarding()
  const { mutateAsync: checkHub } = useCheckHubExist()
  const { mutateAsync: checkAgent } = useCheckAgentExist()
  const agentId = searchParams.get('agentId') ?? ''
  const hubId = searchParams.get('hubId') ?? ''

  useEffect(() => {
    if (!agentId || !hubId) {
      setInvalidReason('This onboarding link is missing required information. Please request a new link from your agent.')
      setLinkValidation('invalid')
      return
    }
    const validate = async () => {
      try {
        const [hubResult, agentResult] = await Promise.all([checkHub(hubId), checkAgent(agentId)])
        if (!hubResult.isValid) { setInvalidReason(hubResult.message || 'The hub could not be found.'); setLinkValidation('invalid'); return }
        if (!agentResult.status) { setInvalidReason('The agent could not be verified. Please request a new link.'); setLinkValidation('invalid'); return }
        setLinkValidation('valid')
      } catch {
        setInvalidReason('We were unable to verify this link. Check your connection and try again.')
        setLinkValidation('invalid')
      }
    }
    validate()
  }, [agentId, hubId])

  const initialValues: FormValues = {
    first_name: '', last_name: '', email: '', phone_number: '',
    whatsapp_number: '', alternative_number: '',
    gender: '', dob: '', address: '', business_address: '', occupation: '',
    id_type: '', id_number: '', profile_picture: '',
    interested_device_type: '', paymentTimeline: '',
    intended_use: '', intended_use_other: '',
    income_source: '', daily_income: '', weekly_income: '',
    monthly_income: '', monthly_expenses: '', income_stability: '',
    monthly_rent: '', school_fees: '',
    loan_repayment_amount: '', loan_repayment_lender: '',
    fuel_expenses: '', electricity_bill: '', other_expenses: '',
    has_taken_loan: null, loan_type: '', loan_status: '',
    has_outstanding_debt: null, outstanding_debt_amount: '',
    willing_to_provide_bank_statement: null, bank_statement_refusal_reason: '',
    power_problems: [], product_benefits: [],
    is_business_owner: null, business_type: '',
    business_duration: '', daily_customer_traffic: '',
    has_power_equipment: null, is_permanent_location: null, hub_distance_km: '',
    guarantor_1_name: '', guarantor_1_phone: '', guarantor_1_relationship: '',
    guarantor_1_address: '', guarantor_1_occupation: '',
    guarantor_1_id_type: '', guarantor_1_id_number: '',
    guarantor_2_name: '', guarantor_2_phone: '', guarantor_2_relationship: '',
    guarantor_2_address: '', guarantor_2_occupation: '',
    guarantor_2_id_type: '', guarantor_2_id_number: '',
    password: '', confirm_password: '', consent_agreed: false,
  }

  const handleNext = async (
    values: FormValues,
    helpers: Pick<FormikHelpers<FormValues>, 'validateForm' | 'setTouched'>
  ) => {
    const isOutright = values.paymentTimeline === DevicePaymentTimelineEnum.OUTRIGHT

    // Step field map — step 1 skips ID fields for outright buyers
    const stepFields: Record<StepIndex, (keyof FormValues)[]> = {
      0: ['first_name', 'last_name', 'email', 'phone_number', 'gender', 'dob', 'address', 'occupation'],
      1: isOutright
        ? ['interested_device_type', 'paymentTimeline', 'intended_use']
        : ['id_type', 'id_number', 'interested_device_type', 'paymentTimeline', 'intended_use'],
      2: ['income_source', 'monthly_income', 'income_stability'],
      3: ['monthly_rent', 'fuel_expenses', 'electricity_bill'],
      4: ['has_taken_loan', 'has_outstanding_debt', 'willing_to_provide_bank_statement'],
      5: ['power_problems', 'product_benefits', 'is_business_owner'],
      6: [
        'guarantor_1_name', 'guarantor_1_phone', 'guarantor_1_relationship',
        'guarantor_1_address', 'guarantor_1_occupation', 'guarantor_1_id_type', 'guarantor_1_id_number',
        'guarantor_2_name', 'guarantor_2_phone', 'guarantor_2_relationship',
        'guarantor_2_address', 'guarantor_2_occupation', 'guarantor_2_id_type', 'guarantor_2_id_number',
      ],
      7: ['password', 'confirm_password', 'consent_agreed'],
    }

    const errors = await helpers.validateForm()
    const current = stepFields[step]
    const bad = current.filter((f) => errors[f])
    if (bad.length > 0) {
      helpers.setTouched(bad.reduce((acc, f) => ({ ...acc, [f]: true }), {}))
      return
    }

    // Extra conditional validation
    if (step === 1 && values.intended_use === IntendedUseEnum.OTHER && !values.intended_use_other.trim()) {
      toast.error('Please describe your intended use')
      return
    }
    if (step === 4) {
      if (values.has_taken_loan === true) {
        if (!values.loan_type) { toast.error('Please select the type of loan'); return }
        if (!values.loan_status) { toast.error('Please select your loan status'); return }
      }
      if (values.has_outstanding_debt === true && !values.outstanding_debt_amount) {
        toast.error('Please enter the outstanding debt amount'); return
      }
      if (values.willing_to_provide_bank_statement === false && !values.bank_statement_refusal_reason.trim()) {
        toast.error('Please explain why you cannot provide bank statements'); return
      }
    }
    if (step === 5 && values.is_business_owner === true) {
      const missing: string[] = []
      if (!values.business_type) missing.push('Business type')
      if (!values.business_duration) missing.push('Operating duration')
      if (!values.daily_customer_traffic) missing.push('Daily customer traffic')
      if (values.has_power_equipment === null) missing.push('Equipment status')
      if (values.is_permanent_location === null) missing.push('Location permanence')
      if (missing.length > 0) { toast.error(`Please complete: ${missing.join(', ')}`); return }
    }

    // Outright buyers jump from step 1 directly to step 7
    if (step === 1 && isOutright) {
      setDirection(1)
      setStep(7)
      return
    }

    setDirection(1)
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1) as StepIndex)
  }

  const handleBack = (paymentTimeline?: string) => {
    setDirection(-1)
    // Outright buyers go back from step 7 to step 1 (skipping steps 2–6)
    if (step === 7 && paymentTimeline === DevicePaymentTimelineEnum.OUTRIGHT) {
      setStep(1)
      return
    }
    setStep((s) => Math.max(s - 1, 0) as StepIndex)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, set: (f: string, v: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    const reader = new FileReader()
    reader.onloadend = () => {
      const b64 = reader.result as string
      setAvatarPreview(b64)
      set('profile_picture', b64)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (values: FormValues) => {
    setIsPending(true)
    onboard(
      {
        first_name: values.first_name, last_name: values.last_name,
        email: values.email, phone_number: values.phone_number,
        whatsapp_number: values.whatsapp_number || undefined,
        alternative_number: values.alternative_number || undefined,
        gender: values.gender as UserGenderEnum, dob: values.dob,
        address: values.address,
        business_address: values.business_address || undefined,
        occupation: values.occupation,
        id_type: values.id_type as any, id_number: values.id_number,
        profile_picture: values.profile_picture || undefined,
        interested_device_type: values.interested_device_type as DeviceTypeEnum,
        paymentTimeline: values.paymentTimeline as DevicePaymentTimelineEnum,
        intended_use: values.intended_use as any,
        intended_use_other: values.intended_use === IntendedUseEnum.OTHER ? values.intended_use_other : undefined,
        income_source: values.income_source,
        daily_income: parseFloat(values.daily_income) || 0,
        weekly_income: parseFloat(values.weekly_income) || 0,
        monthly_income: parseFloat(values.monthly_income) || 0,
        monthly_expenses: parseFloat(values.monthly_expenses) || 0,
        income_stability: values.income_stability as any,
        monthly_rent: parseFloat(values.monthly_rent) || 0,
        school_fees: parseFloat(values.school_fees) || 0,
        loan_repayment_amount: values.loan_repayment_amount ? parseFloat(values.loan_repayment_amount) : undefined,
        loan_repayment_lender: values.loan_repayment_lender || undefined,
        fuel_expenses: parseFloat(values.fuel_expenses) || 0,
        electricity_bill: parseFloat(values.electricity_bill) || 0,
        other_expenses: values.other_expenses ? parseFloat(values.other_expenses) : undefined,
        has_taken_loan: values.has_taken_loan as boolean,
        loan_type: values.has_taken_loan ? (values.loan_type as any) : undefined,
        loan_status: values.has_taken_loan ? (values.loan_status as any) : undefined,
        has_outstanding_debt: values.has_outstanding_debt as boolean,
        outstanding_debt_amount: values.has_outstanding_debt && values.outstanding_debt_amount
          ? parseFloat(values.outstanding_debt_amount) : undefined,
        willing_to_provide_bank_statement: values.willing_to_provide_bank_statement as boolean,
        bank_statement_refusal_reason: !values.willing_to_provide_bank_statement
          ? values.bank_statement_refusal_reason || undefined : undefined,
        power_problems: values.power_problems,
        product_benefits: values.product_benefits,
        is_business_owner: values.is_business_owner as boolean,
        ...(values.is_business_owner ? {
          business_type: values.business_type as any,
          business_duration: values.business_duration as any,
          daily_customer_traffic: values.daily_customer_traffic as any,
          has_power_equipment: values.has_power_equipment as boolean,
          is_permanent_location: values.is_permanent_location as boolean,
          hub_distance_km: values.hub_distance_km ? parseFloat(values.hub_distance_km) : undefined,
        } : {}),
        guarantors: [
          {
            name: values.guarantor_1_name,
            phone: values.guarantor_1_phone,
            relationship: values.guarantor_1_relationship,
            address: values.guarantor_1_address,
            occupation: values.guarantor_1_occupation,
            id_type: values.guarantor_1_id_type as any,
            id_number: values.guarantor_1_id_number,
          },
          {
            name: values.guarantor_2_name,
            phone: values.guarantor_2_phone,
            relationship: values.guarantor_2_relationship,
            address: values.guarantor_2_address,
            occupation: values.guarantor_2_occupation,
            id_type: values.guarantor_2_id_type as any,
            id_number: values.guarantor_2_id_number,
          },
        ],
        consent_agreed: values.consent_agreed,
        password: values.password,
        onboarding_agent_id: agentId,
        onboarding_hub_id: hubId,
      },
      {
        onSuccess: () => { setIsPending(false); setSuccess(true) },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Submission failed. Please try again.')
          setIsPending(false)
        },
      }
    )
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? '60%' : '-60%', opacity: 0 }),
  }

  const pageWrapper = (children: React.ReactNode) => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-primary-900 p-4">
      {children}
    </div>
  )

  // ── Link loading / invalid ──
  if (linkValidation === 'loading') {
    return pageWrapper(
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
        className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 animate-spin mx-auto mb-5" />
        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Verifying your onboarding link…</p>
        <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">This only takes a moment.</p>
      </motion.div>
    )
  }

  if (linkValidation === 'invalid') {
    return pageWrapper(
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-danger-50 dark:bg-danger-900/20 border-2 border-danger-200 dark:border-danger-800 flex items-center justify-center mx-auto mb-5">
          <ExclamationTriangleIcon className="w-8 h-8 text-danger-500" />
        </div>
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">Invalid Onboarding Link</h2>
        <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed mb-8">{invalidReason}</p>
        <button onClick={() => navigate('/login')}
          className="w-full py-2.5 px-4 rounded-lg border border-secondary-300 dark:border-secondary-600 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
          Go to Sign In
        </button>
      </motion.div>
    )
  }

  // ── Success ──
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-primary-900 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-success-50 dark:bg-success-900/20 border-2 border-success-200 dark:border-success-700 flex items-center justify-center mx-auto mb-5">
            <CheckCircleIcon className="w-10 h-10 text-success-500" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Application Submitted!</h2>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed mb-8">
            Your KYC application has been received. You can now sign in and track your application status.
          </p>
          <button onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors">
            Sign in to your account <ArrowRightIcon className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    )
  }

  // ── Main form ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-primary-900 py-8 px-4">
      <div className="max-w-lg w-full mx-auto">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-secondary-100 dark:border-secondary-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 flex items-center justify-center flex-shrink-0">
                <BoltIcon className="w-5 h-5 text-warning-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-secondary-900 dark:text-white leading-tight">
                  Solar Financing Application
                </h2>
                <p className="text-xs text-secondary-400 dark:text-secondary-500">
                  Step {step + 1} of {TOTAL_STEPS} — {STEP_META[step].label}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex gap-1">
              {STEP_META.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                    i <= step ? 'bg-primary-500' : 'bg-secondary-200 dark:bg-secondary-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={stepSchemas[step]}
            onSubmit={handleSubmit}
            validateOnBlur
            validateOnChange={false}
          >
            {({ values, validateForm, setTouched, setFieldValue }) => (
              <Form>
                {/* Scrollable step content */}
                <div className="px-6 pt-5 pb-2 overflow-y-auto max-h-[60vh]">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: 'spring', stiffness: 300, damping: 28, opacity: { duration: 0.15 } }}
                    >

                      {/* ═══════════════════════════════════════════════════════
                          STEP 0 — Personal Info (Section 1 core)
                      ═══════════════════════════════════════════════════════ */}
                      {step === 0 && (
                        <div className="space-y-4 pb-4">
                          <p className={sectionTitle}>Section 1 — Customer Identification</p>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label htmlFor="first_name" className={labelClass}>First Name</label>
                              <Field id="first_name" name="first_name" type="text" placeholder="John" className={inputClass} />
                              <ErrorMessage name="first_name" component="div" className={errorClass} />
                            </div>
                            <div>
                              <label htmlFor="last_name" className={labelClass}>Last Name</label>
                              <Field id="last_name" name="last_name" type="text" placeholder="Doe" className={inputClass} />
                              <ErrorMessage name="last_name" component="div" className={errorClass} />
                            </div>
                          </div>

                          <div>
                            <label className={labelClass}>Gender</label>
                            <div className="mt-1.5 grid grid-cols-2 gap-2">
                              {Object.values(UserGenderEnum).map((g) => (
                                <button key={g} type="button" onClick={() => setFieldValue('gender', g)}
                                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                                    values.gender === g
                                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:border-primary-400'
                                  }`}>
                                  {g.charAt(0).toUpperCase() + g.slice(1)}
                                </button>
                              ))}
                            </div>
                            <ErrorMessage name="gender" component="div" className={errorClass} />
                          </div>

                          <div>
                            <label htmlFor="dob" className={labelClass}>Date of Birth</label>
                            <div className="relative mt-1">
                              <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                              <Field id="dob" name="dob" type="date"
                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                className={`${inputClass} !mt-0 pl-9`} />
                            </div>
                            <ErrorMessage name="dob" component="div" className={errorClass} />
                          </div>

                          <div>
                            <label htmlFor="occupation" className={labelClass}>Occupation / Business Type</label>
                            <Field id="occupation" name="occupation" type="text" placeholder="e.g. Trader, Pharmacist, Civil Servant" className={inputClass} />
                            <ErrorMessage name="occupation" component="div" className={errorClass} />
                          </div>

                          <div>
                            <label htmlFor="address" className={labelClass}>Home Address</label>
                            <div className="relative mt-1">
                              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                              <Field id="address" name="address" type="text" placeholder="3A, 2nd Avenue, Gwarinpa, Abuja" className={`${inputClass} !mt-0 pl-9`} />
                            </div>
                            <ErrorMessage name="address" component="div" className={errorClass} />
                          </div>

                          <div>
                            <label htmlFor="business_address" className={labelClass}>
                              Business Address <span className="normal-case font-normal text-secondary-400">(optional)</span>
                            </label>
                            <div className="relative mt-1">
                              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                              <Field id="business_address" name="business_address" type="text" placeholder="Business location" className={`${inputClass} !mt-0 pl-9`} />
                            </div>
                          </div>

                          <SectionDivider label="Contact Details" />

                          <div>
                            <label htmlFor="phone_number" className={labelClass}>Phone Number</label>
                            <div className="relative mt-1">
                              <DevicePhoneMobileIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                              <Field id="phone_number" name="phone_number" type="tel" placeholder="+2348012345678" className={`${inputClass} !mt-0 pl-9`} />
                            </div>
                            <ErrorMessage name="phone_number" component="div" className={errorClass} />
                          </div>

                          <div>
                            <label htmlFor="email" className={labelClass}>Email Address</label>
                            <Field id="email" name="email" type="email" placeholder="john@example.com" className={inputClass} />
                            <ErrorMessage name="email" component="div" className={errorClass} />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label htmlFor="whatsapp_number" className={labelClass}>
                                WhatsApp <span className="normal-case font-normal text-secondary-400">(opt.)</span>
                              </label>
                              <div className="relative mt-1">
                                <DevicePhoneMobileIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                                <Field id="whatsapp_number" name="whatsapp_number" type="tel" placeholder="+2348..." className={`${inputClass} !mt-0 pl-9`} />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="alternative_number" className={labelClass}>
                                Alt. Number <span className="normal-case font-normal text-secondary-400">(opt.)</span>
                              </label>
                              <div className="relative mt-1">
                                <DevicePhoneMobileIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                                <Field id="alternative_number" name="alternative_number" type="tel" placeholder="+2348..." className={`${inputClass} !mt-0 pl-9`} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══════════════════════════════════════════════════════
                          STEP 1 — ID Documents + Product (Sections 1 ID + 2)
                      ═══════════════════════════════════════════════════════ */}
                      {step === 1 && (
                        <div className="space-y-4 pb-4">

                          {/* Product selection always shown first */}
                          <p className={sectionTitle}>Section 2 — Product Information</p>

                          <div>
                            <label className={labelClass}>Device Type</label>
                            <div className="mt-1.5 grid grid-cols-2 gap-2">
                              {Object.values(DeviceTypeEnum).map((t) => (
                                <button key={t} type="button" onClick={() => setFieldValue('interested_device_type', t)}
                                  className={`py-2.5 px-3 rounded-lg border text-xs font-semibold text-left transition-all ${
                                    values.interested_device_type === t
                                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:border-primary-400'
                                  }`}>
                                  {t}
                                </button>
                              ))}
                            </div>
                            <ErrorMessage name="interested_device_type" component="div" className={errorClass} />
                          </div>

                          <div>
                            <label htmlFor="paymentTimeline" className={labelClass}>Payment Timeline</label>
                            <Field as="select" id="paymentTimeline" name="paymentTimeline" className={inputClass}>
                              <option value="">Select payment timeline</option>
                              {Object.values(DevicePaymentTimelineEnum).map((t) => (
                                <option key={t} value={t}>{paymentTimelineLabels[t]}</option>
                              ))}
                            </Field>
                            <ErrorMessage name="paymentTimeline" component="div" className={errorClass} />
                          </div>

                          <div>
                            <label className={labelClass}>Intended Use</label>
                            <div className="mt-1.5 grid grid-cols-2 gap-2">
                              {Object.values(IntendedUseEnum).map((u) => (
                                <button key={u} type="button" onClick={() => setFieldValue('intended_use', u)}
                                  className={`py-2 px-3 rounded-lg border text-xs font-semibold text-left transition-all ${
                                    values.intended_use === u
                                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:border-primary-400'
                                  }`}>
                                  {intendedUseLabels[u]}
                                </button>
                              ))}
                            </div>
                            <ErrorMessage name="intended_use" component="div" className={errorClass} />
                          </div>

                          {values.intended_use === IntendedUseEnum.OTHER && (
                            <div>
                              <label htmlFor="intended_use_other" className={labelClass}>Please describe</label>
                              <Field id="intended_use_other" name="intended_use_other" type="text" placeholder="Describe your intended use" className={inputClass} />
                            </div>
                          )}

                          {/* Outright banner — skip KYC steps */}
                          {values.paymentTimeline === DevicePaymentTimelineEnum.OUTRIGHT && (
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                              <CheckCircleIcon className="w-4 h-4 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-success-700 dark:text-success-400 leading-relaxed">
                                <span className="font-semibold">Outright purchase selected.</span> No financial assessment or guarantors needed — tap Next to set up your account.
                              </p>
                            </div>
                          )}

                          {/* ID section — only for non-outright buyers */}
                          {values.paymentTimeline !== DevicePaymentTimelineEnum.OUTRIGHT && values.paymentTimeline !== '' && (
                            <>
                              <SectionDivider label="Section 1 — Valid ID" />

                              <div>
                                <label className={labelClass}>ID Type</label>
                                <div className="mt-1.5 grid grid-cols-2 gap-2">
                                  {Object.values(IdTypeEnum).map((t) => (
                                    <button key={t} type="button" onClick={() => setFieldValue('id_type', t)}
                                      className={`py-2 px-3 rounded-lg border text-xs font-semibold text-left transition-all ${
                                        values.id_type === t
                                          ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                          : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:border-primary-400'
                                      }`}>
                                      {idTypeLabels[t]}
                                    </button>
                                  ))}
                                </div>
                                <ErrorMessage name="id_type" component="div" className={errorClass} />
                              </div>

                              <div>
                                <label htmlFor="id_number" className={labelClass}>ID Number</label>
                                <div className="relative mt-1">
                                  <IdentificationIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                                  <Field id="id_number" name="id_number" type="text" placeholder="Enter your ID number" className={`${inputClass} !mt-0 pl-9`} />
                                </div>
                                <ErrorMessage name="id_number" component="div" className={errorClass} />
                              </div>

                              <div>
                                <label className={labelClass}>
                                  Passport Photograph <span className="normal-case font-normal text-secondary-400">(optional)</span>
                                </label>
                                <div className="mt-2 flex items-center gap-4">
                                  <div
                                    className="relative w-16 h-16 rounded-xl border-2 border-dashed border-secondary-300 dark:border-secondary-600 overflow-hidden cursor-pointer hover:border-primary-400 transition-colors bg-secondary-50 dark:bg-secondary-700 flex items-center justify-center flex-shrink-0"
                                    onClick={() => fileInputRef.current?.click()}>
                                    {avatarPreview
                                      ? <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                      : <UserIcon className="w-7 h-7 text-secondary-400" />}
                                    <div className="absolute bottom-0 inset-x-0 bg-black/40 flex items-center justify-center py-1">
                                      <CameraIcon className="w-3 h-3 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-secondary-700 dark:text-secondary-300">Passport photo</p>
                                    <p className="text-[11px] text-secondary-400 mt-0.5">JPG, PNG or WebP · max 5MB</p>
                                    <button type="button" onClick={() => fileInputRef.current?.click()}
                                      className="mt-1.5 text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline">
                                      {avatarPreview ? 'Change photo' : 'Upload photo'}
                                    </button>
                                  </div>
                                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                                    onChange={(e) => handleImageChange(e, setFieldValue)} />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* ═══════════════════════════════════════════════════════
                          STEP 2 — Income (Section 3A)
                      ═══════════════════════════════════════════════════════ */}
                      {step === 2 && (
                        <div className="space-y-4 pb-4">
                          <p className={sectionTitle}>Section 3A — Income & Sales</p>

                          <div>
                            <label htmlFor="income_source" className={labelClass}>Income Source</label>
                            <Field id="income_source" name="income_source" type="text" placeholder="e.g. Shop sales, salary, farming" className={inputClass} />
                            <ErrorMessage name="income_source" component="div" className={errorClass} />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>Daily Income</label>
                              <AmountInput name="daily_income" />
                            </div>
                            <div>
                              <label className={labelClass}>Weekly Income</label>
                              <AmountInput name="weekly_income" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>Monthly Income</label>
                              <AmountInput name="monthly_income" />
                              <ErrorMessage name="monthly_income" component="div" className={errorClass} />
                            </div>
                            <div>
                              <label className={labelClass}>Monthly Expenses</label>
                              <AmountInput name="monthly_expenses" />
                            </div>
                          </div>

                          <div>
                            <label className={labelClass}>Income Stability</label>
                            <div className="mt-1.5 grid grid-cols-2 gap-2">
                              {[
                                { v: IncomeStabilityEnum.VERY_STABLE, l: 'Very Stable' },
                                { v: IncomeStabilityEnum.FAIRLY_STABLE, l: 'Fairly Stable' },
                                { v: IncomeStabilityEnum.SEASONAL, l: 'Seasonal' },
                                { v: IncomeStabilityEnum.UNSTABLE, l: 'Unstable' },
                              ].map(({ v, l }) => (
                                <button key={v} type="button" onClick={() => setFieldValue('income_stability', v)}
                                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                                    values.income_stability === v
                                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:border-primary-400'
                                  }`}>
                                  {l}
                                </button>
                              ))}
                            </div>
                            <ErrorMessage name="income_stability" component="div" className={errorClass} />
                          </div>
                        </div>
                      )}

                      {/* ═══════════════════════════════════════════════════════
                          STEP 3 — Expenditure (Section 3B)
                      ═══════════════════════════════════════════════════════ */}
                      {step === 3 && (
                        <div className="space-y-4 pb-4">
                          <p className={sectionTitle}>Section 3B — Expenditure & Liabilities</p>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>Monthly Rent</label>
                              <AmountInput name="monthly_rent" />
                              <ErrorMessage name="monthly_rent" component="div" className={errorClass} />
                            </div>
                            <div>
                              <label className={labelClass}>School Fees</label>
                              <AmountInput name="school_fees" />
                            </div>
                          </div>

                          <SectionDivider label="Loan Repayments (if any)" />

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>Amount / Month</label>
                              <AmountInput name="loan_repayment_amount" />
                            </div>
                            <div>
                              <label htmlFor="loan_repayment_lender" className={labelClass}>Lender</label>
                              <Field id="loan_repayment_lender" name="loan_repayment_lender" type="text" placeholder="Bank / MFI name" className={inputClass} />
                            </div>
                          </div>

                          <SectionDivider label="Utilities" />

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>Fuel / Generator</label>
                              <AmountInput name="fuel_expenses" />
                              <ErrorMessage name="fuel_expenses" component="div" className={errorClass} />
                            </div>
                            <div>
                              <label className={labelClass}>Electricity Bill</label>
                              <AmountInput name="electricity_bill" />
                              <ErrorMessage name="electricity_bill" component="div" className={errorClass} />
                            </div>
                          </div>

                          <div>
                            <label className={labelClass}>
                              Other Monthly Expenses <span className="normal-case font-normal text-secondary-400">(optional)</span>
                            </label>
                            <AmountInput name="other_expenses" />
                          </div>
                        </div>
                      )}

                      {/* ═══════════════════════════════════════════════════════
                          STEP 4 — Credit History (Section 4)
                      ═══════════════════════════════════════════════════════ */}
                      {step === 4 && (
                        <div className="space-y-5 pb-4">
                          <p className={sectionTitle}>Section 4 — Credit History & Behaviour</p>

                          <div>
                            <label className={labelClass}>Have you ever taken a loan?</label>
                            <YesNo value={values.has_taken_loan} onChange={(v) => {
                              setFieldValue('has_taken_loan', v)
                              if (!v) { setFieldValue('loan_type', ''); setFieldValue('loan_status', '') }
                            }} />
                            <ErrorMessage name="has_taken_loan" component="div" className={errorClass} />
                          </div>

                          {values.has_taken_loan === true && (
                            <div className="space-y-3 pl-2 border-l-2 border-primary-200 dark:border-primary-800">
                              <div>
                                <label className={labelClass}>Loan Type</label>
                                <div className="mt-1.5 flex flex-wrap gap-2">
                                  {[
                                    { v: LoanTypeEnum.BANK, l: 'Bank' },
                                    { v: LoanTypeEnum.MFI, l: 'MFI' },
                                    { v: LoanTypeEnum.COOPERATIVE, l: 'Cooperative' },
                                    { v: LoanTypeEnum.ONLINE_APP, l: 'Online App' },
                                    { v: LoanTypeEnum.FAMILY_FRIENDS, l: 'Family / Friends' },
                                  ].map(({ v, l }) => (
                                    <button key={v} type="button" onClick={() => setFieldValue('loan_type', v)}
                                      className={`py-1.5 px-3 rounded-full border text-xs font-semibold transition-all ${
                                        values.loan_type === v
                                          ? 'bg-primary-600 border-primary-600 text-white'
                                          : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400'
                                      }`}>
                                      {l}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className={labelClass}>Loan Status</label>
                                <div className="mt-1.5 flex flex-wrap gap-2">
                                  {[
                                    { v: LoanStatusEnum.FULLY_REPAID, l: 'Fully Repaid' },
                                    { v: LoanStatusEnum.CURRENTLY_PAYING, l: 'Currently Paying' },
                                    { v: LoanStatusEnum.DEFAULTED, l: 'Defaulted' },
                                    { v: LoanStatusEnum.RESTRUCTURED, l: 'Restructured' },
                                  ].map(({ v, l }) => (
                                    <button key={v} type="button" onClick={() => setFieldValue('loan_status', v)}
                                      className={`py-1.5 px-3 rounded-full border text-xs font-semibold transition-all ${
                                        values.loan_status === v
                                          ? 'bg-primary-600 border-primary-600 text-white'
                                          : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400'
                                      }`}>
                                      {l}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <div>
                            <label className={labelClass}>Do you have outstanding debts?</label>
                            <YesNo value={values.has_outstanding_debt} onChange={(v) => {
                              setFieldValue('has_outstanding_debt', v)
                              if (!v) setFieldValue('outstanding_debt_amount', '')
                            }} />
                            <ErrorMessage name="has_outstanding_debt" component="div" className={errorClass} />
                          </div>

                          {values.has_outstanding_debt === true && (
                            <div className="pl-2 border-l-2 border-primary-200 dark:border-primary-800">
                              <label className={labelClass}>Total Outstanding Amount</label>
                              <AmountInput name="outstanding_debt_amount" />
                            </div>
                          )}

                          <div>
                            <label className={labelClass}>Willing to provide 6-month bank statement?</label>
                            <YesNo value={values.willing_to_provide_bank_statement} onChange={(v) => {
                              setFieldValue('willing_to_provide_bank_statement', v)
                              if (v) setFieldValue('bank_statement_refusal_reason', '')
                            }} />
                            <ErrorMessage name="willing_to_provide_bank_statement" component="div" className={errorClass} />
                          </div>

                          {values.willing_to_provide_bank_statement === false && (
                            <div className="pl-2 border-l-2 border-warning-300 dark:border-warning-700">
                              <label htmlFor="bank_statement_refusal_reason" className={labelClass}>Reason</label>
                              <Field id="bank_statement_refusal_reason" name="bank_statement_refusal_reason"
                                as="textarea" rows={2} placeholder="Please explain why…"
                                className={`${inputClass} resize-none`} />
                            </div>
                          )}
                        </div>
                      )}

                      {/* ═══════════════════════════════════════════════════════
                          STEP 5 — Compelling Need (S5) + Business (S6)
                      ═══════════════════════════════════════════════════════ */}
                      {step === 5 && (
                        <div className="space-y-5 pb-4">
                          <p className={sectionTitle}>Section 5 — Compelling Need</p>

                          <div>
                            <label className={labelClass}>
                              Power supply problems faced{' '}
                              <span className="normal-case font-normal text-secondary-400">
                                (select up to 3 · {values.power_problems.length}/3)
                              </span>
                            </label>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.values(PowerProblemEnum).map((p) => {
                                const selected = values.power_problems.includes(p)
                                const maxed = values.power_problems.length >= 3 && !selected
                                return (
                                  <button key={p} type="button"
                                    onClick={() => {
                                      if (selected) {
                                        setFieldValue('power_problems', values.power_problems.filter((x) => x !== p))
                                      } else if (!maxed) {
                                        setFieldValue('power_problems', [...values.power_problems, p])
                                      }
                                    }}
                                    className={`py-1.5 px-3 rounded-full border text-xs font-semibold transition-all flex items-center gap-1 ${
                                      selected
                                        ? 'bg-primary-600 border-primary-600 text-white'
                                        : maxed
                                        ? 'opacity-40 cursor-not-allowed bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-500'
                                        : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:border-primary-400'
                                    }`}>
                                    {selected && <CheckIcon className="w-3 h-3" />}
                                    {powerProblemLabels[p]}
                                  </button>
                                )
                              })}
                            </div>
                            <ErrorMessage name="power_problems" component="div" className={errorClass} />
                          </div>

                          <div>
                            <label className={labelClass}>Benefits this product will provide</label>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.values(ProductBenefitEnum).map((b) => {
                                const selected = values.product_benefits.includes(b)
                                return (
                                  <button key={b} type="button"
                                    onClick={() => setFieldValue(
                                      'product_benefits',
                                      selected
                                        ? values.product_benefits.filter((x) => x !== b)
                                        : [...values.product_benefits, b]
                                    )}
                                    className={`py-1.5 px-3 rounded-full border text-xs font-semibold transition-all flex items-center gap-1 ${
                                      selected
                                        ? 'bg-success-600 border-success-600 text-white'
                                        : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:border-success-400'
                                    }`}>
                                    {selected && <CheckIcon className="w-3 h-3" />}
                                    {productBenefitLabels[b]}
                                  </button>
                                )
                              })}
                            </div>
                            <ErrorMessage name="product_benefits" component="div" className={errorClass} />
                          </div>

                          <SectionDivider label="Section 6 — Business Verification" />

                          <div>
                            <label className={labelClass}>Are you a business owner?</label>
                            <YesNo value={values.is_business_owner} onChange={(v) => setFieldValue('is_business_owner', v)} />
                            <ErrorMessage name="is_business_owner" component="div" className={errorClass} />
                          </div>

                          {values.is_business_owner === false && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-xs text-secondary-500 dark:text-secondary-400">
                              <LockClosedIcon className="w-4 h-4 flex-shrink-0" />
                              Not applicable — tap Next to continue to the next section.
                            </div>
                          )}

                          <div className={`space-y-4 transition-opacity duration-200 ${values.is_business_owner === false ? 'opacity-30 pointer-events-none select-none' : ''}`}>
                            <div>
                              <label className={labelClass}>Business Type</label>
                              <div className="mt-1.5 flex flex-wrap gap-2">
                                {[
                                  { v: BusinessTypeEnum.SOLE_PROPRIETORSHIP, l: 'Sole Proprietorship' },
                                  { v: BusinessTypeEnum.PARTNERSHIP, l: 'Partnership' },
                                  { v: BusinessTypeEnum.REGISTERED, l: 'Registered Business' },
                                ].map(({ v, l }) => (
                                  <button key={v} type="button" onClick={() => setFieldValue('business_type', v)}
                                    className={`py-1.5 px-3 rounded-full border text-xs font-semibold transition-all ${
                                      values.business_type === v
                                        ? 'bg-primary-600 border-primary-600 text-white'
                                        : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400'
                                    }`}>
                                    {l}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className={labelClass}>How long has the business been operating?</label>
                              <div className="mt-1.5 grid grid-cols-2 gap-2">
                                {[
                                  { v: BusinessDurationEnum.LESS_THAN_6_MONTHS, l: '< 6 months' },
                                  { v: BusinessDurationEnum.SIX_TO_12_MONTHS, l: '6–12 months' },
                                  { v: BusinessDurationEnum.ONE_TO_3_YEARS, l: '1–3 years' },
                                  { v: BusinessDurationEnum.THREE_PLUS_YEARS, l: '3+ years' },
                                ].map(({ v, l }) => (
                                  <button key={v} type="button" onClick={() => setFieldValue('business_duration', v)}
                                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                                      values.business_duration === v
                                        ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                        : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300'
                                    }`}>
                                    {l}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className={labelClass}>Average Daily Customer Traffic</label>
                              <div className="mt-1.5 flex gap-2">
                                {[CustomerTrafficEnum.LOW, CustomerTrafficEnum.MEDIUM, CustomerTrafficEnum.HIGH].map((t) => (
                                  <button key={t} type="button" onClick={() => setFieldValue('daily_customer_traffic', t)}
                                    className={`flex-1 py-2 rounded-lg border text-xs font-semibold capitalize transition-all ${
                                      values.daily_customer_traffic === t
                                        ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                        : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300'
                                    }`}>
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className={labelClass}>Equipment requiring power?</label>
                                <YesNo value={values.has_power_equipment} onChange={(v) => setFieldValue('has_power_equipment', v)} />
                              </div>
                              <div>
                                <label className={labelClass}>Permanent location?</label>
                                <YesNo value={values.is_permanent_location} onChange={(v) => setFieldValue('is_permanent_location', v)} />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="hub_distance_km" className={labelClass}>
                                Distance from nearest hub (km) <span className="normal-case font-normal text-secondary-400">(optional)</span>
                              </label>
                              <Field id="hub_distance_km" name="hub_distance_km" type="number" min="0" placeholder="0" className={inputClass} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══════════════════════════════════════════════════════
                          STEP 6 — Guarantors (Section 7)
                      ═══════════════════════════════════════════════════════ */}
                      {step === 6 && (
                        <div className="space-y-5 pb-4">
                          {/* Guarantor 1 */}
                          <div>
                            <p className={sectionTitle}>
                              <UserGroupIcon className="w-3.5 h-3.5" />
                              Guarantor 1 — Section 7
                            </p>
                            <div className="space-y-3">
                              <div>
                                <label htmlFor="g1_name" className={labelClass}>Full Name</label>
                                <Field id="g1_name" name="guarantor_1_name" type="text" placeholder="Full name" className={inputClass} />
                                <ErrorMessage name="guarantor_1_name" component="div" className={errorClass} />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label htmlFor="g1_phone" className={labelClass}>Phone</label>
                                  <Field id="g1_phone" name="guarantor_1_phone" type="tel" placeholder="+2348..." className={inputClass} />
                                  <ErrorMessage name="guarantor_1_phone" component="div" className={errorClass} />
                                </div>
                                <div>
                                  <label htmlFor="g1_rel" className={labelClass}>Relationship</label>
                                  <Field id="g1_rel" name="guarantor_1_relationship" type="text" placeholder="e.g. Brother" className={inputClass} />
                                  <ErrorMessage name="guarantor_1_relationship" component="div" className={errorClass} />
                                </div>
                              </div>
                              <div>
                                <label htmlFor="g1_addr" className={labelClass}>Address</label>
                                <Field id="g1_addr" name="guarantor_1_address" type="text" placeholder="Full address" className={inputClass} />
                                <ErrorMessage name="guarantor_1_address" component="div" className={errorClass} />
                              </div>
                              <div>
                                <label htmlFor="g1_occ" className={labelClass}>Occupation</label>
                                <Field id="g1_occ" name="guarantor_1_occupation" type="text" placeholder="Occupation" className={inputClass} />
                                <ErrorMessage name="guarantor_1_occupation" component="div" className={errorClass} />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label htmlFor="g1_id_type" className={labelClass}>ID Type</label>
                                  <Field as="select" id="g1_id_type" name="guarantor_1_id_type" className={inputClass}>
                                    <option value="">Select ID</option>
                                    {Object.values(IdTypeEnum).map((t) => (
                                      <option key={t} value={t}>{idTypeLabels[t]}</option>
                                    ))}
                                  </Field>
                                  <ErrorMessage name="guarantor_1_id_type" component="div" className={errorClass} />
                                </div>
                                <div>
                                  <label htmlFor="g1_id_num" className={labelClass}>ID Number</label>
                                  <Field id="g1_id_num" name="guarantor_1_id_number" type="text" placeholder="ID number" className={inputClass} />
                                  <ErrorMessage name="guarantor_1_id_number" component="div" className={errorClass} />
                                </div>
                              </div>
                            </div>
                          </div>

                          <SectionDivider label="Guarantor 2" />

                          {/* Guarantor 2 */}
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="g2_name" className={labelClass}>Full Name</label>
                              <Field id="g2_name" name="guarantor_2_name" type="text" placeholder="Full name" className={inputClass} />
                              <ErrorMessage name="guarantor_2_name" component="div" className={errorClass} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label htmlFor="g2_phone" className={labelClass}>Phone</label>
                                <Field id="g2_phone" name="guarantor_2_phone" type="tel" placeholder="+2348..." className={inputClass} />
                                <ErrorMessage name="guarantor_2_phone" component="div" className={errorClass} />
                              </div>
                              <div>
                                <label htmlFor="g2_rel" className={labelClass}>Relationship</label>
                                <Field id="g2_rel" name="guarantor_2_relationship" type="text" placeholder="e.g. Neighbour" className={inputClass} />
                                <ErrorMessage name="guarantor_2_relationship" component="div" className={errorClass} />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="g2_addr" className={labelClass}>Address</label>
                              <Field id="g2_addr" name="guarantor_2_address" type="text" placeholder="Full address" className={inputClass} />
                              <ErrorMessage name="guarantor_2_address" component="div" className={errorClass} />
                            </div>
                            <div>
                              <label htmlFor="g2_occ" className={labelClass}>Occupation</label>
                              <Field id="g2_occ" name="guarantor_2_occupation" type="text" placeholder="Occupation" className={inputClass} />
                              <ErrorMessage name="guarantor_2_occupation" component="div" className={errorClass} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label htmlFor="g2_id_type" className={labelClass}>ID Type</label>
                                <Field as="select" id="g2_id_type" name="guarantor_2_id_type" className={inputClass}>
                                  <option value="">Select ID</option>
                                  {Object.values(IdTypeEnum).map((t) => (
                                    <option key={t} value={t}>{idTypeLabels[t]}</option>
                                  ))}
                                </Field>
                                <ErrorMessage name="guarantor_2_id_type" component="div" className={errorClass} />
                              </div>
                              <div>
                                <label htmlFor="g2_id_num" className={labelClass}>ID Number</label>
                                <Field id="g2_id_num" name="guarantor_2_id_number" type="text" placeholder="ID number" className={inputClass} />
                                <ErrorMessage name="guarantor_2_id_number" component="div" className={errorClass} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══════════════════════════════════════════════════════
                          STEP 7 — Security + Consent (Section 9)
                      ═══════════════════════════════════════════════════════ */}
                      {step === 7 && (
                        <div className="space-y-4 pb-4">
                          <p className={sectionTitle}>
                            <ShieldCheckIcon className="w-3.5 h-3.5" />
                            Create Account & Consent
                          </p>

                          <div>
                            <label htmlFor="password" className={labelClass}>Password</label>
                            <div className="relative mt-1">
                              <Field id="password" name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="At least 8 characters"
                                className={`${inputClass} !mt-0 pr-10`} />
                              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword((v) => !v)}>
                                {showPassword
                                  ? <EyeSlashIcon className="h-4 w-4 text-secondary-400" />
                                  : <EyeIcon className="h-4 w-4 text-secondary-400" />}
                              </button>
                            </div>
                            <ErrorMessage name="password" component="div" className={errorClass} />
                          </div>

                          <div>
                            <label htmlFor="confirm_password" className={labelClass}>Confirm Password</label>
                            <div className="relative mt-1">
                              <Field id="confirm_password" name="confirm_password"
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Repeat your password"
                                className={`${inputClass} !mt-0 pr-10`} />
                              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirm((v) => !v)}>
                                {showConfirm
                                  ? <EyeSlashIcon className="h-4 w-4 text-secondary-400" />
                                  : <EyeIcon className="h-4 w-4 text-secondary-400" />}
                              </button>
                            </div>
                            <ErrorMessage name="confirm_password" component="div" className={errorClass} />
                          </div>

                          <SectionDivider label="Section 9 — Consent & Declaration" />

                          <div className="rounded-xl bg-secondary-50 dark:bg-secondary-700/50 p-4 text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed space-y-2">
                            <p>I confirm that the information provided is accurate and I agree to comply with the terms of the PayGo/Lease agreement.</p>
                            <p>I consent that my information may be shared with investors and internal stakeholders for reporting purposes only.</p>
                            <p className="text-[10px] text-secondary-400 dark:text-secondary-500">
                              <span className="font-semibold">Data Privacy:</span> We are committed to handling your personal data with confidentiality and responsibility.
                            </p>
                          </div>

                          <label className="flex items-start gap-3 cursor-pointer group">
                            <div
                              onClick={() => setFieldValue('consent_agreed', !values.consent_agreed)}
                              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                values.consent_agreed
                                  ? 'bg-primary-600 border-primary-600'
                                  : 'border-secondary-300 dark:border-secondary-600 group-hover:border-primary-400'
                              }`}>
                              {values.consent_agreed && <CheckIcon className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm text-secondary-700 dark:text-secondary-300 leading-snug" onClick={() => setFieldValue('consent_agreed', !values.consent_agreed)}>
                              I have read and agree to the terms above, and confirm all information provided is truthful and accurate.
                            </span>
                          </label>
                          <ErrorMessage name="consent_agreed" component="div" className={errorClass} />
                        </div>
                      )}

                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation buttons */}
                <div className={`flex gap-3 px-6 py-4 border-t border-secondary-100 dark:border-secondary-700 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
                  {step > 0 && (
                    <button type="button" onClick={() => handleBack(values.paymentTimeline)}
                      className="flex items-center gap-1.5 py-2.5 px-4 rounded-lg border border-secondary-300 dark:border-secondary-600 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
                      <ArrowLeftIcon className="w-4 h-4" />
                      Back
                    </button>
                  )}

                  {step < TOTAL_STEPS - 1 ? (
                    <button type="button"
                      onClick={() => handleNext(values, { validateForm, setTouched })}
                      className="flex items-center gap-1.5 py-2.5 px-5 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors">
                      Next
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  ) : (
                    <button type="submit" disabled={isPending}
                      className="flex items-center gap-1.5 py-2.5 px-5 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      {isPending ? 'Submitting…' : 'Submit Application'}
                      {!isPending && <CheckCircleIcon className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <p className="text-center text-xs text-secondary-500 dark:text-secondary-400 mt-4">
          Already have an account?{' '}
          <button type="button" onClick={() => navigate('/login')}
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium">
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export default OnboardingPage
