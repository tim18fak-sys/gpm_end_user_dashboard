
import { useState, useEffect } from 'react'
import {  useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeftIcon,
  BuildingOfficeIcon,
  UsersIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

import {
  useUniversityTotals,
  useUniversityOverallGrowth,
  useUniversityUserGrowth,
  useUniversityOnboardingActivity,
  useUniversityRoleDistribution,
  useUniversityOnboardingDistribution
} from '../hooks/useUniversityAnalytics'

import TotalsCard from '../components/analytics/TotalsCard'
import GrowthChart from '../components/analytics/GrowthChart'
import UserGrowthChart from '../components/analytics/UserGrowthChart'
import OnboardingActivityChart from '../components/analytics/OnboardingActivityChart'
import DistributionPieChart from '../components/analytics/DistributionPieChart'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

// const statsVariants = {
//   hidden: { opacity: 0, scale: 0.8 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     transition: {
//       duration: 0.6,
//       ease: "easeOut"
//     }
//   }
// }

// Loading Components
const LoadingCard = ({ title }: { title: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-700 p-4 sm:p-6 shadow-primary-500/5 dark:shadow-primary-500/10 dark:shadow-secondary-900/25"
  >
    <div className="flex items-center justify-center space-x-3 mb-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5 sm:w-6 sm:h-6 border-2 sm:border-3 border-primary-200 border-t-primary-600 rounded-full"
      />
      <h3 className="text-xs sm:text-sm font-medium text-secondary-600 dark:text-secondary-400">Loading {title}...</h3>
    </div>
    <div className="space-y-2 sm:space-y-3">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="h-6 sm:h-8 bg-secondary-200 dark:bg-secondary-700 rounded-lg"
      />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
        className="h-3 sm:h-4 bg-secondary-100 dark:bg-secondary-600 rounded"
      />
    </div>
  </motion.div>
)

const ErrorCard = ({ title, error, onRetry }: { title: string; error: string; onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800 p-4 sm:p-6 shadow-red-500/10 dark:shadow-red-500/20 dark:shadow-secondary-900/25"
  >
    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
        <ExclamationTriangleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <h3 className="text-xs sm:text-sm font-semibold text-red-900 dark:text-red-100">Failed to Load {title}</h3>
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      </div>
    </div>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onRetry}
      className="w-full flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm"
    >
      <ArrowPathIcon className="w-3 h-3" />
      <span>Retry</span>
    </motion.button>
  </motion.div>
)

const ChartLoadingCard = ({ title }: { title: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-700 p-4 sm:p-6 shadow-primary-500/5 dark:shadow-primary-500/10 dark:shadow-secondary-900/25"
  >
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div className="flex-1">
        <div className="h-4 sm:h-5 bg-secondary-200 dark:bg-secondary-700 rounded w-24 sm:w-32 mb-1 sm:mb-2"></div>
        <div className="h-2 sm:h-3 bg-secondary-100 dark:bg-secondary-600 rounded w-16 sm:w-24"></div>
      </div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-primary-200 border-t-primary-600 rounded-full"
      />
    </div>
    <div className="h-48 sm:h-64 lg:h-80 bg-secondary-50 dark:bg-secondary-700/30 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-8 h-8 sm:w-12 sm:h-12 border-2 sm:border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-2 sm:mb-3"
        />
        <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400">Loading {title}...</p>
      </div>
    </div>
  </motion.div>
)

const ChartErrorCard = ({ title, error, onRetry }: { title: string; error: string; onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800 p-4 sm:p-6 shadow-red-500/10 dark:shadow-red-500/20 dark:shadow-secondary-900/25"
  >
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div>
        <h3 className="text-sm sm:text-lg font-semibold text-red-900 dark:text-red-100">{title}</h3>
        <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">Failed to load data</p>
      </div>
    </div>
    <div className="h-48 sm:h-64 lg:h-80 bg-red-50 dark:bg-red-900/10 rounded-lg flex items-center justify-center border border-red-200 dark:border-red-800">
      <div className="text-center">
        <ExclamationTriangleIcon className="w-8 h-8 sm:w-12 sm:h-12 text-red-500 mx-auto mb-2 sm:mb-3" />
        <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-3 sm:mb-4 px-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-3 py-2 sm:px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm"
        >
          <ArrowPathIcon className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
          Retry
        </motion.button>
      </div>
    </div>
  </motion.div>
)

export default function UniversityAnalytics() {
  // const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [universityName,] = useState(
    location.state?.universityName || 'University'
  )
  
  // Get university ID from URL path
  const pathSegments = window.location.pathname.split('/')
  const universityId = pathSegments[2] // /universities/{id}/analytics

  if (!universityId) {
    toast.error('University ID not found')
    navigate('/university')
    return null
  }

  // Fetch all analytics data
  const totalsQueries = useUniversityTotals(universityId)
  const { data: overallGrowthData, isLoading: isLoadingOverallGrowth, error: overallGrowthError, refetch: refetchOverallGrowth } = useUniversityOverallGrowth(universityId)
  const { data: userGrowthData, isLoading: isLoadingUserGrowth, error: userGrowthError, refetch: refetchUserGrowth } = useUniversityUserGrowth(universityId)
  const { data: onboardingActivityData, isLoading: isLoadingOnboardingActivity, error: onboardingActivityError, refetch: refetchOnboardingActivity } = useUniversityOnboardingActivity(universityId)
  const { data: roleDistributionData, isLoading: isLoadingRoleDistribution, error: roleDistributionError, refetch: refetchRoleDistribution } = useUniversityRoleDistribution(universityId)
  const { data: onboardingDistributionData, isLoading: isLoadingOnboardingDistribution, error: onboardingDistributionError, refetch: refetchOnboardingDistribution } = useUniversityOnboardingDistribution(universityId)

  // Extract totals data
  const [
    departmentsQuery,
    sectorsQuery,
    facultiesQuery,
    staffQuery,
    usersQuery,
    activeUsersQuery
  ] = totalsQueries

  // Check if any query has an error
  useEffect(() => {
    const errorQueries = totalsQueries.filter(query => query.isError)
    if (errorQueries.length > 0) {
      toast.error('Failed to load some analytics data')
    }
  }, [totalsQueries])

  const handleGoBack = () => {
    navigate('/universities')
  }

  const refetchAll = () => {
    totalsQueries.forEach(query => query.refetch?.())
    refetchOverallGrowth()
    refetchUserGrowth()
    refetchOnboardingActivity()
    refetchRoleDistribution()
    refetchOnboardingDistribution()
  }

  // Define totals cards configuration
  const totalsCards = [
    {
      title: 'Departments',
      total: departmentsQuery.data?.total || 0,
      change: departmentsQuery.data?.change || 0,
      icon: BuildingOfficeIcon,
      isLoading: departmentsQuery.isLoading,
      error: departmentsQuery.error,
      refetch: departmentsQuery.refetch
    },
    {
      title: 'Sectors',
      total: sectorsQuery.data?.total || 0,
      change: sectorsQuery.data?.change || 0,
      icon: BriefcaseIcon,
      isLoading: sectorsQuery.isLoading,
      error: sectorsQuery.error,
      refetch: sectorsQuery.refetch
    },
    {
      title: 'Faculties',
      total: facultiesQuery.data?.total || 0,
      change: facultiesQuery.data?.change || 0,
      icon: AcademicCapIcon,
      isLoading: facultiesQuery.isLoading,
      error: facultiesQuery.error,
      refetch: facultiesQuery.refetch
    },
    {
      title: 'Staff',
      total: staffQuery.data?.total || 0,
      change: staffQuery.data?.change || 0,
      icon: UserGroupIcon,
      isLoading: staffQuery.isLoading,
      error: staffQuery.error,
      refetch: staffQuery.refetch
    },
    {
      title: 'Users',
      total: usersQuery.data?.total || 0,
      change: usersQuery.data?.change || 0,
      icon: UsersIcon,
      isLoading: usersQuery.isLoading,
      error: usersQuery.error,
      refetch: usersQuery.refetch
    },
    {
      title: 'Active Users',
      total: activeUsersQuery.data?.total || 0,
      change: activeUsersQuery.data?.change || 0,
      icon: CheckCircleIcon,
      isLoading: activeUsersQuery.isLoading,
      error: activeUsersQuery.error,
      refetch: activeUsersQuery.refetch
    }
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl sm:rounded-2xl"></div>
        <div className="relative bg-white dark:bg-secondary-800 rounded-xl sm:rounded-2xl shadow-2xl border border-secondary-200 dark:border-secondary-700 p-4 sm:p-6 lg:p-8 shadow-primary-500/10 dark:shadow-primary-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoBack}
                className="p-2 rounded-lg border border-secondary-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-secondary-50 dark:hover:bg-zinc-700 transition-colors duration-200 shrink-0"
              >
                <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-600 dark:text-secondary-400" />
              </motion.button>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
                >
                  {universityName} Analytics
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs sm:text-sm lg:text-base text-secondary-600 dark:text-secondary-300"
                >
                  Comprehensive analytics and insights
                </motion.p>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refetchAll}
                className="flex items-center space-x-2 px-3 py-2 sm:px-4 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg transition-colors duration-200"
              >
                <ArrowPathIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">Refresh</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Totals Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-3  gap-3 sm:gap-4 lg:gap-6">
        {totalsCards.map((card, index) => (
          <AnimatePresence key={card.title} mode="wait">
            {card.isLoading ? (
              <LoadingCard key={`${card.title}-loading`} title={card.title} />
            ) : card.error ? (
              <ErrorCard 
                key={`${card.title}-error`} 
                title={card.title} 
                error={card.error.message} 
                onRetry={card.refetch || (() => {})} 
              />
            ) : (
              <TotalsCard
                key={`${card.title}-data`}
                title={card.title}
                total={card.total}
                change={card.change}
                icon={card.icon}
                isLoading={card.isLoading}
                index={index}
              />
            )}
          </AnimatePresence>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols- gap-4 sm:gap-6 lg:gap-8">
        <AnimatePresence mode="wait">
          {isLoadingOverallGrowth ? (
            <ChartLoadingCard key="growth-loading" title="Growth Trends" />
          ) : overallGrowthError ? (
            <ChartErrorCard key="growth-error" title="Overall Growth Trends" error={overallGrowthError.message} onRetry={refetchOverallGrowth} />
          ) : (
            <GrowthChart
              key="growth-data"
              data={overallGrowthData || []}
              isLoading={isLoadingOverallGrowth}
              title="Overall Growth Trends"
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isLoadingUserGrowth ? (
            <ChartLoadingCard key="user-growth-loading" title="User Growth" />
          ) : userGrowthError ? (
            <ChartErrorCard key="user-growth-error" title="User Growth" error={userGrowthError.message} onRetry={refetchUserGrowth} />
          ) : (
            <UserGrowthChart
              key="user-growth-data"
              data={userGrowthData || []}
              isLoading={isLoadingUserGrowth}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Charts Row 2 */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <AnimatePresence mode="wait">
          {isLoadingOnboardingActivity ? (
            <ChartLoadingCard key="activity-loading" title="Onboarding Activity" />
          ) : onboardingActivityError ? (
            <ChartErrorCard key="activity-error" title="Onboarding Activity" error={onboardingActivityError.message} onRetry={refetchOnboardingActivity} />
          ) : (
            <OnboardingActivityChart
              key="activity-data"
              data={onboardingActivityData || []}
              isLoading={isLoadingOnboardingActivity}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isLoadingRoleDistribution ? (
            <ChartLoadingCard key="role-dist-loading" title="Role Distribution" />
          ) : roleDistributionError ? (
            <ChartErrorCard key="role-dist-error" title="Role Distribution" error={roleDistributionError.message} onRetry={refetchRoleDistribution} />
          ) : (
            <DistributionPieChart
              key="role-dist-data"
              data={roleDistributionData || []}
              title="Role Distribution"
              isLoading={isLoadingRoleDistribution}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isLoadingOnboardingDistribution ? (
            <ChartLoadingCard key="onboard-dist-loading" title="Onboarding Distribution" />
          ) : onboardingDistributionError ? (
            <ChartErrorCard key="onboard-dist-error" title="Onboarding Distribution" error={onboardingDistributionError.message} onRetry={refetchOnboardingDistribution} />
          ) : (
            <DistributionPieChart
              key="onboard-dist-data"
              data={onboardingDistributionData || []}
              title="Onboarding Distribution"
              isLoading={isLoadingOnboardingDistribution}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
