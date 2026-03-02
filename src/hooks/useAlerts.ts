
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertAPI } from '../services/alert.api'
import toast from 'react-hot-toast'

// Hook for getting paginated alerts
export const useAlerts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['alerts ', page],
    queryFn: () => alertAPI.getAlerts(page, limit),
    refetchInterval: 30_000,
    staleTime: 25_000,
  })
}

// Hook for getting unread alerts
export const useUnreadAlerts = () => {
  return useQuery({
    queryKey: ['alerts', 'unread'],
    queryFn: () => alertAPI.getUnreadAlerts(),
    refetchInterval: 30_000,
    staleTime: 25_000,
  })
}

// Hook for getting single alert
export const useAlert = (id: string | null) => {
  return useQuery({
    queryKey: ['alerts', 'single', id],
    queryFn: () => alertAPI.getAlert(id!),
    enabled: !!id,
  })
}

// Hook for marking alert as read
export const useMarkAlertRead = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => alertAPI.markAlertRead(id),
    onSuccess: () => {
      // Invalidate both alerts queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      toast.success('Alert marked as read')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to mark alert as read')
    }
  })
}

// Hook for detecting new alerts
export const useNewAlertDetection = () => {
  const { data: unreadAlerts, } = useUnreadAlerts()
  
  const hasNewAlert = unreadAlerts && 
    unreadAlerts.data.length > 0
  
  const newAlertCount = hasNewAlert 
    ? unreadAlerts.data!.length > 0
    : 0
    
  return {
    hasNewAlert,
    newAlertCount,
    latestAlert: hasNewAlert ? unreadAlerts.data![0] : null
  }
}
