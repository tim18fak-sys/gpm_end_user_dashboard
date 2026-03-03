import { useAuthStore } from '@/store/authStore'
import { ProfileManagementAPI } from '@/services/api'
import { PropsWithChildren } from 'react'
import OnboardingModal from '@/components/modals/OnboardingModal'
import { ONBOARDING_STEPS, OnboardingStepIndex } from '@/components/modals/onboarding.constants'

interface OnboardingFlowWrapperProps extends PropsWithChildren {}

const getInitialStep = (
  hasGottenWelcomeModal: boolean,
  hasViewedSelectedDeviceOffersModal: boolean
): OnboardingStepIndex => {
  if (!hasGottenWelcomeModal) return ONBOARDING_STEPS.WELCOME
  if (!hasViewedSelectedDeviceOffersModal) return ONBOARDING_STEPS.DEVICE_OFFERS
  return ONBOARDING_STEPS.WELCOME
}

const STEP_FLAG_MAP: Record<OnboardingStepIndex, string> = {
  [ONBOARDING_STEPS.WELCOME]: 'hasGottenWelcomeModal',
  [ONBOARDING_STEPS.DEVICE_OFFERS]: 'hasViewedSelectedDeviceOffersModal',
}

const OnboardingFlowWrapper = (props: OnboardingFlowWrapperProps) => {
  const { leadBoardingFlow, name } = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  const { hasGottenWelcomeModal, hasViewedSelectedDeviceOffersModal } = leadBoardingFlow

  const showModal = !hasGottenWelcomeModal || !hasViewedSelectedDeviceOffersModal

  const initialStep = getInitialStep(hasGottenWelcomeModal, hasViewedSelectedDeviceOffersModal)

  const handleStepComplete = async (step: OnboardingStepIndex) => {
    const flagKey = STEP_FLAG_MAP[step]

    setUser((prev) => ({
      ...prev,
      leadBoardingFlow: {
        ...prev.leadBoardingFlow,
        [flagKey]: true,
      },
    }))

    try {
      await ProfileManagementAPI.updateBoardingFlow({ [flagKey]: true })
    } catch {
    }
  }

  return (
    <div>
      {props.children}

      <OnboardingModal
        show={showModal}
        initialStep={initialStep}
        name={name}
        onStepComplete={handleStepComplete}
      />
    </div>
  )
}

export default OnboardingFlowWrapper
