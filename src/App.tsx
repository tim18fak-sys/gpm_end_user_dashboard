import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import GetInformation from './pages/GetInformation'
import DeactivationScreen from './pages/DeactivationScreen'
import Unauthorized from './pages/Unauthorized'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import UniversityManagement from './pages/UniversityManagement';
import SHCCommittee from './pages/SHCCommittee';
import News from './pages/News';
import StaffManagement from './pages/StaffManagement';
import { Toaster } from 'react-hot-toast'
import UniversityAnalytics from './pages/UniversityAnalytics'
import CompleteSetup from './pages/CompleteSetup'
import Analytics from './pages/Analytics'
import NotificationCenter from './pages/NotificationCenter'; //Import NotificationCenter
import AlertCenter from './pages/AlertCenter'
import CaseAnalytics from './pages/CaseAnalytics';
import Kyc from './pages/kyc/Kyc'
import PendingKycReview from './pages/kyc/PendingKycReview'
import RejectedKyc from './pages/kyc/RejectedKyc'

function App() {

  const { isAuthenticated } = useAuthStore()

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

        {/* Protected routes */}
        <Route path="/get-information" element={
          <GetInformation />
        } />

        <Route path="/dashboard" element={
          // <RouteGuard>
            <Layout>
              <Dashboard />
            </Layout>
          // </RouteGuard>
        } />

        <Route path="/university" element={
          // <RouteGuard>
            <Layout>
              <UniversityManagement />
            </Layout>
          // </RouteGuard>
        } />

      <Route path="/universities/:id/analytics" element={
              // <RouteGuard>
              <Layout>
              <UniversityAnalytics />
              </Layout>
              // </RouteGuard>
          } />
          <Route path="/universities/:id/case-analytics" element={<Layout><CaseAnalytics /></Layout>} />
            <Route 
              path="/notifications" 
              element={
                // <RouteGuard requiredRoles={['super_admin']}>
                <Layout>
                  <NotificationCenter />
                </Layout>
                // </RouteGuard>
              } 
            />
             <Route 
              path="/alerts" 
              element={
                // <RouteGuard requiredRoles={['super_admin']}>
                <Layout>
                  <AlertCenter />
                </Layout>
                // </RouteGuard>
              } 
            />
        <Route path="/shc-committee" element={
          // <RouteGuard>
            <Layout>
              <SHCCommittee />
            </Layout>
          // </RouteGuard>
        } />
        <Route path="/news" element={
          // <RouteGuard>
            <Layout>
              <News />
            </Layout>
          // </RouteGuard>
        } />
        <Route path="/staff" element={
          // <RouteGuard>
            <Layout>
              <StaffManagement />
            </Layout>
          // </RouteGuard>
        } />

        <Route path="/users" element={
          // <RouteGuard requiredRoles={['super_admin',]}>
            <Layout>
              <Users />
            </Layout>
          // </RouteGuard>
        } />

        <Route path="/analytics" element={
          // <RouteGuard requiredPrivileges={['read_analytics']}>
            <Layout>
              <Analytics />
            </Layout>
          // </RouteGuard>
        } />

        <Route path="/settings" element={
          // <RouteGuard requiredRoles={['super_admin']}>
            <Layout>
              <Settings />
            </Layout>
          // </RouteGuard>
        } />

        <Route path="/profile" element={
          // <RouteGuard>
            <Layout>
              <Profile />
            </Layout>
          // </RouteGuard>
        } />

{/* kyc route */}
        <Route path='kyc'>
          {/* index, submitting your kyc, NONE */}
          <Route index  element={
            <Kyc/>
          }/>
          {/* PENDING-review */}
          <Route path='pending-review' element={
            <PendingKycReview/>
          }/>
          {/* REJECTED */}
          <Route path='rejected-kyc-review' element={
            <RejectedKyc/>
          }/>
          {/*  */}
        </Route>

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