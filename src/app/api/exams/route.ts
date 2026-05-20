import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exam from '@/models/Exam';

export async function GET() {
  try {
    await dbConnect();
    const exams = await Exam.find({ active: true }).sort({ createdAt: -1 });
    return NextResponse.json(exams, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching exams' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const exam = await Exam.create(data);
    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating exam' }, { status: 500 });
  }
}
