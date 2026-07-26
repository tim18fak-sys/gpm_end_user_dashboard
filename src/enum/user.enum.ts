export enum UserVerificationStatusEnum {
  // this is the default status for a user who has not started their verification process
  NONE = "NONE",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}
export enum DeviceUserOnboardingStatusEnum {
  PENDING = "PENDING",
  // this would be used to trigger creation of the customer information, and then they can proceed with their kyc flow.
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
