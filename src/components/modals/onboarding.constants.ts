export const ONBOARDING_STEPS = {
  WELCOME: 0,
  DEVICE_OFFERS: 1,
} as const

export type OnboardingStepIndex = typeof ONBOARDING_STEPS[keyof typeof ONBOARDING_STEPS]
