import { motion } from 'framer-motion'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts'
import { DataDistribution } from '../../types/analytics'

interface DistributionPieChartProps {
  data: DataDistribution[]
  title: string
  isLoading?: boolean
}

export default function DistributionPieChart({ 
  data, 
  title, 
  isLoading = false 
}: DistributionPieChartProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-800/60 rounded-lg border border-secondary-200 dark:border-zinc-700 p-6"
      >
        <div className="h-6 bg-secondary-200 dark:bg-zinc-600 rounded animate-pulse mb-6 w-48"></div>
        <div className="h-64 bg-secondary-200 dark:bg-zinc-600 rounded-full animate-pulse mx-auto"></div>
      </motion.div>
    )
  }

  // const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  //   if (percent < 0.05) return null // Don't show labels for slices less than 5%

  //   const RADIAN = Math.PI / 180
  //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  //   const x = cx + radius * Math.cos(-midAngle * RADIAN)
  //   const y = cy + radius * Math.sin(-midAngle * RADIAN)

  //   return (
  //     <text 
  //       x={x} 
  //       y={y} 
  //       fill="white" 
  //       textAnchor={x > cx ? 'start' : 'end'} 
  //       dominantBaseline="central"
  //       fontSize={12}
  //       fontWeight="bold"
  //     >
  //       {`${(percent * 100).toFixed(0)}%`}
  //     </text>
  //   )
  // }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white dark:bg-secondary-800 rounded-xl sm:rounded-2xl border border-secondary-200 dark:border-secondary-700 p-4 sm:p-6 lg:p-8 shadow-xl dark:shadow-secondary-900/25 shadow-primary-500/5 dark:shadow-primary-500/10"
    >
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-secondary-900 dark:text-white mb-3 sm:mb-4 lg:mb-6">
        {title}
      </h3>
      <div className="h-48 sm:h-56 lg:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={window.innerWidth < 640 ? 60 : 80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}