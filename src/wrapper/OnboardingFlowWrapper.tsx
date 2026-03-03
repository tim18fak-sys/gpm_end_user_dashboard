import { useAuthStore } from '@/store/authStore'
import { ProfileManagementAPI } from '@/services/api'
import { PropsWithChildren } from 'react'
import WelcomeModal from '@/components/modals/WelcomeModal'

interface OnboardingFlowWrapperProps extends PropsWithChildren {}

const OnboardingFlowWrapper = (props: OnboardingFlowWrapperProps) => {
  const { leadBoardingFlow, name, interestedDevice } = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  const showWelcomeModal = !leadBoardingFlow.hasGottenWelcomeModal

  const handleWelcomeDismiss = async () => {
    setUser((prev) => ({
      ...prev,
      leadBoardingFlow: {
        ...prev.leadBoardingFlow,
        hasGottenWelcomeModal: true,
      },
    }))

    try {
      await ProfileManagementAPI.updateBoardingFlow({ hasGottenWelcomeModal: true })
    } catch {
    }
  }

  return (
    <div>
      {props.children}

      <WelcomeModal
        show={showWelcomeModal}
        name={name}
        deviceName={interestedDevice?.deviceCategoryName}
        onGetStarted={handleWelcomeDismiss}
      />
    </div>
  )
}

export default OnboardingFlowWrapper
