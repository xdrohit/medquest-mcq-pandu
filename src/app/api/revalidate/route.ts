import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Revalidate public pages that use CMS content
    revalidatePath('/');
    revalidatePath('/about');

    return NextResponse.json({ success: true, revalidated: ['/', '/about'] });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
