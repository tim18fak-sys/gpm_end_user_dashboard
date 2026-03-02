
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  EyeIcon,
  EyeSlashIcon,
  DocumentTextIcon,
  TrashIcon,
 
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { api } from '../../services/api'

interface PrivacySettings {
  profileVisibility: 'public' | 'private'
  dataCollection: boolean
  analyticsTracking: boolean
  marketingEmails: boolean
  thirdPartySharing: boolean
  activityLogging: boolean
}

export default function PrivacySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'private',
    dataCollection: true,
    analyticsTracking: false,
    marketingEmails: false,
    thirdPartySharing: false,
    activityLogging: true,
  })

  useEffect(() => {
    fetchPrivacySettings()
  }, [])

  const fetchPrivacySettings = async () => {
    try {
      const response = await api.get('/v1/settings/privacy')
      setSettings(response.data || settings)
    } catch (error) {
      console.error('Failed to fetch privacy settings:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const updateSetting = async (key: keyof PrivacySettings, value: any) => {
    setIsLoading(true)
    try {
      const updatedSettings = { ...settings, [key]: value }
      setSettings(updatedSettings)
      
      await api.patch('/v1/settings/privacy', { [key]: value })
      toast.success('Privacy setting updated!')
    } catch (error) {
      toast.error('Failed to update privacy setting')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadData = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/v1/settings/privacy/export-data', {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'my-data.json')
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success('Data export started!')
    } catch (error) {
      toast.error('Failed to export data')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }
    
    setIsLoading(true)
    try {
      await api.delete('/v1/settings/privacy/delete-account')
      toast.success('Account deletion request submitted!')
    } catch (error) {
      toast.error('Failed to delete account')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <EyeIcon className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Loading Privacy Settings
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              Configuring your privacy preferences...
            </p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const privacyOptions = [
    {
      key: 'dataCollection',
      title: 'Data Collection',
      description: 'Allow collection of usage data to improve services',
      icon: DocumentTextIcon
    },
    {
      key: 'analyticsTracking',
      title: 'Analytics Tracking',
      description: 'Enable analytics to help us understand how you use the platform',
      icon: EyeIcon
    },
    {
      key: 'marketingEmails',
      title: 'Marketing Emails',
      description: 'Receive promotional emails and newsletters',
      icon: DocumentTextIcon
    },
    {
      key: 'thirdPartySharing',
      title: 'Third-party Sharing',
      description: 'Allow sharing of anonymized data with trusted partners',
      icon: ShieldCheckIcon
    },
    {
      key: 'activityLogging',
      title: 'Activity Logging',
      description: 'Log account activities for security purposes',
      icon: DocumentTextIcon
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
          Privacy Settings
        </h3>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Control how your data is collected and used.
        </p>
      </div>

      {/* Profile Visibility */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center space-x-3 mb-4">
          <EyeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <h4 className="text-md font-medium text-secondary-900 dark:text-white">
            Profile Visibility
          </h4>
        </div>
        
        <div className="space-y-3">
          {['public', 'private'].map((visibility) => (
            <label key={visibility} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="profileVisibility"
                value={visibility}
                checked={settings.profileVisibility === visibility}
                onChange={(e) => updateSetting('profileVisibility', e.target.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
              />
              <div className="flex items-center space-x-2">
                {visibility === 'public' ? (
                  <EyeIcon className="h-5 w-5 text-secondary-500" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5 text-secondary-500" />
                )}
                <span className="text-sm font-medium text-secondary-900 dark:text-white capitalize">
                  {visibility}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Privacy Controls */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <h4 className="text-md font-medium text-secondary-900 dark:text-white mb-6">
          Data & Privacy Controls
        </h4>
        
        <div className="space-y-6">
          {privacyOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <motion.div
                key={option.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900 dark:text-white">
                      {option.title}
                    </p>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400">
                      {option.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting(option.key as keyof PrivacySettings, !settings[option.key as keyof PrivacySettings])}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings[option.key as keyof PrivacySettings]
                      ? 'bg-primary-600'
                      : 'bg-secondary-300 dark:bg-secondary-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings[option.key as keyof PrivacySettings] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <h4 className="text-md font-medium text-secondary-900 dark:text-white mb-6">
          Data Management
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              {/* <DownloadIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" /> */}
              <div>
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  Download Your Data
                </p>
                <p className="text-xs text-secondary-600 dark:text-secondary-400">
                  Get a copy of all your data stored in our systems
                </p>
              </div>
            </div>
            <button
              onClick={downloadData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3">
              <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  Delete Account
                </p>
                <p className="text-xs text-secondary-600 dark:text-secondary-400">
                  Permanently delete your account and all associated data
                </p>
              </div>
            </div>
            <button
              onClick={deleteAccount}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
