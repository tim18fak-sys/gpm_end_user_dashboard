import { DeviceUserOnboarding, DeviceUserOnboardingDto } from "@/types/onboarding.types";
import { BaseDataInterface, BaseMessageInterface, BaseStatusInterface } from "@/types/shared";
import { api } from "./api";

export interface DeviceUserOnboardingUserSideServerResponse extends BaseMessageInterface {
  onboarding_id: string;
}

export interface VerifyHubPublicResponse {
  isValid: boolean;
  message: string;
}
export interface GetOnboardingInformationServerResponse extends BaseDataInterface<DeviceUserOnboarding>{}

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
//   LATER: ensure that we combine the hubid and the agentId so we can get if that agent is under that hub. For now we are good.
  checkAgentExist: async (agentId: string): Promise<BaseStatusInterface> => {
    const response = await api.get(`v1/agents/${agentId}/exists`);
    return response.data;
  },
  getOnboardingInfo:async():Promise<GetOnboardingInformationServerResponse> => {
    const response = await api.get(`${BASE_URL}/information`);
    return response.data;
  }
};
