
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  EyeIcon, 
  PowerIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import { SHCCommittee } from '../../services/shc.api';
import { useUpdateCommitteeStatus } from '../../hooks/useShcCommittees';
import ConfirmModal from './ConfirmModal';
import ViewModal from './ViewModal';

interface TableProps {
  committees: SHCCommittee[];
  isLoading: boolean;
}

export default function Table({ committees, isLoading }: TableProps) {
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<{ id: string; status: 'activated' | 'deactivated' } | null>(null);

  const updateStatusMutation = useUpdateCommitteeStatus();

  const handleViewCommittee = (id: string) => {
    console.log(id)
    setSelectedCommitteeId(id);
    setShowViewModal(true);
  };

  const handleStatusToggle = (committee: SHCCommittee) => {
    const newStatus = committee.status === 'activated' ? 'deactivated' : 'activated';
    setStatusUpdate({ id: committee._id, status: newStatus });
    setShowConfirmModal(true);
  };

  const confirmStatusUpdate = () => {
    if (statusUpdate) {
      updateStatusMutation.mutate(statusUpdate);
      setShowConfirmModal(false);
      setStatusUpdate(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === 'activated';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      }`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
            Sexual Harassment Committees
          </h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
            Sexual Harassment Committees
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            {committees.length} committee{committees.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
            <thead className="bg-secondary-50 dark:bg-secondary-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Committee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Committee Head
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  University Founder
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
              {committees.map((committee, index) => (
                <motion.tr
                  key={committee._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-secondary-50 dark:hover:bg-secondary-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-secondary-900 dark:text-white">
                        {committee.committee_name}
                      </div>
                      {committee.notes && (
                        <div className="text-sm text-secondary-500 dark:text-secondary-400 truncate max-w-xs">
                          {committee.notes}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                          <UserCircleIcon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-secondary-900 dark:text-white">
                          {committee.committee_first_name} {committee.committee_last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-secondary-900 dark:text-white">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-secondary-400" />
                        {committee.committee_email}
                      </div>
                      <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400">
                        <PhoneIcon className="h-4 w-4 mr-2 text-secondary-400" />
                        {committee.committee_phone_number}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-secondary-900 dark:text-white">
                      <BuildingOffice2Icon className="h-4 w-4 mr-2 text-secondary-400" />
                      {committee.founder_email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(committee.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewCommittee(committee._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleStatusToggle(committee)}
                        className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          committee.status === 'activated'
                            ? 'text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 focus:ring-red-500'
                            : 'text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 focus:ring-green-500'
                        }`}
                      >
                        <PowerIcon className="h-4 w-4 mr-1" />
                        {committee.status === 'activated' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* View Modal */}
      <ViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCommitteeId(null);
        }}
        committeeId={selectedCommitteeId}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setStatusUpdate(null);
        }}
        onConfirm={confirmStatusUpdate}
        title={`${statusUpdate?.status === 'activated' ? 'Activate' : 'Deactivate'} Committee`}
        message={`Are you sure you want to ${statusUpdate?.status === 'activated' ? 'activate' : 'deactivate'} this committee? This action will change their access status.`}
        confirmText={statusUpdate?.status === 'activated' ? 'Activate' : 'Deactivate'}
        confirmColor={statusUpdate?.status === 'deactivated' ? 'danger' : 'primary'}
        isLoading={updateStatusMutation.isPending}
      />
    </>
  );
}
