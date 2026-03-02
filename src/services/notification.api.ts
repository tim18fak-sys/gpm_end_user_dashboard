
import { api as apiClient } from './api'
import { SuperAdminNotification, NotificationResponse } from '../types/notification'

export const notificationAPI = {
  // List all notifications
  getAll: async (params: { page?: number; limit?: number } = {}): Promise<NotificationResponse> => {
    const { data } = await apiClient.get('/v1/super-admin/notification', { params })
    console.log(data)
    return data
  },

  // List unread notifications
  getUnread: async (params: { page?: number; limit?: number } = {}): Promise<NotificationResponse> => {
    const { data } = await apiClient.get('/v1/super-admin/notification/unread', { params })
    return data
  },

  // Get single notification
  getById: async (id: string): Promise<SuperAdminNotification> => {
    const { data } = await apiClient.get(`/v1/super-admin/notification/${id}`)
    return data
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<void> => {
    await apiClient.post(`/v1/super-admin/notification/${id}/mark-read`)
  },

  // Delete notification
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/super-admin/notification/${id}`)
  }
}
