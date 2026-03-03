import { useQuery } from '@tanstack/react-query'
import { deviceCategoryApi } from '../services/device.api'

export const useDeviceCategoryDetails = (id: string) => {
  return useQuery({
    queryKey: ['device-category', id],
    queryFn: () => deviceCategoryApi.getDeviceCategoryDetails(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

export const useDeviceCategories = (excludeDeviceCategoryId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['device-categories', 'exclude', excludeDeviceCategoryId],
    queryFn: () => deviceCategoryApi.getDeviceCategories(excludeDeviceCategoryId),
    enabled: enabled && !!excludeDeviceCategoryId,
    staleTime: 10 * 60 * 1000,
  })
}
