
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { api } from '../../services/api'

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain uppercase, lowercase, number and special character')
    .required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
})

type PasswordFormData = yup.InferType<typeof passwordSchema>

interface SecuritySettings {
  twoFactorEnabled: boolean
  sessionTimeout: number
  passwordExpiry: number
  loginAttempts: number
  requireStrongPassword: boolean
  allowMultipleSessions: boolean
}

interface LoginSession {
  id: string
  device: string
  location: string
  ipAddress: string
  lastActive: string
  current: boolean
}

export default function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    requireStrongPassword: true,
    allowMultipleSessions: true,
  })
  const [sessions, setSessions] = useState<LoginSession[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  })

  useEffect(() => {
    fetchSecuritySettings()
  }, [])

  const fetchSecuritySettings = async () => {
    try {
      const [settingsResponse, sessionsResponse] = await Promise.all([
        api.get('/v1/settings/security'),
        api.get('/v1/settings/security/sessions')
      ])
      setSettings(settingsResponse.data || settings)
      setSessions(sessionsResponse.data || [])
    } catch (error) {
      console.error('Failed to fetch security settings:', error)
      // Mock data
      setSessions([
        {
          id: '1',
          device: 'Chrome on Windows',
          location: 'New York, US',
          ipAddress: '192.168.1.100',
          lastActive: '2024-01-15T10:30:00Z',
          current: true
        },
        {
          id: '2',
          device: 'Safari on iPhone',
          location: 'Los Angeles, US',
          ipAddress: '192.168.1.101',
          lastActive: '2024-01-14T18:45:00Z',
          current: false
        }
      ])
    } finally {
      setIsLoadingData(false)
    }
  }

  const updateSetting = async (key: keyof SecuritySettings, value: any) => {
    setIsLoading(true)
    try {
      const updatedSettings = { ...settings, [key]: value }
      setSettings(updatedSettings)
      
      await api.patch('/v1/settings/security', { [key]: value })
      toast.success('Security setting updated!')
    } catch (error) {
      toast.error('Failed to update security setting')
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    try {
      await api.patch('/v1/settings/security/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })
      toast.success('Password updated successfully!')
      reset()
    } catch (error) {
      toast.error('Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  const terminateSession = async (sessionId: string) => {
    try {
      await api.delete(`/v1/settings/security/sessions/${sessionId}`)
      setSessions(sessions.filter(s => s.id !== sessionId))
      toast.success('Session terminated!')
    } catch (error) {
      toast.error('Failed to terminate session')
    }
  }

  const enable2FA = async () => {
    setIsLoading(true)
    try {
      await api.post('/v1/settings/security/2fa/enable')
      await updateSetting('twoFactorEnabled', true)
      toast.success('Two-factor authentication enabled!')
    } catch (error) {
      toast.error('Failed to enable 2FA')
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
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 0 0 rgba(34, 197, 94, 0.7)',
                '0 0 0 20px rgba(34, 197, 94, 0)',
                '0 0 0 0 rgba(34, 197, 94, 0)'
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Loading Security Settings
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              Securing your account preferences...
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
          Security Settings
        </h3>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Manage your account security and access controls.
        </p>
      </div>

      {/* Password Change */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center space-x-3 mb-4">
          <KeyIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <h4 className="text-md font-medium text-secondary-900 dark:text-white">
            Change Password
          </h4>
        </div>
        
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              {...register('currentPassword')}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                {...register('newPassword')}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            Update Password
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DevicePhoneMobileIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <div>
              <h4 className="text-md font-medium text-secondary-900 dark:text-white">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <button
            onClick={() => settings.twoFactorEnabled ? updateSetting('twoFactorEnabled', false) : enable2FA()}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              settings.twoFactorEnabled
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
            }`}
          >
            {settings.twoFactorEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <h4 className="text-md font-medium text-secondary-900 dark:text-white mb-4">
          Security Policies
        </h4>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settings.loginAttempts}
                onChange={(e) => updateSetting('loginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { key: 'requireStrongPassword', label: 'Require strong passwords', description: 'Enforce password complexity requirements' },
              { key: 'allowMultipleSessions', label: 'Allow multiple sessions', description: 'Users can be logged in from multiple devices' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    {setting.label}
                  </p>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">
                    {setting.description}
                  </p>
                </div>
                <button
                  onClick={() => updateSetting(setting.key as keyof SecuritySettings, !settings[setting.key as keyof SecuritySettings])}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings[setting.key as keyof SecuritySettings]
                      ? 'bg-primary-600'
                      : 'bg-secondary-300 dark:bg-secondary-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings[setting.key as keyof SecuritySettings] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center space-x-3 mb-4">
          <ComputerDesktopIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <h4 className="text-md font-medium text-secondary-900 dark:text-white">
            Active Sessions
          </h4>
        </div>
        
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <ComputerDesktopIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    {session.device} {session.current && '(Current)'}
                  </p>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">
                    {session.location} • {session.ipAddress} • Last active: {new Date(session.lastActive).toLocaleString()}
                  </p>
                </div>
              </div>
              {!session.current && (
                <button
                  onClick={() => terminateSession(session.id)}
                  className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                >
                  Terminate
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
