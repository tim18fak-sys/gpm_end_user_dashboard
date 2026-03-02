
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const forgotPasswordSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
})

export default function ForgotPassword() {
  const handleForgotPassword = async (values: { email: string }) => {
    try {
      await authAPI.forgotPassword(values.email)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset email')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-primary-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-300">
              Enter your email to receive a password reset link
            </p>
          </div>

          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleForgotPassword}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Email Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-sm bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-danger-600" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>

                <Link
                  to="/login"
                  className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
