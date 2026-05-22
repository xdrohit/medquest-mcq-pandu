import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Daily Dose MCQ",
  description:
    "Read the Privacy Policy of Daily Dose MCQ. Understand how we collect, use, and protect your personal data as a medical student on our platform.",
  alternates: { canonical: "https://www.dailydosemcq.com/privacy" },
  robots: { index: true, follow: false },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
