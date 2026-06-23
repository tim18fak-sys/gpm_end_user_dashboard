import { paymentApi } from "@/services/payment.api"
import { BaseCursorPaginationInterface } from "@/types/shared";
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGetActiveInvoice = () => {
    return useQuery({
        queryKey: ['next-payment-invoice'],
        queryFn: () => paymentApi.getActiveInvoice(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export const useGetAllInvoices = (params: BaseCursorPaginationInterface) => {
  return useQuery({
    queryKey: ["all-invoices"],
    queryFn: () => paymentApi.getAllInvoices(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInitializeInvoicePayment = () => {
    return useMutation({
        mutationKey: ['initialize-recurring-payment', ],
        mutationFn: (invoiceId: string) => paymentApi.initializeInvoicePayment(invoiceId),
    })
}

export const useActivateOrder = () => {
    return useMutation({
        mutationKey: ['activate-order'],
        mutationFn: (orderId:string) => paymentApi.activateOrder(orderId),
    })
}