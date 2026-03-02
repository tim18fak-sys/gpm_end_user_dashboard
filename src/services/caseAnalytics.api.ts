
import { api } from './api'
import type { BaseTotalCase, CaseDistribution } from '../types/caseAnalytics'

const base = '/v1/super_admin/case/analytics'

export const caseAnalyticsAPI = {
  getPendingCases: async (universityId: string): Promise<BaseTotalCase> => {
    const response = await api.get(`${base}/${universityId}/pending`)
    return response.data
  },

  getInProgressCases: async (universityId: string): Promise<BaseTotalCase> => {
    const response = await api.get(`${base}/${universityId}/in_progress`)
    return response.data
  },

  getCompletedCases: async (universityId: string): Promise<BaseTotalCase> => {
    const response = await api.get(`${base}/${universityId}/completed`)
    return response.data
  },

  getClosedCases: async (universityId: string): Promise<BaseTotalCase> => {
    const response = await api.get(`${base}/${universityId}/closed`)
    return response.data
  },

  getMatchingFolderCases: async (universityId: string): Promise<BaseTotalCase> => {
    const response = await api.get(`${base}/${universityId}/matching_folder`)
    return response.data
  },

  getTotalCases: async (universityId: string): Promise<BaseTotalCase> => {
    const response = await api.get(`${base}/${universityId}/total`)
    return response.data
  },

  getStatusDistribution: async (universityId: string): Promise<CaseDistribution[]> => {
    const response = await api.get(`${base}/${universityId}/distribution/status`)
    return response.data
  },

  getTypeDistribution: async (universityId: string): Promise<CaseDistribution[]> => {
    const response = await api.get(`${base}/${universityId}/distribution/type`)
    return response.data
  }
}
