import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';
import Exam from '@/models/Exam';
import Question from '@/models/Question';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
    const { id } = await params;

    // Fetch result and populate questions
    const result = await Result.findById(id)
      .populate('examId', 'title category durationMinutes totalMarks')
      .populate({
        path: 'answers.questionId',
        select: 'text options correctAnswer explanation difficulty topic',
      });

    if (!result) {
      return NextResponse.json({ message: 'Result not found' }, { status: 404 });
    }

    // Optional: Check if user owns the result or is admin
    if (result.userId.toString() !== decoded.userId && decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error fetching result details:', error);
    return NextResponse.json({ message: 'Error fetching result' }, { status: 500 });
  }
}
