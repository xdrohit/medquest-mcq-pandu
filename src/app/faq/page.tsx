import { getCmsSection } from "@/lib/cms";
import FaqClient from "@/components/faq/FaqClient";

export const revalidate = 60;

export default async function FaqPage() {
  const faq = await getCmsSection("faq");
  return <FaqClient faq={faq} />;
}
