
import { useAuthStore } from '../store/authStore'

export const useRBAC = () => {
  const { user } = useAuthStore()

  const hasRole = (role: string): boolean => {
    return user?.role?.includes(role) || false
  }

  const hasPrivilege = (privilege: string): boolean => {
    return user?.privileges?.includes(privilege) || false
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role))
  }

  const hasAnyPrivilege = (privileges: string[]): boolean => {
    return privileges.some(privilege => hasPrivilege(privilege))
  }

  const canAccess = (requiredRoles?: string[], requiredPrivileges?: string[]): boolean => {
    if (!user) return false
    
    const roleCheck = !requiredRoles || hasAnyRole(requiredRoles)
    const privilegeCheck = !requiredPrivileges || hasAnyPrivilege(requiredPrivileges)
    
    return roleCheck && privilegeCheck
  }

  return {
    hasRole,
    hasPrivilege,
    hasAnyRole,
    hasAnyPrivilege,
    canAccess,
    user
  }
}
