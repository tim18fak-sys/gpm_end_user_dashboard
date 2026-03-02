
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { StaffRole } from '../../services/staff.api'

interface StaffFiltersProps {
  onFiltersChange: (filters: {
    search: string
    role: string
    status: string
  }) => void
  totalCount?: number
}

export default function StaffFilters({ onFiltersChange, totalCount }: StaffFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = { search: '', role: '', status: '' }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = filters.search || filters.role || filters.status

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 p-6 mb-6"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Search Staff
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div className="w-full sm:w-48">
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Role
          </label>
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
          >
            <option value="">All Roles</option>
            <option value={StaffRole.SUPER_ADMIN}>Super Admin</option>
            <option value={StaffRole.ADMIN}>Admin</option>
            <option value={StaffRole.MODERATOR}>Moderator</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48">
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearFilters}
            className="flex items-center px-3 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors duration-200"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Clear
          </motion.button>
        )}
      </div>

      {/* Results Count */}
      {totalCount !== undefined && (
        <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            {hasActiveFilters ? `Found ${totalCount} staff member${totalCount !== 1 ? 's' : ''}` : `Total ${totalCount} staff member${totalCount !== 1 ? 's' : ''}`}
          </p>
        </div>
      )}
    </motion.div>
  )
}
