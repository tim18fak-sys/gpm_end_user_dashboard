import { ProcessKycDto, ProcessKycResponse } from '@/types/kyc'
import { api } from './api'


const KYC_API = '/v1/auth/kyc/user'

class KycApiService {
  async processKyc(data: ProcessKycDto): Promise<ProcessKycResponse> {
    const response = await api.post<ProcessKycResponse>(`${KYC_API}/process`, data)
    return response.data
  }
}

export const kycApi = new KycApiService()
