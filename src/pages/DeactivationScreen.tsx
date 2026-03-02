
import { useAuthStore } from '../store/authStore'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function DeactivationScreen() {
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-danger-50 to-warning-50 dark:from-danger-900 dark:to-warning-900">
      <div className="max-w-md w-full text-center p-8">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <ExclamationTriangleIcon className="w-16 h-16 text-danger-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
            Account Deactivated
          </h2>
          
          <p className="text-secondary-600 dark:text-secondary-300 mb-8">
            Your account has been deactivated. Please contact your system administrator for assistance.
          </p>
          
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-danger-600 hover:bg-danger-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}
