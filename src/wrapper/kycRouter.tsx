
import { KycRouterEnum } from '@/enum/kyc.router.enum'
import  { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

interface IKycRouterWrapperProps extends PropsWithChildren {
    isKycVerified:boolean,
    verificationStatus:KycRouterEnum
}
const KycRouterWrapper = ({ isKycVerified, verificationStatus,children }: IKycRouterWrapperProps) => {
  
    console.log('KycRouterWrapper - isKycVerified:', isKycVerified, 'verificationStatus:', verificationStatus)
      if(!isKycVerified && verificationStatus ===  KycRouterEnum.NONE) return <Navigate to={'/kyc'} replace/>
      if(!isKycVerified && verificationStatus === KycRouterEnum.PENDING) return <Navigate to={'/kyc/pending'} replace/>
      if(!isKycVerified && verificationStatus === KycRouterEnum.REJECTED) return <Navigate to={'/kyc/rejected'} replace/>

      return <>{children}</>
}

export default KycRouterWrapper