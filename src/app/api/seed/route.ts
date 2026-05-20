import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exam from '@/models/Exam';
import Question from '@/models/Question';

export async function GET() {
  try {
    await dbConnect();

    // Clean existing data
    await Exam.deleteMany({});
    await Question.deleteMany({});

    // Seed Exams
    const exam1 = await Exam.create({
      title: "General Anatomy & Physiology",
      category: "MBBS",
      durationMinutes: 30,
      active: true,
    });

    const exam2 = await Exam.create({
      title: "Pharmacology Basics",
      category: "Pharmacy",
      durationMinutes: 45,
      active: true,
    });

    const exam3 = await Exam.create({
      title: "Fundamentals of Nursing",
      category: "Nursing",
      durationMinutes: 60,
      active: true,
    });

    const exam4 = await Exam.create({
      title: "Emergency Paramedic Procedures",
      category: "Paramedical",
      durationMinutes: 40,
      active: true,
    });

    // Seed Questions for Anatomy & Physiology (exam1)
    await Question.create([
      {
        examId: exam1._id,
        text: "Which of the following is the largest organ in the human body?",
        options: ["Heart", "Liver", "Skin", "Brain"],
        correctAnswer: 2,
      },
      {
        examId: exam1._id,
        text: "What is the primary function of red blood cells?",
        options: ["Fight infection", "Carry oxygen", "Clot blood", "Produce antibodies"],
        correctAnswer: 1,
      },
      {
        examId: exam1._id,
        text: "Which part of the brain controls balance and coordination?",
        options: ["Cerebrum", "Cerebellum", "Brainstem", "Hypothalamus"],
        correctAnswer: 1,
      }
    ]);

    // Seed Questions for Pharmacology Basics (exam2)
    await Question.create([
      {
        examId: exam2._id,
        text: "Which route of drug administration has 100% bioavailability?",
        options: ["Oral", "Intravenous (IV)", "Subcutaneous", "Intramuscular"],
        correctAnswer: 1,
      },
      {
        examId: exam2._id,
        text: "What is the primary site of drug metabolism in the human body?",
        options: ["Kidneys", "Lungs", "Liver", "Intestines"],
        correctAnswer: 2,
      }
    ]);

    return NextResponse.json({ message: "Database seeded successfully!" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
