import { motion } from 'framer-motion'
import {
  ClockIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
  BellAlertIcon,
  CreditCardIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  {
    icon: DocumentCheckIcon,
    label: 'Application submitted',
    description: 'Your installment plan request has been received.',
    done: true,
  },
  {
    icon: ClockIcon,
    label: 'Admin review',
    description: 'A super admin is reviewing your application.',
    done: false,
    active: true,
  },
  {
    icon: BellAlertIcon,
    label: 'Decision notification',
    description: 'You will be notified once a decision is made.',
    done: false,
  },
  {
    icon: CreditCardIcon,
    label: 'Plan activated',
    description: 'Upon approval your installment plan goes live.',
    done: false,
  },
]

function WaitingForApproval() {
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const firstName = user.first_name

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-primary-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Logo header */}
          <div className="px-8 pt-8 pb-0 flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="GreenPower Logo"
              className="w-14 aspect-square object-contain"
            />
          </div>

          <div className="px-8 pt-6 pb-2 text-center">
            {/* Animated icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.15, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-5"
            >
              <div className="relative">
                {/* Outer pulse ring */}
                <motion.div
                  animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-warning-400 dark:bg-warning-500"
                />
                {/* Inner circle */}
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  className="relative w-20 h-20 rounded-full bg-warning-100 dark:bg-warning-900/40 border-2 border-warning-300 dark:border-warning-700 flex items-center justify-center"
                >
                  <ClockIcon className="w-10 h-10 text-warning-500 dark:text-warning-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.35 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning-100 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-700 mb-4"
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-warning-500 dark:bg-warning-400"
              />
              <span className="text-xs font-semibold text-warning-700 dark:text-warning-300 tracking-wide uppercase">
                Pending Approval
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.35 }}
              className="text-2xl font-bold text-secondary-900 dark:text-white mb-2"
            >
              Hang tight, {firstName}!
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.35 }}
              className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed max-w-sm mx-auto mb-6"
            >
              You've chosen the <span className="font-semibold text-primary-600 dark:text-primary-400">installment plan</span>. Because this involves a financing commitment, a super admin needs to review and approve your application before it activates.
            </motion.p>
          </div>

          {/* Timeline steps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="px-8 pb-6"
          >
            <div className="bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-4">
                Where you are in the process
              </p>
              <ol className="space-y-4">
                {STEPS.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <motion.li
                      key={step.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
                      className="flex items-start gap-3"
                    >
                      {/* Icon column */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            step.done
                              ? 'bg-success-100 dark:bg-success-900/30 border-success-400 dark:border-success-600'
                              : step.active
                              ? 'bg-warning-100 dark:bg-warning-900/30 border-warning-400 dark:border-warning-600'
                              : 'bg-secondary-100 dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600'
                          }`}
                        >
                          {step.done ? (
                            <CheckCircleSolid className="w-4 h-4 text-success-500 dark:text-success-400" />
                          ) : step.active ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            >
                              <ArrowPathIcon className="w-4 h-4 text-warning-500 dark:text-warning-400" />
                            </motion.div>
                          ) : (
                            <Icon className="w-4 h-4 text-secondary-400 dark:text-secondary-500" />
                          )}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className={`w-0.5 h-5 mt-1 ${
                              step.done
                                ? 'bg-success-300 dark:bg-success-700'
                                : 'bg-secondary-200 dark:bg-secondary-700'
                            }`}
                          />
                        )}
                      </div>

                      {/* Text column */}
                      <div className="pt-1">
                        <p
                          className={`text-sm font-semibold leading-tight ${
                            step.done
                              ? 'text-success-700 dark:text-success-400'
                              : step.active
                              ? 'text-warning-700 dark:text-warning-300'
                              : 'text-secondary-400 dark:text-secondary-500'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5 leading-snug">
                          {step.description}
                        </p>
                      </div>
                    </motion.li>
                  )
                })}
              </ol>
            </div>

            {/* Info callout */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.35 }}
              className="flex items-start gap-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 mb-6"
            >
              <CheckCircleIcon className="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-primary-800 dark:text-primary-200 mb-0.5">
                  Nothing to do right now
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400 leading-relaxed">
                  Sit back — your agent will reach out once the admin has reviewed your application. Approval usually happens within <span className="font-semibold">24–48 hours</span>.
                </p>
              </div>
            </motion.div>

            {/* Logout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
              className="flex justify-center"
            >
              <button
                onClick={handleLogout}
                className="text-sm text-secondary-400 dark:text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-200 transition-colors py-2 px-6"
              >
                Sign out
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default WaitingForApproval
