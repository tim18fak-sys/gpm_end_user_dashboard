import { kycApi } from "@/services/kyc.api";
import { ManualKycVerificationDto } from "@/types/kyc";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useVerifyNinManually() {
  return useMutation({
    mutationFn: (data: ManualKycVerificationDto) =>
      kycApi.verifyNinManually(data),
    onSuccess: (data) => {
      toast.success(
        data?.message || "NIN verification submitted successfully!",
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Verification failed. Please try again.",
      );
    },
  });
}
