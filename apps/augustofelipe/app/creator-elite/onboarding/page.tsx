import type { Metadata } from "next";
import OnboardingForm from "./OnboardingForm";

export const metadata: Metadata = {
  title: "Onboarding — Creator Elite",
  description:
    "Questionário estratégico pré-call da mentoria Creator Elite com Augusto Felipe.",
  robots: { index: false, follow: false, nocache: true },
};

export default function CreatorEliteOnboardingPage() {
  return <OnboardingForm />;
}
