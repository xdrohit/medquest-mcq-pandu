// ── Server Component: fetches CMS data at build time + ISR revalidation every 60s
// Zero client-side delay for content — it's all pre-rendered on the server.
import React from "react";
import { DEFAULT_CONTENT } from "@/app/api/site-content/route";
import HomepageClient from "@/components/homepage/HomepageClient";

async function getCmsData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/site-content`, {
      next: { revalidate: 60 }, // ISR: re-fetch every 60s on the server
    });
    if (!res.ok) return DEFAULT_CONTENT;
    return res.json();
  } catch {
    return DEFAULT_CONTENT;
  }
}

export default async function HomePage() {
  const cms = await getCmsData();
  return <HomepageClient cms={cms} />;
}
