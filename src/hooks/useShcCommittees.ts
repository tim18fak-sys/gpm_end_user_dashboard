
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shcAPI, SHCCommitteesParams, CreateCommitteeRequest } from '../services/shc.api';
import toast from 'react-hot-toast';

export const useShcCommittees = (params: SHCCommitteesParams = {}) => {
  return useQuery({
    queryKey: ['shc-committees', params],
    queryFn: () => shcAPI.getCommittees(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useShcCommitteeDetails = (id: string) => {
  console.log(id)
  return useQuery({
    queryKey: ['shc-committee', id],
    queryFn: () => shcAPI.getCommitteeById(id),
    enabled: !!id,
  });
};

export const useCreateCommittee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommitteeRequest) => shcAPI.createCommittee(data),
    onSuccess: () => {
      // Invalidate all SHC committee queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['shc-committees'] });
      toast.success('Committee created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create committee');
    },
  });
};

export const useUpdateCommitteeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'activated' | 'deactivated' }) =>
      status == 'activated' ? shcAPI.activateCommitteeStatus(id, status):shcAPI.deactivateCommitteeStatus(id, status),
    onSuccess: () => {
      // Invalidate all SHC committee queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['shc-committees'] });
      toast.success('Committee status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update committee status');
    },
  });
};
