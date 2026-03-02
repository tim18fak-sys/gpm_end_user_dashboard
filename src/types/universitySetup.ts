
export interface AddUniversityFounder {
  founder_email: string
  founder_first_name: string
  founder_last_name: string
  founder_phone: string
}

export interface AddUniversitySHPC {
  shc_email: string
  shc_first_name: string
  shc_last_name: string
  shc_phone: string
}

export interface CompleteUniversitySetupDto extends AddUniversityFounder, AddUniversitySHPC {}
