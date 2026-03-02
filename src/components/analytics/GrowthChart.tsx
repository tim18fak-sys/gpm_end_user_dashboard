import { motion } from 'framer-motion'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { UniversityAdminGrowthData } from '../../types/analytics'

interface GrowthChartProps {
  data: UniversityAdminGrowthData[]
  isLoading?: boolean
  title: string
}

export default function GrowthChart({ data, isLoading = false, title }: GrowthChartProps) {
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
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-zinc-800/60 rounded-lg sm:rounded-xl border border-secondary-200 dark:border-zinc-700 p-3 sm:p-4 lg:p-6 shadow-xl dark:shadow-secondary-900/25 shadow-primary-500/5 dark:shadow-primary-500/10"
    >
      <h3 className="text-sm sm:text-lg font-semibold text-secondary-900 dark:text-white mb-3 sm:mb-4 lg:mb-6">
        {title}
      </h3>
      <div className="h-48 sm:h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
            <Line 
              type="monotone" 
              dataKey="departments" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Departments"
            />
            <Line 
              type="monotone" 
              dataKey="sectors" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Sectors"
            />
            <Line 
              type="monotone" 
              dataKey="faculties" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Faculties"
            />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Users"
            />
            <Line 
              type="monotone" 
              dataKey="staffs" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Staff"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}