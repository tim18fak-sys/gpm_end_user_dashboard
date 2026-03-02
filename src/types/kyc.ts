export interface KycImageDetail {
  image_type_id: number
  image: string
}

export interface KycPartnerParams {
  job_id: string
  user_id: string
  job_type: number
}

export interface ProcessKycDto {
  images_details: KycImageDetail[]
  partner_params: KycPartnerParams
}

export interface ProcessKycResponse {
  success: boolean
  message: string
}
