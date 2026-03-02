import { useNavigate } from 'react-router-dom'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { 
  BuildingOffice2Icon,
  UsersIcon, 
  ChartBarIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { 
  useTotalUniversity, 
  useTotalShc, 
  useTotalStaff, 
  useActiveUser, 
  useGrowthReport, 
  useRecentActivities, 
  useUniversityStatusDistribution 
} from '../hooks/analytics'
import { PrimaryCard } from '../components/ui/Card'
import { motion, AnimatePresence } from 'framer-motion'

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

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const LoadingCard = ({ title }: { title: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-700 p-6"
  >
    <div className="flex items-center justify-center space-x-4 mb-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-6 h-6 border-3 border-primary-200 border-t-primary-600 rounded-full"
      />
      <h3 className="text-sm font-medium text-secondary-600 dark:text-secondary-400">Loading {title}...</h3>
    </div>
    <div className="space-y-3">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="h-8 bg-secondary-200 dark:bg-secondary-700 rounded-lg"
      />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
        className="h-4 bg-secondary-100 dark:bg-secondary-600 rounded"
      />
    </div>
  </motion.div>
)

const ErrorCard = ({ title, error, onRetry }: { title: string; error: string; onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800 p-6"
  >
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
        <ExclamationTriangleIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-red-900 dark:text-red-100">Failed to Load {title}</h3>
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      </div>
    </div>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onRetry}
      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm"
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
    className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-700 p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="h-5 bg-secondary-200 dark:bg-secondary-700 rounded w-32 mb-2"></div>
        <div className="h-3 bg-secondary-100 dark:bg-secondary-600 rounded w-24"></div>
      </div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full"
      />
    </div>
    <div className="h-[300px] bg-secondary-50 dark:bg-secondary-700/30 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-3"
        />
        <p className="text-sm text-secondary-500 dark:text-secondary-400">Loading {title}...</p>
      </div>
    </div>
  </motion.div>
)

const ChartErrorCard = ({ title, error, onRetry }: { title: string; error: string; onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800 p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">{title}</h3>
        <p className="text-sm text-red-600 dark:text-red-400">Failed to load data</p>
      </div>
    </div>
    <div className="h-[300px] bg-red-50 dark:bg-red-900/10 rounded-lg flex items-center justify-center border border-red-200 dark:border-red-800">
      <div className="text-center">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm"
        >
          <ArrowPathIcon className="w-4 h-4 inline mr-2" />
          Retry
        </motion.button>
      </div>
    </div>
  </motion.div>
)

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // Individual hooks for each API endpoint
  const { data: universityData, isLoading: isLoadingUniversity, error: universityError, refetch: refetchUniversity } = useTotalUniversity()
  const { data: shcData, isLoading: isLoadingShc, error: shcError, refetch: refetchShc } = useTotalShc()
  const { data: staffData, isLoading: isLoadingStaff, error: staffError, refetch: refetchStaff } = useTotalStaff()
  const { data: activeUserData, isLoading: isLoadingActiveUser, error: activeUserError, refetch: refetchActiveUser } = useActiveUser()
  const { data: growthData, isLoading: isLoadingGrowth, error: growthError, refetch: refetchGrowth } = useGrowthReport()
  const { data: recentActivitiesData, isLoading: isLoadingActivities, error: activitiesError, refetch: refetchActivities } = useRecentActivities(7)
  const { data: statusDistributionData, isLoading: isLoadingStatus, error: statusError, refetch: refetchStatus } = useUniversityStatusDistribution()

  const refetchAll = () => {
    refetchUniversity()
    refetchShc()
    refetchStaff()
    refetchActiveUser()
    refetchGrowth()
    refetchActivities()
    refetchStatus()
  }

  const formatChangeValue = (value: number) => {
    return value > 0 ? `+${value}%` : `${value}%`
  }

  const getChangeType = (value: number) => {
    return value >= 0 ? 'increase' : 'decrease'
  }

  // Navigation handlers for quick actions
  const handleAddUniversity = () => {
    navigate('/university')
  }

  const handleManageStaff = () => {
    navigate('/staff')
  }

  const handleSHCCommittee = () => {
    navigate('/shc-committee')
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl"></div>
        <div className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-700 p-8">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
              >
                Welcome back, {user?.first_name || 'Admin'}!
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-secondary-600 dark:text-secondary-300"
              >
                {user?.email ? `Logged in as ${user.email}` : 'Monitor and manage your educational platform ecosystem.'}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-2 flex items-center space-x-4 text-sm text-secondary-500 dark:text-secondary-400"
              >
                {user?._id && (
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    ID: {user._id}
                  </span>
                )}
                {user?.status && (
                  <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                )}
              </motion.div>
              {user?.role && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 flex flex-wrap gap-2"
                >
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
                    user.role.includes('super_admin')
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-400 border-green-200 dark:border-green-800'
                      : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      user.role.includes('super_admin') ? 'bg-green-500 animate-pulse' : 'bg-blue-500'
                    }`}></div>
                    {user.role.includes('super_admin') ? 'Super Administrator' : user.role.replace('_', ' ').toUpperCase()}
                  </div>
                  {user.privileges && user.privileges.length > 0 && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700 dark:bg-secondary-700/50 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-600">
                      {user.privileges.length} Privilege{user.privileges.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refetchAll}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg transition-colors duration-200"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Refresh</span>
              </motion.button>
              <motion.div 
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 10
                }}
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-500 via-purple-600 to-indigo-600 p-1 shadow-lg">
                  <div className="h-full w-full rounded-full bg-white dark:bg-secondary-800 flex items-center justify-center overflow-hidden">
                    {user?.profile_picture_url ? (
                      <img
                        src={user.profile_picture_url}
                        alt="Profile"
                        className="h-full w-full object-cover rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling!.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <span 
                      className={`text-lg font-bold text-primary-600 dark:text-primary-400 ${user?.profile_picture_url ? 'hidden' : 'flex'}`}
                      style={{ display: user?.profile_picture_url ? 'none' : 'flex' }}
                    >
                      {`${user?.first_name?.charAt(0) || ''}${user?.last_name?.charAt(0) || ''}`.toUpperCase() || 'A'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* University Stats */}
        <AnimatePresence mode="wait">
          {isLoadingUniversity ? (
            <LoadingCard key="university-loading" title="Universities" />
          ) : universityError ? (
            <ErrorCard key="university-error" title="Universities" error={universityError.message} onRetry={refetchUniversity} />
          ) : universityData ? (
            <PrimaryCard
              key="university-data"
              name="Total Universities"
              stat={universityData.total.toString()}
              description="Onboarded institutions"
              Icon={BuildingOffice2Icon}
              index={0}
              changeType={getChangeType(universityData.change)}
              change={formatChangeValue(universityData.change)}
              statsVariants={statsVariants}
            />
          ) : null}
        </AnimatePresence>

        {/* Staff Stats */}
        <AnimatePresence mode="wait">
          {isLoadingStaff ? (
            <LoadingCard key="staff-loading" title="Staff" />
          ) : staffError ? (
            <ErrorCard key="staff-error" title="Staff" error={staffError.message} onRetry={refetchStaff} />
          ) : staffData ? (
            <PrimaryCard
              key="staff-data"
              name="Total Staff"
              stat={staffData.total.toLocaleString()}
              description="Active staff members"
              Icon={BriefcaseIcon}
              index={1}
              changeType={getChangeType(staffData.change)}
              change={formatChangeValue(staffData.change)}
              statsVariants={statsVariants}
            />
          ) : null}
        </AnimatePresence>

        {/* SHC Stats */}
        <AnimatePresence mode="wait">
          {isLoadingShc ? (
            <LoadingCard key="shc-loading" title="SHC" />
          ) : shcError ? (
            <ErrorCard key="shc-error" title="SHC Committee" error={shcError.message} onRetry={refetchShc} />
          ) : shcData ? (
            <PrimaryCard
              key="shc-data"
              name="SHC Committee"
              stat={shcData.total.toString()}
              description="Committee members"
              Icon={ShieldCheckIcon}
              index={2}
              changeType={getChangeType(shcData.change)}
              change={formatChangeValue(shcData.change)}
              statsVariants={statsVariants}
            />
          ) : null}
        </AnimatePresence>

        {/* Active Users Stats */}
        <AnimatePresence mode="wait">
          {isLoadingActiveUser ? (
            <LoadingCard key="users-loading" title="Users" />
          ) : activeUserError ? (
            <ErrorCard key="users-error" title="Active Users" error={activeUserError.message} onRetry={refetchActiveUser} />
          ) : activeUserData ? (
            <PrimaryCard
              key="users-data"
              name="Active Users"
              stat={activeUserData.total.toLocaleString()}
              description="Platform users"
              Icon={UsersIcon}
              index={3}
              changeType={getChangeType(activeUserData.change)}
              change={formatChangeValue(activeUserData.change)}
              statsVariants={statsVariants}
            />
          ) : null}
        </AnimatePresence>
      </motion.div>

      {/* Charts Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Growth Chart */}
        <AnimatePresence mode="wait">
          {isLoadingGrowth ? (
            <ChartLoadingCard key="growth-loading" title="Growth Overview" />
          ) : growthError ? (
            <ChartErrorCard key="growth-error" title="Growth Overview" error={growthError.message} onRetry={refetchGrowth} />
          ) : growthData ? (
            <motion.div
              key="growth-data"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-700 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">Growth Overview</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Monthly onboarding trends</p>
                </div>
                <div className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium">
                  All Time
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="universities" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="staff" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="shc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area type="monotone" dataKey="universities" stackId="1" stroke="#3B82F6" fill="url(#universities)" />
                  <Area type="monotone" dataKey="staff" stackId="2" stroke="#10B981" fill="url(#staff)" />
                  <Area type="monotone" dataKey="shc" stackId="3" stroke="#F59E0B" fill="url(#shc)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* University Status Distribution */}
        <AnimatePresence mode="wait">
          {isLoadingStatus ? (
            <ChartLoadingCard key="status-loading" title="University Status" />
          ) : statusError ? (
            <ChartErrorCard key="status-error" title="University Status" error={statusError.message} onRetry={refetchStatus} />
          ) : statusDistributionData ? (
            <motion.div
              key="status-data"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-700 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">University Status</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Current distribution</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {statusDistributionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-secondary-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {/* Recent Activity Chart */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="wait">
          {isLoadingActivities ? (
            <ChartLoadingCard key="activities-loading" title="Recent Activity" />
          ) : activitiesError ? (
            <ChartErrorCard key="activities-error" title="Recent Activity" error={activitiesError.message} onRetry={refetchActivities} />
          ) : recentActivitiesData ? (
            <motion.div
              key="activities-data"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-700 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">Recent Activity</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Daily onboarding metrics</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={recentActivitiesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="universities" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                    name="Universities"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="staff" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                    name="Staff"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="shc" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                    name="SHC"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-700 p-6">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddUniversity}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200"
          >
            <BuildingOffice2Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Add University</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Onboard new institution</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleManageStaff}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-200"
          >
            <BriefcaseIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">Manage Staff</p>
              <p className="text-xs text-green-600 dark:text-green-400">Staff administration</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSHCCommittee}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-all duration-200"
          >
            <ShieldCheckIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">SHC Committee</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">Committee oversight</p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}