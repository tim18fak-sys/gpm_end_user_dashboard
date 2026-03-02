
import { useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useCaseAnalytics } from '../hooks/useCaseAnalytics'
import CaseTotCard from '../components/caseAnalytics/CaseTotCard'
import PieChartCard from '../components/caseAnalytics/PieChartCard'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function CaseAnalytics() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const universityName = location.state?.universityName || 'University'

  const {
    pending,
    inProgress,
    completed,
    closed,
    matchingFolder,
    total,
    statusDistribution,
    typeDistribution,
    isError
  } = useCaseAnalytics(id || null)

  useEffect(() => {
    if (isError) {
      toast.error('Error loading case analytics')
    }
  }, [isError])

  const handleGoBack = () => {
    navigate('/university-management')
  }

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-danger-600 font-medium">Invalid university ID</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGoBack}
            className="flex items-center text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Universities
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Case Analytics - {universityName}
        </h1>
        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
          Overview of sexual harassment case statistics and distributions
        </p>
      </motion.div>

      {isError && (
        <motion.div 
          variants={itemVariants}
          className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-4"
        >
          <p className="text-danger-800 dark:text-danger-200">
            Error loading analytics. Please try again later.
          </p>
        </motion.div>
      )}

      {/* Total Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CaseTotCard
            title="Total Cases"
            data={total.data}
            isLoading={total.isLoading}
            colorClass="text-secondary-600"
            index={0}
          />
          <CaseTotCard
            title="Pending"
            data={pending.data}
            isLoading={pending.isLoading}
            colorClass="text-amber-600"
            index={1}
          />
          <CaseTotCard
            title="In Progress"
            data={inProgress.data}
            isLoading={inProgress.isLoading}
            colorClass="text-blue-600"
            index={2}
          />
          <CaseTotCard
            title="Completed"
            data={completed.data}
            isLoading={completed.isLoading}
            colorClass="text-emerald-600"
            index={3}
          />
          <CaseTotCard
            title="Closed"
            data={closed.data}
            isLoading={closed.isLoading}
            colorClass="text-slate-600"
            index={4}
          />
          <CaseTotCard
            title="Matching Folder"
            data={matchingFolder.data}
            isLoading={matchingFolder.isLoading}
            colorClass="text-purple-600"
            index={5}
          />
        </div>
      </motion.div>

      {/* Distribution Charts */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PieChartCard
            title="Status Distribution"
            data={statusDistribution.data}
            isLoading={statusDistribution.isLoading}
          />
          <PieChartCard
            title="Type Distribution"
            data={typeDistribution.data}
            isLoading={typeDistribution.isLoading}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
