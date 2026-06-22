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


export const useCheckHubExist = () => {
  return useMutation({
    mutationKey: ["check-hub-exist", ],
    mutationFn: async (hubId: string) => {
      const response = await onboardingApi.checkHubExist(hubId);
      return response;
    },
  });
};

export const useCheckAgentExist = () => {
  return useMutation({
    mutationKey: ["check-agent-exist"],
    mutationFn: async (agentId: string) => {
      const response = await onboardingApi.checkAgentExist(agentId);
      return response;
    },
  });
};