import { useLinkedDeviceInfo, useCurrentDeviceCode } from "@/hooks/useDeviceCategory"
import { useGetActiveInvoice } from "@/hooks/usePayment"

const Dashboard = () => {
  // get the device information, and the current device code so it can be displayed on the dashboard.
  const {} = useLinkedDeviceInfo()
  // get the device id from the response of the useLinkedDeviceInfo hook
  const {} = useCurrentDeviceCode()
  // get the next payment date and the amount to be paid, and display it on the dashboard
  const {} = useGetActiveInvoice()
  // if no device linked, display a message to the user to link a device to see the dashboard, and once they click on it, we navigate them to the order page, to create an order and link a device to their account.
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard