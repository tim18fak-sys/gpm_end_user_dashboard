
import { useState } from 'react'
import { motion } from 'framer-motion'
import {  
  ExclamationTriangleIcon, 
  UserIcon
} from '@heroicons/react/24/outline'
import { useAuthStore, LeadStatusEnum } from '../store/authStore'

const tabs = [
  { id: 'profile', name: 'Profile', icon: UserIcon },
  // { id: 'notifications', name: 'Notifications', icon: BellIcon },
  // { id: 'alerts', name: 'Alerts', icon: ExclamationTriangleIcon },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const { user } = useAuthStore()

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab user={user} />
      case 'notifications':
        return <NotificationsTab />
      case 'alerts':
        return <AlertsTab />
      default:
        return <ProfileTab user={user} />
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Profile Summary
        </h1>
        <p className="mt-2 text-secondary-600 dark:text-secondary-300">
          Manage your profile.
        </p>
      </div>

      <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900/50">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-4 px-1 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </div>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600"
                    />
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Profile Tab Component
function ProfileTab({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Profile Information
        </h3>
      </div>

      <div className="bg-secondary-50 dark:bg-secondary-700 rounded-xl p-6">
        <div className="flex items-center space-x-6">
          <div className="h-20 w-20 rounded-full overflow-hidden">
            <div 
              className="h-full w-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold"
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-secondary-900 dark:text-white">
              {user?.name || 'User'}
            </h4>
            <p className="text-secondary-600 dark:text-secondary-300">{user?.email}</p>
            <div className="mt-2 flex items-center space-x-4">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                user?.status === LeadStatusEnum.QUALIFIED || user?.status === LeadStatusEnum.CONVERTED
                  ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                  : user?.status === LeadStatusEnum.UNQUALIFIED
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {user?.status?.replace('_', ' ')}
              </span>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 capitalize">
                {user?.leadSourceType?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
              Name
            </label>
            <p className="text-secondary-900 dark:text-white">{user?.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
              Email Address
            </label>
            <p className="text-secondary-900 dark:text-white">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
              Phone Number
            </label>
            <p className="text-secondary-900 dark:text-white">
              {user?.phoneNumber || 'Not provided'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
              Status
            </label>
            <p className="text-secondary-900 dark:text-white capitalize">{user?.status?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {user?.interestedDevice?.deviceCategoryName && (
        <div>
          <h4 className="text-md font-medium text-secondary-900 dark:text-white mb-3">
            Interested Device
          </h4>
          <div className="flex items-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
            <div className="h-2 w-2 bg-primary-500 rounded-full mr-3"></div>
            <span className="text-sm text-secondary-900 dark:text-white">
              {user.interestedDevice.deviceCategoryName}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Notifications Tab Component
function NotificationsTab() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [systemUpdates, setSystemUpdates] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
// this is to 
  return (  
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Notification Preferences
        </h3>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Configure how you receive notifications about system events.
        </p>
      </div>

      {/* Notification Channels */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-secondary-900 dark:text-white">
          Notification Channels
        </h4>
        <div className="space-y-4">
          {[
            { 
              label: 'Email Notifications', 
              description: 'Receive notifications via email',
              value: emailNotifications,
              onChange: setEmailNotifications
            },
            { 
              label: 'Push Notifications', 
              description: 'Browser push notifications',
              value: pushNotifications,
              onChange: setPushNotifications
            }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  {item.label}
                </p>
                <p className="text-xs text-secondary-600 dark:text-secondary-400">
                  {item.description}
                </p>
              </div>
              <button
                onClick={() => item.onChange(!item.value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  item.value ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    item.value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Types */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-secondary-900 dark:text-white">
          Notification Types
        </h4>
        <div className="space-y-4">
          {[
            { 
              label: 'System Updates', 
              description: 'Important system announcements and updates',
              value: systemUpdates,
              onChange: setSystemUpdates
            },
            { 
              label: 'Security Alerts', 
              description: 'Login attempts and security-related notifications',
              value: securityAlerts,
              onChange: setSecurityAlerts
            }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  {item.label}
                </p>
                <p className="text-xs text-secondary-600 dark:text-secondary-400">
                  {item.description}
                </p>
              </div>
              <button
                onClick={() => item.onChange(!item.value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  item.value ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    item.value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-secondary-900 dark:text-white">
          Recent Notifications
        </h4>
        <div className="space-y-3">
          {[
            {
              title: 'New University Registration',
              message: 'Harvard University has been successfully registered',
              time: '2 hours ago',
              type: 'info'
            },
            {
              title: 'Staff Member Added',
              message: 'John Doe has been added as a moderator',
              time: '4 hours ago',
              type: 'success'
            },
            {
              title: 'System Maintenance',
              message: 'Scheduled maintenance completed successfully',
              time: '1 day ago',
              type: 'warning'
            }
          ].map((notification, index) => (
            <div key={index} className="p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-secondary-900 dark:text-white">
                    {notification.title}
                  </h5>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                    {notification.message}
                  </p>
                </div>
                <span className="text-xs text-secondary-500">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Alerts Tab Component
function AlertsTab() {
  const [activeAlerts] = useState([
    {
      id: '1',
      title: 'High CPU Usage',
      message: 'Server CPU usage has exceeded 90% for the past 15 minutes',
      severity: 'high',
      timestamp: '2024-01-15T10:30:00Z',
      acknowledged: false
    },
    {
      id: '2',
      title: 'Failed Login Attempts',
      message: '7 failed login attempts detected from IP 192.168.1.100',
      severity: 'critical',
      timestamp: '2024-01-15T09:45:00Z',
      acknowledged: false
    },
    {
      id: '3',
      title: 'University Registration Spike',
      message: '25 new universities registered in the last hour',
      severity: 'medium',
      timestamp: '2024-01-15T08:20:00Z',
      acknowledged: true
    }
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20'
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      case 'low': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
      default: return 'border-l-secondary-500 bg-secondary-50 dark:bg-secondary-700'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          System Alerts
        </h3>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Monitor and manage system alerts and notifications.
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', value: activeAlerts.length, color: 'bg-blue-500' },
          { label: 'Critical', value: activeAlerts.filter(a => a.severity === 'critical').length, color: 'bg-red-500' },
          { label: 'High', value: activeAlerts.filter(a => a.severity === 'high').length, color: 'bg-orange-500' },
          { label: 'Acknowledged', value: activeAlerts.filter(a => a.acknowledged).length, color: 'bg-green-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${stat.color} mr-3`}></div>
              <div>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Alerts */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-secondary-900 dark:text-white">
          Active Alerts
        </h4>
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} ${
                alert.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h5 className="font-medium text-secondary-900 dark:text-white">
                      {alert.title}
                    </h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center text-xs text-secondary-500 space-x-2">
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!alert.acknowledged && (
                    <button className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full hover:bg-green-200">
                      Acknowledge
                    </button>
                  )}
                  <button className="p-1 text-secondary-500 hover:text-secondary-700">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
