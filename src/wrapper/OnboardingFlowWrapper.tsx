// import { LeadOnBoardingDashboardFlow, useAuthStore } from '@/store/authStore'
// import { ProfileManagementAPI } from '@/services/api'
// import { PropsWithChildren } from 'react'
// import OnboardingModal from '@/components/modals/OnboardingModal'
// import { ONBOARDING_STEPS, OnboardingStepIndex } from '@/components/modals/onboarding.constants'

// interface OnboardingFlowWrapperProps extends PropsWithChildren {}

// const getInitialStep = (
//   hasGottenWelcomeModal: boolean,
//   hasViewedSelectedDeviceOffersModal: boolean,
//   hasViewedFinancingOptionModal: boolean
// ): OnboardingStepIndex => {
//   if (!hasGottenWelcomeModal) return ONBOARDING_STEPS.WELCOME
//   if (!hasViewedSelectedDeviceOffersModal) return ONBOARDING_STEPS.DEVICE_OFFERS
//   if (!hasViewedFinancingOptionModal) return ONBOARDING_STEPS.FINANCING_OPTIONS
//   return ONBOARDING_STEPS.WELCOME
// }

// const STEP_FLAG_MAP: Record<OnboardingStepIndex, keyof LeadOnBoardingDashboardFlow> = {
//   [ONBOARDING_STEPS.WELCOME]: 'hasGottenWelcomeModal',
//   [ONBOARDING_STEPS.DEVICE_OFFERS]: 'hasViewedSelectedDeviceOffersModal',
//   [ONBOARDING_STEPS.FINANCING_OPTIONS]: 'hasViewedFinancingOptionModal',
// }

// const OnboardingFlowWrapper = (props: OnboardingFlowWrapperProps) => {
//   const { leadBoardingFlow, name } = useAuthStore((state) => state.user)
//   const { setUser, user } = useAuthStore()

//   const {
//     hasGottenWelcomeModal,
//     hasViewedSelectedDeviceOffersModal,
//     hasViewedFinancingOptionModal,
//   } = leadBoardingFlow

//   const showModal =
//     !hasGottenWelcomeModal ||
//     !hasViewedSelectedDeviceOffersModal ||
//     !hasViewedFinancingOptionModal

//   const initialStep = getInitialStep(
//     hasGottenWelcomeModal,
//     hasViewedSelectedDeviceOffersModal,
//     hasViewedFinancingOptionModal
//   )

//   const handleStepComplete = async (step: OnboardingStepIndex) => {
//     const flagKey = STEP_FLAG_MAP[step]

//     if (user.leadBoardingFlow) {
//       user.leadBoardingFlow[flagKey] = true
//     }
//     setUser(user)

//     try {
//       await ProfileManagementAPI.updateBoardingFlow({ [flagKey]: true })
//     } catch {
//     }
//   }

//   return (
//     <div>
//       {props.children}

//       <OnboardingModal
//         show={showModal}
//         initialStep={initialStep}
//         name={name}
//         onStepComplete={handleStepComplete}
//       />
//     </div>
//   )
// }

// export default OnboardingFlowWrapper
