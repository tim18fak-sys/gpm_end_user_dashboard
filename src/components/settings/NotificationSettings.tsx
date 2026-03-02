
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {  
  EnvelopeIcon, 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { api } from '../../services/api'

interface NotificationChannel {
  id: string
  name: string
  description: string
  icon: any
  enabled: boolean
}

interface NotificationType {
  id: string
  name: string
  description: string
  channels: {
    email: boolean
    push: boolean
    sms: boolean
    desktop: boolean
  }
}

export default function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [channels, setChannels] = useState<NotificationChannel[]>([])
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([])

  useEffect(() => {
    fetchNotificationSettings()
  }, [])

  const fetchNotificationSettings = async () => {
    try {
      const response = await api.get('/v1/settings/notifications')
      setChannels(response.data.channels || [])
      setNotificationTypes(response.data.types || [])
    } catch (error) {
      console.error('Failed to fetch notification settings:', error)
      // Mock data for when API is not available
      setChannels([
        { id: 'email', name: 'Email', description: 'Receive notifications via email', icon: EnvelopeIcon, enabled: true },
        { id: 'push', name: 'Push Notifications', description: 'Browser push notifications', icon: ComputerDesktopIcon, enabled: true },
        { id: 'sms', name: 'SMS', description: 'Text message notifications', icon: DevicePhoneMobileIcon, enabled: false },
      ])
      setNotificationTypes([
        {
          id: 'system',
          name: 'System Updates',
          description: 'Important system announcements and updates',
          channels: { email: true, push: true, sms: false, desktop: true }
        },
        {
          id: 'security',
          name: 'Security Alerts',
          description: 'Login attempts and security-related notifications',
          channels: { email: true, push: true, sms: true, desktop: true }
        },
        {
          id: 'staff',
          name: 'Staff Activities',
          description: 'New staff registrations and activities',
          channels: { email: true, push: false, sms: false, desktop: true }
        },
        {
          id: 'university',
          name: 'University Updates',
          description: 'University registration and status changes',
          channels: { email: true, push: true, sms: false, desktop: false }
        }
      ])
    } finally {
      setIsLoadingData(false)
    }
  }

  const toggleChannel = async (channelId: string) => {
    setIsLoading(true)
    try {
      const updatedChannels = channels.map(channel =>
        channel.id === channelId ? { ...channel, enabled: !channel.enabled } : channel
      )
      setChannels(updatedChannels)
      
      await api.patch('/v1/settings/notifications/channels', {
        channelId,
        enabled: !channels.find(c => c.id === channelId)?.enabled
      })
      
      toast.success('Channel settings updated!')
    } catch (error) {
      toast.error('Failed to update channel settings')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleNotificationType = async (typeId: string, channelId: string) => {
    setIsLoading(true)
    try {
      const updatedTypes = notificationTypes.map(type =>
        type.id === typeId
          ? {
              ...type,
              channels: {
                ...type.channels,
                [channelId]: !type.channels[channelId as keyof typeof type.channels]
              }
            }
          : type
      )
      setNotificationTypes(updatedTypes)
      
      await api.patch('/v1/settings/notifications/types', {
        typeId,
        channelId,
        enabled: !notificationTypes.find(t => t.id === typeId)?.channels[channelId as keyof typeof notificationTypes[0]['channels']]
      })
      
      toast.success('Notification settings updated!')
    } catch (error) {
      toast.error('Failed to update notification settings')
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
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-3 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Loading Notification Settings
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              Fetching your notification preferences...
            </p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
          Notification Settings
        </h3>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Configure how and when you receive notifications.
        </p>
      </div>

      {/* Notification Channels */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-secondary-900 dark:text-white">
          Notification Channels
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {channels.map((channel, index) => {
              const Icon = channel.icon
              return (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    channel.enabled
                      ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
                      : 'border-secondary-200 bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      channel.enabled
                        ? 'bg-primary-100 dark:bg-primary-800'
                        : 'bg-secondary-100 dark:bg-secondary-700'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        channel.enabled
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-secondary-500 dark:text-secondary-400'
                      }`} />
                    </div>
                    <button
                      onClick={() => toggleChannel(channel.id)}
                      disabled={isLoading}
                      className={`p-1 rounded-full transition-colors ${
                        channel.enabled
                          ? 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/20'
                          : 'text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                      }`}
                    >
                      {channel.enabled ? (
                        <CheckCircleIcon className="h-6 w-6" />
                      ) : (
                        <XCircleIcon className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                  <h5 className="font-medium text-secondary-900 dark:text-white mb-1">
                    {channel.name}
                  </h5>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {channel.description}
                  </p>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Notification Types */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-secondary-900 dark:text-white">
          Notification Types
        </h4>
        <div className="space-y-4">
          <AnimatePresence>
            {notificationTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h5 className="font-medium text-secondary-900 dark:text-white mb-1">
                      {type.name}
                    </h5>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {type.description}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(type.channels).map(([channelKey, enabled]) => {
                    const channelInfo = channels.find(c => c.id === channelKey)
                    if (!channelInfo) return null
                    
                    return (
                      <button
                        key={channelKey}
                        onClick={() => toggleNotificationType(type.id, channelKey)}
                        disabled={isLoading || !channelInfo.enabled}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          enabled && channelInfo.enabled
                            ? 'border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-900/30 dark:text-primary-300'
                            : 'border-secondary-200 bg-secondary-50 text-secondary-600 dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-400'
                        } ${
                          !channelInfo.enabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <channelInfo.icon className="h-5 w-5" />
                          <span className="text-xs font-medium">{channelInfo.name}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
