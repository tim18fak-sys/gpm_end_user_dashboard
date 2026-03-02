
import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { universityAPI } from '../../services/university'
import type { CompleteUniversitySetupDto } from '../../types/universitySetup'
import type { University } from '../../types/university'

interface CompleteSetupModalProps {
  isOpen: boolean
  onClose: () => void
  university: University | null
  onSuccess?: () => void
}

const founderSchema = Yup.object({
  founder_email: Yup.string().email('Invalid email').required('Email is required'),
  founder_first_name: Yup.string().required('First name is required'),
  founder_last_name: Yup.string().required('Last name is required'),
  founder_phone: Yup.string()
    .matches(/^(\+234|0)[789]\d{9}$/, 'Enter a valid Nigerian phone number')
    .required('Phone number is required'),
})

const shcSchema = Yup.object({
  shc_email: Yup.string().email('Invalid email').required('Email is required'),
  shc_first_name: Yup.string().required('First name is required'),
  shc_last_name: Yup.string().required('Last name is required'),
  shc_phone: Yup.string()
    .matches(/^(\+234|0)[789]\d{9}$/, 'Enter a valid Nigerian phone number')
    .required('Phone number is required'),
})

const combinedSchema = Yup.object().shape({
  ...founderSchema.fields,
  ...shcSchema.fields,
})

export default function CompleteSetupModal({ isOpen, onClose, university, onSuccess }: CompleteSetupModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')

  const handleClose = () => {
    setCurrentStep(1)
    setSlideDirection('right')
    onClose()
  }

  const nextStep = () => {
    setSlideDirection('right')
    setCurrentStep(2)
  }

  const prevStep = () => {
    setSlideDirection('left')
    setCurrentStep(1)
  }

  const handleSubmit = async (values: CompleteUniversitySetupDto) => {
    if (!university) return

    setIsSubmitting(true)
    try {
      await universityAPI.completeSetup(university._id, values)
      toast.success('University setup completed successfully!')
      handleClose()
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to complete setup')
    } finally {
      setIsSubmitting(false)
    }
  }

  const slideVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -300 : 300,
      opacity: 0,
    }),
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
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-secondary-800 shadow-2xl transition-all">
                {/* Header */}
                <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-semibold text-secondary-900 dark:text-white">
                        Complete University Setup
                      </Dialog.Title>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                        {university?.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-md text-secondary-400 hover:text-secondary-500 focus:outline-none transition-colors duration-200"
                      onClick={handleClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex items-center mt-6 space-x-4">
                    <div className="flex items-center">
                      <motion.div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300 ${
                          currentStep >= 1
                            ? 'bg-primary-600 border-primary-600 text-white'
                            : 'border-secondary-300 text-secondary-500'
                        }`}
                        animate={{ scale: currentStep === 1 ? 1.1 : 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {currentStep > 1 ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">1</span>
                        )}
                      </motion.div>
                      <span className="ml-2 text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        Founder Information
                      </span>
                    </div>
                    
                    <motion.div
                      className={`flex-1 h-1 rounded-full transition-colors duration-500 ${
                        currentStep >= 2 ? 'bg-primary-600' : 'bg-secondary-200 dark:bg-secondary-600'
                      }`}
                      animate={{ scaleX: currentStep >= 2 ? 1 : 0 }}
                      style={{ originX: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    <div className="flex items-center">
                      <motion.div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300 ${
                          currentStep >= 2
                            ? 'bg-primary-600 border-primary-600 text-white'
                            : 'border-secondary-300 text-secondary-500'
                        }`}
                        animate={{ scale: currentStep === 2 ? 1.1 : 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span className="text-sm font-medium">2</span>
                      </motion.div>
                      <span className="ml-2 text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        SHC Committee
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="relative overflow-hidden">
                  <Formik
                    initialValues={{
                      founder_email: '',
                      founder_first_name: '',
                      founder_last_name: '',
                      founder_phone: '',
                      shc_email: '',
                      shc_first_name: '',
                      shc_last_name: '',
                      shc_phone: '',
                    }}
                    validationSchema={combinedSchema}
                    onSubmit={handleSubmit}
                  >
                    {({  validateForm }) => (
                      <Form>
                        <AnimatePresence mode="wait" custom={slideDirection}>
                          {currentStep === 1 && (
                            <motion.div
                              key="step1"
                              custom={slideDirection}
                              variants={slideVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              className="p-6"
                            >
                              <div className="space-y-6">
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <h4 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                                    Founder Information
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        First Name *
                                      </label>
                                      <Field
                                        name="founder_first_name"
                                        type="text"
                                        className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                                      />
                                      <ErrorMessage name="founder_first_name" component="div" className="text-sm text-danger-600 mt-1" />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        Last Name *
                                      </label>
                                      <Field
                                        name="founder_last_name"
                                        type="text"
                                        className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                                      />
                                      <ErrorMessage name="founder_last_name" component="div" className="text-sm text-danger-600 mt-1" />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        Email Address *
                                      </label>
                                      <Field
                                        name="founder_email"
                                        type="email"
                                        className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                                      />
                                      <ErrorMessage name="founder_email" component="div" className="text-sm text-danger-600 mt-1" />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        Phone Number *
                                      </label>
                                      <Field
                                        name="founder_phone"
                                        type="tel"
                                        placeholder="+234XXXXXXXXX or 08XXXXXXXXX"
                                        className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                                      />
                                      <ErrorMessage name="founder_phone" component="div" className="text-sm text-danger-600 mt-1" />
                                    </div>
                                  </div>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}

                          {currentStep === 2 && (
                            <motion.div
                              key="step2"
                              custom={slideDirection}
                              variants={slideVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              className="p-6"
                            >
                              <div className="space-y-6">
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <h4 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                                    Sexual Harassment Committee Information
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        First Name *
                                      </label>
                                      <Field
                                        name="shc_first_name"
                                        type="text"
                                        className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                                      />
                                      <ErrorMessage name="shc_first_name" component="div" className="text-sm text-danger-600 mt-1" />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        Last Name *
                                      </label>
                                      <Field
                                        name="shc_last_name"
                                        type="text"
                                        className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                                      />
                                      <ErrorMessage name="shc_last_name" component="div" className="text-sm text-danger-600 mt-1" />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        Email Address *
                                      </label>
                                      <Field
                                        name="shc_email"
                                        type="email"
                                        className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                                      />
                                      <ErrorMessage name="shc_email" component="div" className="text-sm text-danger-600 mt-1" />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        Phone Number *
                                      </label>
                                      <Field
                                        name="shc_phone"
                                        type="tel"
                                        placeholder="+234XXXXXXXXX or 08XXXXXXXXX"
                                        className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                                      />
                                      <ErrorMessage name="shc_phone" component="div" className="text-sm text-danger-600 mt-1" />
                                    </div>
                                  </div>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-secondary-50 dark:bg-secondary-700/50 border-t border-secondary-200 dark:border-secondary-600">
                          <div className="flex justify-between">
                            <div>
                              {currentStep > 1 && (
                                <motion.button
                                  type="button"
                                  onClick={prevStep}
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-600 border border-secondary-300 dark:border-secondary-500 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                  Previous
                                </motion.button>
                              )}
                            </div>

                            <div className="flex space-x-3">
                              <motion.button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-600 border border-secondary-300 dark:border-secondary-500 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                Cancel
                              </motion.button>

                              {currentStep < 2 ? (
                                <motion.button
                                  type="button"
                                  onClick={async () => {
                                    const errors = await validateForm()
                                    const founderErrors = Object.keys(errors).filter(key => key.startsWith('founder_'))
                                    if (founderErrors.length === 0) {
                                      nextStep()
                                    }
                                  }}
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  Next
                                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                                </motion.button>
                              ) : (
                                <motion.button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                >
                                  {isSubmitting ? (
                                    <>
                                      <motion.div
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      />
                                      Completing Setup...
                                    </>
                                  ) : (
                                    <>
                                      <CheckIcon className="h-4 w-4 mr-2" />
                                      Complete Setup
                                    </>
                                  )}
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
