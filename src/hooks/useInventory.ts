import { useQuery } from '@tanstack/react-query'
import { inventoryApi } from '../services/inventory.api'

export const useCheckDeviceAvailability = (deviceCategoryId: string) => {
  return useQuery({
    queryKey: ['inventory', 'availability', deviceCategoryId],
    queryFn: () => inventoryApi.checkDeviceAvailability(deviceCategoryId),
    enabled: !!deviceCategoryId,
    staleTime: 5 * 60 * 1000,
  })
}
