
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { BaseDataInterface } from "@/types/shared";
import { User } from "@/types/user.types";

// const API_BASE_URL = 'https://campus-pal-monolith-api.onrender.com' // Replace with your actual API URL
 const API_BASE_URL =  'http://localhost:4000' // Use environment variable or fallback to localhost
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // useAuthStore.getState().logout()
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints configuration

export interface CustomerLoginResponse {
  access_token: string;
  is_verified: boolean;
  is_new: boolean;
  owner: string;
  payload: {
    name: string | null;
    device_id: string | null;
    email: string;
    // gender:string
    isVerified: boolean;
    stage: string;
  };
}
const AUTH_API = "/v1/auth/customer";
// this is a central point
export const authAPI = {
  login: async (identity: string, password: string):Promise<CustomerLoginResponse> => {
    const response = await api.post(`${AUTH_API}/login`, { identity, password })
    return response.data
  },
  
  forgotPassword: async (email: string) => {
    const response = await api.post(`${AUTH_API}/forgot-password`, { email })
    return response.data
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post(`${AUTH_API}/set-password?token=${token}`, {
      password: newPassword
    })
    return response.data
  },
  completeSetup: async (token: string, newPassword: string) => {
    const response = await api.post(`${AUTH_API}/complete-setup?token=${token}`, {
      password: newPassword
    })
    return response.data
  },
  
  
  getUserInfo: async () => {
    const response = await api.get(`${AUTH_API}/me`)
    return response.data
  },

  logout:async() => {
    const response = await api.patch(`${AUTH_API}/logout`)
    return response.data
  }
}

interface UpdateProfile {
  name?: string
  email?: string
  phoneNumber?: string
  current_password?: string
  new_password?: string
}

interface GetUserInfoResponse extends BaseDataInterface<User> {}
// this is for the user management
const PROFILE_MANAGEMENT_API = '/v1/profile-management/customer'
export const ProfileManagementAPI = {
  getUserInfo: async (): Promise<GetUserInfoResponse> => {
    const response = await api.get(`${PROFILE_MANAGEMENT_API}`);
    return response.data;
  },
  updateProfile: async (data: UpdateProfile) => {
    const response = await api.patch(`${PROFILE_MANAGEMENT_API}`, data);
    return response.data;
  },
  updateBoardingFlow: async (
    data: Partial<Record<string, boolean | string>>,
  ) => {
    const response = await api.patch(
      `${PROFILE_MANAGEMENT_API}/boarding-flow`,
      data,
    );
    return response.data;
  },
};