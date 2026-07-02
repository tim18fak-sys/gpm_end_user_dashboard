import { BaseStatusEnum } from "@/enum/base.enum";
import {
  DeviceCategoryGroupStatusEnum,
  DeviceClassStatusEnum,
  DevicePaymentPlan,
  DevicePaymentTimelineEnum,
} from "@/enum/device.enum";
import { Point } from "./shared.type";

export interface Device {
  _id: string;
  device_category: DeviceCategorySub;
  user: UserSub;
  device_value: number;
  batch_id: string;
  uuid: string;
  is_soft_deleted: boolean;
  payment_plan: PayGoDevicePaymentPlan;
}

export interface PayGoDevicePaymentPlan {
  payment_timeline: DevicePaymentTimelineEnum;
  plan: DevicePaymentPlan;
  initialization_amount: number;
  //   the amount to be paid in each installment timeline,either weekly or monthly
  installment_value: number;
  has_completed_payment: boolean;
  amount_paid_already: number;
  increment_number: number;

  retail_value: number;
}

export interface DeviceCategorySub {
  _id: string;
  model: string;
  description: string;
  status: BaseStatusEnum;
  amount: number;
}

export interface UserSub {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  location: Point;
}

// device code

export interface PayGoDeviceCode {
  user_id: string | null;
  device_id: string;
  code: string;
  // NOTE:
  increment_counter: number;
  // NOTE: this is to know the next code to pass to the user.
  next_counter: number
  current_counter: number;
//   either weekly or monthly, that is 7 or 30 days
  time_range: number;
  // NOTE: this is to know if the user has used the code, because the admin will have a list of the codes that have been generated and which has been used
  is_used: boolean;
  // this is to know the final code for disabling the paygo standard in the device
  is_disable_code: boolean;
  // this is to know the current code that was used, and will be used to get the code and it's next counter.
  is_current_code: boolean;
  // this is to know the code to finally disable the paygo feature
  is_master_code: boolean;
}

// DEVICE CLASS
export interface DeviceClass {
    _id: string
    name:string
    description:string
    status: DeviceClassStatusEnum
    createdAt: string
    updatedAt: string

}
// DEVICE CATEGORY GROUP

export interface DeviceCategoryGroup {
  _id: string
  device_class: string;
  name: string;
  description: string;
  status: DeviceCategoryGroupStatusEnum;
  createdAt: string;
  updatedAt: string;
}