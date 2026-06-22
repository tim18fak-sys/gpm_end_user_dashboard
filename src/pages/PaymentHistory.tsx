import { useGetActiveInvoice, useGetAllInvoices } from "@/hooks/usePayment";
import React from "react";

function PaymentHistory() {
  const {} = useGetAllInvoices();
  const {} = useGetActiveInvoice();
  return <div>PaymentHistory</div>;
}

export default PaymentHistory;
