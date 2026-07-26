import {
  DeviceCategory,
  DeviceCategoryPaymentOptionEnum,
} from "@/types/deviceCategory";

// this the payment calculation helper
export const getTrueAmountFromDeviceCategory = (
  deviceCategory: DeviceCategory,
): number => {
  // we select the first payment option for the device category
  const selectedPaymentOption = deviceCategory.payment_option[0];
  if (selectedPaymentOption === DeviceCategoryPaymentOptionEnum.OUTRIGHT) {
    return deviceCategory.amount;
  } else {
    //installment_initialization_percentage
    const initPct =
      Number(deviceCategory.installment_initialization_percentage) || 0;

    const interestRate = Number(deviceCategory.installment_interest_rate) || 0;
    const initAmount = (initPct / 100) * deviceCategory.amount;
    const fundAfterDownPayment = deviceCategory.amount - initAmount;
    const interestAmount = (interestRate / 100) * fundAfterDownPayment;
    const totalToFinance = fundAfterDownPayment + interestAmount;
    const trueTotal = initAmount + totalToFinance;
    return trueTotal;
  }
};
