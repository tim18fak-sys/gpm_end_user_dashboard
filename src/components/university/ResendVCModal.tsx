
import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { universityAPI } from '../../services/university'
import type { University } from '../../types/university'

interface ResendVCModalProps {
  isOpen: boolean
  onClose: () => void
  university: University | null
  onSuccess?: () => void
}

type VCType = 'university_admin' | 'shpc_founder'

export default function ResendVCModal({ isOpen, onClose, university, onSuccess }: ResendVCModalProps) {
  const [currentStep, setCurrentStep] = useState<'selection' | 'confirmation'>('selection')
  const [selectedType, setSelectedType] = useState<VCType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setCurrentStep('selection')
    setSelectedType(null)
    onClose()
  }

  const handleCardClick = (type: VCType) => {
    setSelectedType(type)
    setCurrentStep('confirmation')
  }

  const handleBack = () => {
    setCurrentStep('selection')
    setSelectedType(null)
  }

  const handleConfirm = async () => {
    if (!university || !selectedType) return

    setIsSubmitting(true)
    try {
      await universityAPI.resendSetupEmail(university._id, selectedType)
      toast.success('Setup email resent successfully!')
      handleClose()
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend setup email')
    } finally {
      setIsSubmitting(false)
    }
  }

  const slideVariants = {
    enter: {
      x: 300,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -300,
      opacity: 0,
    },
  }

  const getTypeLabel = (type: VCType) => {
    return type === 'university_admin' ? 'Institution VC' : 'Institution Sexual Harassment Probition VC'
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-secondary-800 shadow-2xl transition-all">
                {/* Header */}
                <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {currentStep === 'confirmation' && (
                        <button
                          type="button"
                          onClick={handleBack}
                          className="rounded-md text-secondary-400 hover:text-secondary-500 focus:outline-none transition-colors duration-200"
                        >
                          <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                      )}
                      <div>
                        <Dialog.Title as="h3" className="text-lg font-semibold text-secondary-900 dark:text-white">
                          {currentStep === 'selection' ? 'Resend VC Probition' : 'Confirm Action'}
                        </Dialog.Title>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                          {university?.name}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-md text-secondary-400 hover:text-secondary-500 focus:outline-none transition-colors duration-200"
                      onClick={handleClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {currentStep === 'selection' ? (
                      <motion.div
                        key="selection"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <p className="text-secondary-600 dark:text-secondary-400 text-center mb-6">
                          Select which VC setup email you want to resend
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Institution VC Card */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCardClick('university_admin')}
                            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-6 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                Institution VC
                              </h3>
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                Resend setup email to the Institution Vice Chancellor
                              </p>
                            </div>
                          </motion.div>

                          {/* Institution Sexual Harassment Probition VC Card */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCardClick('shpc_founder')}
                            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-200 dark:border-purple-700 rounded-xl p-6 cursor-pointer hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200"
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                                Institution Sexual Harassment Probition VC
                              </h3>
                              <p className="text-sm text-purple-700 dark:text-purple-300">
                                Resend setup email to the Sexual Harassment Probition Committee founder
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="confirmation"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="text-center space-y-6"
                      >
                        <div className="w-16 h-16 bg-warning-100 dark:bg-warning-900/20 rounded-full flex items-center justify-center mx-auto">
                          <svg className="w-8 h-8 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                            Confirm Resend Email
                          </h3>
                          <p className="text-secondary-600 dark:text-secondary-400">
                            Are you sure you want to resend the setup email for{' '}
                            <span className="font-medium text-secondary-900 dark:text-white">
                              {selectedType ? getTypeLabel(selectedType) : ''}
                            </span>
                            ?
                          </p>
                        </div>

                        <div className="flex justify-center space-x-4">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className="px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                              </>
                            ) : (
                              <>
                                <CheckIcon className="h-4 w-4" />
                                Yes, Resend Email
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
