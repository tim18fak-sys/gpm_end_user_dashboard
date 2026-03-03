import { FC, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WelcomeStep from './steps/WelcomeStep'
import DeviceOffersStep from './steps/DeviceOffersStep'
import { useAuthStore } from '@/store/authStore'
import { useDeviceCategoryDetails, useDeviceCategories } from '@/hooks/useDeviceCategory'
import { useCheckDeviceAvailability, useCheckMultipleDeviceAvailability, isDeviceAvailable } from '@/hooks/useInventory'
import { ONBOARDING_STEPS, OnboardingStepIndex } from './onboarding.constants'

export { ONBOARDING_STEPS, type OnboardingStepIndex } from './onboarding.constants'

interface OnboardingModalProps {
  show: boolean
  initialStep: OnboardingStepIndex
  name: string
  onStepComplete: (step: OnboardingStepIndex) => void
}

const TOTAL_STEPS = Object.keys(ONBOARDING_STEPS).length

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
}

const OnboardingModal: FC<OnboardingModalProps> = ({
  show,
  initialStep,
  name,
  onStepComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStepIndex>(initialStep)
  const directionRef = useRef(1)

  const { interestedDevice } = useAuthStore((state) => state.user)
  const deviceCategoryId = interestedDevice?.deviceCategoryId ?? ''

  const { data: deviceCategoryData, isLoading: isLoadingDevice } = useDeviceCategoryDetails(deviceCategoryId)

  const { data: availabilityData, isLoading: isLoadingAvailability } = useCheckDeviceAvailability(deviceCategoryId)

  const isAvailableInInventory = isDeviceAvailable(
    availabilityData?.data.status,
    availabilityData?.data.availableQuantity
  )

  const fetchAlternatives = !isLoadingAvailability && !!availabilityData && !isAvailableInInventory

  const { data: alternativesData, isLoading: isLoadingAlternatives } = useDeviceCategories(
    { excludeDeviceCategoryId: deviceCategoryId },
    fetchAlternatives
  )

  const alternativeCategoryIds = (alternativesData?.data ?? []).map((cat) => cat._id)

  const alternativeAvailabilityResults = useCheckMultipleDeviceAvailability(
    fetchAlternatives ? alternativeCategoryIds : []
  )

  const isCheckingAlternativeAvailability =
    fetchAlternatives && alternativeAvailabilityResults.some((r) => r.isLoading)

  const availableAlternatives = (alternativesData?.data ?? []).filter((_, index) => {
    const result = alternativeAvailabilityResults[index]
    return isDeviceAvailable(result?.data?.data.status, result?.data?.data.availableQuantity)
  })

  const isLoadingOffers =
    isLoadingDevice ||
    isLoadingAvailability ||
    (fetchAlternatives && isLoadingAlternatives) ||
    isCheckingAlternativeAvailability

  const handleNext = () => {
    const completed = currentStep
    onStepComplete(completed)

    const next = currentStep + 1
    if (next < TOTAL_STEPS) {
      directionRef.current = 1
      setCurrentStep(next as OnboardingStepIndex)
    }
  }

  const renderStep = (step: OnboardingStepIndex) => {
    switch (step) {
      case ONBOARDING_STEPS.WELCOME:
        return <WelcomeStep name={name} onNext={handleNext} />
      case ONBOARDING_STEPS.DEVICE_OFFERS:
        return (
          <DeviceOffersStep
            onNext={handleNext}
            selectedDeviceCategory={deviceCategoryData?.data}
            isAvailableInInventory={isAvailableInInventory}
            otherDeviceCategories={availableAlternatives}
            isLoading={isLoadingOffers}
          />
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.04 }}
            className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-primary-500 to-primary-600 rounded-t-2xl z-10" />

            <div className="absolute top-4 right-5 z-10 flex items-center gap-1.5">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === currentStep ? 20 : 6,
                    backgroundColor:
                      i === currentStep
                        ? 'rgb(59 130 246)'
                        : i < currentStep
                        ? 'rgb(147 197 253)'
                        : 'rgb(209 213 219)',
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-1.5 rounded-full"
                />
              ))}
            </div>

            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={directionRef.current}>
                <motion.div
                  key={currentStep}
                  custom={directionRef.current}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  {renderStep(currentStep)}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OnboardingModal
