import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/models/Question';

// PUT update a question
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    const question = await Question.findByIdAndUpdate(id, data, { new: true });
    if (!question) return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    return NextResponse.json(question, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a single question
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Question.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Question deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET single question
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const question = await Question.findById(id).populate('examId', 'title category');
    if (!question) return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    return NextResponse.json(question, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
