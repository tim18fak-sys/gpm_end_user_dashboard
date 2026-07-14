import { DeviceUserOnboardingStatusEnum } from "@/enum/user.enum";
import { useAuthStore } from "@/store/authStore";
import React from "react";
import { Navigate } from "react-router-dom";

interface ApprovalFlowWrapperProps extends React.PropsWithChildren {}

function ApprovalFlowWrapper({ children }: ApprovalFlowWrapperProps) {
  const { user } = useAuthStore();
  if (user.onboardingStatus === DeviceUserOnboardingStatusEnum.PENDING) return <Navigate to={"/waiting-for-approval"} replace />;
  if (user.onboardingStatus === DeviceUserOnboardingStatusEnum.REJECTED) return <Navigate to={"/rejected-application"} replace />;
    return <>{children}</>;
}

export default ApprovalFlowWrapper;
