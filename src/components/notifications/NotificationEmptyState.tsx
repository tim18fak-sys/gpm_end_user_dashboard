
import { motion } from 'framer-motion'
import { BellIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

interface NotificationEmptyStateProps {
  isUnreadTab?: boolean
}

const messages = [
  "Your notification center is peaceful and quiet",
  "No new alerts - enjoy the calm",
  "All clear! No notifications to worry about",
  "Your dashboard is notification-free",
  "Silence is golden - no new messages"
]

const caughtUpMessages = [
  "You're all caught up! Great job staying on top of things",
  "Inbox zero achieved! You're a notification ninja",
  "All notifications handled - you're doing amazing",
  "Perfect! Nothing left to read",
  "You're up to date with everything important"
]

export default function NotificationEmptyState({ isUnreadTab = false }: NotificationEmptyStateProps) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const messagesToUse = isUnreadTab ? caughtUpMessages : messages

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messagesToUse.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [messagesToUse.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const bellVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, -10, 10, -5, 5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  }

  const sparkleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
        staggerChildren: 0.2
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center py-16 relative"
    >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${10 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <SparklesIcon className="h-4 w-4 text-primary-400 dark:text-primary-300" />
          </motion.div>
        ))}
      </div>

      {/* Main icon with animation */}
      <motion.div variants={itemVariants} className="relative mb-8">
        <motion.div
          className="mx-auto h-32 w-32 bg-gradient-to-br from-primary-100 via-secondary-100 to-primary-200 dark:from-primary-900/20 dark:via-secondary-900/20 dark:to-primary-800/20 rounded-full flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Background pulse */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.1, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div variants={bellVariants} initial="initial" animate="animate">
            {isUnreadTab ? (
              <CheckCircleIcon className="h-16 w-16 text-primary-600 dark:text-primary-400 relative z-10" />
            ) : (
              <BellIcon className="h-16 w-16 text-primary-600 dark:text-primary-400 relative z-10" />
            )}
          </motion.div>

          {/* Sparkles around the icon */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              variants={sparkleVariants}
              initial="initial"
              animate="animate"
              className="absolute"
              style={{
                top: i % 2 === 0 ? '20%' : '75%',
                left: i < 2 ? '20%' : '75%',
              }}
            >
              <SparklesIcon className="h-6 w-6 text-primary-500 dark:text-primary-400" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Dynamic title */}
      <motion.h3
        variants={itemVariants}
        className="text-2xl font-bold text-secondary-900 dark:text-white mb-4"
      >
        {isUnreadTab ? "All Caught Up!" : "No Notifications"}
      </motion.h3>
      
      {/* Dynamic rotating message */}
      <motion.div
        variants={itemVariants}
        className="relative h-20 flex items-center justify-center mb-6"
      >
        <motion.p
          key={currentMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-secondary-600 dark:text-secondary-400 max-w-lg mx-auto text-lg absolute inset-0 flex items-center justify-center"
        >
          {messagesToUse[currentMessage]}
        </motion.p>
      </motion.div>

      {/* Animated progress indicator */}
      <motion.div variants={itemVariants} className="mt-8">
        <div className="flex justify-center items-center space-x-2">
          {messagesToUse.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                index === currentMessage 
                  ? 'bg-primary-500' 
                  : 'bg-secondary-300 dark:bg-secondary-600'
              }`}
              animate={{
                scale: index === currentMessage ? 1.2 : 1
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating action hint */}
      <motion.div
        variants={itemVariants}
        className="mt-8"
      >
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-flex items-center px-4 py-2 bg-secondary-100 dark:bg-secondary-700 rounded-full text-sm text-secondary-600 dark:text-secondary-400"
        >
          <SparklesIcon className="h-4 w-4 mr-2" />
          {isUnreadTab ? "Check back later for new updates" : "New notifications will appear here"}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
