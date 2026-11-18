import {
  DeviceCategory,
  DeviceCategoryPaymentDurationOptionEnum,
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
    // if manual calculation is allowed, we use the monthly value * the number of months to get the true amount
    if(deviceCategory.allow_manual_calculation_for_installment_payment){
      const monthlyAmount = deviceCategory.installment_payment_durations_option.find(
        (option) =>
          option.duration_option ===
          DeviceCategoryPaymentDurationOptionEnum.MONTHLY,
      )?.amount;
      // now we multiply the monthly amount by the number of months to get the true amount
      if(monthlyAmount){
        const trueTotal = monthlyAmount * deviceCategory.installment_duration_available;
        return trueTotal.toFixed(2) as unknown as number; // return as number with 2 decimal places
      }
      // also check if weekly is available, if so we multiply by the number of weeks to get the true amount
      const weeklyAmount = deviceCategory.installment_payment_durations_option.find(
        (option) =>
          option.duration_option ===
          DeviceCategoryPaymentDurationOptionEnum.WEEKLY,
      )?.amount;
      if(weeklyAmount){
        const trueTotal = weeklyAmount * deviceCategory.installment_duration_available * 4; // multiply by 4 to get the number of weeks in a month

        return trueTotal.toFixed(2) as unknown as number; // return as number with 2 decimal places
      }
    }
    //installment_initialization_percentage
    const initPct =
      Number(deviceCategory.installment_initialization_percentage) || 0;

    const interestRate = Number(deviceCategory.installment_interest_rate) || 0;
    const initAmount = (initPct / 100) * deviceCategory.amount;
    const fundAfterDownPayment = deviceCategory.amount - initAmount;
    const interestAmount = (interestRate / 100) * fundAfterDownPayment;
    const totalToFinance = fundAfterDownPayment + interestAmount;
    const trueTotal = initAmount + totalToFinance;
    return trueTotal.toFixed(2) as unknown as number; // return as number with 2 decimal places
  }
};
