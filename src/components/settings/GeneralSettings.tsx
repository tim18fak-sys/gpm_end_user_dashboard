
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { api } from '../../services/api'

const schema = yup.object({
  siteName: yup.string().required('Site name is required'),
  adminEmail: yup.string().email('Invalid email').required('Admin email is required'),
  timezone: yup.string().required('Timezone is required'),
  language: yup.string().required('Language is required'),
  allowRegistration: yup.boolean(),
  maintenanceMode: yup.boolean(),
})

type FormData = yup.InferType<typeof schema>

export default function GeneralSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      siteName: '',
      adminEmail: '',
      timezone: 'UTC',
      language: 'en',
      allowRegistration: true,
      maintenanceMode: false,
    },
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.get('/v1/settings/general')
      reset(response.data)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await api.patch('/v1/settings/general', data)
      toast.success('Settings updated successfully!')
    } catch (error) {
      toast.error('Failed to update settings')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
          General Settings
        </h3>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Configure basic application settings and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Site Name
            </label>
            <input
              type="text"
              id="siteName"
              {...register('siteName')}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.siteName && (
              <p className="mt-1 text-sm text-red-600">{errors.siteName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              id="adminEmail"
              {...register('adminEmail')}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.adminEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.adminEmail.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Timezone
            </label>
            <select
              id="timezone"
              {...register('timezone')}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
            {errors.timezone && (
              <p className="mt-1 text-sm text-red-600">{errors.timezone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Language
            </label>
            <select
              id="language"
              {...register('language')}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
            {errors.language && (
              <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="allowRegistration"
              type="checkbox"
              {...register('allowRegistration')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
            />
            <label htmlFor="allowRegistration" className="ml-3 block text-sm text-secondary-900 dark:text-white">
              Allow user registration
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="maintenanceMode"
              type="checkbox"
              {...register('maintenanceMode')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
            />
            <label htmlFor="maintenanceMode" className="ml-3 block text-sm text-secondary-900 dark:text-white">
              Enable maintenance mode
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
