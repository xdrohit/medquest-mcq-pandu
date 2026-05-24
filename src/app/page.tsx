// ── Server Component: fetches CMS data directly from DB (no HTTP round-trip)
// Eliminates production error of server fetching its own API
// ISR: Next.js caches this page for 60s, then re-fetches in background
import React from "react";
import { getCmsContent } from "@/lib/cms";
import HomepageClient from "@/components/homepage/HomepageClient";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const cms = await getCmsContent();
  return <HomepageClient cms={cms} />;
}
