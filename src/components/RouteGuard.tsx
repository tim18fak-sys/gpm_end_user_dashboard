
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore, LeadStatusEnum } from '../store/authStore'

interface RouteGuardProps {
  children: ReactNode
  requiredStatuses?: LeadStatusEnum[]
}

export const RouteGuard = ({ children, requiredStatuses }: RouteGuardProps) => {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user?.status === LeadStatusEnum.UNQUALIFIED) {
    return <Navigate to="/deactivation-screen" replace />
  }

  if (requiredStatuses && !requiredStatuses.includes(user?.status)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
