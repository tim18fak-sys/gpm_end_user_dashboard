
import { useQuery } from '@tanstack/react-query'
import { caseAnalyticsAPI } from '../services/caseAnalytics.api'

const CACHE_TIME = 5 * 60 * 1000 // 5 minutes

export const useCaseAnalytics = (universityId: string | null) => {
  const pendingQuery = useQuery({
    queryKey: ['case-analytics', universityId, 'pending'],
    queryFn: () => caseAnalyticsAPI.getPendingCases(universityId!),
    enabled: !!universityId,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false
  })

  const inProgressQuery = useQuery({
    queryKey: ['case-analytics', universityId, 'in-progress'],
    queryFn: () => caseAnalyticsAPI.getInProgressCases(universityId!),
    enabled: !!universityId,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false
  })

  const completedQuery = useQuery({
    queryKey: ['case-analytics', universityId, 'completed'],
    queryFn: () => caseAnalyticsAPI.getCompletedCases(universityId!),
    enabled: !!universityId,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false
  })

  const closedQuery = useQuery({
    queryKey: ['case-analytics', universityId, 'closed'],
    queryFn: () => caseAnalyticsAPI.getClosedCases(universityId!),
    enabled: !!universityId,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false
  })

  const matchingFolderQuery = useQuery({
    queryKey: ['case-analytics', universityId, 'matching-folder'],
    queryFn: () => caseAnalyticsAPI.getMatchingFolderCases(universityId!),
    enabled: !!universityId,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false
  })

  const totalQuery = useQuery({
    queryKey: ['case-analytics', universityId, 'total'],
    queryFn: () => caseAnalyticsAPI.getTotalCases(universityId!),
    enabled: !!universityId,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false
  })

  const statusDistributionQuery = useQuery({
    queryKey: ['case-analytics', universityId, 'status-distribution'],
    queryFn: () => caseAnalyticsAPI.getStatusDistribution(universityId!),
    enabled: !!universityId,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false
  })

  const typeDistributionQuery = useQuery({
    queryKey: ['case-analytics', universityId, 'type-distribution'],
    queryFn: () => caseAnalyticsAPI.getTypeDistribution(universityId!),
    enabled: !!universityId,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false
  })

  return {
    pending: pendingQuery,
    inProgress: inProgressQuery,
    completed: completedQuery,
    closed: closedQuery,
    matchingFolder: matchingFolderQuery,
    total: totalQuery,
    statusDistribution: statusDistributionQuery,
    typeDistribution: typeDistributionQuery,
    isLoading: pendingQuery.isLoading || inProgressQuery.isLoading || completedQuery.isLoading || 
              closedQuery.isLoading || matchingFolderQuery.isLoading || totalQuery.isLoading ||
              statusDistributionQuery.isLoading || typeDistributionQuery.isLoading,
    isError: pendingQuery.isError || inProgressQuery.isError || completedQuery.isError ||
             closedQuery.isError || matchingFolderQuery.isError || totalQuery.isError ||
             statusDistributionQuery.isError || typeDistributionQuery.isError
  }
}
