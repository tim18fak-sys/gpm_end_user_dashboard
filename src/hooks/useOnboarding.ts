import { onboardingApi } from "@/services/onboarding.api";
import { DeviceUserOnboardingDto } from "@/types/onboarding.types";
import { useMutation } from "@tanstack/react-query";

export const useOnboarding = () => {
  return useMutation({
    mutationKey: ["onboard-user"],
    mutationFn: async (onboardingData: DeviceUserOnboardingDto) => {
      const response = await onboardingApi.onboardUser(onboardingData);
      return response;
    },
  });
};
