import { DevicePaymentTimelineEnum } from "@/enum/device.enum";
import { UserVerificationStatusEnum } from "@/enum/user.enum";
import { Point } from "framer-motion";

export enum UserGenderEnum {
  MALE = "male",
  FEMALE = "female",
}


export interface User {
  _id:string
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  location: Point;
  profile_picture?: string;
  phone_number?: string
  date_birth: Date
  gender: UserGenderEnum
  is_deleted: boolean;
  is_device_assigned: boolean;
  verification_status: UserVerificationStatusEnum;
  verificationReason: string;
  onboarding_id: string;
  distributorId: string;
  address: string;
  onboarding_agent_id: string;
  onboarding_hub_id: string;
  paymentTimeline: DevicePaymentTimelineEnum;
}