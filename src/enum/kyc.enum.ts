export enum IdTypeEnum {
  NATIONAL_ID_NIN = "national_id_nin",
  VOTERS_CARD = "voters_card",
  DRIVERS_LICENSE = "drivers_license",
  INTERNATIONAL_PASSPORT = "international_passport",
  NA='N/A'
}

export enum IntendedUseEnum {
  PHARMACY = "pharmacy",
  BEER_PARLOUR = "beer_parlour",
  FROZEN_FOODS = "frozen_foods",
  SOFT_DRINK_CHEMIST = "soft_drink_chemist",
  RESTAURANT = "restaurant",
  MINI_MART = "mini_mart",
  HOME_USE = "home_use",
  OTHER = "other",
}

export enum IncomeStabilityEnum {
  VERY_STABLE = "very_stable",
  FAIRLY_STABLE = "fairly_stable",
  SEASONAL = "seasonal",
  UNSTABLE = "unstable",
}

export enum LoanTypeEnum {
  BANK = "bank",
  MFI = "mfi",
  COOPERATIVE = "cooperative",
  ONLINE_APP = "online_app",
  FAMILY_FRIENDS = "family_friends",
}

export enum LoanStatusEnum {
  FULLY_REPAID = "fully_repaid",
  CURRENTLY_PAYING = "currently_paying",
  DEFAULTED = "defaulted",
  RESTRUCTURED = "restructured",
}

export enum PowerProblemEnum {
  HIGH_FUEL_EXPENSES = "high_fuel_expenses",
  GENERATOR_BREAKDOWN = "generator_breakdown",
  LOSS_OF_CUSTOMERS = "loss_of_customers",
  FOOD_MEDICINE_SPOILAGE = "food_medicine_spoilage",
  REDUCED_OPERATING_HOURS = "reduced_operating_hours",
  NOISE_AIR_POLLUTION = "noise_air_pollution",
  UNRELIABLE_NEPA = "unreliable_nepa",
  HIGH_RUNNING_COST = "high_running_cost",
  EXPAND_BUSINESS = "expand_business",
  OTHER = "other",
}

export enum ProductBenefitEnum {
  INCREASE_SALES = "increase_sales",
  REDUCE_COSTS = "reduce_costs",
  IMPROVE_SERVICE = "improve_service",
  EXTEND_HOURS = "extend_hours",
  COLD_STORAGE = "cold_storage",
  NEW_INCOME_SOURCE = "new_income_source",
  OTHER = "other",
}

export enum BusinessTypeEnum {
  SOLE_PROPRIETORSHIP = "sole_proprietorship",
  PARTNERSHIP = "partnership",
  REGISTERED = "registered",
}

export enum BusinessDurationEnum {
  LESS_THAN_6_MONTHS = "less_than_6_months",
  SIX_TO_12_MONTHS = "6_to_12_months",
  ONE_TO_3_YEARS = "1_to_3_years",
  THREE_PLUS_YEARS = "3_plus_years",
}

export enum CustomerTrafficEnum {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}
