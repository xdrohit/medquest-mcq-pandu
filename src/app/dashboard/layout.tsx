import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Dashboard — Practice Medical MCQ Tests Online",
  description:
    "Access your personalized medical MCQ dashboard. Take timed tests in MBBS, Nursing, Pharmacy, and BDS. View your performance analytics, badges, leaderboard rank, and AI-driven weak point analysis.",
  keywords: [
    "medical MCQ dashboard",
    "online MCQ test India",
    "MBBS practice test",
    "nursing MCQ test online",
    "pharmacy MCQ test",
    "medical student exam practice",
    "timed MCQ test",
    "AI medical exam analytics",
  ],
  alternates: { canonical: "https://www.dailydosemcq.com/dashboard" },
  openGraph: {
    title: "Student Dashboard | Daily Dose MCQ — Practice Medical Tests Online",
    description:
      "Take timed MBBS, Nursing, and Pharmacy MCQ tests. Get AI analytics, track your rank, and improve your weak areas with India's best medical MCQ platform.",
    url: "https://www.dailydosemcq.com/dashboard",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
