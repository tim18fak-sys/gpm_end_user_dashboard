import { analyticApi } from "@/services/analytics.api";
import { useQuery } from "@tanstack/react-query";

// Hook to fetch total universities
export const useTotalUniversity = () => {
  return useQuery({
    queryKey: ['total_university'],
    queryFn: () => analyticApi.totalUniversity(),
  });
};

// Hook to fetch recent activities
export const useRecentActivities = (days: number) => {
  return useQuery({
    queryKey: ['recent_activities', days],
    queryFn: () => analyticApi.recentActivities(days),
  });
};

// ✅ Hook to fetch total SHC staff
export const useTotalShc = () => {
  return useQuery({
    queryKey: ['total_shc'],
    queryFn: () => analyticApi.totalShc(),
  });
};

// Optional: add other hooks for staff, growth, etc.
export const useTotalStaff = () => {
  return useQuery({
    queryKey: ['total_staff'],
    queryFn: () => analyticApi.totalStaff(),
  });
};

export const useGrowthReport = () => {
  return useQuery({
    queryKey: ['growth_report'],
    queryFn: () => analyticApi.growthReport(),
  });
};


// total user
export const useActiveUser = () => {
    return useQuery({
        queryKey: ['active_user'],
        queryFn: () => analyticApi.activeUser()
    })
}

export const useUniversityStatusDistribution = () => {
    return useQuery({
        queryKey: ['university_status_distribution'],
        queryFn: async () => analyticApi.universityStatusDistribution()
    })
}