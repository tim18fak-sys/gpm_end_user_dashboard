import { FC } from 'react'
import { motion } from 'framer-motion'
import {
  SunIcon,
  BoltIcon,
  HomeModernIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

interface DeviceOffersStepProps {
  onNext: () => void
}

const offers = [
  {
    icon: SunIcon,
    tier: 'Starter',
    capacity: '1.5 kWp',
    highlight: 'Ideal for small homes',
    perks: ['Powers essential appliances', 'Up to 40% bill reduction', 'Easy monthly payments'],
    color: 'amber',
  },
  {
    icon: HomeModernIcon,
    tier: 'Home',
    capacity: '3 kWp',
    highlight: 'Most popular for families',
    perks: ['Full household coverage', 'Up to 70% bill reduction', 'Flexible financing terms'],
    color: 'primary',
    featured: true,
  },
  {
    icon: BuildingOffice2Icon,
    tier: 'Business',
    capacity: '5 kWp+',
    highlight: 'Built for commercial use',
    perks: ['High-capacity output', 'Battery storage add-on', 'Dedicated account manager'],
    color: 'emerald',
  },
]

const colorMap: Record<string, { bg: string; icon: string; badge: string; badgeText: string }> = {
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    icon: 'text-amber-500',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    badgeText: '',
  },
  primary: {
    bg: 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700',
    icon: 'text-primary-500',
    badge: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    badgeText: 'Most Popular',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    icon: 'text-emerald-500',
    badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    badgeText: '',
  },
}

const DeviceOffersStep: FC<DeviceOffersStepProps> = ({ onNext }) => {
  return (
    <div className="px-8 pt-8 pb-6">
      <div className="flex flex-col items-center text-center mb-6">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
          className="mb-4 w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 flex items-center justify-center"
        >
          <BoltIcon className="w-9 h-9 text-primary-500" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl font-bold text-secondary-900 dark:text-white"
        >
          Your Solar Options
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed max-w-sm"
        >
          We've prepared solar packages to fit different needs and budgets. Browse the options available to you below.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.4 }}
        className="flex flex-col gap-3 mb-6"
      >
        {offers.map((offer, index) => {
          const colors = colorMap[offer.color]
          return (
            <motion.div
              key={offer.tier}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.38 + index * 0.1, duration: 0.35 }}
              className={`relative flex items-start gap-3 p-3.5 rounded-xl border ${colors.bg}`}
            >
              {offer.featured && (
                <span className="absolute -top-2 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-600 text-white">
                  Most Popular
                </span>
              )}
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/60 dark:bg-secondary-800/60 flex items-center justify-center shadow-sm">
                <offer.icon className={`w-5 h-5 ${colors.icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-secondary-900 dark:text-white">
                    {offer.tier}
                  </p>
                  <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400">
                    · {offer.capacity}
                  </span>
                </div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1.5">
                  {offer.highlight}
                </p>
                <div className="flex flex-wrap gap-1">
                  {offer.perks.map((perk) => (
                    <span
                      key={perk}
                      className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white/70 dark:bg-secondary-800/70 text-secondary-600 dark:text-secondary-300 border border-white/50 dark:border-secondary-600"
                    >
                      <CheckCircleIcon className="w-2.5 h-2.5 text-emerald-500" />
                      {perk}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.35 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        Explore My Offers
        <ArrowRightIcon className="w-4 h-4" />
      </motion.button>
    </div>
  )
}

export default DeviceOffersStep
