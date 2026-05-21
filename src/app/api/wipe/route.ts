import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exam from '@/models/Exam';
import Question from '@/models/Question';
import Result from '@/models/Result';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    await Exam.deleteMany({});
    await Question.deleteMany({});
    await Result.deleteMany({});
    return NextResponse.json({ message: "Wiped!" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
