import { useAuthStore } from "@/store/authStore"
import { PropsWithChildren } from "react"

interface OnboardingFlowWrapperProps extends PropsWithChildren{}
const OnboardingFlowWrapper = (props: OnboardingFlowWrapperProps) => {
    const { leadBoardingFlow } = useAuthStore((state) => state.user)
  return (
    <div>
      {props.children}
    </div>
  )
}

export default OnboardingFlowWrapper