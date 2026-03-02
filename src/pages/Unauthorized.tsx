
import { Link } from 'react-router-dom'
import { ShieldExclamationIcon } from '@heroicons/react/24/outline'

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warning-50 to-danger-50 dark:from-warning-900 dark:to-danger-900">
      <div className="max-w-md w-full text-center p-8">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <ShieldExclamationIcon className="w-16 h-16 text-warning-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
            Access Denied
          </h2>
          
          <p className="text-secondary-600 dark:text-secondary-300 mb-8">
            You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>
          
          <Link
            to="/dashboard"
            className="inline-block w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
