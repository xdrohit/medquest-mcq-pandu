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

    // Fetch raw result
    const rawResult = await Result.findById(id).lean();

    if (!rawResult) {
      return NextResponse.json({ message: 'Result not found' }, { status: 404 });
    }

    // Manual populate examId
    let examData = null;
    if (rawResult.examId) {
      examData = await Exam.findById(rawResult.examId).select('title category durationMinutes totalMarks').lean();
    }

    // Manual populate answers.questionId
    const questionIds = [...new Set((rawResult.answers || []).map((a: any) => a.questionId?.toString()).filter(Boolean))];
    const questions = await Question.find({ _id: { $in: questionIds } }).select('text options correctAnswer explanation difficulty topic').lean();
    const questionMap = new Map();
    questions.forEach((q: any) => questionMap.set(q._id.toString(), q));

    const populatedAnswers = (rawResult.answers || []).map((a: any) => ({
      ...a,
      questionId: a.questionId ? (questionMap.get(a.questionId.toString()) || null) : null
    }));

    const result = {
      ...rawResult,
      examId: examData,
      answers: populatedAnswers
    };

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
