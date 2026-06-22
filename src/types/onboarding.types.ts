import { DevicePaymentTimelineEnum, DeviceTypeEnum } from "@/enum/device.enum";
import { UserGenderEnum } from "./user.types";

export interface DeviceUserOnboardingDto {
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  profile_picture: string;

  gender: UserGenderEnum;

  password: string;
  interested_device_type: DeviceTypeEnum;

  // this is to know the payment timeline the user is interested in, and we get device categories that support that payment timeline. And also if the timeline is outright, we don't need kyc verification, but if the timeline is not outright, we need kyc verification.
  paymentTimeline: DevicePaymentTimelineEnum;

  // this are gotten from the link shared with the customer or user.
  onboarding_agent_id: string;
  onboarding_hub_id: string;
}
