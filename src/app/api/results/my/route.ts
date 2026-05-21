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

    if (!token) {
      return NextResponse.json([], { status: 200 }); // Return empty array, not error
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch {
      return NextResponse.json([], { status: 200 }); // Token invalid → empty, not 401
    }

    const userId = decoded.userId;
    if (!userId) return NextResponse.json([], { status: 200 });

    const results = await Result.find({ userId })
      .populate('examId', 'title category durationMinutes')
      .sort({ submittedAt: -1 })
      .lean(); // lean() for faster, plain JS objects

    // Ensure we always return a clean array even if populate had partial failures
    const safeResults = Array.isArray(results) ? results : [];

    return NextResponse.json(safeResults, { status: 200 });
  } catch (error) {
    console.error('Error fetching my results:', error);
    return NextResponse.json([], { status: 200 }); // Never return an error that breaks UI
  }
}
