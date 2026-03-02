import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import { 
  EllipsisVerticalIcon, 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  GlobeAltIcon,
  CalendarIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import type { University } from '../../types/university'
import { useActivateUniversity, useDeactivateUniversity } from '../../hooks/university/useUniversities'
import ViewUniversityModal from './ViewUniversityModal'
import CompleteSetupModal from './CompleteSetupModal'
import ResendVCModal from './ResendVCModal'

interface UniversityTableProps {
  universities: University[]
  isLoading: boolean
  onViewAnalytics: (university: University) => void
}

export default function UniversityTable({ 
  universities, 
  isLoading, 

  onViewAnalytics 
}: UniversityTableProps) {
  const navigate = useNavigate()
  const activateUniversity = useActivateUniversity()
  const deactivateUniversity = useDeactivateUniversity()
    // State for managing the view university modal
    const [viewUniversityModalOpen, setViewUniversityModalOpen] = useState(false);
    const [selectedUniversityId, setSelectedUniversityId] = useState<string | null>(null);
    const [setupUniversity, setSetupUniversity] = useState<University | null>(null)
    const [resendVCUniversity, setResendVCUniversity] = useState<University | null>(null)

    const handleViewUniversity = (id: string) => {
        setSelectedUniversityId(id);
        setViewUniversityModalOpen(true);
    };

    const handleCloseViewUniversityModal = () => {
        setViewUniversityModalOpen(false);
        setSelectedUniversityId(null);
    };

  const handleActivate = (id: string) => {
    activateUniversity.mutate(id)
  }

  const handleDeactivate = (id: string) => {
    deactivateUniversity.mutate(id)
  }

  const handleCompleteSetup = (university: University) => {
    setSetupUniversity(university)
  }

  const handleResendVC = (university: University) => {
    setResendVCUniversity(university)
  }

  const onViewCaseAnalytics = (university: University) => {
    navigate(`/universities/${university._id}/case-analytics`, {
      state: {
        universityName: university.name
      }
    })
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white dark:bg-secondary-800 shadow-sm rounded-lg overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-secondary-200 dark:border-secondary-700 p-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-secondary-200 dark:bg-secondary-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-secondary-800 shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
          <thead className="bg-secondary-50 dark:bg-secondary-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                University
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Type & Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Assignment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
            {universities.map((university, index) => (
              <motion.tr
                key={university._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {university.logo_url ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={university.logo_url}
                          alt={university.name}
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${university.name}&background=random`
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                          <span className="text-white font-medium text-lg">
                            {university.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-secondary-900 dark:text-white">
                        {university.name}
                      </div>
                      <div className="text-sm text-secondary-500 dark:text-secondary-400">
                        {university.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-secondary-900 dark:text-white">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        university.type === 'federal' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : university.type === 'state'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {university.type}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400">
                      {/* <MapPinIcon className="h-4 w-4 mr-1" /> */}
                      {university.location}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    {university.founding_year && (
                      <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {university.founding_year}
                      </div>
                    )}
                    {university.student_population && (
                      <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400">
                        <UsersIcon className="h-4 w-4 mr-1" />
                        {university.student_population.toLocaleString()}
                      </div>
                    )}
                    {university.website && (
                      <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400">
                        <GlobeAltIcon className="h-4 w-4 mr-1" />
                        <a 
                          href={university.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      university.status === 'activated'
                        ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                        : 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200'
                    }`}>
                      {university.status}
                    </span>
                    {university.is_verified && (
                      <div className="flex items-center text-xs text-success-600 dark:text-success-400">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    university.assignment_status === 'assigned'
                      ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                      : 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200'
                  }`}>
                    {university.assignment_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200">
                      <EllipsisVerticalIcon className="h-5 w-5 text-secondary-400" />
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-secondary-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">

                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleViewUniversity(university._id)}
                                className={`${
                                  active ? 'bg-secondary-100 dark:bg-secondary-700' : ''
                                } group flex w-full items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300`}
                              >
                                <EyeIcon className="mr-3 h-4 w-4" />
                                View University
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => onViewAnalytics(university)}
                                className={`${
                                  active ? 'bg-secondary-100 dark:bg-secondary-700' : ''
                                } group flex w-full items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300`}
                              >
                                <ChartBarIcon className="mr-3 h-4 w-4" />
                                View Analytics
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => onViewCaseAnalytics(university)}
                                className={`${
                                  active ? 'bg-secondary-100 dark:bg-secondary-700' : ''
                                } group flex w-full items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300`}
                              >
                                <ChartBarIcon className="mr-3 h-4 w-4" />
                                Case Analytics
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleResendVC(university)}
                                className={`${
                                  active ? 'bg-secondary-100 dark:bg-secondary-700' : ''
                                } group flex w-full items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300`}
                              >
                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21.41 8.41a2 2 0 000-2.83L13.72.89a2 2 0 00-2.83 0L3.31 8.48A2 2 0 003 8z" />
                                </svg>
                                Resend VC Probition
                              </button>
                            )}
                          </Menu.Item>
                            {university.assignment_status === 'unassigned' && (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleCompleteSetup(university)}
                                    className={`${
                                      active ? 'bg-secondary-100 dark:bg-secondary-700' : ''
                                    } group flex w-full items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300`}
                                  >
                                    <EllipsisVerticalIcon className="mr-3 h-4 w-4" />
                                    Complete Setup
                                  </button>
                                )}
                              </Menu.Item>
                            )}
                          {university.status === 'deactivated' ? (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleActivate(university._id)}
                                  className={`${
                                    active ? 'bg-secondary-100 dark:bg-secondary-700' : ''
                                  } group flex w-full items-center px-4 py-2 text-sm text-success-700 dark:text-success-300`}
                                >
                                                                 <CheckCircleIcon className="mr-3 h-4 w-4" />
                                  Activate
                                </button>
                              )}
                            </Menu.Item>
                          ) : (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleDeactivate(university._id)}
                                  className={`${
                                    active ? 'bg-secondary-100 dark:bg-secondary-700' : ''
                                  } group flex w-full items-center px-4 py-2 text-sm text-danger-700 dark:text-danger-300`}
                                >
                                  <XCircleIcon className="mr-3 h-4 w-4" />
                                  Deactivate
                                </button>
                              )}
                            </Menu.Item>
                          )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
       {/* View University Modal */}
       <ViewUniversityModal
            isOpen={viewUniversityModalOpen}
            onClose={handleCloseViewUniversityModal}
            universityId={selectedUniversityId}
        />

      <CompleteSetupModal
        isOpen={!!setupUniversity}
        onClose={() => setSetupUniversity(null)}
        university={setupUniversity}
        onSuccess={() => {
          setSetupUniversity(null)
          // Optionally trigger a refetch of universities
        }}
      />

      <ResendVCModal
        isOpen={!!resendVCUniversity}
        onClose={() => setResendVCUniversity(null)}
        university={resendVCUniversity}
        onSuccess={() => {
          setResendVCUniversity(null)
          // Optionally trigger a refetch of universities
        }}
      />
    </div>
  )
}