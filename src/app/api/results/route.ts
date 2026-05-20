import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    // In a real app, you'd get the userId from the JWT session/cookie
    const result = await Result.create(data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error submitting result' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    // Get userId from query params or session
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

    const results = await Result.find({ userId }).populate('examId').sort({ submittedAt: -1 });
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching results' }, { status: 500 });
  }
}
