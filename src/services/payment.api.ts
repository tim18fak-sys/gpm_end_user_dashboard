import { Invoice } from "@/types/payment.type";
import {
  BaseCursorPaginationInterface,
  BaseDataInterface,
} from "@/types/shared";
import { AxiosInstance } from "axios";
import { api } from "./api";

// if null, it means that the user is an outright payment user, so we are not needing to create an invoice.
export interface GetNextPaymentInvoiceResponse extends BaseDataInterface<Invoice | null> {}

export interface GetAllInvoicesResponse
  extends BaseCursorPaginationInterface, BaseDataInterface<Invoice[]> {}

export interface InitializePaymentResponse extends BaseDataInterface<{
  authorization_url: string;
  reference: string;
}> {
    status: boolean;
}
export class PaymentApi {
  private endpoint = "/v1/invoice/customer";
  private paystackEndpoint = "/v1/payment/customer";
  constructor(private axios: AxiosInstance) {}

  // get next payment date and amount invoice.
  async getActiveInvoice(): Promise<GetNextPaymentInvoiceResponse> {
    try {
      const response = await this.axios.get(`${this.endpoint}/active-invoice`);
      return response.data;
    } catch (error) {
      console.error("Error fetching next payment invoice:", error);
      throw error;
    }
  }
  // initialization payment
  async initializeInvoicePayment(
    invoiceId: string,
  ): Promise<InitializePaymentResponse> {
    try {
      const response = await this.axios.post(
        `${this.paystackEndpoint}/initialize-invoice-payment`,
        {
          invoiceId,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error initializing payment:", error);
      throw error;
    }
  }
  //   after creating an order, we activate it, by generating the payment link for the user.
  async activateOrder(orderId: string): Promise<InitializePaymentResponse> {
    try {
      const response = await this.axios.post(
        `${this.paystackEndpoint}/activate-order`,
        {
          orderId,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error activating order:", error);
      throw error;
    }
  }
  // get all invoices of the user.
  async getAllInvoices(
    params: BaseCursorPaginationInterface,
  ): Promise<GetAllInvoicesResponse> {
    try {
      const response = await this.axios.get(`${this.endpoint}/invoices`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all invoices:", error);
      throw error;
    }
  }
}


export const paymentApi = new PaymentApi(api)