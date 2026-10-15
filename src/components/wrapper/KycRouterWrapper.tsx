import { DevicePaymentTimelineEnum } from "@/enum/device.enum";
import { DeviceUserOnboardingStatusEnum, UserVerificationStatusEnum } from "@/enum/user.enum";
import { useAuthStore } from "@/store/authStore";
import { PropsWithChildren } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";

interface KycRouterWrapperProps extends PropsWithChildren {}

function KycRouterWrapper({ children }: KycRouterWrapperProps) {
  const { user } = useAuthStore();
   const [searchParams] = useSearchParams();
   const fromKyc = searchParams.get("fromKyc");

  console.log("KycRouterWrapper user", user.verification_status, fromKyc);

  // there
  if (fromKyc === "1") {
    return <Navigate to={"/kyc/pending-review"} />;
  }
  if (
    user.verification_status === UserVerificationStatusEnum.NONE &&
    user.paymentTimeline !== DevicePaymentTimelineEnum.OUTRIGHT &&
    user.onboardingStatus === DeviceUserOnboardingStatusEnum.ACCEPTED
  )
    return <Navigate to={"/kyc"} />;

  //   the user has not started their verification process, so we should redirect them to the kyc page
  if (
    user.verification_status === UserVerificationStatusEnum.PENDING &&
    user.paymentTimeline !== DevicePaymentTimelineEnum.OUTRIGHT &&
    user.onboardingStatus === DeviceUserOnboardingStatusEnum.ACCEPTED
  )
    return <Navigate to={"/kyc/pending"} />;

  // if the user has been rejected, we should redirect them to the kyc page
  if (
    user.verification_status === UserVerificationStatusEnum.REJECTED &&
    user.paymentTimeline !== DevicePaymentTimelineEnum.OUTRIGHT &&
    user.onboardingStatus === DeviceUserOnboardingStatusEnum.ACCEPTED
  )
    return <Navigate to={"/kyc/rejected"} />;
  return <div>{children}</div>;
}

export default KycRouterWrapper;
