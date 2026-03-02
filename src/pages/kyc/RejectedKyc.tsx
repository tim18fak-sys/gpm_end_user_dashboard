import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircleIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline'

const RejectedKyc = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="px-8 pt-8 pb-2">
            <div className="flex items-center justify-center mb-4">
              <img src="/images/logo.png" alt="CompusPal" className="w-16 aspect-square" />
            </div>
          </div>

          <div className="px-8 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.15, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center mx-auto">
                <XCircleIcon className="h-10 w-10 text-danger-500" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-secondary-900 dark:text-white mb-2"
            >
              Verification Unsuccessful
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-sm text-secondary-500 dark:text-secondary-400 mb-8 leading-relaxed max-w-sm mx-auto"
            >
              Unfortunately, your identity verification was not approved. This may be due to unclear images or a document mismatch.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-4 mb-6 text-left"
            >
              <div className="flex items-start gap-3">
                <ShieldExclamationIcon className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-danger-800 dark:text-danger-200 mb-1">
                    Common reasons for rejection
                  </p>
                  <ul className="text-sm text-danger-700 dark:text-danger-300 space-y-1">
                    <li>Blurry or unclear selfie photo</li>
                    <li>ID document was not fully visible</li>
                    <li>Face on selfie did not match the ID photo</li>
                    <li>Expired or damaged identity document</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/kyc', { replace: true })}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RejectedKyc
