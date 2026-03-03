import { useQuery, useQueries } from '@tanstack/react-query'
import { inventoryApi } from '../services/inventory.api'
import { InventoryStatusEnum } from '@/enum/inventory.enum'

export const useCheckDeviceAvailability = (deviceCategoryId: string) => {
  return useQuery({
    queryKey: ['inventory', 'availability', deviceCategoryId],
    queryFn: () => inventoryApi.checkDeviceAvailability(deviceCategoryId),
    enabled: !!deviceCategoryId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCheckMultipleDeviceAvailability = (deviceCategoryIds: string[]) => {
  return useQueries({
    queries: deviceCategoryIds.map((id) => ({
      queryKey: ['inventory', 'availability', id],
      queryFn: () => inventoryApi.checkDeviceAvailability(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  })
}

export const isDeviceAvailable = (
  status: InventoryStatusEnum | undefined,
  availableQuantity: number | undefined
): boolean => {
  if (status === undefined || availableQuantity === undefined) return false
  return status !== InventoryStatusEnum.INACTIVE && availableQuantity > 0
}
