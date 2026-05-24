// ── Direct DB fetch helper — used by Server Components (no HTTP round-trip)
// This avoids the production issue of server fetching its own API via HTTP
import dbConnect from '@/lib/db';
import SiteContent from '@/models/SiteContent';
import { DEFAULT_CONTENT } from '@/app/api/site-content/route';

export async function getCmsContent(): Promise<Record<string, any>> {
  try {
    await dbConnect();
    const docs = await SiteContent.find({}).lean() as any[];
    const result: Record<string, any> = { ...DEFAULT_CONTENT };
    docs.forEach((doc) => { result[doc.key] = doc.data; });
    return result;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function getCmsSection(key: string): Promise<any> {
  try {
    await dbConnect();
    const doc = await SiteContent.findOne({ key }).lean() as any;
    return doc ? doc.data : DEFAULT_CONTENT[key] ?? null;
  } catch {
    return DEFAULT_CONTENT[key] ?? null;
  }
}
