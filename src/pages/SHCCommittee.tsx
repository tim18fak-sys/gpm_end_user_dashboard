import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { useShcCommittees, useCreateCommittee } from '../hooks/useShcCommittees';
import { SHCCommitteesParams } from '../services/shc.api';
import Filters from '../components/shc/Filters';
import Table from '../components/shc/Table';
import EmptyState from '../components/shc/EmptyState';
import Pagination from '../components/ui/Pagination';
import OnboardModal, { OnboardCommitteeValues } from '../components/shc/OnboardModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function SHCCommittee() {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const limit = 10;

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setSearchQuery(searchTerm);
      setCurrentPage(1); // Reset to page 1 when searching
    }, 300),
    []
  );

  // Prepare query parameters
  const queryParams: SHCCommitteesParams = useMemo(() => {
    const params: SHCCommitteesParams = {
      page: currentPage,
      limit,
    };

    if (searchQuery) {
      params.search = searchQuery;
    }

    if (status) {
      params.status = status as 'activated' | 'deactivated';
    }

    return params;
  }, [searchQuery, status, currentPage, limit]);

  // Fetch committees data
  const { data, isLoading, error } = useShcCommittees(queryParams);
  const createCommitteeMutation = useCreateCommittee();

  const hasActiveFilters = Boolean(searchQuery || status);
  const hasCommittees = data && data.data.length > 0;

  const handleSearchInputChange = (search: string) => {
    setSearchInputValue(search);
    debouncedSearch(search);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setSearchInputValue('');
    debouncedSearch.cancel();
    setSearchQuery('');
    setStatus('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOnboardCommittee = () => {
    setShowOnboardModal(true);
  };

  const handleCloseOnboardModal = () => {
    setShowOnboardModal(false);
  };

  const handleCreateCommittee = async (values: OnboardCommitteeValues) => {
    try {
      await createCommitteeMutation.mutateAsync(values);
      setShowOnboardModal(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-danger-600 dark:text-danger-400">
            Error Loading Committees
          </h2>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            {error.message || 'Failed to load Sexual Harassment Committees'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Sexual Harassment Committees
        </h1>
        <p className="mt-2 text-secondary-600 dark:text-secondary-400">
          Manage and monitor Sexual Harassment Committee members across universities
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Filters
          search={searchInputValue}
          status={status}
          onSearchChange={handleSearchInputChange}
          onStatusChange={handleStatusChange}
          onClearFilters={handleClearFilters}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        {!hasCommittees && !isLoading ? (
          <EmptyState 
            hasFilters={hasActiveFilters}
            onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
            onOnboardCommittee={!hasActiveFilters ? handleOnboardCommittee : undefined}
          />
        ) : (
          <>
            {/* Header with Create Button */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Committees Overview
                </h2>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Manage and monitor all Sexual Harassment Committees
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOnboardCommittee}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-secondary-800 transition-colors duration-200"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Committee
              </motion.button>
            </div>

            <Table 
              committees={data?.data || []} 
              isLoading={isLoading}
            />

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-6"
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                  // totalItems={data.total}
                  // itemsPerPage={limit}
                />
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {/* Loading overlay for pagination */}
      {isLoading && hasCommittees && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40"
        >
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span className="text-secondary-900 dark:text-white">Loading...</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Onboard Modal */}
      <OnboardModal
        isOpen={showOnboardModal}
        onClose={handleCloseOnboardModal}
        onSubmit={handleCreateCommittee}
        isLoading={createCommitteeMutation.isPending}
      />
    </motion.div>
  );
}