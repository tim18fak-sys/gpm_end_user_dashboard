
import { api } from './api'
import type { University, CreateUniversityDto, UniversityFilters, UniversityResponse } from '../types/university'
import type { CompleteUniversitySetupDto } from '../types/universitySetup'
const base = '/v1/university_management'
export const universityAPI = {
  getUniversities: async (filters: UniversityFilters): Promise<UniversityResponse> => {
    const params = new URLSearchParams()
    if (filters.status && filters.status !== 'all') params.append('status', filters.status)
    if (filters.assignment_status && filters.assignment_status !== 'all') params.append('assignment_status', filters.assignment_status)
    if (filters.search) params.append('search', filters.search)
    params.append('page', filters.page.toString())
    params.append('limit', filters.limit.toString())

    const response = await api.get(`${base}?${params.toString()}`)
    return response.data
  },

  getUniversity: async (id: string): Promise<University> => {
    const response = await api.get(`${base}/${id}`)
    return response.data
  },

  createUniversity: async (data: CreateUniversityDto): Promise<University> => {
    const response = await api.post(`${base}`, data)
    return response.data
  },

  updateUniversity: async (id: string, data: Partial<University>): Promise<University> => {
    const response = await api.put(`${base}/${id}`, data)
    return response.data
  },

  activateUniversity: async (id: string): Promise<University> => {
    const response = await api.patch(`${base}/${id}/activate`)
    return response.data
  },

  deactivateUniversity: async (id: string): Promise<University> => {
    const response = await api.patch(`${base}/${id}/deactivate`)
    return response.data
  },

  deleteUniversity: async (id: string): Promise<void> => {
    await api.delete(`${base}/${id}`)
  },

  completeSetup: async (id: string, data: CompleteUniversitySetupDto): Promise<University> => {
    const response = await api.post(`${base}/${id}/complete-setup`, data)
    return response.data
  },

  resendSetupEmail: async (id: string, type: 'university_admin' | 'shpc_founder'): Promise<void> => {
    await api.post(`${base}/${id}/resend-setup-email?type=${type}`)
  }
}
