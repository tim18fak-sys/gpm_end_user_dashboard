
export interface TotalResponse {
  total: number
  change: number
}

export interface UniversityAdminGrowthData {
  period: string
  departments: number
  sectors: number
  faculties: number
  users: number
  staffs: number
}

export interface UniversityAdminUserGrowthData {
  period: string
  academic_staff: number
  students: number
  non_academic_staff: number
}

export interface UniversityAdminOnboardingActivityData {
  date: string
  departments: number
  staffs: number
  sectors: number
  faculties: number
}

export interface DataDistribution {
  name: string
  value: number
  color: string
}
