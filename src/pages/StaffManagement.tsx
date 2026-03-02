import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon } from '@heroicons/react/24/outline'
import { 
  useStaffList, 
  useCreateStaff, 
  useUpdateStaff, 
  useDeleteStaff,
  useActivateStaff,
  useDeactivateStaff,
  useStaffDetails
} from '../hooks/useStaff'
import { StaffMember, CreateStaffRequest } from '../services/staff.api'
import StaffFilters from '../components/staff/StaffFilters'
import StaffTable from '../components/staff/StaffTable'
import AddEditStaffModal from '../components/staff/AddEditStaffModal'
import ViewStaffModal from '../components/staff/ViewStaffModal'
import StaffEmptyState from '../components/staff/StaffEmptyState'
import Pagination from '../components/ui/Pagination'

export default function StaffManagement() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [viewingStaffId, setViewingStaffId] = useState<string | null>(null)

  // Build query filters
  const queryFilters = useMemo(() => {
    const cleanFilters: any = {
      page: currentPage,
      limit: 10
    }

    if (filters.search.trim()) {
      cleanFilters.search = filters.search.trim()
    }
    if (filters.role) {
      cleanFilters.role = filters.role
    }
    if (filters.status) {
      cleanFilters.status = filters.status
    }

    return cleanFilters
  }, [currentPage, filters])

  // Queries and mutations
  const { data: staffData, isLoading } = useStaffList(queryFilters)
  const { data: viewingStaffData, isLoading: isLoadingStaffDetails } = useStaffDetails(viewingStaffId)
  const createStaffMutation = useCreateStaff()
  const updateStaffMutation = useUpdateStaff()
  const deleteStaffMutation = useDeleteStaff()
  const activateStaffMutation = useActivateStaff()
  const deactivateStaffMutation = useDeactivateStaff()

  // Event handlers
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAddStaff = () => {
    setEditingStaff(null)
    setShowAddModal(true)
  }

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff)
    setShowAddModal(true)
  }

  const handleViewStaff = (staff: StaffMember) => {
    console.log(staff)
    setViewingStaffId(staff._id)
  }

  const handleDeleteStaff = async (id: string) => {
    try {
      await deleteStaffMutation.mutateAsync(id)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleActivateStaff = async (id: string) => {
    try {
      await activateStaffMutation.mutateAsync(id)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleDeactivateStaff = async (id: string) => {
    try {
      await deactivateStaffMutation.mutateAsync(id)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleSubmitStaff = async (values: CreateStaffRequest) => {
    try {
      if (editingStaff) {
        await updateStaffMutation.mutateAsync({ 
          id: editingStaff._id, 
          data: values 
        })
      } else {
        await createStaffMutation.mutateAsync(values)
      }
      setShowAddModal(false)
      setEditingStaff(null)
    } catch (error) {
      // Error is handled by the mutations
    }
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setEditingStaff(null)
  }

  const handleCloseViewModal = () => {
    setViewingStaffId(null)
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      role: '',
      status: ''
    })
    setCurrentPage(1)
  }
console.log(viewingStaffData)
  const staff = staffData?.data || []
  const isNew = staffData?.is_new
  const hasActiveFilters = filters.search || filters.role || filters.status
  const isEmpty = staff.length === 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* New Staff Banner */}
      {isNew && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">!</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Welcome to Staff Management!
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                This appears to be your first time here. Start by adding your first staff member.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Staff Management
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Manage staff members, roles, and privileges across the platform
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddStaff}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-secondary-800 transition-colors duration-200"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Staff Member
        </motion.button>
      </div>

      {/* Filters */}
      <StaffFilters
        onFiltersChange={handleFiltersChange}
        totalCount={staffData?.total}
      />

      {/* Staff Table or Empty State */}
      {isEmpty && !isLoading ? (
        <StaffEmptyState
          hasFilters={!!hasActiveFilters}
          onAddStaff={handleAddStaff}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <StaffTable
          staff={staff}
          isLoading={isLoading}
          onEdit={handleEditStaff}
          onDelete={handleDeleteStaff}
          onView={handleViewStaff}
          onActivate={handleActivateStaff}
          onDeactivate={handleDeactivateStaff}
        />
      )}

      {/* Pagination */}
      {!isEmpty && !isLoading && staffData && staffData.data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((staffData.total || 0) / 10)}
          onPageChange={handlePageChange}
        />
      )}

      

      {/* Add/Edit Modal */}
      <AddEditStaffModal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        onSubmit={handleSubmitStaff}
        isLoading={createStaffMutation.isPending || updateStaffMutation.isPending}
        editingStaff={editingStaff}
      />

      {/* View Modal */}
      <ViewStaffModal
        isOpen={!!viewingStaffId}
        onClose={handleCloseViewModal}
        staff={viewingStaffData || null}
        isLoading={isLoadingStaffDetails}
      />
    </motion.div>
  
  )
}