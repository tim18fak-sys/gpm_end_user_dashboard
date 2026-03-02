
import { useAuthStore, LeadStatusEnum } from '../store/authStore'

export const useRBAC = () => {
  const { user } = useAuthStore()

  const hasStatus = (status: LeadStatusEnum): boolean => {
    return user?.status === status
  }

  const hasAnyStatus = (statuses: LeadStatusEnum[]): boolean => {
    return statuses.some(status => hasStatus(status))
  }

  const isQualified = (): boolean => {
    return user?.status === LeadStatusEnum.QUALIFIED || user?.status === LeadStatusEnum.CONVERTED
  }

  const canAccess = (requiredStatuses?: LeadStatusEnum[]): boolean => {
    if (!user) return false
    if (!requiredStatuses) return true
    return hasAnyStatus(requiredStatuses)
  }

  return {
    hasStatus,
    hasAnyStatus,
    isQualified,
    canAccess,
    user
  }
}
