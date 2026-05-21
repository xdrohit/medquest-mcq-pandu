import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export const dynamic = 'force-dynamic';
import Question from '@/models/Question';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const questions = await Question.find({ examId: id });
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching questions' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    const question = await Question.create({ ...data, examId: id });
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating question' }, { status: 500 });
  }
}
