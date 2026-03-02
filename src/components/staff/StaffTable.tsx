import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PencilIcon, 
  TrashIcon, 
  EllipsisVerticalIcon,
  EyeIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { StaffMember, StaffRole } from '../../services/staff.api'

interface StaffTableProps {
  staff: StaffMember[]
  isLoading: boolean
  onEdit: (staff: StaffMember) => void
  onDelete: (id: string) => void
  onView: (staff: StaffMember) => void
  onActivate: (id: string) => void
  onDeactivate: (id: string) => void
}

export default function StaffTable({ 
  staff, 
  isLoading, 
  onEdit, 
  onDelete, 
  onView,
  onActivate,
  onDeactivate 
}: StaffTableProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    type: 'status' | 'delete'
    staffId: string
    staffName: string
    newStatus?: string
  }>({
    isOpen: false,
    type: 'status',
    staffId: '',
    staffName: '',
    newStatus: ''
  })

  const getRoleColor = (role: StaffRole) => {
    switch (role) {
      case StaffRole.SUPER_ADMIN:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case StaffRole.ADMIN:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case StaffRole.MODERATOR:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activated':
        return 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
      case 'deactivated':
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'
    }
  }

  const handleStatusChange = (staffId: string, action: 'activated' | 'deactivated', staffName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'status',
      staffId,
      staffName,
      newStatus: action
    })
    setOpenDropdown(null)
  }

  const handleDeleteConfirm = (staffId: string, staffName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      staffId,
      staffName
    })
    setOpenDropdown(null)
  }

  const handleConfirmAction = () => {
    if (confirmModal.type === 'status' && confirmModal.newStatus) {
      if (confirmModal.newStatus === 'activate') {
        onActivate(confirmModal.staffId)
      } else if (confirmModal.newStatus === 'deactivate') {
        onDeactivate(confirmModal.staffId)
      }
    } else if (confirmModal.type === 'delete') {
      onDelete(confirmModal.staffId)
    }
    setConfirmModal({ isOpen: false, type: 'status', staffId: '', staffName: '' })
  }

  const handleCancelAction = () => {
    setConfirmModal({ isOpen: false, type: 'status', staffId: '', staffName: '' })
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="rounded-full bg-secondary-200 dark:bg-secondary-700 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/4"></div>
                  <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
          <thead className="bg-secondary-50 dark:bg-secondary-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Staff Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Privileges
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
            {staff.map((member, index) => (
              <motion.tr
                key={member._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-secondary-900 dark:text-white">
                        {member.first_name} {member.last_name}
                      </div>
                      <div className="text-sm text-secondary-500 dark:text-secondary-400">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                    {member.role.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary-900 dark:text-white">
                    {member.privileges.length} privilege{member.privileges.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-secondary-500 dark:text-secondary-400">
                    {member.privileges.slice(0, 2).join(', ')}
                    {member.privileges.length > 2 && ` +${member.privileges.length - 2} more`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                  {new Date(member.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === member._id ? null : member._id)}
                      className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-600 transition-colors duration-200"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                    </button>

                    <AnimatePresence>
                      {openDropdown === member._id && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdown(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-700 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-600 z-20"
                          >
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onView(member)
                                  setOpenDropdown(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-600"
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                View Details
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEdit(member)
                                  setOpenDropdown(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-600"
                              >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit
                              </button>

                              <hr className="my-1 border-secondary-200 dark:border-secondary-600" />

                              <div className="px-4 py-2">
                                <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-2">Change Status</p>
                                {member.status === 'activated' ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleStatusChange(member._id, 'deactivated', `${member.first_name} ${member.last_name}`)
                                    }}
                                    className="block w-full text-left px-2 py-1 text-xs text-danger-600 hover:text-danger-700"
                                  >
                                    Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleStatusChange(member._id, 'activated', `${member.first_name} ${member.last_name}`)
                                    }}
                                    className="block w-full text-left px-2 py-1 text-xs text-success-600 hover:text-success-700"
                                  >
                                    Activate
                                  </button>
                                )}
                              </div>

                              <hr className="my-1 border-secondary-200 dark:border-secondary-600" />

                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteConfirm(member._id, `${member.first_name} ${member.last_name}`)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                              >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-secondary-500 bg-opacity-75 transition-opacity"
                onClick={handleCancelAction}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block align-bottom bg-white dark:bg-secondary-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white dark:bg-secondary-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-danger-100 dark:bg-danger-900/20 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-danger-600 dark:text-danger-400" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                        {confirmModal.type === 'status' ? 'Change Status' : 'Delete Staff Member'}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                          {confirmModal.type === 'status' 
                            ? `Are you sure you want to ${confirmModal.newStatus} ${confirmModal.staffName}? This action will affect their access permissions.`
                            : `Are you sure you want to delete ${confirmModal.staffName}? This action cannot be undone and will permanently remove their account and all associated data.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary-50 dark:bg-secondary-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleConfirmAction}
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-danger-600 text-base font-medium text-white hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                  >
                    {confirmModal.type === 'status' ? (confirmModal.newStatus === 'activate' ? 'Activate' : 'Deactivate') : 'Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelAction}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-secondary-300 dark:border-secondary-600 shadow-sm px-4 py-2 bg-white dark:bg-secondary-800 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}