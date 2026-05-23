import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';
import Category from '@/models/Category';
import Exam from '@/models/Exam';
import Question from '@/models/Question';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { categoryId, subCategory, limit = 20 } = await req.json();

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Find random questions
    const matchQuery: any = { categoryId: new mongoose.Types.ObjectId(categoryId) };
    if (subCategory && subCategory !== "All") {
      matchQuery.subCategory = subCategory;
    }

    const randomQuestions = await Question.aggregate([
      { $match: matchQuery },
      { $sample: { size: limit } }
    ]);

    if (randomQuestions.length === 0) {
      return NextResponse.json({ error: 'No questions found in this category to generate a practice test.' }, { status: 404 });
    }

    // Create a temporary/hidden Exam for this practice session
    const title = subCategory && subCategory !== "All" ? `Quick Practice: ${category.name} > ${subCategory}` : `Quick Practice: ${category.name}`;
    
    const exam = await Exam.create({
      title,
      description: "Auto-generated mock test from Question Bank.",
      category: category.name,
      subCategory: subCategory !== "All" ? subCategory : "",
      durationMinutes: randomQuestions.length, // 1 min per question
      active: false, // Don't show in main dashboard list
      status: 'draft',
      totalMarks: randomQuestions.length,
      passingMarks: Math.floor(randomQuestions.length * 0.5),
      negativeMarking: 0,
      randomQuestionOrder: true
    });

    // Copy these questions to the newly created exam
    const newQuestionsData = randomQuestions.map(q => ({
      examId: exam._id,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      topic: q.topic,
      imageUrl: q.imageUrl,
      randomize: q.randomize
    }));

    await Question.insertMany(newQuestionsData);

    return NextResponse.json({ examId: exam._id }, { status: 201 });
  } catch (error: any) {
    console.error("Quick Practice Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
