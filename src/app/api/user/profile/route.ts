import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Result from '@/models/Result';
import Exam from '@/models/Exam'; // Required for populate('examId')
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    // Get token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Fetch recent results (raw)
    const rawRecentResults = await Result.find({ userId: user._id })
      .sort({ submittedAt: -1 })
      .limit(5)
      .lean();

    // Manual populate for recent results
    const recentExamIds = [...new Set(rawRecentResults.map((r: any) => r.examId?.toString()).filter(Boolean))];
    const recentExams = await Exam.find({ _id: { $in: recentExamIds } }).select('title category').lean();
    
    const recentExamMap = new Map();
    recentExams.forEach((e: any) => recentExamMap.set(e._id.toString(), e));

    const recentResults = rawRecentResults.map((r: any) => ({
      ...r,
      examId: r.examId ? (recentExamMap.get(r.examId.toString()) || null) : null
    }));

    // Calculate aggregated stats
    const allResults = await Result.find({ userId: user._id });
    const totalExams = allResults.length;
    let averageScore = 0;
    let averageTimeSeconds = 0;
    
    if (totalExams > 0) {
      const totalPercentage = allResults.reduce((acc, res) => acc + ((res.score / res.totalQuestions) * 100), 0);
      averageScore = Math.round(totalPercentage / totalExams);
      
      const totalTime = allResults.reduce((acc, res) => acc + (res.timeTakenSeconds || 0), 0);
      averageTimeSeconds = Math.round(totalTime / totalExams);
    }

    // Extract all weak topics
    const weakTopicsMap: Record<string, number> = {};
    allResults.forEach(res => {
      if (res.weakTopics) {
        res.weakTopics.forEach((topic: string) => {
          weakTopicsMap[topic] = (weakTopicsMap[topic] || 0) + 1;
        });
      }
    });
    
    // Sort weak topics by frequency
    const topWeakTopics = Object.entries(weakTopicsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        joined: user.createdAt,
      },
      stats: {
        totalExams,
        averageScore,
        averageTimeSeconds,
        recentResults,
        topWeakTopics
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
  }
}
