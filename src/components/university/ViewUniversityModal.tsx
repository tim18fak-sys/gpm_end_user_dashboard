
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, BuildingOffice2Icon, MapPinIcon, GlobeAltIcon, UserIcon, CalendarIcon, AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useUniversityDetails } from '../../hooks/university/useUniversities';

interface ViewUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  universityId: string | null;
}

export default function ViewUniversityModal({ isOpen, onClose, universityId }: ViewUniversityModalProps) {
 
  const { data: university, isLoading, error } = useUniversityDetails(universityId || '');
  console.log(universityId, university)
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-secondary-800 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-secondary-900 dark:text-white"
                  >
                    University Details
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-md text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600">
                    Loading Data

                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 dark:text-red-400">Failed to load university details</p>
                    </div>
                  ) : university ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Header */}
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0">
                          {university.logo_url ? (
                            <img
                              className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                              src={university.logo_url}
                              alt={university.name}
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${university.name}&background=random&size=80`
                              }}
                            />
                          ) : (
                            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center border-4 border-white shadow-lg">
                              <span className="text-white font-bold text-2xl">
                                {university.name ? university.name.charAt(0).toUpperCase(): university.name}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                            {university?.name}
                          </h2>
                          <p className="text-secondary-600 dark:text-secondary-400 text-lg">
                            {university?.slug}
                          </p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              university.type === 'federal' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                : university.type === 'state'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                            }`}>
                              {university?.type} University
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              university.status === 'activated'
                                ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400'
                                : 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400'
                            }`}>
                              {university?.status}
                            </span>
                            {university?.is_verified && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400">
                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* University Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            Location
                          </label>
                          <p className="text-secondary-900 dark:text-white">
                            {university?.location}
                          </p>
                        </div>

                        {/* Website */}
                        {university?.website && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center">
                              <GlobeAltIcon className="h-4 w-4 mr-2" />
                              Website
                            </label>
                            <a
                              href={university.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              {university?.website}
                            </a>
                          </div>
                        )}

                        {/* Founding Year */}
                        {university?.founding_year && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              Founded
                            </label>
                            <p className="text-secondary-900 dark:text-white">
                              {university.founding_year}
                            </p>
                          </div>
                        )}

                        {/* Student Population */}
                        {university?.student_population && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center">
                              <AcademicCapIcon className="h-4 w-4 mr-2" />
                              Student Population
                            </label>
                            <p className="text-secondary-900 dark:text-white">
                              {university?.student_population.toLocaleString()} students
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      {university?.address && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center">
                            <BuildingOffice2Icon className="h-4 w-4 mr-2" />
                            Address
                          </label>
                          <div className="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-4">
                            <p className="text-secondary-900 dark:text-white">
                              {university.address}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Founder Information */}
                      <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
                        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 flex items-center">
                          <UserIcon className="h-5 w-5 mr-2" />
                          Founder Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                              Name
                            </label>
                            <p className="text-secondary-900 dark:text-white">
                              {university.founder_first_name} {university.founder_last_name}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                              Email
                            </label>
                            <p className="text-secondary-900 dark:text-white">
                              {university.founder_email}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                              Phone
                            </label>
                            <p className="text-secondary-900 dark:text-white">
                              {university.founder_phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                        <div>
                          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                            Created At
                          </label>
                          <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            {new Date(university.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                            Last Updated
                          </label>
                          <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            {new Date(university.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </div>

                <div className="px-6 py-4 bg-secondary-50 dark:bg-secondary-700/50 flex justify-end">
                  <button
                    onClick={onClose}
                    className="inline-flex justify-center rounded-lg border border-transparent bg-primary-600 px-6 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
