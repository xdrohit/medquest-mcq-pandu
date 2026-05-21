import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const results = await Result.find({ userId })
      .populate('examId', 'title category durationMinutes')
      .sort({ submittedAt: -1 });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching my results:', error);
    return NextResponse.json({ message: 'Error fetching results' }, { status: 500 });
  }
}
