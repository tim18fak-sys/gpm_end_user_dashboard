import { Navigate, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  // BellIcon,
  ChartBarIcon,
  UserIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeSolid,
  // BellIcon as BellSolid,
  ChartBarIcon as ChartSolid,
  UserIcon as UserSolid,
  ExclamationCircleIcon as AlertSolid,
} from '@heroicons/react/24/solid'
import type { PropsWithChildren } from 'react'
import { useAuthStore } from '@/store/authStore'
import KycRouterWrapper from "./wrapper/KycRouterWrapper";
import ApprovalFlowWrapper from "./wrapper/ApprovalFlowWrapper";

const TAB_ITEMS = [
  {
    label: 'Home',
    to: '/dashboard',
    Icon: HomeIcon,
    ActiveIcon: HomeSolid,
  },
  {
    label: 'Orders',
    to: '/order-list',
    Icon: ExclamationCircleIcon,
    ActiveIcon: AlertSolid,
  },
  {
    label: 'Payments',
    to: '/payments-history',
    Icon: ChartBarIcon,
    ActiveIcon: ChartSolid,
  },
  // {
  //   label: 'Notifications',
  //   to: '/notifications',
  //   Icon: BellIcon,
  //   ActiveIcon: BellSolid,
  // },
  {
    label: 'Logout',
    to: '/logout',
    Icon: UserIcon,
    ActiveIcon: UserSolid,
  },
]

function DesktopGuard() {
  return (
    <div className="hidden md:flex fixed inset-0 z-[9999] items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-primary-950 p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="bg-white dark:bg-secondary-800 rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center"
      >
        <div className="flex justify-center gap-3 mb-6">
          <div className="w-10 h-16 rounded-xl border-2 border-primary-400 dark:border-primary-500 flex items-end justify-center pb-1.5 bg-primary-50 dark:bg-primary-900/20">
            <div className="w-2 h-2 rounded-full bg-primary-400 dark:bg-primary-500" />
          </div>
          <div className="w-14 h-20 rounded-2xl border-[3px] border-primary-600 dark:border-primary-400 flex items-end justify-center pb-2 bg-primary-50 dark:bg-primary-900/20 shadow-md">
            <div className="w-3 h-3 rounded-full bg-primary-600 dark:bg-primary-400" />
          </div>
          <div className="w-10 h-16 rounded-xl border-2 border-primary-300 dark:border-primary-600 flex items-end justify-center pb-1.5 bg-primary-50/50 dark:bg-primary-900/10 opacity-60">
            <div className="w-2 h-2 rounded-full bg-primary-300 dark:bg-primary-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
          Best viewed on mobile
        </h2>
        <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed">
          This app is designed for mobile screens. Please open it on your smartphone or tablet for the best experience.
        </p>

        <div className="mt-8 flex items-center gap-2 justify-center text-xs text-secondary-400 dark:text-secondary-500">
          <div className="h-px flex-1 bg-secondary-200 dark:bg-secondary-700" />
          <span>Greenpower</span>
          <div className="h-px flex-1 bg-secondary-200 dark:bg-secondary-700" />
        </div>
      </motion.div>
    </div>
  )
}

function MobileTabBar() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden">
      <div className="bg-white/90 dark:bg-secondary-900/90 backdrop-blur-md border-t border-secondary-200 dark:border-secondary-700 px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]">
        <div className="flex items-end justify-around">
          {TAB_ITEMS.map(({ label, to, Icon, ActiveIcon }) => {
            const isActive = pathname === to || pathname.startsWith(to + '/')
            return (
              <NavLink
                key={to}
                to={to}
                className="flex flex-col items-center gap-0.5 flex-1 py-1 relative"
              >
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary-600 dark:bg-primary-400"
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {isActive ? (
                    <ActiveIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  ) : (
                    <Icon className="w-6 h-6 text-secondary-400 dark:text-secondary-500" />
                  )}
                </motion.div>

                <span
                  className={`text-[10px] font-medium leading-none ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-secondary-400 dark:text-secondary-500'
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

function MobileLayout({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuthStore();

  console.log("isAuthenticated", isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <>
      <ApprovalFlowWrapper>
        <KycRouterWrapper>
          <DesktopGuard />
          <div className="pb-[calc(env(safe-area-inset-bottom,0px)+64px)]">
            {children}
          </div>
          <MobileTabBar />
        </KycRouterWrapper>
      </ApprovalFlowWrapper>
    </>
  );
}

export default MobileLayout
