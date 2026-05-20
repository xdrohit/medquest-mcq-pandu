import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exam from '@/models/Exam';
import Question from '@/models/Question';

// GET all exams (admin: show all, student: show active only)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');
    const query = all === 'true' ? {} : { status: 'published', active: true };
    const exams = await Exam.find(query).sort({ createdAt: -1 });

    const examsWithCount = await Promise.all(
      exams.map(async (exam) => {
        const count = await Question.countDocuments({ examId: exam._id });
        return { ...exam.toObject(), questionCount: count };
      })
    );
    return NextResponse.json(examsWithCount, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST create a new exam
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const exam = await Exam.create(data);
    return NextResponse.json(exam, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT update exam
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { id, ...data } = await req.json();
    const exam = await Exam.findByIdAndUpdate(id, data, { new: true });
    if (!exam) return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    return NextResponse.json(exam, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE exam and its questions
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await Exam.findByIdAndDelete(id);
    await Question.deleteMany({ examId: id });
    return NextResponse.json({ message: 'Exam and questions deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
