
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export enum LeadStatusEnum {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  UNQUALIFIED = 'unqualified'
}

export enum LeadSourceEnum {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  COLD_CALL = 'cold_call',
  EVENT = 'event',
  FIELD_AGENT = 'agent'
}

export enum LeadFinancingOptionEnum {
  OUTRIGHT_PURCHASE = 'outright_purchase',
  FINANCING_OPTION = 'financing_option',
  DEFAULT = 'default'
}

export enum LeadKycVerificationStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  NONE = 'NONE'
}

export interface LeadObjectionInterface {
  reason: string
  details?: string
  isResolved: boolean
  proposedSolution?: string
  resolvedDate?: Date
}

export interface LeadProcessTimelineInterface {
  leadProcessId: string
  name: string
  fulfilledAt: Date
  isQualifiedProcess: boolean
  failedReason?: string
}

export interface LeadTracking {
  leadConfigId: string
  currentLeadScore: number
  isReadyForConversion: boolean
  leadProcessTimeline: LeadProcessTimelineInterface[]
  isScreened: boolean
  screenedAt: Date | null
  qualifiedAt: Date | null
  qualificationJobFailed: boolean
  qualificationJobFailedReason: string
  hasSubmittedKYCDocuments: boolean
  kycVerificationStatus: LeadKycVerificationStatusEnum
  prefersFinancingOption: LeadFinancingOptionEnum
}

export interface LeadInterestedDevice {
  deviceCategoryId: string
  deviceCategoryName: string
}

export interface LeadOfferMedia {
  mediaUrl: string
  fileId: string
}


// kyc verification first, before onboarding flow
export interface LeadOnBoardingDashboardFlow {
  hasGottenWelcomeModal: boolean
  hasViewedSelectedDeviceOffersModal: boolean
  hasViewedFinancingOptionModal: boolean
  hasSelectedFinancingOption: boolean
  prefersFinancingOption: LeadFinancingOptionEnum
  hasPlacedOrderForDeviceForOutrightPurchase: boolean
  hasSubmittedKYCDocumentsForFinancingOption: boolean
  hasPlacedOrderForDeviceForFinancingOption: boolean
}

export interface User {
  _id: string
  name: string
  email: string
  phoneNumber: string
  leadBoardingFlow: LeadOnBoardingDashboardFlow
  status: LeadStatusEnum
  leadTracking: LeadTracking
  leadSourceId: string
  leadSourceType: LeadSourceEnum
  assignedSalesAgentId: string | null
  assignedScreeningAgentId: string | null
  assignedSalesAgentAt?: Date
  hubId?: string
  interestedDevice: LeadInterestedDevice
  objections?: LeadObjectionInterface[]
  offerMedia: LeadOfferMedia
  leadConfigMetaData: Record<string, any>
}

const defaultUser: User = {
  _id: '',
  name: '',
  email: '',
  phoneNumber: '',
  leadBoardingFlow: {
    hasGottenWelcomeModal: false,
    hasViewedSelectedDeviceOffersModal: false,
    hasViewedFinancingOptionModal: false,
    hasSelectedFinancingOption: false,
    prefersFinancingOption: LeadFinancingOptionEnum.DEFAULT,
    hasPlacedOrderForDeviceForOutrightPurchase: false,
    hasSubmittedKYCDocumentsForFinancingOption: false,
    hasPlacedOrderForDeviceForFinancingOption: false
  },
  status: LeadStatusEnum.NEW,
  leadSourceId: '',
  leadSourceType: LeadSourceEnum.WEBSITE,
  assignedSalesAgentId: null,
  assignedScreeningAgentId: null,
  interestedDevice: {
    deviceCategoryId: '',
    deviceCategoryName: ''
  },
  offerMedia: {
    mediaUrl: '',
    fileId: ''
  },
  leadConfigMetaData: {},
  leadTracking: {
    leadConfigId: "",
  currentLeadScore: 0,
  isReadyForConversion: false,
  leadProcessTimeline: [],
  isScreened: false,
  screenedAt: null,
  qualifiedAt: null,
  qualificationJobFailed: false,
  qualificationJobFailedReason: "",
  hasSubmittedKYCDocuments: false,
  kycVerificationStatus: LeadKycVerificationStatusEnum.NONE,
  prefersFinancingOption: LeadFinancingOptionEnum.DEFAULT,
  }
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
      user: { ...defaultUser },
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: { ...defaultUser }, token: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
)
