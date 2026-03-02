
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { universityAPI } from '../../services/university'
import type { UniversityFilters } from '../../types/university'
import toast from 'react-hot-toast'

export const useUniversities = (filters: UniversityFilters, trigger?: number) => {
  return useQuery({
    queryKey: ['universities', filters, trigger],
    queryFn: () => universityAPI.getUniversities(filters),
  })
}



export const useActivateUniversity = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => universityAPI.activateUniversity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] })
      toast.success('University activated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to activate university')
    }
  })
}

export const useDeactivateUniversity = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => universityAPI.deactivateUniversity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] })
      toast.success('University deactivated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to deactivate university')
    }
  })
}

export const useUniversityDetails = (id: string) => {
  return useQuery({
    queryKey: ['university', id],
    queryFn: () => universityAPI.getUniversity(id),
    enabled: !!id,
  })
}
