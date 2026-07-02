// get full device category details

import { DeviceCategory, DeviceCategoryPagination } from '@/types/deviceCategory'
import { BaseCursorPaginationInterface, BaseDataInterface } from '@/types/shared'
import { AxiosInstance } from 'axios'


// dto
export interface DeviceCursorPaginationDto {
  limit: number;
  prevCursor?: string;
  nextCursor?: string;
  search?: string;
  deviceGroupId?: string;
}

export interface DeviceCategoryGroupCursorPaginationDto {
  limit: number;
  prevCursor?: string;
  nextCursor?: string;
  search?: string;
  deviceClassId: string;
}

export interface DeviceClassCursorPaginationDto {
  limit: number;
  prevCursor?: string;
  nextCursor?: string;
  search?: string;
}
export interface GetLinkedDeviceInfoResponse
  extends BaseCursorPaginationInterface, BaseDataInterface<Device[]> {}

export interface GetAllActiveDeviceClassCursorPaginationResponse
  extends BaseCursorPaginationInterface, BaseDataInterface<DeviceClass[]> {}
export interface GetAllDeviceCategoryGroupByClassIdCursorPaginationResponse
  extends
    BaseCursorPaginationInterface,
    BaseDataInterface<DeviceCategoryGroup[]> {}

export interface GetAllDeviceCategoryByGroupIdCursorPaginationResponse
  extends BaseCursorPaginationInterface, BaseDataInterface<DeviceCategory[]> {}

export interface GetCurrentDeviceCodeResponse extends BaseDataInterface<PayGoDeviceCode> {}
export class DeviceCategoryApi {
  private endpoint = "/v1/device-category/customer";
  private deviceEndpoint = "/v1/device/customer";
  private deviceClassEndpoint = "/v1/device-category/customer";
  private deviceGroupEndpoint = "/v1/device-category-group/customer";
  private axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }
  // get the list of active device classes
  async getDeviceClasses(
    dto: DeviceClassCursorPaginationDto,
  ): Promise<GetAllActiveDeviceClassCursorPaginationResponse> {
    try {
      
      const response = await this.axios.get(`${this.deviceClassEndpoint}/all`, {
        params: dto,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching device classes:", error);
      throw error;
    }
  }
  // get device category groups by device class id
  async getDeviceCategoryGroups(
    params: DeviceCategoryGroupCursorPaginationDto,
  ): Promise<GetAllDeviceCategoryGroupByClassIdCursorPaginationResponse> {
    try {
      const response = await this.axios.get(`${this.deviceGroupEndpoint}/all`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching device category groups:", error);
      throw error;
    }
  }
  // get device categories by device category group id
  async getDeviceCategoriesByGroupId(
    params: DeviceCursorPaginationDto,
  ): Promise<GetAllDeviceCategoryByGroupIdCursorPaginationResponse> {
    try {
      const response = await this.axios.get(`${this.endpoint}/all`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching device categories by group id:", error);
      throw error;
    }
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
      const response = await this.axios.get(
        `${this.deviceEndpoint}/linked?limit=10`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching linked device info:", error);
      throw error;
    }
  }
  // get the device code current code, get the device id from the linked device information, and use it to get the current code for the device, and display it on the dashboard.
  async getCurrentDeviceCode(
    deviceId: string,
  ): Promise<GetCurrentDeviceCodeResponse> {
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
import {
  Device,
  DeviceCategoryGroup,
  DeviceClass,
  PayGoDeviceCode,
} from "@/types/device.type";
export const deviceCategoryApi = new DeviceCategoryApi(api)



// the flow:
/**
 * first get the device class
 * then get the device category group.
 * then get the device categories within that group.
 */