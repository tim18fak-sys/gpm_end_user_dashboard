// get full device category details

import { DeviceCategory, DeviceCategoryPagination } from '@/types/deviceCategory'
import { BaseDataInterface } from '@/types/shared'
import { AxiosInstance } from 'axios'

export interface DeviceCursorPaginationDto {
  limit: number;
  prevCursor?: string;
  nextCursor?: string;
  search?: string;
  paymentTimeline: string;
}


export interface GetLinkedDeviceInfoResponse extends BaseDataInterface<Device|null> {}

export interface GetCurrentDeviceCodeResponse extends BaseDataInterface<PayGoDeviceCode> {}
export class DeviceCategoryApi {
  private endpoint = "/v1/customer/device/category";
  private deviceEndpoint = "/v1/customer/device";
  private axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }
  // list out the device categories that support the payment timeline the user onboarded with.
  async getDeviceCategories(
    params: DeviceCursorPaginationDto,
  ): Promise<DeviceCategoryPagination> {
    try {
      const response = await this.axios.get(`${this.endpoint}/all`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching device categories:", error);
      throw error;
    }
  }

  async getDeviceCategoryDetails(
    id: string,
  ): Promise<BaseDataInterface<DeviceCategory>> {
    try {
      const response = await this.axios.get(`${this.endpoint}/${id}/one`);
      return response.data;
    } catch (error) {
      console.error("Error fetching device category details:", error);
      throw error;
    }
  }

  // get the device information for the linked user
  async getLinkedDeviceInfo(): Promise<GetLinkedDeviceInfoResponse> {
    try {
      const response = await this.axios.get(`${this.deviceEndpoint}/linked`);
      return response.data;
    } catch (error) {
      console.error("Error fetching linked device info:", error);
      throw error;
    }
  }
  // get the device code current code, get the device id from the linked device information, and use it to get the current code for the device, and display it on the dashboard.
  async getCurrentDeviceCode(deviceId:string): Promise<GetCurrentDeviceCodeResponse> {
    try {
      const response = await this.axios.get(
        `${this.deviceEndpoint}/${deviceId}/current-code`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching current device code:", error);
      throw error;
    }
  }
}

import { api } from './api'
import { Device, PayGoDeviceCode } from "@/types/device.type";
export const deviceCategoryApi = new DeviceCategoryApi(api)