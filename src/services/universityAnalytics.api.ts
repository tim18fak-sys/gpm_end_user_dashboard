
import { api } from './api'
import { 
  TotalResponse, 
  UniversityAdminGrowthData, 
  UniversityAdminUserGrowthData, 
  UniversityAdminOnboardingActivityData, 
  DataDistribution 
} from '../types/analytics'

export const universityAnalyticsApi = {
  // Total endpoints
  getTotalDepartments: (id: string): Promise<TotalResponse> =>
    api.get(`/v1/super-admin/university/analytics/departments/total?_id=${id}`).then(res => res.data),
  
  getTotalSectors: (id: string): Promise<TotalResponse> =>
    api.get(`/v1/super-admin/university/analytics/sectors/total?_id=${id}`).then(res => res.data),
  
  getTotalFaculties: (id: string): Promise<TotalResponse> =>
    api.get(`/v1/super-admin/university/analytics/faculties/total?_id=${id}`).then(res => res.data),
  
  getTotalStaff: (id: string): Promise<TotalResponse> =>
    api.get(`/v1/super-admin/university/analytics/staff/total?_id=${id}`).then(res => res.data),
  
  getTotalUsers: (id: string): Promise<TotalResponse> =>
    api.get(`/v1/super-admin/university/analytics/users/total?_id=${id}`).then(res => res.data),
  
  getTotalActiveUsers: (id: string): Promise<TotalResponse> =>
    api.get(`/v1/super-admin/university/analytics/users/active/total?_id=${id}`).then(res => res.data),

  // Growth endpoints
  getOverallGrowth: (id: string): Promise<UniversityAdminGrowthData[]> =>
    api.get(`/v1/super-admin/university/analytics/growth/overall?_id=${id}`).then(res => res.data),
  
  getUserGrowth: (id: string): Promise<UniversityAdminUserGrowthData[]> =>
    api.get(`/v1/super-admin/university/analytics/growth/users?_id=${id}`).then(res => res.data),

  // Activity endpoints
  getOnboardingActivity: (id: string, days: number = 7): Promise<UniversityAdminOnboardingActivityData[]> =>
    api.get(`/v1/super-admin/university/analytics/onboarding/activity?_id=${id}&days=${days}`).then(res => res.data),

  // Distribution endpoints
  getRoleDistribution: (id: string): Promise<DataDistribution[]> =>
    api.get(`/v1/super-admin/university/analytics/distribution/roles?_id=${id}`).then(res => res.data),
  
  getOnboardingDistribution: (id: string): Promise<DataDistribution[]> =>
    api.get(`/v1/super-admin/university/analytics/distribution/onboarding?_id=${id}`).then(res => res.data),
}
