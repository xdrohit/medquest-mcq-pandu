import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Daily Dose MCQ",
  description:
    "Terms and Conditions of using Daily Dose MCQ platform. Read about user responsibilities, content ownership, and platform rules for medical students.",
  alternates: { canonical: "https://www.dailydosemcq.com/terms" },
  robots: { index: true, follow: false },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
