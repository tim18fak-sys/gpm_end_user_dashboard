import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useAuthStore, LeadStatusEnum } from '../store/authStore'
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
}

export default function Header({ sidebarOpen, setSidebarOpen, setMobileSidebarOpen }: HeaderProps) {
  const { user } = useAuthStore()
  const handleLogout=async ()=> {
    toast.loading('Logging out in progress',)
    authAPI.logout().then(() => {
       toast.success('Logout out successful')
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    })
    
  }

  return (
    <div className="top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-secondary-700 dark:text-secondary-300 lg:hidden"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      <button
        type="button"
        className="hidden lg:block -m-2.5 p-2.5 text-secondary-700 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white transition-colors duration-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="sr-only">Toggle sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-secondary-200 dark:bg-secondary-700 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-lg transition-colors duration-200">
              <span className="sr-only">Open user menu</span>
              <div className="relative">
                <div 
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 ring-2 ring-primary-500/20 flex items-center justify-center text-white text-sm font-medium"
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                {user?.status === LeadStatusEnum.QUALIFIED && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-secondary-900 rounded-full"></div>
                )}
              </div>
              <span className="hidden lg:flex lg:items-center">
                <div className="ml-4">
                  <span className="text-sm font-semibold leading-6 text-secondary-900 dark:text-white" aria-hidden="true">
                    {user.name || 'User'}
                  </span>
                  {user?.status && (
                    <span className="block text-xs text-secondary-500 dark:text-secondary-400 capitalize">
                      {user.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <ChevronDownIcon className="ml-2 h-5 w-5 text-secondary-400 dark:text-secondary-500" aria-hidden="true" />
              </span>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-72 origin-top-right rounded-xl bg-white dark:bg-secondary-800 shadow-xl ring-1 ring-secondary-900/5 dark:ring-secondary-700 focus:outline-none border border-secondary-200 dark:border-secondary-700">
                <div className="px-4 py-3 border-b border-secondary-100 dark:border-secondary-700">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div 
                        className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-lg font-medium"
                      >
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      {user?.status === LeadStatusEnum.QUALIFIED && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-secondary-800 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-secondary-900 dark:text-white truncate">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                        {user?.email || 'No email provided'}
                      </p>
                      {user?.status && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300 mt-1 capitalize">
                          {user.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  {user?.phoneNumber && (
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                      {user.phoneNumber}
                    </p>
                  )}
                </div>

                {user?.interestedDevice?.deviceCategoryName && (
                  <div className="px-4 py-2 border-b border-secondary-100 dark:border-secondary-700">
                    <p className="text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1">Interested Device:</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300">
                      {user.interestedDevice.deviceCategoryName}
                    </span>
                  </div>
                )}

                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/profile"
                        className={`${
                          active ? 'bg-secondary-50 dark:bg-secondary-700' : ''
                        } block px-4 py-2 text-sm text-secondary-900 dark:text-secondary-100 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors`}
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>My Profile</span>
                        </div>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'text-secondary-900 dark:text-secondary-100'
                        } block w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors`}
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign out</span>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
}