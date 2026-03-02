
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { StaffRole, AVAILABLE_PRIVILEGES, type CreateStaffRequest, type StaffMember } from '../../services/staff.api'

interface AddEditStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: CreateStaffRequest) => void
  isLoading: boolean
  editingStaff?: StaffMember | null
}

const staffSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
  privileges: Yup.array().min(1, 'At least one privilege is required')
})

const rolePrivilegeDefaults = {
  [StaffRole.SUPER_ADMIN]: AVAILABLE_PRIVILEGES,
  [StaffRole.ADMIN]: [
    'read_dashboard',
    'read_analytics',
    'read_users',
    'write_users',
    'read_universities',
    'write_universities',
    'read_shc_committees',
    'write_shc_committees',
    'read_news',
    'write_news',
    'read_staff'
  ],
  [StaffRole.MODERATOR]: [
    'read_dashboard',
    'read_users',
    'read_universities',
    'read_shc_committees',
    'read_news',
    'write_news'
  ],
  [StaffRole.SUPPORT]: [
    'read_dashboard',
    'read_users',
    'read_universities'
  ],
  [StaffRole.CUSTOM]: []
}

export default function AddEditStaffModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  editingStaff 
}: AddEditStaffModalProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const initialValues: CreateStaffRequest = {
    first_name: editingStaff?.first_name || '',
    last_name: editingStaff?.last_name || '',
    email: editingStaff?.email || '',
    role: editingStaff?.role || StaffRole.MODERATOR,
    privileges: editingStaff?.privileges || rolePrivilegeDefaults[StaffRole.MODERATOR]
  }

  const handleSubmit = (values: CreateStaffRequest) => {
    onSubmit(values)
  }

  const handleRoleChange = (setFieldValue: any, role: StaffRole) => {
    setFieldValue('role', role)
    setFieldValue('privileges', rolePrivilegeDefaults[role])
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-secondary-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block align-bottom bg-white dark:bg-secondary-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <Formik
                initialValues={initialValues}
                validationSchema={staffSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form>
                    <div className="bg-white dark:bg-secondary-800 px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                          {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                        </h3>
                        <button
                          type="button"
                          onClick={onClose}
                          className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div className="px-6 py-6 space-y-6 max-h-96 overflow-y-auto">
                      {/* Basic Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            First Name *
                          </label>
                          <Field
                            name="first_name"
                            type="text"
                            disabled={!!editingStaff}
                            className={`w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white ${editingStaff ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="Enter first name"
                          />
                          <ErrorMessage name="first_name" component="div" className="mt-1 text-sm text-danger-600" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Last Name *
                          </label>
                          <Field
                            name="last_name"
                            type="text"
                            disabled={!!editingStaff}
                            className={`w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white ${editingStaff ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="Enter last name"
                          />
                          <ErrorMessage name="last_name" component="div" className="mt-1 text-sm text-danger-600" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          Email Address *
                        </label>
                        <Field
                          name="email"
                          type="email"
                          disabled={!!editingStaff}
                          className={`w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white ${editingStaff ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="Enter email address"
                        />
                        <ErrorMessage name="email" component="div" className="mt-1 text-sm text-danger-600" />
                        {editingStaff && (
                          <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                            Email cannot be changed for existing staff members
                          </p>
                        )}
                      </div>

                      {/* Role Selection */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          Role *
                        </label>
                        {editingStaff && (
                          <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-2">
                            You can only change the role and privileges for existing staff members
                          </p>
                        )}
                        <div className="grid grid-cols-3 gap-3">
                          {Object.values(StaffRole).map((role) => (
                            <label
                              key={role}
                              className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                values.role === role
                                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                  : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400'
                              }`}
                            >
                              <Field
                                type="radio"
                                name="role"
                                value={role}
                                className="sr-only"
                                onChange={() => handleRoleChange(setFieldValue, role)}
                              />
                              <span className="text-sm font-medium text-secondary-900 dark:text-white capitalize">
                                {role.replace('_', ' ')}
                              </span>
                            </label>
                          ))}
                        </div>
                        <ErrorMessage name="role" component="div" className="mt-1 text-sm text-danger-600" />
                      </div>

                      {/* Advanced Privileges */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                            Privileges *
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                          >
                            {showAdvanced ? <EyeSlashIcon className="h-4 w-4 mr-1" /> : <EyeIcon className="h-4 w-4 mr-1" />}
                            {showAdvanced ? 'Hide' : 'Show'} Advanced
                          </button>
                        </div>

                        {showAdvanced ? (
                          <div className="border border-secondary-200 dark:border-secondary-600 rounded-lg p-4 max-h-32 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-2">
                              {AVAILABLE_PRIVILEGES.map((privilege) => (
                                <label key={privilege} className="flex items-center space-x-2 text-sm">
                                  <Field
                                    type="checkbox"
                                    name="privileges"
                                    value={privilege}
                                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <span className="text-secondary-700 dark:text-secondary-300 capitalize">
                                    {privilege.replace(/_/g, ' ')}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-700 rounded-lg p-3">
                            {values.privileges.length} privilege{values.privileges.length !== 1 ? 's' : ''} selected for {values.role.replace('_', ' ')} role
                          </div>
                        )}
                        <ErrorMessage name="privileges" component="div" className="mt-1 text-sm text-danger-600" />
                      </div>
                    </div>

                    <div className="bg-secondary-50 dark:bg-secondary-700 px-6 py-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        {isLoading || isSubmitting 
                          ? (editingStaff ? 'Updating...' : 'Adding...') 
                          : (editingStaff ? 'Update Staff' : 'Add Staff')
                        }
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
