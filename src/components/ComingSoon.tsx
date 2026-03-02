
import { motion } from 'framer-motion'
import { ClockIcon, BellIcon, StarIcon } from '@heroicons/react/24/outline'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
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

const floatingVariants = {
  floating: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const sparkleVariants = {
  sparkle: {
    opacity: [0, 1, 0],
    scale: [0.5, 1, 0.5],
    rotate: [0, 180, 360],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function ComingSoon() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[600px] flex items-center justify-center relative overflow-hidden"
    >
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
          className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-primary-200/20 to-secondary-200/20 rounded-full blur-3xl"
        />
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
          className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-secondary-200/15 to-primary-200/15 rounded-full blur-3xl"
        />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        variants={floatingVariants}
        animate="floating"
        className="absolute top-20 left-20"
      >
        <StarIcon className="h-6 w-6 text-primary-400 opacity-60" />
      </motion.div>
      
      <motion.div
        variants={sparkleVariants}
        animate="sparkle"
        className="absolute top-32 right-32"
      >
        <StarIcon className="h-4 w-4 text-secondary-400 opacity-40" />
      </motion.div>
      
      <motion.div
        variants={floatingVariants}
        animate="floating"
        style={{ animationDelay: '1s' }}
        className="absolute bottom-32 left-32"
      >
        <StarIcon className="h-5 w-5 text-primary-300 opacity-50" />
      </motion.div>

      {/* Main content */}
      <div className="text-center relative z-10 max-w-2xl mx-auto px-6">
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          {/* Animated icon */}
          <motion.div
            variants={pulseVariants}
            animate="pulse"
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full shadow-2xl mb-6 relative"
          >
            <ClockIcon className="h-12 w-12 text-white" />
            
            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                ease: "linear",
                repeat: Infinity
              }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-primary-300/50"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 bg-clip-text text-transparent mb-4">
            Coming Soon
          </h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className="text-xl md:text-2xl text-secondary-600 dark:text-secondary-300 mb-2">
            News & Updates
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className="text-lg text-secondary-500 dark:text-secondary-400 mb-8 leading-relaxed">
            We're crafting an amazing news experience for you. Stay tuned for the latest updates, 
            announcements, and stories from your educational community.
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg border border-secondary-200 dark:border-secondary-700"
          >
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <BellIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Real-time Updates</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Get instant notifications about important news and announcements
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg border border-secondary-200 dark:border-secondary-700"
          >
            <div className="bg-secondary-100 dark:bg-secondary-900/30 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <StarIcon className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Curated Content</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Carefully selected news stories relevant to your academic journey
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg border border-secondary-200 dark:border-secondary-700"
          >
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <ClockIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Timeline View</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Browse news in an intuitive, chronological timeline format
            </p>
          </motion.div>
        </motion.div>

        {/* Animated progress bar */}
        <motion.div variants={itemVariants}>
          <div className="bg-secondary-200 dark:bg-secondary-700 rounded-full h-2 mb-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            />
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Development Progress: 75%
          </p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center space-x-2 mt-8"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
