import {
  CancelStandardOrderDTO,
  CreateStandardOrderDTO,
  GetAllOrderCursorPaginationDTO,
  orderApi,
} from "@/services/order.api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllOrders = (params: GetAllOrderCursorPaginationDTO) => {
  return useQuery({
    queryKey: ["all-orders"],
    queryFn: () => orderApi.getAllOrders(params),
  });
};

// get order details
export const useGetOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => orderApi.getOrderDetails({ orderId }),
    enabled: !!orderId,
  });
};

// create a new order
export const useCreateNewOrder = () => {
  return useMutation({
    mutationFn: (data: CreateStandardOrderDTO) => orderApi.createNewOrder(data),
  });
};

// cancel order
export const useCancelOrder = () => {
  return useMutation({
    mutationFn: (data: CancelStandardOrderDTO) => orderApi.cancelOrder(data),
  });
};
