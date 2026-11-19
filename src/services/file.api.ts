import { api } from './api'

const endpoint = '/v1/public/upload'

export const fileApi = {
  getAccessUrl: async (url: string): Promise<{ accessUrl: string }> => {
    const response = await api.patch<{ accessUrl: string }>(`${endpoint}/access-url`, {
      url,
    })
    return response.data
  },
}
