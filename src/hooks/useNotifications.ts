
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationAPI } from '../services/notification.api'
import toast from 'react-hot-toast'

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params: any) => [...notificationKeys.lists(), params] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
  unreadList: (params: any) => [...notificationKeys.unread(), params] as const,
  detail: (id: string) => [...notificationKeys.all, 'detail', id] as const,
}

// Get all notifications with polling
export const useNotifications = (params: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationAPI.getAll(params),
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 0,
  })
}

// Get unread notifications with polling
export const useUnreadNotifications = (params: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: notificationKeys.unreadList(params),
    queryFn: () => notificationAPI.getUnread(params),
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 0,
  })
}

// Get single notification
export const useNotificationDetails = (id: string | null) => {
  return useQuery({
    queryKey: notificationKeys.detail(id!),
    queryFn: () => notificationAPI.getById(id!),
    enabled: !!id,
  })
}

// Mark as read mutation
export const useMarkAsRead = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: notificationAPI.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      toast.success('Notification marked as read')
    },
    onError: () => {
      toast.error('Failed to mark notification as read')
    },
  })
}

// Delete notification mutation
export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: notificationAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      toast.success('Notification deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete notification')
    },
  })
}
