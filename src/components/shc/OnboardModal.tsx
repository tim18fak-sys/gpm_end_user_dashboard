
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ShieldCheckIcon, UserCircleIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface OnboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: OnboardCommitteeValues) => void;
  isLoading: boolean;
}

export interface OnboardCommitteeValues {
  committee_name: string;
  notes?: string;
  committee_email: string;
  committee_phone_number: string;
  committee_first_name: string;
  committee_last_name: string;
}

const onboardSchema = Yup.object({
  committee_name: Yup.string()
    .required('Committee name is required')
    .min(3, 'Committee name must be at least 3 characters'),
  notes: Yup.string().optional(),
  committee_email: Yup.string()
    .email('Invalid email address')
    .required('Committee email is required'),
  committee_phone_number: Yup.string()
    .matches(/^(\+234|0)[789][01]\d{8}$/, 'Invalid Nigerian phone number')
    .required('Phone number is required'),
  committee_first_name: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  committee_last_name: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
});

export default function OnboardModal({ isOpen, onClose, onSubmit, isLoading }: OnboardModalProps) {
  const initialValues: OnboardCommitteeValues = {
    committee_name: '',
    notes: '',
    committee_email: '',
    committee_phone_number: '',
    committee_first_name: '',
    committee_last_name: '',
  };

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-secondary-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                        <ShieldCheckIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-secondary-900 dark:text-white"
                      >
                        Onboard New SHC Committee
                      </Dialog.Title>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        Add a new Sexual Harassment Committee to the system
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-secondary-800 text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={onboardSchema}
                  onSubmit={onSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="mt-6 space-y-6">
                      {/* Committee Information */}
                      <div className="bg-secondary-50 dark:bg-secondary-700/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
                          <BuildingOffice2Icon className="h-4 w-4 mr-2" />
                          Committee Information
                        </h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="committee_name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                              Committee Name *
                            </label>
                            <Field
                              id="committee_name"
                              name="committee_name"
                              type="text"
                              className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="Enter committee name"
                            />
                            <ErrorMessage name="committee_name" component="div" className="mt-1 text-sm text-red-600" />
                          </div>

                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                              Notes (Optional)
                            </label>
                            <Field
                              as="textarea"
                              id="notes"
                              name="notes"
                              rows={3}
                              className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="Additional notes about the committee"
                            />
                            <ErrorMessage name="notes" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>
                      </div>

                      {/* Committee Head Information */}
                      <div className="bg-secondary-50 dark:bg-secondary-700/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
                          <UserCircleIcon className="h-4 w-4 mr-2" />
                          Committee Head Information
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="committee_first_name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                              First Name *
                            </label>
                            <Field
                              id="committee_first_name"
                              name="committee_first_name"
                              type="text"
                              className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="Enter first name"
                            />
                            <ErrorMessage name="committee_first_name" component="div" className="mt-1 text-sm text-red-600" />
                          </div>

                          <div>
                            <label htmlFor="committee_last_name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                              Last Name *
                            </label>
                            <Field
                              id="committee_last_name"
                              name="committee_last_name"
                              type="text"
                              className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="Enter last name"
                            />
                            <ErrorMessage name="committee_last_name" component="div" className="mt-1 text-sm text-red-600" />
                          </div>

                          <div>
                            <label htmlFor="committee_email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                              Email Address *
                            </label>
                            <Field
                              id="committee_email"
                              name="committee_email"
                              type="email"
                              className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="Enter email address"
                            />
                            <ErrorMessage name="committee_email" component="div" className="mt-1 text-sm text-red-600" />
                          </div>

                          <div>
                            <label htmlFor="committee_phone_number" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                              Phone Number *
                            </label>
                            <Field
                              id="committee_phone_number"
                              name="committee_phone_number"
                              type="tel"
                              className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="+234xxxxxxxxxx or 08xxxxxxxxx"
                            />
                            <ErrorMessage name="committee_phone_number" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end space-x-3 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md hover:bg-secondary-50 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting || isLoading}
                          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 border border-transparent rounded-md hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {(isSubmitting || isLoading) && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          )}
                          {isSubmitting || isLoading ? 'Creating...' : 'Create Committee'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
