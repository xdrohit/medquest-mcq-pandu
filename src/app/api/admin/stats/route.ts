import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exam from '@/models/Exam';
import Question from '@/models/Question';
import User from '@/models/User';
import Result from '@/models/Result';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Verify Auth
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const [totalExams, totalQuestions, totalStudents, totalTestsTaken] = await Promise.all([
      Exam.countDocuments(),
      Question.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Result.countDocuments()
    ]);

    return NextResponse.json({
      totalExams,
      totalQuestions,
      totalStudents,
      totalTestsTaken
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
