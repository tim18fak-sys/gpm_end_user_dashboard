import { FC, useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface CelebrationProps {
  title?: string
  subtitle?: string
  message?: string
  buttonText?: string
  onButtonClick?: () => void
  show: boolean
}

interface Particle {
  id: number
  x: number
  delay: number
  duration: number
  color: string
  size: number
  rotation: number
  drift: number
}

const CONFETTI_COLORS = [
  '#3b82f6', '#2563eb', '#22c55e', '#16a34a',
  '#f59e0b', '#d97706', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#14b8a6', '#f97316',
]

const Celebration: FC<CelebrationProps> = ({
  title = 'Congratulations!',
  subtitle,
  message,
  buttonText = 'Continue',
  onButtonClick,
  show,
}) => {
  const [particlesVisible, setParticlesVisible] = useState(false)

  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 80,
    }))
  }, [])

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setParticlesVisible(true), 200)
      return () => clearTimeout(timer)
    } else {
      setParticlesVisible(false)
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          {particlesVisible && (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{
                    opacity: 1,
                    y: -20,
                    x: `${p.x}vw`,
                    rotate: 0,
                    scale: 1,
                  }}
                  animate={{
                    opacity: [1, 1, 0],
                    y: ['0vh', '110vh'],
                    x: `calc(${p.x}vw + ${p.drift}px)`,
                    rotate: p.rotation + 360,
                    scale: [1, 0.8, 0.4],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: 'easeIn',
                  }}
                  className="absolute top-0"
                  style={{
                    width: p.size,
                    height: p.size * (Math.random() > 0.5 ? 1 : 0.6),
                    backgroundColor: p.color,
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
            className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                initial={{ scale: 0, opacity: 0.3 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary-400"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0.2 }}
                animate={{ scale: 5, opacity: 0 }}
                transition={{ duration: 1.8, delay: 0.5, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-success-400"
              />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                className="mx-auto mb-6"
              >
                <div className="relative inline-block">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mx-auto"
                  >
                    <CheckCircleIcon className="h-12 w-12 text-success-500" />
                  </motion.div>

                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                      transition={{
                        duration: 0.8,
                        delay: 0.5 + i * 0.1,
                        ease: 'easeOut',
                      }}
                      className="absolute w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                        top: `${50 + 45 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                        left: `${50 + 45 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white mb-2"
              >
                {title}
              </motion.h2>

              {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                  className="text-base text-primary-600 dark:text-primary-400 font-medium mb-3"
                >
                  {subtitle}
                </motion.p>
              )}

              {message && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="text-sm text-secondary-500 dark:text-secondary-400 mb-8 leading-relaxed"
                >
                  {message}
                </motion.p>
              )}

              {onButtonClick && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.4 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onButtonClick}
                  className="w-full py-3 px-6 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  {buttonText}
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Celebration
