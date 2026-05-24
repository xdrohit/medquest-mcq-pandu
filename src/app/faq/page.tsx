// Server Component with ISR
import { DEFAULT_CONTENT } from "@/app/api/site-content/route";
import FaqClient from "@/components/faq/FaqClient";

async function getFaqData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/site-content?section=faq`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return DEFAULT_CONTENT.faq;
    return res.json();
  } catch {
    return DEFAULT_CONTENT.faq;
  }
}

export default async function FaqPage() {
  const faq = await getFaqData();
  return <FaqClient faq={faq} />;
}
