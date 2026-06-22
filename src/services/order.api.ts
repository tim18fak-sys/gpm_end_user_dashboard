import { AxiosInstance } from "axios";
import { api } from "./api";
import {
  BaseCursorPaginationInterface,
  BaseDataInterface,
  BaseMessageInterface,
} from "@/types/shared";
import { StandardOrder } from "@/types/order.types";
import {
  DevicePaymentTimelineEnum,
  DevicePaymentPlan,
} from "@/enum/device.enum";

// DTO
export interface CreateStandardOrderDTO {
  deviceCategoryId: string;
  // quantity is alway 1
  paymentTimeline: DevicePaymentTimelineEnum;
  plan: DevicePaymentPlan;
}
export interface CancelStandardOrderDTO {
  orderId: string;
}
export interface GetAllOrderCursorPaginationDTO extends BaseCursorPaginationInterface {}
export interface GetStandardOrderDetailsDTO {
  orderId: string;
}

// SERVER RESPONSES
export interface GetAllOrderCursorPaginationServerResponse
  extends BaseCursorPaginationInterface, BaseDataInterface<StandardOrder[]> {}
export interface GetStandardOrderDetailsServerResponse extends BaseDataInterface<StandardOrder> {}
export interface CreateNewStandardOrderServerResponse extends BaseMessageInterface {}
export interface CancelStandardOrderServerResponse extends BaseMessageInterface {}

export class OrderApi {
  private endpoint = "/v1/order-management/customer";
  constructor(private axios: AxiosInstance) {}
  // get all orders.
  async getAllOrders(
    params: GetAllOrderCursorPaginationDTO,
  ): Promise<GetAllOrderCursorPaginationServerResponse> {
    try {
      const response = await this.axios.get(`${this.endpoint}/all`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }
  // get order details
  async getOrderDetails(
    params: GetStandardOrderDetailsDTO,
  ): Promise<GetStandardOrderDetailsServerResponse> {
    try {
      const response = await this.axios.get(
        `${this.endpoint}/${params.orderId}/one`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  }

  // create a new order
  async createNewOrder(
    data: CreateStandardOrderDTO,
  ): Promise<CreateNewStandardOrderServerResponse> {
    try {
      const response = await this.axios.post(`${this.endpoint}/create`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating new order:", error);
      throw error;
    }
  }

  // cancel order
  async cancelOrder(
    data: CancelStandardOrderDTO,
  ): Promise<CancelStandardOrderServerResponse> {
    try {
      const response = await this.axios.post(`${this.endpoint}/cancel`, data);
      return response.data;
    } catch (error) {
      console.error("Error canceling order:", error);
      throw error;
    }
  }
}

export const orderApi = new OrderApi(api);
