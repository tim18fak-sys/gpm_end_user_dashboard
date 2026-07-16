import { InvoiceStatusEnum } from "@/enum/payment.enum";
import {
  BaseCursorPaginationInterface,
  BaseDataInterface,
  BaseMessageInterface,
} from "./shared";

export interface Invoice {
  // let this be an embedded document, so that the admin can quickly see the user information in a single query without having to populate the user information.
  userId: InvoiceUserInfoSubSchema | null;
  nextPaymentDate: Date;
  amount: number;
  agentId: string;
  hubId: string;
  status: InvoiceStatusEnum;
  deviceId: string;
  //   this is the history array that will store the history of the invoice, so that we can track the changes of the invoice and also to help with debugging and auditing. It's after updating the status from pending, to paid, to overdue, to cancelled, and to refunded, we will push the previous status, amount, due date, and updated at date to the history array, so that we can track the changes of the invoice and also to help with debugging and auditing.
  history: {
    status: InvoiceStatusEnum;
    amount: number;
    dueDate: Date;
    paymentDate: Date | null;
    updatedAt: Date;
  }[];

  //   this is a flag to know the current invoice of that user, so we can easily query the current invoice of the user.

  isCurrent: boolean;
}

export interface BankAccount {
  _id: string;
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
}

export interface InvoiceUserInfoSubSchema {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

// manual payment receipt upload request
export interface UploadActivateOrderPaymentReceiptDto {
  orderId: string;
  amountPaid: number;
  receiptUrl: string;
  bankId: string;
}
export interface UploadInvoicePaymentReceiptDto {
  invoiceId: string;
  amountPaid: number;
  receiptUrl: string;
  bankId: string;
}
// manual payment receipt upload response

export interface UploadActivateOrderPaymentReceiptResponse extends BaseMessageInterface {}
export interface UploadInvoicePaymentReceiptResponse extends BaseMessageInterface {}
export interface GetAllActiveBankAccountCursorPaginationResponse
  extends BaseCursorPaginationInterface, BaseDataInterface<BankAccount[]> {}