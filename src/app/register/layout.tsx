import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Free — Daily Dose MCQ | Join 5000+ Medical Students",
  description:
    "Create your free account on Daily Dose MCQ. Get instant access to 3000+ verified MCQ questions for MBBS, Nursing, BDS, Pharmacy, and Paramedical exam preparation. No credit card required.",
  keywords: [
    "free medical MCQ registration",
    "join medical MCQ platform",
    "free MBBS MCQ",
    "nursing MCQ free",
    "medical student free test",
    "register daily dose mcq",
  ],
  alternates: { canonical: "https://www.dailydosemcq.com/register" },
  openGraph: {
    title: "Register Free | Daily Dose MCQ — Start Practicing Medical MCQs Today",
    description:
      "Join 5000+ medical students. Free registration, instant access to 3000+ MCQs, timed tests, AI analytics, and leaderboard. Sign up now!",
    url: "https://www.dailydosemcq.com/register",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
