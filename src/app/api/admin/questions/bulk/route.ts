import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/models/Question';

// POST - bulk upload questions (array of question objects)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { questions } = await req.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Invalid data. Expected array of questions.' }, { status: 400 });
    }

    const created = await Question.insertMany(questions);
    return NextResponse.json({ message: `${created.length} questions uploaded successfully.`, count: created.length }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
