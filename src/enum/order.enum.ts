export enum OrderTypeEnum {
  // THIS IS FROM THE HUB BACK TO THE WAREHOUSE OR TO A DIFFERENT HUB
  TRANSFER_ORDER = "TRANSFER_ORDER",
  // THIS IS FROM THE WAREHOUSE TO THE HUB
  SHIPPING_ORDER = "SHIPPING_ORDER",
  // THIS IS FROM THE CUSTOMER
  RETURN_ORDER = "RETURN_ORDER",
  //
}

export enum OrderStatusEnum {
  // this is from the customer side, that is they created the order but have not made payment yet.
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
  ON_HOLD = "ON_HOLD",
  FAILED = "FAILED",
  PARTIALLY_COMPLETED = "PARTIALLY_COMPLETED",
  PARTIALLY_CANCELLED = "PARTIALLY_CANCELLED",
  PARTIALLY_REJECTED = "PARTIALLY_REJECTED",
}

// this is the type of user class that are using the order system
export enum OrderUserTypeEnum {
  HUB = "HUB",
  WAREHOUSE = "WAREHOUSE",
  CUSTOMER = "CUSTOMER",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

export enum OrderClassEnum {
  // this is the standard order class, which is the default order class for all orders. it is used for all orders that do not fall under any other order class.
  STANDARD = "STANDARD",
  // THIS ARE ORDER REQUEST FROM THE HUB TO THE WAREHOUSE.
  REQUEST = "REQUEST",
}

export enum OrderDirectionFlowEnum {
  // this is the flow of the order from the hub to the warehouse
  HUB_TO_WAREHOUSE = "HUB_TO_WAREHOUSE",
  // this is the flow of the order from the warehouse to the hub
  WAREHOUSE_TO_HUB = "WAREHOUSE_TO_HUB",
  // this is the flow of the order from the customer to the hub
  CUSTOMER_TO_HUB = "CUSTOMER_TO_HUB",
  // this is the flow of the order from the hub to the customer
  HUB_TO_CUSTOMER = "HUB_TO_CUSTOMER",
}
