"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ExamPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Exam Details
        const examRes = await fetch("/api/exams");
        const allExams = await examRes.json();
        const currentExam = allExams.find((e: any) => e._id === id);
        
        // Fetch Questions
        const questionsRes = await fetch(`/api/exams/${id}/questions`);
        const examQuestions = await questionsRes.json();
        
        if (currentExam && examQuestions.length > 0) {
          setExam(currentExam);
          setQuestions(examQuestions);
          setTimeLeft(currentExam.durationMinutes * 60);
        }
      } catch (err) {
        console.error("Error fetching exam data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted && !loading) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && exam && !isSubmitted && !loading) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted, exam, loading]);

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    let calculatedScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    
    // Submit to API
    try {
      await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: id,
          userId: "60d0fe4f5311236168a109ca", // Placeholder, should get from session
          score: calculatedScore,
          totalQuestions: questions.length,
          timeTakenSeconds: (exam.durationMinutes * 60) - timeLeft
        })
      });
    } catch (err) {
      console.error("Error submitting result:", err);
    }

    setIsSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Exam not found or no questions available.</h2>
        <Button className="mt-4" onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  if (isSubmitted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Exam Completed!</h2>
          <p className="text-slate-600 mb-8">You have successfully submitted {exam.title}.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <div className="text-5xl font-black text-primary-600 mb-2">{percentage}%</div>
            <p className="text-sm font-medium text-slate-500">
              You scored {score} out of {questions.length} correct.
            </p>
          </div>
          
          <Button variant="primary" className="w-full" onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Exam Header */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">{exam.title}</h1>
          <p className="text-sm text-slate-500">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-700'}`}>
          <Clock className="w-5 h-5" />
          <span className="tabular-nums">{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-center"
          >
            <h2 className="text-2xl md:text-3xl font-medium text-slate-900 mb-8 leading-relaxed">
              <span className="text-slate-400 mr-2">{currentIndex + 1}.</span>
              {question.text}
            </h2>

            <div className="space-y-4">
              {question.options.map((opt: string, idx: number) => {
                const isSelected = answers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 text-lg ${
                      isSelected
                        ? "border-primary-500 bg-primary-50 text-primary-900 shadow-md"
                        : "border-slate-100 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm ${
                        isSelected ? "border-primary-500 bg-primary-500 text-white" : "border-slate-300 text-slate-500"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      {opt}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-6">
          <Button variant="secondary" onClick={handlePrev} disabled={currentIndex === 0}>
            <ChevronLeft className="w-5 h-5 mr-1" /> Previous
          </Button>

          <div className="flex gap-2">
            {currentIndex === questions.length - 1 ? (
              <Button variant="primary" onClick={handleSubmit}>
                Submit Exam <CheckCircle2 className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNext}>
                Next <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
