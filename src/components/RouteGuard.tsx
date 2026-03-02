
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useRBAC } from '../hooks/useRBAC'

interface RouteGuardProps {
  children: ReactNode
  requiredRoles?: string[]
  requiredPrivileges?: string[]
}

export const RouteGuard = ({ children, requiredRoles, requiredPrivileges }: RouteGuardProps) => {
  const { isAuthenticated, user } = useAuthStore()
  const { canAccess } = useRBAC()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user?.status === 'deactivated') {
    return <Navigate to="/deactivation-screen" replace />
  }

  if (!canAccess(requiredRoles, requiredPrivileges)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
