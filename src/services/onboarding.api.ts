import { DeviceUserOnboardingDto } from "@/types/onboarding.types";
import { BaseMessageInterface } from "@/types/shared";
import { api } from "./api";

export interface DeviceUserOnboardingUserSideServerResponse extends BaseMessageInterface {
  onboarding_id: string;
}

const BASE_URL = "/v1/customer-onboarding";
export const onboardingApi = {
  onboardUser: async (
    onboardingData: DeviceUserOnboardingDto,
  ): Promise<DeviceUserOnboardingUserSideServerResponse> => {
    const response = await api.post(BASE_URL, onboardingData);
    return response.data;
  },
};
