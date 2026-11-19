import { useQuery } from '@tanstack/react-query'
import { fileApi } from '@/services/file.api'

export const useGetFileAccessUrl = (url: string) =>
  useQuery({
    queryKey: ['fileAccessUrl', url],
    queryFn: async () => {
      const response = await fileApi.getAccessUrl(url)
      return response.accessUrl
    },
    enabled: !!url,
    staleTime: 5 * 60 * 1000,
  })
