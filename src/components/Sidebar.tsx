import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, SunIcon, MoonIcon, BellIcon, CogIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HomeIcon, 
  UsersIcon, 
  AcademicCapIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { useAuthStore, LeadStatusEnum } from '../store/authStore'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'University Management', href: '/university', icon: AcademicCapIcon },
  { name: 'Staff Management', href: '/staff', icon: UsersIcon },
  {name:"Notification", href:'/notifications',icon: BellIcon },
  {name:"Alerts", href:'/alerts',icon: ExclamationTriangleIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
}

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8
    }
  },
  closed: {
    x: -320,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8
    }
  }
}

const logoVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
}

const navItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  })
}

const userProfileVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
}

export default function Sidebar({ sidebarOpen,  mobileSidebarOpen, setMobileSidebarOpen }: SidebarProps) {
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const user = useAuthStore((state) => state.user)

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())

    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <motion.div 
      className="flex grow flex-col gap-y-6 overflow-y-auto bg-gradient-to-b from-white via-white to-gray-50/50 dark:from-[#1E1E2F] dark:via-[#1E1E2F] dark:to-[#1A1A28] px-6 pb-4 border-r border-gray-200/80 dark:border-[#2A2A3B] shadow-2xl backdrop-blur-sm"
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex h-20 shrink-0 items-center justify-center"
        variants={logoVariants}
      >
        <div className="flex items-center space-x-3 group">
          <motion.div 
            className="relative h-12 w-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform-gpu"
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.img
              src="/images/logo.png"
              alt="Logo"
              className="h-8 w-8 object-contain filter brightness-0 invert"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling!.textContent = 'A'
              }}
            />
            <span className="text-white font-bold text-lg hidden">A</span>

            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <AnimatePresence>
            {(sidebarOpen || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 dark:from-gray-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {user && (sidebarOpen || isMobile) && (
          <motion.div 
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-4 border border-blue-200/50 dark:border-blue-700/30"
            variants={userProfileVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div className="relative flex items-center space-x-3">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 border-2 border-white dark:border-gray-700 shadow-lg flex items-center justify-center text-white text-lg font-medium"
                  layoutId={`user-avatar-${user._id}`}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </motion.div>
                {user.status === LeadStatusEnum.QUALIFIED && (
                  <motion.div 
                    className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </p>
                <motion.span 
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 mt-1 capitalize"
                  whileHover={{ scale: 1.05 }}
                >
                  {user.status?.replace('_', ' ')}
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-8">
          <li>
            <ul role="list" className="space-y-2">
              {navigation.map((item, index) => (
                <motion.li 
                  key={item.name}
                  custom={index}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={cn(
                      "group relative flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium transition-all duration-300 transform-gpu",
                      location.pathname === item.href
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-blue-700 dark:hover:text-blue-300'
                    )}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-shrink-0"
                    >
                      <item.icon 
                        className={cn(
                          "h-5 w-5 transition-colors duration-200",
                          location.pathname === item.href 
                            ? "text-white" 
                            : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        )}
                        aria-hidden="true"
                      />
                    </motion.div>

                    <AnimatePresence>
                      {(sidebarOpen || isMobile) && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex-1"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {location.pathname === item.href && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </li>

          <motion.li 
            className="mt-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={toggleDarkMode}
              className={cn(
                "group relative flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium w-full transition-all duration-300",
                "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 dark:hover:from-yellow-900/20 dark:hover:to-orange-900/20 hover:text-yellow-700 dark:hover:text-yellow-300"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-500 group-hover:text-yellow-600" />
                )}
              </motion.div>

              <AnimatePresence>
                {(sidebarOpen || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.li>
        </ul>
      </nav>
    </motion.div>
  )

  return (
    <>
      <AnimatePresence>
        {mobileSidebarOpen && (
          <Transition.Root show={mobileSidebarOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileSidebarOpen}>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
              </Transition.Child>

              <div className="fixed inset-0 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <motion.button
                          type="button"
                          className="-m-2.5 p-2.5 text-white hover:text-gray-300 transition-colors"
                          onClick={() => setMobileSidebarOpen(false)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </motion.button>
                      </div>
                    </Transition.Child>
                    <SidebarContent isMobile={true} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        )}
      </AnimatePresence>

      <motion.div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:w-72" : "lg:w-20"
        )}
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        initial={false}
      >
        <SidebarContent />
      </motion.div>
    </>
  )
}