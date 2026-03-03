import { FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

interface WelcomeModalProps {
  show: boolean
  name: string
  deviceName?: string
  onGetStarted: () => void
}

const features = [
  {
    icon: DevicePhoneMobileIcon,
    title: 'Your Device Awaits',
    description: 'Browse curated offers for your chosen device and find the plan that works for you.',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Flexible Financing',
    description: 'Choose between outright purchase or a financing option designed for students.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Verified',
    description: 'Your identity and data are protected every step of the way.',
  },
  {
    icon: AcademicCapIcon,
    title: 'Built for Students',
    description: 'CompusPal is designed to help students access the technology they need to succeed.',
  },
]

const WelcomeModal: FC<WelcomeModalProps> = ({ show, name, deviceName, onGetStarted }) => {
  const firstName = name?.split(' ')[0] || 'there'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.05 }}
            className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-t-2xl" />

            <div className="px-8 pt-8 pb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4, type: 'spring', stiffness: 200 }}
                  className="mb-4"
                >
                  <img
                    src="/images/logo.png"
                    alt="CompusPal"
                    className="w-14 h-14 object-contain"
                  />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="text-2xl font-bold text-secondary-900 dark:text-white"
                >
                  Welcome, {firstName}!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed"
                >
                  {deviceName
                    ? `We're excited to help you get your ${deviceName}. Here's everything you can do on CompusPal.`
                    : "We're excited to have you on board. Here's everything you can do on CompusPal."}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + index * 0.08, duration: 0.35 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-secondary-700/50 border border-gray-100 dark:border-secondary-600"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-secondary-800 dark:text-white leading-tight mb-0.5">
                        {feature.title}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.35 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onGetStarted}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Get Started
                <ArrowRightIcon className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WelcomeModal
