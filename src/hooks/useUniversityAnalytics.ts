
import { useQuery, useQueries } from '@tanstack/react-query'
import { universityAnalyticsApi } from '../services/universityAnalytics.api'

// Hook for all totals data
export const useUniversityTotals = (id: string) => {
  return useQueries({
    queries: [
      {
        queryKey: ['university-analytics', 'totals', 'departments', id],
        queryFn: () => universityAnalyticsApi.getTotalDepartments(id),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['university-analytics', 'totals', 'sectors', id],
        queryFn: () => universityAnalyticsApi.getTotalSectors(id),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['university-analytics', 'totals', 'faculties', id],
        queryFn: () => universityAnalyticsApi.getTotalFaculties(id),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['university-analytics', 'totals', 'staff', id],
        queryFn: () => universityAnalyticsApi.getTotalStaff(id),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['university-analytics', 'totals', 'users', id],
        queryFn: () => universityAnalyticsApi.getTotalUsers(id),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['university-analytics', 'totals', 'active-users', id],
        queryFn: () => universityAnalyticsApi.getTotalActiveUsers(id),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    ],
  })
}

// Hook for overall growth data
export const useUniversityOverallGrowth = (id: string) => {
  return useQuery({
    queryKey: ['university-analytics', 'growth', 'overall', id],
    queryFn: () => universityAnalyticsApi.getOverallGrowth(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Hook for user growth data
export const useUniversityUserGrowth = (id: string) => {
  return useQuery({
    queryKey: ['university-analytics', 'growth', 'users', id],
    queryFn: () => universityAnalyticsApi.getUserGrowth(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Hook for onboarding activity
export const useUniversityOnboardingActivity = (id: string, days: number = 7) => {
  return useQuery({
    queryKey: ['university-analytics', 'onboarding-activity', id, days],
    queryFn: () => universityAnalyticsApi.getOnboardingActivity(id, days),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Hook for role distribution
export const useUniversityRoleDistribution = (id: string) => {
  return useQuery({
    queryKey: ['university-analytics', 'distribution', 'roles', id],
    queryFn: () => universityAnalyticsApi.getRoleDistribution(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Hook for onboarding distribution
export const useUniversityOnboardingDistribution = (id: string) => {
  return useQuery({
    queryKey: ['university-analytics', 'distribution', 'onboarding', id],
    queryFn: () => universityAnalyticsApi.getOnboardingDistribution(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
