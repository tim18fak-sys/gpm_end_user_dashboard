import { useMutation } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { KycRouterEnum } from '@/enum/kyc.router.enum'
import { kycApi } from '@/services/kyc.api'
import { ProcessKycDto } from '@/types/kyc'

interface IKycRouterProps {
  isKycVerified: boolean
  verificationStatus: KycRouterEnum
}

export const useKycRouter = ({ isKycVerified, verificationStatus }: IKycRouterProps) => {
  if (isKycVerified) return

  if (!isKycVerified && verificationStatus === KycRouterEnum.NONE) return <Navigate to={'/kyc'} replace />
  if (!isKycVerified && verificationStatus === KycRouterEnum.PENDING) return <Navigate to={'/kyc/pending-review'} replace />
  if (!isKycVerified && verificationStatus === KycRouterEnum.REJECTED) return <Navigate to={'/kyc/rejected-kyc-review'} replace />
}

export function useProcessKyc() {
  return useMutation({
    mutationFn: (data: ProcessKycDto) => kycApi.processKyc(data),
    onSuccess: (data) => {
      toast.success(data?.message || 'KYC documents submitted successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'KYC submission failed. Please try again.')
    },
  })
}
