import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/models/User';
import Question from '@/models/Question';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Get user from token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    // We expect data to have examId, answers (array of { questionId, selectedOption, timeSpentSeconds })
    // We will calculate score server-side to prevent cheating!
    
    let score = 0;
    const detailedAnswers = [];
    const weakTopicsSet = new Set<string>();

    for (const ans of data.answers) {
      const q = await Question.findById(ans.questionId);
      if (q) {
        const isCorrect = q.correctAnswer === ans.selectedOption;
        if (isCorrect) score += 1;
        else if (q.topic) weakTopicsSet.add(q.topic); // If wrong, add to weak topics
        
        detailedAnswers.push({
          questionId: q._id,
          selectedOption: ans.selectedOption,
          isCorrect,
          timeSpentSeconds: ans.timeSpentSeconds || 0
        });
      }
    }

    const xpEarned = score * 10; // 10 XP per correct answer

    const result = await Result.create({
      userId,
      examId: data.examId,
      score,
      totalQuestions: data.answers.length,
      timeTakenSeconds: data.timeTakenSeconds,
      answers: detailedAnswers,
      weakTopics: Array.from(weakTopicsSet),
      xpEarned
    });

    // Update User XP and Streak
    const user = await User.findById(userId);
    if (user) {
      user.xp = (user.xp || 0) + xpEarned;
      
      // Streak logic
      const now = new Date();
      const lastActive = user.lastActiveDate;
      if (!lastActive) {
        user.streak = 1;
      } else {
        const diffTime = Math.abs(now.getTime() - lastActive.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays === 1) {
          user.streak += 1; // Consecutive day
        } else if (diffDays > 1) {
          user.streak = 1; // Streak broken
        }
      }
      user.lastActiveDate = now;
      await user.save();
    }

    return NextResponse.json({ resultId: result._id, xpEarned }, { status: 201 });
  } catch (error) {
    console.error('Error submitting result:', error);
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
