import { DevicePaymentTimelineEnum, DevicePaymentPlan } from "@/enum/device.enum";
import { OrderTypeEnum, OrderStatusEnum, OrderUserTypeEnum, OrderDirectionFlowEnum } from "@/enum/order.enum";

export interface StandardOrder {
  deviceCategoryId: string;
  //     // this is the hub that the lead was gotten from, based on the agent that created the lead.
  //    @Prop({required: true, type: mongoose.Schema.string})
  //    hubId: string;
  // who created the order
  originId: string;
  type: OrderTypeEnum;
  status: OrderStatusEnum;
  createdBy: OrderUserTypeEnum;
  createdById: string;

  //   this is the discriminator key that will be used to differentiate between the different order classes, such as standard order, and request order.
  //   @Prop({ type: String, enum: OrderClassEnum })
  //   orderClass: OrderClassEnum;
  directionFlow: OrderDirectionFlowEnum;
  //   destination of the order.
  //   if null it means that the order is request from the hub to the warehouse.
  // add a flow that the system check which warehouse has available products,and assigns it has the destination of the order.
  destinationId: string | null;

  // if the primary destination do not have the device category in stock, the system would reassign the order to a secondary destination, and update the destinationId to the new destination. The secondary destination is just for record purpose, it would move the prev destination to the secondary destination, and update the destinationId to the new destination. This would also be used for transfer of order when a customer makes an order and tht hub does not have to device category in stock, the hub can transfer the order to another hub that has the device category in stock, and the system would update the destinationId to the new hub, and move the prev destinationId to the secondaryDestinationId for record purpose.
  secondaryDestinationId: string | null;
  destinationUserType: OrderUserTypeEnum | null;

  // extra storage for any additional information that might be needed.
  metadata: StandardOrderMetaData;
  tripId: string | null;

  // loooking at adding status change history, to track the status changes of the order, and to show it on the frontend for better tracking of the order.
  // LATER: move this to a separate collection and reference it in the order schema, to avoid the order document from getting too big, and to improve the performance of the order queries.
  statusChangeHistory: {
    status: OrderStatusEnum;
    changedAt: Date;
    reason: string;
  }[];
  shippingAddress: string;
}


interface StandardOrderMetaData {
  agentId: string
  paymentTimeline: DevicePaymentTimelineEnum;
  plan: DevicePaymentPlan;
  customerProfile: {
    email: string;
    firstName: string;
    lastName: string;
    location: string;
    address: string;
    phoneNumber: string;
  };

  // payment
  initializationAmount: number;
  // initialization amount plus the installment value multiplied by the number of installments, which is the total amount the customer will pay for the device.
  deviceAmount: number;
  installmentValue:number;
  hubId: string;
}