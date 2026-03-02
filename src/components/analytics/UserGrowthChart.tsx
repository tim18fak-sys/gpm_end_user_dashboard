import { motion } from 'framer-motion'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { UniversityAdminUserGrowthData } from '../../types/analytics'

interface UserGrowthChartProps {
  data: UniversityAdminUserGrowthData[]
  isLoading?: boolean
}

export default function UserGrowthChart({ data, isLoading = false }: UserGrowthChartProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-secondary-800 rounded-xl sm:rounded-2xl border border-secondary-200 dark:border-secondary-700 p-4 sm:p-6 lg:p-8 shadow-xl dark:shadow-secondary-900/25 shadow-primary-500/5 dark:shadow-primary-500/10"
    >
      <h3 className="text-sm sm:text-lg font-semibold text-secondary-900 dark:text-white mb-3 sm:mb-4 lg:mb-6">
        User Growth Trends
      </h3>
      <div className="h-48 sm:h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 10 }}
              className="text-secondary-600 dark:text-secondary-400"
              angle={-45}
              textAnchor="end"
              height={60}
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
            <Area
              type="monotone"
              dataKey="academic_staff"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Academic Staff"
            />
            <Area
              type="monotone"
              dataKey="students"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Students"
            />
            <Area
              type="monotone"
              dataKey="non_academic_staff"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.6}
              name="Non-Academic Staff"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}