
import { api } from './api'

export interface CreateStaffRequest {
  first_name: string
  last_name: string
  email: string
  role: StaffRole
  privileges: string[]
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {
  id: string
}

export interface StaffMember {
  _id: string
  first_name: string
  last_name: string
  email: string
  role: StaffRole
  privileges: string[]
  status: 'activated' | 'deactivated'
  phone?: string
  profile_picture_url?: string
  last_login_at?: string
  is_login: boolean
  assigned_by?: string
  created_at: string
  updated_at: string
  bio?: string
}

export enum StaffRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SUPPORT = 'support',
  CUSTOM = 'custom'
}

export interface StaffListResponse {
  data: StaffMember[]
  page: number
  is_new: boolean,
  total:number
}

export interface StaffFilters {
  page?: number
  limit?: number
  search?: string
  role?: StaffRole
  status?: string
}

const STAFF_API = '/v1/super_admin/staff_management'

export const staffAPI = {
  getStaff: async (filters: StaffFilters = {}): Promise<StaffListResponse> => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value))
      }
    })
    
    const response = await api.get(`${STAFF_API}?${params.toString()}`)
    return response.data
  },

  getStaffById: async (id: string): Promise<StaffMember > => {
    const response = await api.get(`${STAFF_API}/${id}`)
    return response.data
  },

  createStaff: async (data: CreateStaffRequest): Promise<{ data: StaffMember }> => {
    const response = await api.post(`${STAFF_API}`, data)
    return response.data
  },

  updateStaff: async (id: string, data: Partial<CreateStaffRequest>): Promise<{ data: StaffMember }> => {
    const response = await api.patch(`${STAFF_API}/${id}`, data)
    return response.data
  },

  deleteStaff: async (id: string): Promise<void> => {
    await api.delete(`${STAFF_API}/${id}`)
  },

  activateStaff: async (id: string): Promise<{ message: string }> => {
    const response = await api.patch(`${STAFF_API}/${id}/activate`)
    return response.data
  },

  deactivateStaff: async (id: string): Promise<{ message: string }> => {
    const response = await api.patch(`${STAFF_API}/${id}/deactivate`)
    return response.data
  }
}

// Available privileges for the system
export const AVAILABLE_PRIVILEGES = [
  'read_dashboard',
  'read_analytics',
  'write_analytics',
  'read_users',
  'write_users',
  'delete_users',
  'read_universities',
  'write_universities',
  'delete_universities',
  'read_shc_committees',
  'write_shc_committees',
  'delete_shc_committees',
  'read_news',
  'write_news',
  'delete_news',
  'read_staff',
  'write_staff',
  'delete_staff',
  'manage_settings',
  'manage_billing'
] as const

export type Privilege = typeof AVAILABLE_PRIVILEGES[number]
