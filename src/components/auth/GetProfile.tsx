
import { useAuthStore } from '@/store/authStore'
import { FC, PropsWithChildren, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'


const GetProfileWrapper: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useAuthStore.getState().token
  
  useEffect(() => {
    // If there's a token and we're not already on a protected route
    if (token && (location.pathname === '/login' || location.pathname === '/')) {
      navigate('/get-information')
    }
    // If there's no token and we're trying to access a protected route
    else if (!token && location.pathname !== '/login' && location.pathname !== '/forgot-password' && location.pathname !== '/reset-password') {
      navigate('/login')
    }
  }, [token, location.pathname, navigate])

  return <>{children}</>
}

export default GetProfileWrapper
