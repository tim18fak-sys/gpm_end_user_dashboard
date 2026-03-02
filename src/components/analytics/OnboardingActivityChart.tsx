import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { UniversityAdminOnboardingActivityData } from '../../types/analytics'

interface OnboardingActivityChartProps {
  data: UniversityAdminOnboardingActivityData[]
  isLoading?: boolean
}

export default function OnboardingActivityChart({ data, isLoading = false }: OnboardingActivityChartProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-800/60 rounded-lg border border-secondary-200 dark:border-zinc-700 p-6"
      >
        <div className="h-6 bg-secondary-200 dark:bg-zinc-600 rounded animate-pulse mb-6 w-48"></div>
        <div className="h-64 bg-secondary-200 dark:bg-zinc-600 rounded animate-pulse"></div>
      </motion.div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formattedData = data.map(item => ({
    ...item,
    date: formatDate(item.date)
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-zinc-800/60 rounded-lg sm:rounded-xl border border-secondary-200 dark:border-zinc-700 p-3 sm:p-4 lg:p-6"
    >
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-secondary-900 dark:text-white mb-3 sm:mb-4 lg:mb-6">
        Onboarding Activity (Last 7 Days)
      </h3>
      <div className="h-48 sm:h-56 lg:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              className="text-secondary-600 dark:text-secondary-400"
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              className="text-secondary-600 dark:text-secondary-400"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--toast-bg)',
                border: '1px solid var(--toast-border)',
                borderRadius: '8px',
                color: 'var(--toast-color)',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="departments" fill="#3b82f6" name="Departments" />
            <Bar dataKey="staffs" fill="#10b981" name="Staff" />
            <Bar dataKey="sectors" fill="#f59e0b" name="Sectors" />
            <Bar dataKey="faculties" fill="#ef4444" name="Faculties" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}