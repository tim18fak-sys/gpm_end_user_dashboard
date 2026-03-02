
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, UserCircleIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useShcCommitteeDetails } from '../../hooks/useShcCommittees';

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  committeeId: string | null;
}

export default function ViewModal({ isOpen, onClose, committeeId }: ViewModalProps) {
  const { data: committee, isLoading, error } = useShcCommitteeDetails(committeeId || '');
console.log(committee)
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-secondary-800 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-secondary-900 dark:text-white"
                  >
                    Committee Details
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 dark:text-red-400">Failed to load committee details</p>
                    </div>
                  ) : committee ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Header */}
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                            <UserCircleIcon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                            {committee.committee_name}
                          </h2>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              committee.status === 'activated'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {committee.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Committee Head */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center">
                            <UserCircleIcon className="h-4 w-4 mr-2" />
                            Committee Head
                          </label>
                          <p className="text-secondary-900 dark:text-white">
                            {committee.committee_first_name} {committee.committee_last_name}
                          </p>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-2" />
                            Committee Email
                          </label>
                          <p className="text-secondary-900 dark:text-white">
                            {committee.committee_email}
                          </p>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center">
                            <PhoneIcon className="h-4 w-4 mr-2" />
                            Phone Number
                          </label>
                          <p className="text-secondary-900 dark:text-white">
                            {committee.committee_phone_number}
                          </p>
                        </div>

                        {/* Founder Email */}
                        {/* <div className="space-y-2">
                          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center">
                            <BuildingOffice2Icon className="h-4 w-4 mr-2" />
                            University Founder
                          </label>
                          <p className="text-secondary-900 dark:text-white">
                            {committee.founder_email}
                          </p>
                        </div> */}
                      </div>

                      {/* Notes */}
                      {committee.notes && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                            Notes
                          </label>
                          <div className="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-4">
                            <p className="text-secondary-900 dark:text-white">
                              {committee.notes}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Timestamps */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                        <div>
                          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                            Created At
                          </label>
                          <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            {new Date(committee.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                            Last Updated
                          </label>
                          <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            {new Date(committee.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </div>

                <div className="px-6 py-4 bg-secondary-50 dark:bg-secondary-700/50">
                  <button
                    onClick={onClose}
                    className="w-full inline-flex justify-center rounded-lg border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
