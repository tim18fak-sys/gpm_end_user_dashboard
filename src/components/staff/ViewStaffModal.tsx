
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, UserCircleIcon, ShieldCheckIcon, CalendarIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { StaffMember, StaffRole } from '../../services/staff.api'

interface ViewStaffModalProps {
  isOpen: boolean
  onClose: () => void
  staff: StaffMember | null
  isLoading: boolean
}

export default function ViewStaffModal({ isOpen, onClose, staff, isLoading }: ViewStaffModalProps) {
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
      case 'active':
        return 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
      case 'inactive':
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'
      case 'suspended':
        return 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200'
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'
    }
  }

  // const LoadingSpinner = () => (
  //   <motion.div
  //     className="flex items-center justify-center"
  //     initial={{ opacity: 0 }}
  //     animate={{ opacity: 1 }}
  //     exit={{ opacity: 0 }}
  //   >
  //     <motion.div
  //       className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"
  //       animate={{ rotate: 360 }}
  //       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  //     />
  //   </motion.div>
  // )


  const LoadingSkeleton = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 py-8 space-y-6"
    >
      {/* Header loading */}
      <div className="flex items-center space-x-6">
        <motion.div
          className="rounded-full bg-gradient-to-r from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-600 h-16 w-16"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="space-y-3 flex-1">
          <motion.div
            className="h-6 bg-gradient-to-r from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-600 rounded w-48"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
          />
          <motion.div
            className="h-4 bg-gradient-to-r from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-600 rounded w-64"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          />
          <div className="flex space-x-3">
            <motion.div
              className="h-6 bg-gradient-to-r from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-600 rounded w-20"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <motion.div
              className="h-6 bg-gradient-to-r from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-600 rounded w-16"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Content loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-4">
            <motion.div
              className="h-6 bg-gradient-to-r from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-600 rounded w-32"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 + i * 0.1 }}
            />
            {[...Array(4)].map((_, j) => (
              <motion.div
                key={j}
                className="h-4 bg-gradient-to-r from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-600 rounded w-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 + j * 0.1 }}
              />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={onClose}
            />

            {/* Modal */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="inline-block align-bottom bg-white dark:bg-secondary-800 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-[10000]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg">
                      <UserCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Staff Details</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="text-white/80 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/10"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <LoadingSkeleton key="loading" />
                ) : staff ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-6 space-y-6"
                  >
                    {/* Profile Section */}
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                          <UserCircleIcon className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-secondary-900 dark:text-white">
                          {staff.first_name} {staff.last_name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <EnvelopeIcon className="h-4 w-4 text-secondary-500" />
                          <span className="text-secondary-600 dark:text-secondary-400">{staff.email}</span>
                        </div>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(staff.role)}`}>
                            <ShieldCheckIcon className="h-3 w-3 mr-1" />
                            {staff.role.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                            {staff.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h5 className="text-lg font-medium text-secondary-900 dark:text-white border-b border-secondary-200 dark:border-secondary-700 pb-2">
                          Basic Information
                        </h5>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                              Full Name
                            </label>
                            <p className="text-secondary-900 dark:text-white">
                              {staff.first_name} {staff.last_name}
                            </p>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                              Email Address
                            </label>
                            <p className="text-secondary-900 dark:text-white">{staff.email}</p>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                              Role
                            </label>
                            <p className="text-secondary-900 dark:text-white capitalize">
                              {staff.role.replace('_', ' ')}
                            </p>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                              Status
                            </label>
                            <p className="text-secondary-900 dark:text-white capitalize">{staff.status}</p>
                          </div>
                        </div>
                      </div>

                      {/* Privileges */}
                      <div className="space-y-4">
                        <h5 className="text-lg font-medium text-secondary-900 dark:text-white border-b border-secondary-200 dark:border-secondary-700 pb-2">
                          Privileges ({staff.privileges.length})
                        </h5>
                        
                        <div className="max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-1 gap-2">
                            {staff.privileges.map((privilege, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center p-2 bg-secondary-50 dark:bg-secondary-700 rounded-lg"
                              >
                                <div className="h-2 w-2 bg-primary-500 rounded-full mr-3"></div>
                                <span className="text-sm text-secondary-900 dark:text-white capitalize">
                                  {privilege.replace(/_/g, ' ')}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
                      <h5 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                        Timestamps
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-secondary-500" />
                          <div>
                            <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                              Created At
                            </p>
                            <p className="text-secondary-900 dark:text-white">
                              {new Date(staff.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-secondary-500" />
                          <div>
                            <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                              Last Updated
                            </p>
                            <p className="text-secondary-900 dark:text-white">
                              {new Date(staff.updated_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-6 py-8 text-center"
                  >
                    <p className="text-secondary-600 dark:text-secondary-400">
                      Staff data not available
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="bg-secondary-50 dark:bg-secondary-700 px-6 py-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
