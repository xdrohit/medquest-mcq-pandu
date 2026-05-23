import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export const dynamic = 'force-dynamic';
import Question from '@/models/Question';

// GET all questions (with optional exam filter)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get('examId');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    const query: any = {};
    if (examId) query.examId = examId;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.text = { $regex: search, $options: 'i' };

    const questions = await Question.find(query).populate('examId', 'title category').populate('categoryId', 'name').sort({ createdAt: -1 });
    return NextResponse.json(questions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a new question
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const question = await Question.create(data);
    return NextResponse.json(question, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE bulk delete (send array of ids in body)
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { ids } = await req.json();
    await Question.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ message: 'Questions deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
