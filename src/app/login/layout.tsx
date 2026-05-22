import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Daily Dose MCQ | Medical MCQ Practice Platform",
  description:
    "Log in to Daily Dose MCQ and continue your medical exam preparation. Access your MCQ tests, analytics, and leaderboard for MBBS, Nursing, and Pharmacy students.",
  keywords: ["daily dose mcq login", "medical MCQ login", "MBBS test login", "nursing MCQ platform login"],
  alternates: { canonical: "https://www.dailydosemcq.com/login" },
  robots: { index: true, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
