import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const debug: Record<string, any> = {};

  try {
    // Step 1: Check cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    debug.hasToken = !!token;
    debug.tokenPreview = token ? token.substring(0, 20) + '...' : null;

    if (!token) {
      return NextResponse.json({ error: 'NO TOKEN IN COOKIE', debug }, { status: 200 });
    }

    // Step 2: Decode JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
      debug.userId = decoded.userId;
      debug.userName = decoded.name;
      debug.tokenValid = true;
    } catch (e: any) {
      debug.tokenValid = false;
      debug.tokenError = e.message;
      return NextResponse.json({ error: 'TOKEN INVALID', debug }, { status: 200 });
    }

    // Step 3: DB connect
    await dbConnect();
    debug.dbConnected = true;

    // Step 4: Count ALL results in DB
    const totalInDb = await Result.countDocuments({});
    debug.totalResultsInDb = totalInDb;

    // Step 5: Count results for this user
    const userResults = await Result.countDocuments({ userId: decoded.userId });
    debug.resultsForThisUser = userResults;

    // Step 6: Fetch without populate
    const rawResults = await Result.find({ userId: decoded.userId }).sort({ submittedAt: -1 }).lean();
    debug.rawResultsCount = rawResults.length;
    debug.firstResult = rawResults[0] ? {
      _id: rawResults[0]._id,
      examId: rawResults[0].examId,
      score: rawResults[0].score,
      totalQuestions: rawResults[0].totalQuestions,
      submittedAt: rawResults[0].submittedAt,
    } : null;

    return NextResponse.json({ ok: true, debug }, { status: 200 });

  } catch (error: any) {
    debug.fatalError = error.message;
    return NextResponse.json({ error: 'FATAL', debug }, { status: 200 });
  }
}
