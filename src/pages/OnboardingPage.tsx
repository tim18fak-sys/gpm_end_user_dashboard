import { useOnboarding } from "@/hooks/useOnboarding";

// this is the onboarding page for the user or customer.
interface OnboardingPageProps {
  // Define any props if needed in the future
}
function OnboardingPage({}: OnboardingPageProps) {
  const { mutate, error, isPending } = useOnboarding();
  return <div>OnboardingPage</div>;
}

export default OnboardingPage;
