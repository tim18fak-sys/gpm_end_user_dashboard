
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileManagementAPI } from '../services/api'
import { useAuthStore, LeadStatusEnum } from '../store/authStore'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

const spinnerVariants = {
  hidden: { scale: 0, rotate: 0 },
  visible: {
    scale: 1,
    rotate: 360,
    transition: {
      scale: { duration: 0.5, ease: "easeOut" },
      rotate: { duration: 2, ease: "linear", repeat: Infinity }
    }
  }
}

const dotsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      duration: 1.5
    }
  }
}

const dotVariants = {
  hidden: { opacity: 0.3, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1.2,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
}

export default function GetInformation() {
  const navigate = useNavigate()
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true)
        const userInfo = await ProfileManagementAPI.getUserInfo()
        console.log(userInfo, '')
        setUser(userInfo)

        if (userInfo.status === LeadStatusEnum.UNQUALIFIED) {
          navigate('/deactivation-screen')
        } else {
          // Small delay to show the loading animation
          setTimeout(() => {
            navigate('/dashboard')
          }, 2000)
        }
      } catch (error: any) {
        toast.error('Failed to fetch user information')
        navigate('/login')
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 2000)
      }
    }

    fetchUserInfo()
  }, [navigate, setUser, setLoading])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-primary-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-secondary-200/20 to-primary-200/20 rounded-full blur-3xl"
        ></motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center relative z-10"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-secondary-800 rounded-3xl shadow-2xl border border-secondary-200 dark:border-secondary-700 p-12 backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95"
        >
          {/* Main spinner */}
          <motion.div variants={itemVariants} className="relative mb-8">
            <div className="w-24 h-24 mx-auto relative">
              {/* Outer ring */}
              <motion.div
                variants={spinnerVariants}
                className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-800"
              ></motion.div>
              
              {/* Inner spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  ease: "linear",
                  repeat: Infinity
                }}
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 border-r-primary-500"
              ></motion.div>
              
              {/* Center gradient circle */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-2 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500"
              ></motion.div>
              
              {/* Inner icon */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 3,
                  ease: "linear",
                  repeat: Infinity
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent"
            >
              Setting up your dashboard
            </motion.h2>
            
            <motion.p
              variants={itemVariants}
              className="text-secondary-600 dark:text-secondary-300 max-w-md mx-auto text-lg leading-relaxed"
            >
              Please wait while your information is being collected. This will only take a moment.
            </motion.p>

            {/* Progress indicators */}
            <motion.div variants={itemVariants} className="mt-8">
              <div className="flex justify-center items-center space-x-2 mb-4">
                <motion.div
                  variants={dotsVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex space-x-2"
                >
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      variants={dotVariants}
                      className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                    ></motion.div>
                  ))}
                </motion.div>
              </div>
              
              {/* Progress text */}
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-sm text-secondary-500 dark:text-secondary-400"
              >
                Collecting user preferences and settings...
              </motion.div>
            </motion.div>

            {/* Additional visual elements */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex justify-center space-x-4"
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-8 bg-gradient-to-t from-primary-300 to-primary-600 rounded-full"
                ></motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
