import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — India's #1 Medical MCQ Platform",
  description:
    "Learn about Daily Dose MCQ — India's leading free MCQ platform built for MBBS, Nursing, BDS, Pharmacy & Paramedical students. Our mission and commitment to quality medical education.",
  keywords: ["about daily dose mcq", "medical MCQ platform India", "MBBS exam preparation", "nursing exam platform", "docmcq"],
  alternates: { canonical: "https://www.dailydosemcq.com/about" },
  openGraph: {
    title: "About Daily Dose MCQ | India's Best Free Medical MCQ Platform",
    description: "We help 5000+ medical students crack their exams with AI-powered MCQ practice and real-time analytics.",
    url: "https://www.dailydosemcq.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
