import { PropsWithChildren } from "react"

interface OnboardingFlowWrapperProps extends PropsWithChildren{}
const OnboardingFlowWrapper = (props: OnboardingFlowWrapperProps) => {
  return (
    <div>
      {props.children}
    </div>
  )
}

export default OnboardingFlowWrapper