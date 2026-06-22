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
    limit: 30,
    ...params,
  }

  return useQuery({
    queryKey: ['device-categories', fullParams],
    queryFn: () => deviceCategoryApi.getDeviceCategories(fullParams),
    enabled: enabled && !!params.paymentTimeline,
    staleTime: 10 * 60 * 1000,
  })
}


export const useLinkedDeviceInfo = () => {
  return useQuery({
    queryKey: ['linked-device-info'],
    queryFn: () => deviceCategoryApi.getLinkedDeviceInfo(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCurrentDeviceCode = (deviceId: string) => {
  return useQuery({
    queryKey: ['current-device-code', deviceId],
    queryFn: () => deviceCategoryApi.getCurrentDeviceCode(deviceId),
    enabled: !!deviceId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllDeviceCategories = (enabled: boolean) => {
  return useQuery({
    queryKey: ['device-categories-all'],
    queryFn: () => deviceCategoryApi.getDeviceCategories({ limit: 30 }),
    enabled,
    staleTime: 10 * 60 * 1000,
  })
}