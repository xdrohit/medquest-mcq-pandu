import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Bookmark from '@/models/Bookmark';
import Question from '@/models/Question';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getUserIdFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const questionId = url.searchParams.get('questionId');

    // If questionId is provided, just check if it's bookmarked
    if (questionId) {
      const bookmark = await Bookmark.findOne({ userId, questionId });
      return NextResponse.json({ bookmarked: !!bookmark }, { status: 200 });
    }

    // Otherwise fetch all bookmarks for user
    const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 }).lean();
    
    // Manual populate for questions to avoid serverless registry issues
    const questionIds = bookmarks.map((b: any) => b.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } }).lean();
    
    const questionMap = new Map();
    questions.forEach((q: any) => questionMap.set(q._id.toString(), q));
    
    const populatedBookmarks = bookmarks.map((b: any) => ({
      ...b,
      question: questionMap.get(b.questionId.toString()) || null
    }));

    return NextResponse.json(populatedBookmarks, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ message: 'Error fetching bookmarks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { questionId, examId } = await req.json();

    if (!questionId) {
      return NextResponse.json({ message: 'questionId is required' }, { status: 400 });
    }

    // Check if already bookmarked
    const existing = await Bookmark.findOne({ userId, questionId });
    if (existing) {
      return NextResponse.json({ message: 'Already bookmarked', bookmark: existing }, { status: 200 });
    }

    const newBookmark = await Bookmark.create({
      userId,
      questionId,
      examId
    });

    return NextResponse.json({ message: 'Bookmarked successfully', bookmark: newBookmark }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding bookmark:', error);
    return NextResponse.json({ message: 'Error adding bookmark' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const questionId = url.searchParams.get('questionId');

    if (!questionId) {
      return NextResponse.json({ message: 'questionId is required' }, { status: 400 });
    }

    await Bookmark.deleteOne({ userId, questionId });

    return NextResponse.json({ message: 'Bookmark removed successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json({ message: 'Error removing bookmark' }, { status: 500 });
  }
}
