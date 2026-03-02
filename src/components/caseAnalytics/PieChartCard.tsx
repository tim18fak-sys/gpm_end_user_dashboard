
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { CaseDistribution } from '../../types/caseAnalytics'

interface PieChartCardProps {
  title: string
  data: CaseDistribution[] | undefined
  isLoading: boolean
}

export default function PieChartCard({ title, data, isLoading }: PieChartCardProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-secondary-200 dark:bg-secondary-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
        </div>
      </motion.div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700"
      >
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          {title}
        </h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-secondary-600 dark:text-secondary-400">
              No distribution data available
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-secondary-800 p-3 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700">
          <p className="text-sm font-medium text-secondary-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Count: {data.value}
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm text-secondary-700 dark:text-secondary-300">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700"
    >
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
