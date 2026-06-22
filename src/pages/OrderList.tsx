import { DevicePaymentTimelineEnum } from "@/enum/device.enum";
import { useDeviceCategories } from "@/hooks/useDeviceCategory";
import {
  useGetAllOrders,
  useGetOrderDetails,
  useCreateNewOrder,
  useCancelOrder,
} from "@/hooks/useOrder";
import { useAuthStore } from "@/store/authStore";

function OrderList() {
  const {} = useGetAllOrders();
  const {} = useGetOrderDetails();
  const {} = useCreateNewOrder();
  const {} = useCancelOrder();
  const { user } = useAuthStore();
  const paymentTimeline = user.paymentTimeline;
  //   to get device categories that support the payment timeline, we can use the useDeviceCategories hook and pass the payment timeline
  const {} = useDeviceCategories(
    {
      paymentTimeline: paymentTimeline as DevicePaymentTimelineEnum,
    },
    paymentTimeline ? true : false,
  );
  //   to get all device category, in case the selected timeline is not supported, the user can select another timeline that is supported, we can use the useDeviceCategories hook and pass the payment timeline
  const {} = useDeviceCategories(
    {
      paymentTimeline: undefined,
    },
    true,
  );
  // get device category that supports the payment timeline in the user object in the useAuthStore
  return <div>OrderList</div>;
}

export default OrderList;
