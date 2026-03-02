
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { 
  staffAPI, 
  type StaffFilters, 
  type CreateStaffRequest, 

} from '../services/staff.api'

export const useStaffList = (filters: StaffFilters = {}) => {
  return useQuery({
    queryKey: ['staff', filters],
    queryFn: () => staffAPI.getStaff(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useStaffDetails = (id: string | null) => {

  return useQuery({
    queryKey: ['staff', id],
    queryFn: () => staffAPI.getStaffById(id!),
    enabled: !!id,
  })
}

export const useCreateStaff = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateStaffRequest) => staffAPI.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      toast.success('Staff member created successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create staff member'
      toast.error(message)
    }
  })
}

export const useUpdateStaff = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateStaffRequest> }) => 
      staffAPI.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      console.log('updated')
      toast.success('Staff member updated successfully')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update staff member'
      toast.error(message)
    }
  })
}

export const useDeleteStaff = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => staffAPI.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      toast.success('Staff member deleted successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete staff member'
      toast.error(message)
    }
  })
}

export const useActivateStaff = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => staffAPI.activateStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      toast.success('Staff activated successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to activate staff'
      toast.error(message)
    }
  })
}

export const useDeactivateStaff = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => staffAPI.deactivateStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      toast.success('Staff deactivated successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to deactivate staff'
      toast.error(message)
    }
  })
}
