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
  DevicePhoneMobileIcon,
  CameraIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  BoltIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { useCheckAgentExist, useCheckHubExist, useOnboarding } from '@/hooks/useOnboarding'
import { DeviceTypeEnum, DevicePaymentTimelineEnum } from '@/enum/device.enum'
import { UserGenderEnum } from '@/types/user.types'

const STEPS = ['Personal Info', 'Security', 'Device Preference'] as const
type StepIndex = 0 | 1 | 2

const deviceTypeLabels: Record<DeviceTypeEnum, string> = {
  [DeviceTypeEnum.SIM]: 'SIM Card',
  [DeviceTypeEnum.PAYGO]: 'Pay-As-You-Go',
  [DeviceTypeEnum.IOT]: 'IoT Device',
  [DeviceTypeEnum.MANUAL_PAYGO]: 'Manual Pay-As-You-Go',
}

const paymentTimelineLabels: Record<DevicePaymentTimelineEnum, string> = {
  [DevicePaymentTimelineEnum.OUTRIGHT]: 'Outright (Pay in full)',
  [DevicePaymentTimelineEnum.SIX_MONTH]: '6 Months',
  [DevicePaymentTimelineEnum.NINE_MONTH]: '9 Months',
  [DevicePaymentTimelineEnum.TWELVE_MONTH]: '12 Months',
  [DevicePaymentTimelineEnum.FIFTEEN_MONTH]: '15 Months',
  [DevicePaymentTimelineEnum.EIGHTEEN_MONTH]: '18 Months',
  [DevicePaymentTimelineEnum.TWENTY_ONE_MONTH]: '21 Months',
  [DevicePaymentTimelineEnum.TWENTY_FOUR_MONTH]: '24 Months',
  [DevicePaymentTimelineEnum.TWENTY_SEVEN_MONTH]: '27 Months',
  [DevicePaymentTimelineEnum.THIRTY_MONTH]: '30 Months',
  [DevicePaymentTimelineEnum.THIRTY_THREE_MONTH]: '33 Months',
  [DevicePaymentTimelineEnum.THIRTY_SIX_MONTH]: '36 Months',
}

const stepSchemas = [
  Yup.object({
    first_name: Yup.string().trim().required('First name is required'),
    last_name: Yup.string().trim().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone_number: Yup.string()
      .matches(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number')
      .required('Phone number is required'),
    gender: Yup.mixed<UserGenderEnum>()
      .oneOf(Object.values(UserGenderEnum), 'Please select a gender')
      .required('Gender is required'),
  }),
  Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Please confirm your password'),
    profile_picture: Yup.string().optional(),
  }),
  Yup.object({
    interested_device_type: Yup.mixed<DeviceTypeEnum>()
      .oneOf(Object.values(DeviceTypeEnum), 'Please select a device type')
      .required('Device type is required'),
    paymentTimeline: Yup.mixed<DevicePaymentTimelineEnum>()
      .oneOf(Object.values(DevicePaymentTimelineEnum), 'Please select a payment timeline')
      .required('Payment timeline is required'),
  }),
]

interface FormValues {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  gender: UserGenderEnum | ''
  password: string
  confirm_password: string
  profile_picture: string
  interested_device_type: DeviceTypeEnum | ''
  paymentTimeline: DevicePaymentTimelineEnum | ''
}

const inputClass =
  'mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-sm bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm'

const labelClass = 'block text-sm font-medium text-secondary-700 dark:text-secondary-300'

const errorClass = 'mt-1 text-xs text-danger-500'

type LinkValidationState = 'loading' | 'valid' | 'invalid'

function OnboardingPage() {
  const [linkValidation, setLinkValidation] = useState<LinkValidationState>('loading')
  const [invalidReason, setInvalidReason] = useState('')
  const [isPending, setIsPending] = useState<boolean>(false)

  const [step, setStep] = useState<StepIndex>(0)
  const [direction, setDirection] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mutate: onboard, } = useOnboarding()
  const { mutateAsync: checkHub } = useCheckHubExist()
  const { mutateAsync: checkAgent } = useCheckAgentExist()

  const agentId = searchParams.get('agentId') ?? ''
  const hubId = searchParams.get('hubId') ?? ''



  console.log('agentId:', agentId, 'hubId:', hubId)
  useEffect(() => {
    if (!agentId || !hubId) {
      setInvalidReason('This onboarding link is missing required information. Please request a new link from your agent.')
      setLinkValidation('invalid')
      return
    }

    const validate = async () => {
      try {
        const [hubResult, agentResult] = await Promise.all([
          checkHub(hubId),
          checkAgent(agentId),
        ])

        if (!hubResult.isValid) {
          setInvalidReason(hubResult.message || 'The hub in this link could not be found. Please request a new link.')
          setLinkValidation('invalid')
          return
        }

        if (!agentResult.status) {
          setInvalidReason('The agent in this link could not be verified. Please request a new link from your agent.')
          setLinkValidation('invalid')
          return
        }

        setLinkValidation('valid')
      } catch {
        setInvalidReason('We were unable to verify this link. Please check your connection and try again.')
        setLinkValidation('invalid')
      }
    }

    validate()
  }, [agentId, hubId])

  const initialValues: FormValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: '',
    password: '',
    confirm_password: '',
    profile_picture: '',
    interested_device_type: '',
    paymentTimeline: '',
  }

  const handleNext = async (
    _values: FormValues,
    helpers: Pick<FormikHelpers<FormValues>, 'validateForm' | 'setTouched'>
  ) => {
    const errors = await helpers.validateForm()
    const stepFields: Record<StepIndex, (keyof FormValues)[]> = {
      0: ['first_name', 'last_name', 'email', 'phone_number', 'gender'],
      1: ['password', 'confirm_password'],
      2: ['interested_device_type', 'paymentTimeline'],
    }
    const currentFields = stepFields[step]
    const stepErrors = currentFields.filter((f) => errors[f])
    if (stepErrors.length > 0) {
      const touched = currentFields.reduce((acc, f) => ({ ...acc, [f]: true }), {})
      helpers.setTouched(touched)
      return
    }
    setDirection(1)
    setStep((s) => (s + 1) as StepIndex)
  }

  const handleBack = () => {
    setDirection(-1)
    setStep((s) => (s - 1) as StepIndex)
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setAvatarPreview(base64)
      setFieldValue('profile_picture', base64)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (values: FormValues) => {
    setIsPending(true)
    onboard(
      {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: values.phone_number,
        gender: values.gender as UserGenderEnum,
        password: values.password,
        profile_picture: values.profile_picture,
        interested_device_type: values.interested_device_type as DeviceTypeEnum,
        paymentTimeline: values.paymentTimeline as DevicePaymentTimelineEnum,
        onboarding_agent_id: agentId,
        onboarding_hub_id: hubId,
      },
      {
        onSuccess: () => {
            setIsPending(false) 
          setSuccess(true)
        },
        onError: (err: any) => {
            console.log('Onboarding error:', err)
          toast.error(err?.response?.data?.message || 'Onboarding failed. Please try again.')
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

  if (linkValidation === 'loading') {
    return pageWrapper(
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-full border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 animate-spin mx-auto mb-5" />
        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
          Verifying your onboarding link…
        </p>
        <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
          This only takes a moment.
        </p>
      </motion.div>
    )
  }

  if (linkValidation === 'invalid') {
    return pageWrapper(
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-danger-50 dark:bg-danger-900/20 border-2 border-danger-200 dark:border-danger-800 flex items-center justify-center mx-auto mb-5">
          <ExclamationTriangleIcon className="w-8 h-8 text-danger-500" />
        </div>
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
          Invalid Onboarding Link
        </h2>
        <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed mb-8">
          {invalidReason}
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-2.5 px-4 rounded-lg border border-secondary-300 dark:border-secondary-600 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
        >
          Go to Sign In
        </button>
      </motion.div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-primary-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-success-50 dark:bg-success-900/20 border-2 border-success-200 dark:border-success-700 flex items-center justify-center mx-auto mb-5">
            <CheckCircleIcon className="w-10 h-10 text-success-500" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            You're all set!
          </h2>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed mb-8">
            Your account has been created successfully. You can now sign in and continue your solar financing journey.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Sign in to your account
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-primary-900 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-8 pb-4">
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 flex items-center justify-center mb-3">
                <BoltIcon className="w-6 h-6 text-warning-500" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                Create Your Account
              </h2>
              <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400 text-center">
                Get started with your solar financing application
              </p>
            </div>

            <div className="flex items-center gap-2 mb-6">
              {STEPS.map((label, i) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full h-1.5 rounded-full transition-colors duration-300 ${
                      i <= step
                        ? 'bg-primary-500'
                        : 'bg-secondary-200 dark:bg-secondary-600'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-medium transition-colors duration-200 ${
                      i === step
                        ? 'text-primary-600 dark:text-primary-400'
                        : i < step
                        ? 'text-primary-400 dark:text-primary-600'
                        : 'text-secondary-400 dark:text-secondary-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
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
            {({ values,  validateForm, setTouched, setFieldValue }) => (
              <Form>
                <div className="px-8 pb-8 overflow-hidden">
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
                      {step === 0 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label htmlFor="first_name" className={labelClass}>First Name</label>
                              <Field
                                id="first_name"
                                name="first_name"
                                type="text"
                                placeholder="John"
                                className={inputClass}
                              />
                              <ErrorMessage name="first_name" component="div" className={errorClass} />
                            </div>
                            <div>
                              <label htmlFor="last_name" className={labelClass}>Last Name</label>
                              <Field
                                id="last_name"
                                name="last_name"
                                type="text"
                                placeholder="Doe"
                                className={inputClass}
                              />
                              <ErrorMessage name="last_name" component="div" className={errorClass} />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="email" className={labelClass}>Email Address</label>
                            <Field
                              id="email"
                              name="email"
                              type="email"
                              placeholder="john@example.com"
                              className={inputClass}
                            />
                            <ErrorMessage name="email" component="div" className={errorClass} />
                          </div>

                          <div>
                            <label htmlFor="phone_number" className={labelClass}>Phone Number</label>
                            <div className="relative mt-1">
                              <DevicePhoneMobileIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                              <Field
                                id="phone_number"
                                name="phone_number"
                                type="tel"
                                placeholder="+2348012345678"
                                className={`${inputClass} !mt-0 pl-9`}
                              />
                            </div>
                            <ErrorMessage name="phone_number" component="div" className={errorClass} />
                          </div>

                          <div>
                            <label className={labelClass}>Gender</label>
                            <div className="mt-1 grid grid-cols-2 gap-2">
                              {Object.values(UserGenderEnum).map((g) => (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={() => setFieldValue('gender', g)}
                                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all duration-150 ${
                                    values.gender === g
                                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:border-primary-400'
                                  }`}
                                >
                                  {g.charAt(0).toUpperCase() + g.slice(1)}
                                </button>
                              ))}
                            </div>
                            <ErrorMessage name="gender" component="div" className={errorClass} />
                          </div>
                        </div>
                      )}

                      {step === 1 && (
                        <div className="space-y-4">
                          <div className="flex flex-col items-center gap-3 mb-2">
                            <div
                              className="relative w-20 h-20 rounded-full border-2 border-dashed border-secondary-300 dark:border-secondary-600 overflow-hidden cursor-pointer hover:border-primary-400 transition-colors bg-secondary-50 dark:bg-secondary-700 flex items-center justify-center"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              {avatarPreview ? (
                                <img
                                  src={avatarPreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <UserIcon className="w-8 h-8 text-secondary-400" />
                              )}
                              <div className="absolute bottom-0 inset-x-0 bg-black/40 flex items-center justify-center py-1">
                                <CameraIcon className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(e) => handleImageChange(e, setFieldValue)}
                            />
                            <div className="text-center">
                              <p className="text-xs font-medium text-secondary-700 dark:text-secondary-300">
                                Profile Photo <span className="font-normal text-secondary-400">(optional)</span>
                              </p>
                              <p className="text-[11px] text-secondary-400 mt-0.5">
                                JPG, PNG or WebP · max 5MB
                              </p>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="password" className={labelClass}>Password</label>
                            <div className="relative mt-1">
                              <Field
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="At least 8 characters"
                                className={`${inputClass} !mt-0 pr-10`}
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword((v) => !v)}
                              >
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
                              <Field
                                id="confirm_password"
                                name="confirm_password"
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Repeat your password"
                                className={`${inputClass} !mt-0 pr-10`}
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirm((v) => !v)}
                              >
                                {showConfirm
                                  ? <EyeSlashIcon className="h-4 w-4 text-secondary-400" />
                                  : <EyeIcon className="h-4 w-4 text-secondary-400" />}
                              </button>
                            </div>
                            <ErrorMessage name="confirm_password" component="div" className={errorClass} />
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-4">
                          <div>
                            <label className={labelClass}>Device Type</label>
                            <p className="text-xs text-secondary-400 mt-0.5 mb-2">
                              What type of solar device are you interested in?
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.values(DeviceTypeEnum).map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setFieldValue('interested_device_type', type)}
                                  className={`py-2.5 px-3 rounded-lg border text-xs font-semibold text-left transition-all duration-150 ${
                                    values.interested_device_type === type
                                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:border-primary-400'
                                  }`}
                                >
                                  {deviceTypeLabels[type]}
                                </button>
                              ))}
                            </div>
                            <ErrorMessage name="interested_device_type" component="div" className={errorClass} />
                          </div>

                          <div>
                            <label htmlFor="paymentTimeline" className={labelClass}>Payment Timeline</label>
                            <p className="text-xs text-secondary-400 mt-0.5 mb-1">
                              How long would you like to spread your payments?
                            </p>
                            <Field
                              as="select"
                              id="paymentTimeline"
                              name="paymentTimeline"
                              className={inputClass}
                            >
                              <option value="">Select a payment timeline</option>
                              {Object.values(DevicePaymentTimelineEnum).map((t) => (
                                <option key={t} value={t}>
                                  {paymentTimelineLabels[t]}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name="paymentTimeline" component="div" className={errorClass} />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className={`flex gap-3 mt-6 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-1.5 py-2.5 px-4 rounded-lg border border-secondary-300 dark:border-secondary-600 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                      >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back
                      </button>
                    )}

                    {step < 2 ? (
                      <button
                        type="button"
                        onClick={() => handleNext(values, { validateForm, setTouched })}
                        className="flex items-center gap-1.5 py-2.5 px-5 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                      >
                        Next
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-1.5 py-2.5 px-5 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                      >
                        {isPending ? 'Submitting...' : 'Create Account'}
                        {!isPending && <CheckCircleIcon className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <p className="text-center text-xs text-secondary-500 dark:text-secondary-400 mt-4">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export default OnboardingPage
