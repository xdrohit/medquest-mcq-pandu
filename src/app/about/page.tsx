// Server Component with ISR
import { DEFAULT_CONTENT } from "@/app/api/site-content/route";
import AboutClient from "@/components/about/AboutClient";

async function getAboutData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/site-content?section=about`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return DEFAULT_CONTENT.about;
    return res.json();
  } catch {
    return DEFAULT_CONTENT.about;
  }
}

export default async function AboutUsPage() {
  const about = await getAboutData();
  return <AboutClient about={about} />;
}
