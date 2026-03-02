import { useState, useRef, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { api, ProfileManagementAPI } from '../services/api'
import {  
  PencilIcon, 
  CameraIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import ProfileImageUpload from '@/components/smart_components/SingleImageUpload'

const profileSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  bio: Yup.string().max(500, 'Bio must be less than 500 characters'),
  phone: Yup.string(),
})

const passwordSchema = Yup.object({
  current_password: Yup.string().required('Current password is required'),
  new_password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password')], 'Passwords must match')
    .required('Confirm password is required'),
})

export default function Profile() {
  const { user, setUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Function to invalidate and refresh profile data
  const invalidateAndRefreshProfile = async () => {
    try {
      const userInfo = await ProfileManagementAPI.getUserInfo()
      setUser(userInfo)
    } catch (error: any) {
      console.error('Failed to refresh profile data:', error)
      // Don't show error toast here to avoid duplicate error messages
    }
  }

  // Fetch fresh user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true)
        const userInfo = await ProfileManagementAPI.getUserInfo()
        console.log(userInfo)
        setUser(userInfo)
      } catch (error: any) {
        toast.error('Failed to fetch profile data')
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [setUser])

  // this is to update the profile information of the user only
  const handleProfileUpdate = async (values: any) => {
    try {
      const updateData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        bio: values.bio,
        phone: values.phone,
      }

      const updatedUser = await ProfileManagementAPI.updateProfile(updateData)
      setUser(updatedUser)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
      
      // Invalidate and refetch user profile to ensure consistency
      await invalidateAndRefreshProfile()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  // this is to change the user password
  const handlePasswordChange = async (values: any) => {
    try {
      await ProfileManagementAPI.updateProfile({
        current_password: values.current_password,
        new_password: values.new_password
      })
      setIsChangingPassword(false)
      toast.success('Password updated successfully!')
      
      // Invalidate and refetch user profile to ensure consistency
      await invalidateAndRefreshProfile()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    }
  }


  if (isLoadingProfile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">Profile</h1>
        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-300">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
                  {user?.profile_picture_url ? (
                    <img
                      src={user?.profile_picture_url}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-medium text-secondary-600 dark:text-secondary-300">
                      {user?.first_name && user?.last_name ? user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase() : 'US'}
                    </span>
                  )}
                </div>
                <ProfileImageUpload axiosInstance={api} uploadUrl={'/v1/super-admin/upload/single'} profileUrl={'v1/profile-management/super-admin/profile-image'} resourceType={'image'}/>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  {user?.first_name || 'User'}
                </h2>
                <p className="text-secondary-600 dark:text-secondary-300">{user?.email}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user?.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {user?.status}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 capitalize">
                    {user?.role?.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors duration-200"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
          <div className="px-6 py-6">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-6">
              Personal Information
            </h3>

            {isEditing ? (
              <Formik
                initialValues={{
                  first_name: user?.first_name || '',
                  last_name: user?.last_name || '',
                  email: user?.email || '',
                  bio: user?.bio || '',
                  phone: user?.phone || '',
                }}
                validationSchema={profileSchema}
                onSubmit={handleProfileUpdate}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          First Name
                        </label>
                        <Field
                          name="first_name"
                          type="text"
                          className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <ErrorMessage name="first_name" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          Last Name
                        </label>
                        <Field
                          name="last_name"
                          type="text"
                          className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <ErrorMessage name="last_name" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          Email
                        </label>
                        <Field
                          name="email"
                          type="email"
                          className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          Phone Number
                        </label>
                        <Field
                          name="phone"
                          type="tel"
                          className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Bio
                      </label>
                      <Field
                        as="textarea"
                        name="bio"
                        rows="4"
                        className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Tell us about yourself..."
                      />
                      <ErrorMessage name="bio" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-sm text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                      >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                      Full Name
                    </label>
                    <p className="text-secondary-900 dark:text-white">{user?.first_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                      Email
                    </label>
                    <p className="text-secondary-900 dark:text-white">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                      Phone Number
                    </label>
                    <p className="text-secondary-900 dark:text-white">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                      Role
                    </label>
                    <p className="text-secondary-900 dark:text-white capitalize">{user?.role?.replace('_', ' ')}</p>
                  </div>
                </div>
                {user?.bio && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                      Bio
                    </label>
                    <p className="text-secondary-900 dark:text-white">{user.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Privileges */}
        {user?.privileges && user.privileges.length > 0 && (
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                Privileges ({user.privileges.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {user.privileges.map((privilege, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg"
                  >
                    <div className="h-2 w-2 bg-primary-500 rounded-full mr-3"></div>
                    <span className="text-sm text-secondary-900 dark:text-white capitalize">
                      {privilege.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Password Change */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
          <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                Password & Security
              </h3>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {isChangingPassword ? (
              <Formik
                initialValues={{
                  current_password: '',
                  new_password: '',
                  confirm_password: '',
                }}
                validationSchema={passwordSchema}
                onSubmit={handlePasswordChange}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Field
                          name="current_password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-secondary-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-secondary-400" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="current_password" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Field
                          name="new_password"
                          type={showNewPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-secondary-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-secondary-400" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="new_password" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Field
                          name="confirm_password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-secondary-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-secondary-400" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="confirm_password" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <p className="text-secondary-600 dark:text-secondary-300">
                Keep your account secure by using a strong password and changing it regularly.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}