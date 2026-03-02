
import { useState, useEffect, useCallback } from 'react'
import { analyticsAPI, AnalyticsData } from '../services/analytics.api'
import toast from 'react-hot-toast'

export const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const analyticsData = await analyticsAPI.getAllAnalytics()
      setData(analyticsData)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch analytics data'
      setError(errorMessage)
      console.error('Analytics fetch error:', err)
      
      // Fallback to mock data if API fails
      setData({
        stats: {
          totalUniversities: 42,
          totalStaff: 1247,
          totalSHC: 156,
          activeUsers: 2891,
          changes: {
            universities: '8%',
            staff: '12%', 
            shc: '5%',
            users: '-2%'
          }
        },
        growthData: [
          { month: 'Jan', universities: 15, staff: 420, shc: 45 },
          { month: 'Feb', universities: 22, staff: 580, shc: 62 },
          { month: 'Mar', universities: 28, staff: 720, shc: 78 },
          { month: 'Apr', universities: 33, staff: 890, shc: 95 },
          { month: 'May', universities: 38, staff: 1050, shc: 125 },
          { month: 'Jun', universities: 42, staff: 1247, shc: 156 },
        ],
        universityStatusData: [
          { name: 'Active', value: 38, color: '#10B981' },
          { name: 'Pending', value: 4, color: '#F59E0B' },
          { name: 'Inactive', value: 2, color: '#EF4444' },
        ],
        staffDistributionData: [
          { role: 'Faculty', count: 756, percentage: 60.6 },
          { role: 'Administration', count: 285, percentage: 22.9 },
          { role: 'Support Staff', count: 206, percentage: 16.5 },
        ],
        recentActivitiesData: [
          { date: '2024-01-15', universities: 2, staff: 45, shc: 8 },
          { date: '2024-01-14', universities: 1, staff: 32, shc: 5 },
          { date: '2024-01-13', universities: 0, staff: 28, shc: 3 },
          { date: '2024-01-12', universities: 3, staff: 52, shc: 12 },
          { date: '2024-01-11', universities: 1, staff: 38, shc: 7 },
          { date: '2024-01-10', universities: 2, staff: 41, shc: 9 },
          { date: '2024-01-09', universities: 0, staff: 29, shc: 4 },
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    toast.promise(
      fetchAnalytics(),
      {
        loading: 'Refreshing analytics data...',
        success: 'Analytics data refreshed successfully!',
        error: 'Failed to refresh analytics data'
      }
    )
  }, [fetchAnalytics])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    data,
    isLoading,
    error,
    refetch
  }
}
