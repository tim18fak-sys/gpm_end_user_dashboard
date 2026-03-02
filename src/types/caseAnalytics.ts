
export interface BaseTotalCase {
  total: number
  change: number
}

export interface CaseDistribution {
  name: string
  value: number
  color: string
}

export interface UniversitySexualHarassmentProbitionCaseGrowthData {
  period: string
  case: number
}

export interface CaseAnalyticsData {
  pending: BaseTotalCase
  in_progress: BaseTotalCase
  completed: BaseTotalCase
  closed: BaseTotalCase
  matching_folder: BaseTotalCase
  total: BaseTotalCase
  statusDistribution: CaseDistribution[]
  typeDistribution: CaseDistribution[]
  growthData?: UniversitySexualHarassmentProbitionCaseGrowthData[]
}
