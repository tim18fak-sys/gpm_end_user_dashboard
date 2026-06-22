import { DeviceUserOnboardingDto } from "@/types/onboarding.types";
import { BaseMessageInterface, BaseStatusInterface } from "@/types/shared";
import { api } from "./api";

export interface DeviceUserOnboardingUserSideServerResponse extends BaseMessageInterface {
  onboarding_id: string;
}

export interface VerifyHubPublicResponse {
  isValid: boolean;
  message: string;
}

const BASE_URL = "/v1/customer-onboarding";
export const onboardingApi = {
  onboardUser: async (
    onboardingData: DeviceUserOnboardingDto,
  ): Promise<DeviceUserOnboardingUserSideServerResponse> => {
    const response = await api.post(BASE_URL, onboardingData);
    return response.data;
  },
  //   check if the hub exist, and the agent exist
  checkHubExist: async (hubId: string): Promise<VerifyHubPublicResponse> => {
    const response = await api.get(`/v1/public/hub/${hubId}/verify`);
    return response.data;
  },
  checkAgentExist: async (agentId: string): Promise<BaseStatusInterface> => {
    const response = await api.get(`v1/agents/${agentId}/exists`);
    return response.data;
  },
};
