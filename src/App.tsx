import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import GetInformation from './pages/GetInformation'
import DeactivationScreen from './pages/DeactivationScreen'
import Unauthorized from './pages/Unauthorized'
import Dashboard from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'
import CompleteSetup from './pages/CompleteSetup'
import Kyc from './pages/kyc/Kyc'
import PendingKycReview from './pages/kyc/PendingKycReview'
import RejectedKyc from './pages/kyc/RejectedKyc'
import Layout2 from './components/Layout2'
import OnboardingPage from './pages/OnboardingPage'
import MobileLayout from './components/MobileLayout'

function App() {
  const location = useLocation()
  location.pathname = location.pathname.toLowerCase() // Ensure the path is in lowercase for consistent routing
  const { isAuthenticated } = useAuthStore()
  if(location.pathname === '/onboarding' && !isAuthenticated) return <OnboardingPage/>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">

      <Routes>

        {/* Public routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to={'/'}/>: <Login />
        } />
        <Route path='/login' element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/complete-setup' element={< CompleteSetup/>}/>
        <Route path="/deactivation-screen" element={<DeactivationScreen />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected routes — wrapped in MobileLayout for mobile shell + tab bar */}
        <Route path="/get-information" element={
          <MobileLayout><GetInformation /></MobileLayout>
        } />
        {/* kyc path */}
        <Route path='/kyc'>
          <Route index element={<MobileLayout><Kyc /></MobileLayout>} />
          <Route path='pending' element={<MobileLayout><PendingKycReview /></MobileLayout>} />
          <Route path='rejected' element={<MobileLayout><RejectedKyc /></MobileLayout>} />
        </Route>
        {/* main page and only page for now, the onboarding will be modals */}
        <Route path="/dashboard" element={
          isAuthenticated
            ? <MobileLayout><Layout2><Dashboard /></Layout2></MobileLayout>
            : <Navigate to="/login" />
        } />
        {/* Default redirect */}
        <Route path="/" element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

      <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              padding: '12px 16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              style: {
                background: 'rgb(34 197 94)',
                color: 'white',
                border: '1px solid rgb(22 163 74)',
              },
              iconTheme: {
                primary: 'white',
                secondary: 'rgb(34 197 94)',
              },
            },
            error: {
              style: {
                background: 'rgb(239 68 68)',
                color: 'white',
                border: '1px solid rgb(220 38 38)',
              },
              iconTheme: {
                primary: 'white',
                secondary: 'rgb(239 68 68)',
              },
            },
            loading: {
              style: {
                background: 'rgb(59 130 246)',
                color: 'white',
                border: '1px solid rgb(37 99 235)',
              },
              iconTheme: {
                primary: 'white',
                secondary: 'rgb(59 130 246)',
              },
            },
          }}
        />
    </div>
  )
}

export default App