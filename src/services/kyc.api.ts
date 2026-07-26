import {
  ManualKycVerificationDto,
  // ProcessKycDto,
  // ProcessKycResponse,
} from "@/types/kyc";
import { api } from "./api";
import { BaseMessageInterface } from "@/types/shared";

const KYC_API = "/v1/auth/kyc/customer";

class KycApiService {
  // async processKyc(data: ProcessKycDto): Promise<ProcessKycResponse> {
  //   const response = await api.post<ProcessKycResponse>(
  //     `${KYC_API}/process`,
  //     data,
  //   );
  //   return response.data;
  // }

  async verifyNinManually(
    data: ManualKycVerificationDto,
  ): Promise<BaseMessageInterface> {
    const response = await api.patch<BaseMessageInterface>(
      `${KYC_API}/verify-nin-manually`,
      data,
    );
    return response.data;
  }
}

export const kycApi = new KycApiService();
