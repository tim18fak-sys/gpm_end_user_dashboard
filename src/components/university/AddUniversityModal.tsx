import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { universityAPI } from '../../services/university'
import toast from 'react-hot-toast'
import type { CreateUniversityDto } from '../../types/university'

interface AddUniversityModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const universitySchema = Yup.object({
  name: Yup.string().required('University name is required'),
  slug: Yup.string().required('Slug is required'),
  type: Yup.string().oneOf(['federal', 'state', 'private'], 'Invalid type').required('Type is required'),
  location: Yup.string().required('Location is required'),
  logo_url: Yup.string().url('Must be a valid URL').optional(),
  website: Yup.string().url('Must be a valid URL').optional(),
  address: Yup.string().optional(),
  founding_year: Yup.number().min(1800, 'Year must be 1800 or later').optional(),
  student_population: Yup.number().min(0, 'Population must be 0 or greater').optional(),
})

export default function AddUniversityModal({ isOpen, onClose, onSuccess }: AddUniversityModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = async (values: CreateUniversityDto) => {
    setIsSubmitting(true)
    try {
      await universityAPI.createUniversity(values)
      toast.success('University created successfully!')
      handleClose()
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create university')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-secondary-800 p-6 text-left align-middle shadow-xl transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-secondary-900 dark:text-white">
                    Add New University
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-secondary-400 hover:text-secondary-500 focus:outline-none"
                    onClick={handleClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Formik
                    initialValues={{
                      name: '',
                      slug: '',
                      type: null,
                      location: '',
                      logo_url: '',
                      website: '',
                      address: '',
                      founding_year: null,
                      student_population: null
                    }}
                    validationSchema={universitySchema}
                    onSubmit={handleSubmit}
                  >
                    {({ setFieldValue }) => (
                      <Form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                              University Name *
                            </label>
                            <Field
                              name="name"
                              type="text"
                              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                              onChange={(e: any) => {
                                setFieldValue('name', e.target.value)
                                // Auto-generate slug
                                const slug = e.target.value.toLowerCase()
                                  .replace(/[^a-z0-9\s]/g, '')
                                  .replace(/\s+/g, '-')
                                setFieldValue('slug', slug)
                              }}
                            />
                            <ErrorMessage name="name" component="div" className="text-sm text-danger-600 mt-1" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                              Slug *
                            </label>
                            <Field
                              name="slug"
                              type="text"
                              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                            />
                            <ErrorMessage name="slug" component="div" className="text-sm text-danger-600 mt-1" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                              Type *
                            </label>
                            <Field
                              as="select"
                              name="type"
                              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                            >
                              <option value="">Select type</option>
                              <option value="federal">Federal</option>
                              <option value="state">State</option>
                              <option value="private">Private</option>
                            </Field>
                            <ErrorMessage name="type" component="div" className="text-sm text-danger-600 mt-1" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                              Location *
                            </label>
                            <Field
                              name="location"
                              type="text"
                              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                            />
                            <ErrorMessage name="location" component="div" className="text-sm text-danger-600 mt-1" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                              Logo URL
                            </label>
                            <Field
                              name="logo_url"
                              type="url"
                              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                            />
                            <ErrorMessage name="logo_url" component="div" className="text-sm text-danger-600 mt-1" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                              Website
                            </label>
                            <Field
                              name="website"
                              type="url"
                              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                            />
                            <ErrorMessage name="website" component="div" className="text-sm text-danger-600 mt-1" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                              Founding Year
                            </label>
                            <Field
                              name="founding_year"
                              type="number"
                              min="1800"
                              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                            />
                            <ErrorMessage name="founding_year" component="div" className="text-sm text-danger-600 mt-1" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                              Student Population
                            </label>
                            <Field
                              name="student_population"
                              type="number"
                              min="0"
                              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                            />
                            <ErrorMessage name="student_population" component="div" className="text-sm text-danger-600 mt-1" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                            Address
                          </label>
                          <Field
                            as="textarea"
                            name="address"
                            rows={3}
                            className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                          />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Creating...' : 'Create University'}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </motion.div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}