import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exam from '@/models/Exam';

// Quick fix: Set all existing exams to active: true and status: published
export async function GET() {
  try {
    await dbConnect();
    const result = await Exam.updateMany(
      {},
      { $set: { active: true, status: 'published' } }
    );
    return NextResponse.json({
      message: `Fixed ${result.modifiedCount} exams — all set to active & published.`
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
