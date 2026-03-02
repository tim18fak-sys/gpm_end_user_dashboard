
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  _id: string
  first_name: string,
  last_name:string
  email: string
  status: 'active' | 'deactivated'
  role: string
  privileges: string[]
  profile_picture_url?: string
  bio?: string
  phone?: string
}

interface AuthState {
  user: User 
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        _id: '',
        email: '',
        status: 'active',
        role: '',
        privileges: [],
        first_name: '',
        last_name: '',
        profile_picture_url: '',
        bio: '',
      },
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user:{
        _id: '',
        email: '',
        status: 'active',
        role: '',
        privileges: [],
        first_name: '',
        last_name: ''
      }, token: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    // store the token in localstorage
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
)
