import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useProcessKyc } from '@/hooks/useKyc'

import { ShieldCheckIcon, DocumentTextIcon, CameraIcon } from '@heroicons/react/24/outline'
import '@smileid/web-components/smart-camera-web'
import Celebration from '@/components/ui/Celebration'

const Kyc = () => {
  const navigate = useNavigate()
  const smileIdRef = useRef<HTMLElement>(null)
  const [started, setStarted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const listenerAttached = useRef(false)

  const { mutate: processKyc, isPending: isSubmitting } = useProcessKyc()

  const handlePublish = useCallback((event: Event) => {
    const detail = (event as CustomEvent).detail
    const { images, partner_params } = detail

    processKyc(
      { images_details: images, partner_params },
      { onSuccess: () => setShowCelebration(true) }
    )
  }, [processKyc])

  const handleError = useCallback((event: Event) => {
    console.error('SmileID capture error:', event)
    toast.error('An error occurred during capture. Please try again.')
  }, [])

  useEffect(() => {
    const smileIdElement = smileIdRef.current
    if (!smileIdElement || listenerAttached.current) return

    listenerAttached.current = true
    smileIdElement.addEventListener('smart-camera-web.publish', handlePublish)
    smileIdElement.addEventListener('smart-camera-web.error', handleError)

    return () => {
      listenerAttached.current = false
      smileIdElement.removeEventListener('smart-camera-web.publish', handlePublish)
      smileIdElement.removeEventListener('smart-camera-web.error', handleError)
    }
  }, [started, handlePublish, handleError])

  const steps = [
    {
      icon: CameraIcon,
      title: 'Take a Selfie',
      description: 'A clear photo of your face for identity verification',
    },
    {
      icon: DocumentTextIcon,
      title: 'Scan Your ID',
      description: 'Capture the front of a valid government-issued ID',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Get Verified',
      description: 'Your documents will be reviewed and verified securely',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-center mb-4">
              <img src="/images/logo.png" alt="CompusPal" className="w-16 aspect-square" />
            </div>
            <h2 className="text-2xl font-bold text-center text-secondary-900 dark:text-white">
              Identity Verification
            </h2>
            <p className="text-center text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              Complete your KYC to activate your hub admin account
            </p>
          </div>

          <div className="px-8 py-6">
            {!started ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.4 }}
                      className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-secondary-700/50 rounded-xl border border-gray-200 dark:border-secondary-600"
                    >
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-3">
                        <step.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <h4 className="text-sm font-semibold text-secondary-900 dark:text-white mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-1">
                        Secure Verification
                      </p>
                      <p className="text-sm text-primary-700 dark:text-primary-300">
                        Your documents are processed securely through SmileID. We do not store raw images after verification is complete.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStarted(true)}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Begin Verification
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isSubmitting && (
                  <div className="absolute inset-0 z-10 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mb-4" />
                    <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      Submitting your documents...
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setStarted(false)}
                    className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 transition-colors"
                  >
                    &larr; Back
                  </button>
                </div>

                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-secondary-600">
                  <smart-camera-web
                    theme-color="#3b82f6"
                    capture-id
                    hide-back-of-id
                    ref={smileIdRef as any}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <Celebration
        show={showCelebration}
        title="Verification Submitted!"
        subtitle="Your documents are being reviewed"
        message="We will verify your identity and notify you once the review is complete. This usually takes a few minutes to 2 days. Thank you for your patience!"
        buttonText="Continue"
        onButtonClick={() => navigate('/kyc/pending-review', { replace: true })}
      />
    </div>
  )
}

export default Kyc
