import { useQuery } from '@tanstack/react-query'
import { deviceCategoryApi, DeviceCursorPaginationDto } from '../services/device.api'

export const useDeviceCategoryDetails = (id: string) => {
  return useQuery({
    queryKey: ['device-category', id],
    queryFn: () => deviceCategoryApi.getDeviceCategoryDetails(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

export const useDeviceCategories = (
  params: Omit<DeviceCursorPaginationDto, 'limit'> & { limit?: number },
  enabled: boolean
) => {
  const fullParams: DeviceCursorPaginationDto = {
    limit: 10,
    ...params,
  }

  return useQuery({
    queryKey: ['device-categories', fullParams],
    queryFn: () => deviceCategoryApi.getDeviceCategories(fullParams),
    enabled: enabled && !!fullParams.excludeDeviceCategoryId,
    staleTime: 10 * 60 * 1000,
  })
}
