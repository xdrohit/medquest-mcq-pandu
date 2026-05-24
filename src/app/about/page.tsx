import { getCmsSection } from "@/lib/cms";
import AboutClient from "@/components/about/AboutClient";

export const revalidate = 60;

export default async function AboutUsPage() {
  const about = await getCmsSection("about");
  return <AboutClient about={about} />;
}
