
import { api } from './api'

export interface AnalyticsStats {
  totalUniversities: number
  totalStaff: number
  totalSHC: number
  activeUsers: number
  changes: {
    universities: string
    staff: string
    shc: string
    users: string
  }
}

export interface GrowthData {
  month: string
  universities: number
  staff: number
  shc: number
}

export interface StatusDistribution {
  name: string
  value: number
  color: string
}

export interface StaffDistribution {
  role: string
  count: number
  percentage: number
}

export interface RecentActivity {
  date: string
  universities: number
  staff: number
  shc: number
}

export interface AnalyticsData {
  stats: AnalyticsStats
  growthData: GrowthData[]
  universityStatusData: StatusDistribution[]
  staffDistributionData: StaffDistribution[]
  recentActivitiesData: RecentActivity[]
}

const ANALYTICS_API = '/v1/analytics'

export const analyticsAPI = {
  getDashboardStats: async (): Promise<AnalyticsStats> => {
    const response = await api.get(`${ANALYTICS_API}/dashboard-stats`)
    return response.data
  },

  getGrowthData: async (): Promise<GrowthData[]> => {
    const response = await api.get(`${ANALYTICS_API}/growth-data`)
    return response.data
  },

  getUniversityStatusDistribution: async (): Promise<StatusDistribution[]> => {
    const response = await api.get(`${ANALYTICS_API}/university-status`)
    return response.data
  },

  getStaffDistribution: async (): Promise<StaffDistribution[]> => {
    const response = await api.get(`${ANALYTICS_API}/staff-distribution`)
    return response.data
  },

  getRecentActivities: async (): Promise<RecentActivity[]> => {
    const response = await api.get(`${ANALYTICS_API}/recent-activities`)
    return response.data
  },

  getAllAnalytics: async (): Promise<AnalyticsData> => {
    const response = await api.get(`${ANALYTICS_API}/dashboard`)
    return response.data
  }
}

// Additional API endpoints for individual analytics
const base = '/v1/analytics/super_admin'

interface BaseInterface {
  total: number
  change: number
}

export interface SuperAdminActivityData {
  date: string
  universities: number
  staff: number
  shc: number
}

export interface SuperAdminStatusData {
  name: string
  value: number
  color: string
}

export const analyticApi = {
  totalUniversity: async (): Promise<BaseInterface> => {
    const response = await api.get(`${base}/university/total`)
    return response.data
  },

  totalShc: async (): Promise<BaseInterface> => {
    const response = await api.get(`${base}/shc/total`)
    return response.data
  },

  totalStaff: async (): Promise<BaseInterface> => {
    const response = await api.get(`${base}/staff/total`)
    return response.data
  },

  growthReport: async (): Promise<any> => {
    const response = await api.get(`${base}/growth/data`)
    return response.data
  },

  recentActivities: async (days: number): Promise<SuperAdminActivityData[]> => {
    const response = await api.get(`${base}?days=${days}`)
    return response.data
  },

  universityStatusDistribution: async (): Promise<SuperAdminStatusData[]> => {
    const response = await api.get(`${base}/university-status/distribution`)
    return response.data
  },

  activeUser: async (): Promise<BaseInterface> => {
    const response = await api.get(`${base}/active-user/count`)
    return response.data
  }
}
