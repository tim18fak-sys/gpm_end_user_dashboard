
export interface University {
  _id: string
  name: string
  slug: string
  type: 'federal' | 'state' | 'private'
  location: string
  logo_url?: string
  website?: string
  address?: string
  founding_year?: number
  student_population?: number
  is_active: boolean
  is_verified: boolean
  status: 'activated' | 'deactivated'
  assignment_status: 'assigned' | 'unassigned'
  founder_email: string
  created_at: string
  updated_at: string
  founder_first_name:string, 
  founder_last_name:string
  founder_phone:string
  createdAt:Date,
  updatedAt:Date
  
}

export interface CreateUniversityDto {
  name: string
  slug: string
  type: 'federal' | 'state' | 'private'|null
  location: string
  logo_url?: string
  website?: string
  address?: string
  founding_year?: number | null
  student_population?: number | null
}

export interface UniversityFilters {
  status?: 'activated' | 'deactivated' | 'all'
  assignment_status?: 'assigned' | 'unassigned' | 'all'
  search?: string
  page: number
  limit: number
}

export interface UniversityResponse {
  data: University[]
  total: number
  page: number
  limit: number
  totalPages: number
  is_new:boolean
}
