import { paymentApi } from "@/services/payment.api";
import {
  UploadInvoicePaymentReceiptDto,
  UploadActivateOrderPaymentReceiptDto,
} from "@/types/payment.type";
import { BaseCursorPaginationInterface } from "@/types/shared";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetActiveInvoice = () => {
  return useQuery({
    queryKey: ["next-payment-invoice"],
    queryFn: () => paymentApi.getActiveInvoice(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetAllInvoices = (params: BaseCursorPaginationInterface) => {
  return useQuery({
    queryKey: ["all-invoices"],
    queryFn: () => paymentApi.getAllInvoices(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// to get active bank account for manual payment.
export const useGetActiveBankAccount = (deviceCategoryId: string) => {
  return useQuery({
    queryKey: ["active-bank-account"],
    queryFn: () => paymentApi.getActiveBankAccount(deviceCategoryId),
    staleTime: 5 * 60 * 1000,
  });
};
export const useInitializeInvoicePayment = () => {
  return useMutation({
    mutationKey: ["initialize-recurring-payment"],
    mutationFn: (invoiceId: string) =>
      paymentApi.initializeInvoicePayment(invoiceId),
  });
};

export const useActivateOrder = () => {
  return useMutation({
    mutationKey: ["activate-order"],
    mutationFn: (orderId: string) => paymentApi.activateOrder(orderId),
  });
};
export const useUploadInvoicePaymentReceipt = () => {
  return useMutation({
    mutationKey: ["upload-invoice-payment-receipt"],
    mutationFn: (dto: UploadInvoicePaymentReceiptDto) =>
      paymentApi.uploadInvoicePaymentReceipt(dto),
  });
};

export const useUploadActivateOrderPaymentReceipt = () => {
  return useMutation({
    mutationKey: ["upload-activate-order-payment-receipt"],
    mutationFn: (dto: UploadActivateOrderPaymentReceiptDto) =>
      paymentApi.uploadActivateOrderPaymentReceipt(dto),
  });
};