import { KycRouterEnum } from "@/enum/kyc.router.enum"
import { LeadKycVerificationStatusEnum, useAuthStore } from "@/store/authStore"
import KycRouterWrapper from "@/wrapper/kycRouter"
import OnboardingFlowWrapper from "@/wrapper/OnboardingFlowWrapper"
import { PropsWithChildren } from "react"

interface Layout2Props  extends PropsWithChildren {

}
const Layout2 = (props: Layout2Props) => {
    const { leadTracking } = useAuthStore((state) => state.user)
    const {isAuthenticated} = useAuthStore()

    console.log(isAuthenticated, 'isAuthenticated in Layout2')
    const getKycRouterEnumFromLeadKycVerificationStatusEnum = (status: LeadKycVerificationStatusEnum) => {
      switch (status) {
        case LeadKycVerificationStatusEnum.NONE:
          return KycRouterEnum.NONE
        case LeadKycVerificationStatusEnum.PENDING:
          return KycRouterEnum.PENDING
        case LeadKycVerificationStatusEnum.COMPLETED:
          return KycRouterEnum.COMPLETED
        case LeadKycVerificationStatusEnum.REJECTED:
          return KycRouterEnum.REJECTED
        default:
          return KycRouterEnum.NONE
      }
    }
  return (
    <KycRouterWrapper isKycVerified={leadTracking.kycVerificationStatus === LeadKycVerificationStatusEnum.COMPLETED} verificationStatus={getKycRouterEnumFromLeadKycVerificationStatusEnum(leadTracking.kycVerificationStatus!)}>
        {/* onboarding wrapper */}
        <OnboardingFlowWrapper>
          {props.children}
        </OnboardingFlowWrapper>
    </KycRouterWrapper>
  )
}

export default Layout2