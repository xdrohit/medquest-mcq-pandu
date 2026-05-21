import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';
import Exam from '@/models/Exam'; // CRITICAL: must import so Mongoose registers the model for populate()
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'NO_TOKEN' }, { status: 401 });
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch (e: any) {
      return NextResponse.json({ error: 'INVALID_TOKEN', details: e.message }, { status: 401 });
    }

    const userId = decoded.userId;
    if (!userId) {
      return NextResponse.json({ error: 'NO_USER_ID' }, { status: 401 });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // Fetch raw results
    const rawResults = await Result.find({ userId: objectId })
      .sort({ submittedAt: -1 })
      .lean();

    // Manual populate to avoid Mongoose serverless registry issues
    const examIds = [...new Set(rawResults.map((r: any) => r.examId?.toString()).filter(Boolean))];
    const exams = await Exam.find({ _id: { $in: examIds } }).select('title category durationMinutes').lean();
    
    const examMap = new Map();
    exams.forEach((e: any) => examMap.set(e._id.toString(), e));

    const results = rawResults.map((r: any) => ({
      ...r,
      examId: r.examId ? (examMap.get(r.examId.toString()) || null) : null
    }));

    const safeResults = Array.isArray(results) ? results : [];
    return NextResponse.json(safeResults, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching my results:', error);
    return NextResponse.json({ error: 'FATAL_ERROR', message: error.message }, { status: 500 });
  }
}
