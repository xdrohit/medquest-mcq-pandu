import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exam from '@/models/Exam';
import Question from '@/models/Question';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    // SECURITY FIX: Disable automatic deletion to protect user data
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ message: "Seed disabled in production for data safety." }, { status: 403 });
    }

    await dbConnect();

    // Prevent accidental deletion of future admin questions
    // await Exam.deleteMany({});
    // await Question.deleteMany({});

    // Seed Master Admin User
    const adminExists = await User.findOne({ email: 'rohithubhai3@gmail.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('@Akkiakki1', 10);
      await User.create({
        name: 'Master Admin',
        email: 'rohithubhai3@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
    }

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
        topic: "Integumentary System",
        explanation: "The skin is the largest organ of the body, with a total area of about 20 square feet. It protects us from microbes and the elements, helps regulate body temperature, and permits the sensations of touch, heat, and cold."
      },
      {
        examId: exam1._id,
        text: "What is the primary function of red blood cells?",
        options: ["Fight infection", "Carry oxygen", "Clot blood", "Produce antibodies"],
        correctAnswer: 1,
        topic: "Hematology",
        explanation: "Red blood cells contain hemoglobin, a protein that binds to oxygen. They carry oxygen from the lungs to all parts of the body and bring carbon dioxide back to the lungs to be exhaled."
      },
      {
        examId: exam1._id,
        text: "Which part of the brain controls balance and coordination?",
        options: ["Cerebrum", "Cerebellum", "Brainstem", "Hypothalamus"],
        correctAnswer: 1,
        topic: "Neuroanatomy",
        explanation: "The cerebellum (Latin for 'little brain') is located at the back of the brain. It is primarily responsible for motor control, including coordination, precision, and accurate timing of movements."
      }
    ]);

    // Seed Questions for Pharmacology Basics (exam2)
    await Question.create([
      {
        examId: exam2._id,
        text: "Which route of drug administration has 100% bioavailability?",
        options: ["Oral", "Intravenous (IV)", "Subcutaneous", "Intramuscular"],
        correctAnswer: 1,
        topic: "Pharmacokinetics",
        explanation: "Intravenous (IV) administration bypasses the absorption process entirely, delivering the drug directly into the systemic circulation, resulting in 100% bioavailability."
      },
      {
        examId: exam2._id,
        text: "What is the primary site of drug metabolism in the human body?",
        options: ["Kidneys", "Lungs", "Liver", "Intestines"],
        correctAnswer: 2,
        topic: "Drug Metabolism",
        explanation: "The liver is the principal site of drug metabolism. It contains enzymes, particularly the cytochrome P450 system, which alter the chemical structure of drugs to facilitate their excretion."
      }
    ]);

    return NextResponse.json({ message: "Database seeded successfully!" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
