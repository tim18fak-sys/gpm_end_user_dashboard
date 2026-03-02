
import { api as apiClient } from './api'
import { SuperAdminAlert, AlertResponse } from '../types/alert'

export const alertAPI = {
  // Get all alerts with pagination
  getAlerts: async (page: number = 1, limit: number = 10): Promise<AlertResponse> => {
    const response = await apiClient.get('/v1/super-admin/alerts', {
      params: { page, limit }
    })
    return response.data
  },

  // Get unread alerts
  getUnreadAlerts: async (): Promise<{data:SuperAdminAlert[]}> => {
    const response = await apiClient.get('/v1/super-admin/alerts/unread')
    console.log(response.data, 'alert')
    return response.data
  },

  // Mark alert as read
  markAlertRead: async (id: string): Promise<SuperAdminAlert> => {
    const response = await apiClient.post(`/v1/super-admin/alerts/${id}/mark-read`)
    return response.data
  },

  // Get single alert
  getAlert: async (id: string): Promise<SuperAdminAlert> => {
    const response = await apiClient.get(`/v1/super-admin/alerts/${id}`)
    return response.data
  }
}
