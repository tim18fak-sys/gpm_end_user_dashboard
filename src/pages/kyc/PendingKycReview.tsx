import { motion } from 'framer-motion'
import { ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router'

const PendingKycReview = () => {
  const navigate = useNavigate()
  const {logout}  = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')  
  }
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
              <div className="relative inline-block">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center mx-auto"
                >
                  <ClockIcon className="h-10 w-10 text-warning-500" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-secondary-900 dark:text-white mb-2"
            >
              Verification In Progress
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-sm text-secondary-500 dark:text-secondary-400 mb-8 leading-relaxed max-w-sm mx-auto"
            >
              Your KYC documents have been submitted and are currently under review. This process typically takes a few minutes to 2 days to complete.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4 mb-6 text-left"
            >
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning-800 dark:text-warning-200 mb-1">
                    What happens next?
                  </p>
                  <ul className="text-sm text-warning-700 dark:text-warning-300 space-y-1">
                    <li>Your identity documents are being verified</li>
                    <li>You will be notified once the review is complete</li>
                    <li>Upon approval, you will get full access to your dashboard</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="flex items-center justify-center gap-2 text-sm text-secondary-400 dark:text-secondary-500"
            >
              <div className="h-2 w-2 rounded-full bg-warning-400 animate-pulse" />
              <span>Review in progress</span>
            </motion.div>
          </div>
          {/* the logout button */}
       <div className='flex items-center justify-center'>
         <button onClick={handleLogout} className="mt-4 text-sm text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 transition-colors py-4 px-8">
          Logout
        </button>
       </div>
        </motion.div>
        
      </div>
    </div>
  )
}

export default PendingKycReview
