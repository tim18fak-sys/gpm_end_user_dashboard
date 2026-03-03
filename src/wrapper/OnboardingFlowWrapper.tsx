import { useAuthStore, User } from '@/store/authStore'
import { ProfileManagementAPI } from '@/services/api'
import { PropsWithChildren } from 'react'
import WelcomeModal from '@/components/modals/WelcomeModal'

interface OnboardingFlowWrapperProps extends PropsWithChildren {}

const OnboardingFlowWrapper = (props: OnboardingFlowWrapperProps) => {
  const { leadBoardingFlow, name } = useAuthStore((state) => state.user)
  const {setUser,user} = useAuthStore()

  const showWelcomeModal = !leadBoardingFlow.hasGottenWelcomeModal

  const handleWelcomeDismiss = async () => {
    user.leadBoardingFlow.hasGottenWelcomeModal = true
    setUser(user as User)
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
        onGetStarted={handleWelcomeDismiss}
      />
    </div>
  )
}

export default OnboardingFlowWrapper
