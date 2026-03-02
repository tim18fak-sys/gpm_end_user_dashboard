import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { useUniversities } from '../hooks/university/useUniversities'
import { useTrigger } from '../hooks/useTrigger'
import UniversityTable from '../components/university/UniversityTable'
import UniversityEmptyState from '../components/university/UniversityEmptyState'
import UniversityNotFound from '../components/university/UniversityNotFound'
import AddUniversityModal from '../components/university/AddUniversityModal'
import Pagination from '../components/ui/Pagination'
import type { UniversityFilters } from '../types/university'
import { useNavigate } from 'react-router-dom'

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
      duration: 0.5
    }
  }
}

export default function UniversityManagement() {
  const navigate = useNavigate()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchInputValue, setSearchInputValue] = useState('')
  const [filters, setFilters] = useState<UniversityFilters>({
    page: 1,
    limit: 10,
    status: 'all',
    search: '',
    assignment_status: 'all'
  })

  const { trigger, triggerRefetch } = useTrigger()
  const { data, isLoading, error } = useUniversities(filters, trigger)

  const handleFilterChange = (key: keyof UniversityFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when changing filters
    }))
  }

  const handleAssignmentStatusFilter = (assignment_status: 'assigned' | 'unassigned' | 'all') => {
    handleFilterChange('assignment_status', assignment_status)
  }

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      handleFilterChange('search', searchTerm)
    }, 300),
    []
  )

  const handleSearchInputChange = (value: string) => {
    setSearchInputValue(value)
    debouncedSearch(value)
  }

  const handleStatusFilter = (status: 'activated' | 'deactivated' | 'all') => {
    handleFilterChange('status', status)
  }

  const handlePageChange = (page: number) => {
    handleFilterChange('page', page)
  }

  const hasActiveFilters = filters.search !== '' || filters.status !== 'all' || filters.assignment_status !== 'all'

  const clearAllFilters = () => {
    setSearchInputValue('')
    debouncedSearch.cancel()
    setFilters({ page: 1, limit: 10, status: 'all', search: '', assignment_status: 'all' })
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-danger-600 mb-2">Error Loading Institution</h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            {(error as any)?.response?.data?.message || 'Failed to load Institution'}
          </p>
        </div>
      </div>
    )
  }

  const hasUniversities = data && !data.is_new

  const handleViewAnalytics = (university: any) => {
      // Navigate to university analytics page while preserving query cache and the name of the university
    navigate(`/universities/${university._id}/analytics`, {
      state:{
        universityName: university.name
      }
    })

    // pass 
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Institution Management
          </h1>
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            Manage Institution, their information, and founder details.
          </p>
        </div>
        {hasUniversities && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-x-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-primary-700 hover:to-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-200"
            >
              <PlusIcon className="h-4 w-4" />
              Add Institution
            </button>
          </div>
        )}
      </motion.div>

      {hasUniversities ? (
        <>
          {/* Filters */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search universities..."
                  value={searchInputValue}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg leading-5 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => handleStatusFilter(e.target.value as any)}
                  className="block w-full pl-3 pr-10 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg leading-5 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="activated">Activated</option>
                  <option value="deactivated">Deactivated</option>
                </select>
              </div>

              {/* Page Size */}
              <div>
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                  className="block w-full pl-3 pr-10 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg leading-5 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-2">
                <button
                  onClick={() => handleStatusFilter('all')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    filters.status === 'all'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => handleStatusFilter('activated')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    filters.status === 'activated'
                      ? 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300'
                      : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white'
                  }`}
                >
                  Activated
                </button>
                <button
                  onClick={() => handleStatusFilter('deactivated')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    filters.status === 'deactivated'
                      ? 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300'
                      : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white'
                  }`}
                >
                  Deactivated
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Assignment:</span>
                <button
                  onClick={() => handleAssignmentStatusFilter('all')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    filters.assignment_status === 'all'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleAssignmentStatusFilter('assigned')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    filters.assignment_status === 'assigned'
                      ? 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300'
                      : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white'
                  }`}
                >
                  Assigned
                </button>
                <button
                  onClick={() => handleAssignmentStatusFilter('unassigned')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    filters.assignment_status === 'unassigned'
                      ? 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300'
                      : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white'
                  }`}
                >
                  Unassigned
                </button>
              </div>

            {/* Filter summary */}
            {(filters.search || filters.status !== 'all' || filters.assignment_status !== 'all') && (
              <div className="mt-4 flex items-center gap-2">
                <FunnelIcon className="h-4 w-4 text-secondary-500" />
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  Active filters:
                  {filters.search && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      Search: "{filters.search}"
                    </span>
                  )}
                  {filters.status !== 'all' && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
                      Status: {filters.status}
                    </span>
                  )}
                   {filters.assignment_status !== 'all' && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
                      Assignment Status: {filters.assignment_status}
                    </span>
                  )}
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>

          {/* Results Summary */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              {data ? (
                <>
                  Showing {((data.page - 1) * data.limit) + 1} to {Math.min(data.page * data.limit, data.total)} of {data.total} universities
                </>
              ) : (
                'Loading...'
              )}
            </div>
          </motion.div>

          {/* Universities Table or No Results */}
          <motion.div variants={itemVariants}>
            {data?.data && data.data.length > 0 ? (
              <UniversityTable
                universities={data.data}
                isLoading={isLoading}
                onViewAnalytics={handleViewAnalytics}
              />
            ) : !isLoading ? (
              <UniversityNotFound 
                onClearFilters={clearAllFilters}
                hasActiveFilters={hasActiveFilters}
              />
            ) : (
              <UniversityTable universities={[]} isLoading={isLoading} onViewAnalytics={handleViewAnalytics} />
            )}
          </motion.div>

          {/* Pagination */}
          {data && data.totalPages > 1 && data.data.length > 0 && (
            <motion.div variants={itemVariants}>
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            </motion.div>
          )}
        </>
      ) : !isLoading ? (
        <motion.div variants={itemVariants}>
          <UniversityEmptyState onAddUniversity={() => setIsAddModalOpen(true)} />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-secondary-200 dark:bg-secondary-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Add University Modal */}
      <AddUniversityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={triggerRefetch}
      />
    </motion.div>
  )
}