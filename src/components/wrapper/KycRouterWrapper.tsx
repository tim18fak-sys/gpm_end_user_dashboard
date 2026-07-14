import { DevicePaymentTimelineEnum } from "@/enum/device.enum";
import { DeviceUserOnboardingStatusEnum, UserVerificationStatusEnum } from "@/enum/user.enum";
import { useAuthStore } from "@/store/authStore";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

interface KycRouterWrapperProps extends PropsWithChildren {}

function KycRouterWrapper({ children }: KycRouterWrapperProps) {
  const { user } = useAuthStore();

  //   the user has not started their verification process, so we should redirect them to the kyc page
  if (
    user.verification_status === UserVerificationStatusEnum.PENDING &&
    user.paymentTimeline !== DevicePaymentTimelineEnum.OUTRIGHT && user.onboardingStatus === DeviceUserOnboardingStatusEnum.ACCEPTED
  )
    return <Navigate to={"/kyc"} />;

  // if the user has been rejected, we should redirect them to the kyc page
  if (
    user.verification_status === UserVerificationStatusEnum.REJECTED &&
    user.paymentTimeline !== DevicePaymentTimelineEnum.OUTRIGHT && user.onboardingStatus === DeviceUserOnboardingStatusEnum.ACCEPTED
  )
    return <Navigate to={"/kyc/rejected"} />;
  return <div>{children}</div>;
}

export default KycRouterWrapper;
