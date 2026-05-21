"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, AlertCircle, ChevronRight, ChevronLeft, Bookmark, 
  Grid, X, Check, Eye
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Status: 0=unvisited, 1=visited-unanswered, 2=answered, 3=marked-for-review
type QuestionStatus = 0 | 1 | 2 | 3;

export default function FullscreenExamEngine() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // State tracking
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [statusMap, setStatusMap] = useState<Record<number, QuestionStatus>>({});
  const [timeSpent, setTimeSpent] = useState<Record<number, number>>({});
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const examRes = await fetch("/api/exams", { cache: "no-store" });
        const allExams = await examRes.json();
        const currentExam = allExams.find((e: any) => e._id === id);
        
        const questionsRes = await fetch(`/api/exams/${id}/questions`, { cache: "no-store" });
        const examQuestions = await questionsRes.json();
        
        if (currentExam && examQuestions.length > 0) {
          setExam(currentExam);
          setQuestions(examQuestions);
          
          // Check local storage for resume state
          const savedState = localStorage.getItem(`exam_${id}`);
          if (savedState) {
            const parsed = JSON.parse(savedState);
            setAnswers(parsed.answers || {});
            setStatusMap(parsed.statusMap || { 0: 1 });
            setTimeLeft(parsed.timeLeft || currentExam.durationMinutes * 60);
            setTimeSpent(parsed.timeSpent || {});
            setCurrentIndex(parsed.currentIndex || 0);
          } else {
            setTimeLeft(currentExam.durationMinutes * 60);
            setStatusMap({ 0: 1 }); // first question visited
          }
        }
      } catch (err) {
        console.error("Error fetching exam:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Timer & Auto-save
  useEffect(() => {
    if (timeLeft > 0 && !submitting && !loading) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setTimeSpent(prev => ({ ...prev, [currentIndex]: (prev[currentIndex] || 0) + 1 }));
      }, 1000);

      // Auto save every 5 seconds
      if (timeLeft % 5 === 0) {
        localStorage.setItem(`exam_${id}`, JSON.stringify({
          answers, statusMap, timeLeft, timeSpent, currentIndex
        }));
      }

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && exam && !submitting && !loading) {
      handleSubmit();
    }
  }, [timeLeft, submitting, exam, loading, currentIndex, answers, statusMap, timeSpent, id]); // Added id here for dependencies

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
    setStatusMap(prev => ({ ...prev, [currentIndex]: 2 })); // Answered
  };

  const handleClear = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentIndex];
    setAnswers(newAnswers);
    setStatusMap(prev => ({ ...prev, [currentIndex]: 1 })); // Visited, unanswered
  };

  const handleMarkReview = () => {
    setStatusMap(prev => ({ ...prev, [currentIndex]: 3 }));
    handleNext();
  };

  const navigateTo = (index: number) => {
    setCurrentIndex(index);
    if (!statusMap[index]) {
      setStatusMap(prev => ({ ...prev, [index]: 1 }));
    }
    setShowPalette(false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) navigateTo(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) navigateTo(currentIndex - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    const formattedAnswers = Object.entries(answers).map(([idxStr, selectedOption]) => {
      const idx = parseInt(idxStr);
      return {
        questionId: questions[idx]._id,
        selectedOption,
        timeSpentSeconds: timeSpent[idx] || 0
      };
    });

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: id,
          timeTakenSeconds: (exam.durationMinutes * 60) - timeLeft,
          answers: formattedAnswers
        })
      });
      
      const resultData = await res.json();
      localStorage.removeItem(`exam_${id}`); // Clear save
      
      if (res.ok) {
        router.push(`/dashboard/results/${resultData.resultId}`);
      } else {
        alert("Failed to submit. Please try again.");
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-300 animate-pulse">Initializing Exam Engine...</h2>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold">Exam not found</h2>
        <Button className="mt-4" onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  const question = questions[currentIndex];
  const isDangerTime = timeLeft < 300;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-primary-500/30">
      
      {/* Top Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
        <div>
          <h1 className="text-white font-bold tracking-tight line-clamp-1">{exam.title}</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">{exam.category}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-black font-mono text-lg ${isDangerTime ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-slate-800 text-primary-400 border border-slate-700'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
          
          <Button variant="primary" onClick={handleSubmit} disabled={submitting} className="font-bold shadow-lg shadow-primary-500/20">
            {submitting ? "Submitting..." : "Submit Test"}
          </Button>

          <button onClick={() => setShowPalette(!showPalette)} className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300">
            <Grid className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Main Exam Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-12 relative flex flex-col">
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
            
            {/* Question Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
              <div className="flex gap-2">
                <button onClick={handleMarkReview} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors">
                  <Bookmark className="w-4 h-4" /> Mark for Review
                </button>
              </div>
            </div>

            {/* Question Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-xl lg:text-2xl font-medium text-white mb-10 leading-relaxed">
                  {question.text}
                </h2>

                <div className="space-y-3">
                  {question.options.map((opt: string, idx: number) => {
                    const isSelected = answers[currentIndex] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-4 lg:p-5 rounded-2xl border-2 transition-all duration-200 text-base lg:text-lg flex items-center gap-4 ${
                          isSelected
                            ? "border-primary-500 bg-primary-500/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                            : "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                          isSelected ? "border-primary-500 bg-primary-500 text-white" : "border-slate-600 text-slate-500"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Footer */}
            <div className="mt-auto pt-8 flex items-center justify-between">
              <div className="flex gap-3">
                <Button variant="ghost" onClick={handleClear} disabled={answers[currentIndex] === undefined} className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 border">
                  Clear Selection
                </Button>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handlePrev} disabled={currentIndex === 0} className="bg-slate-800 text-white hover:bg-slate-700 font-bold">
                  <ChevronLeft className="w-5 h-5 mr-1" /> Prev
                </Button>
                {currentIndex === questions.length - 1 ? (
                  <Button variant="primary" onClick={handleSubmit} disabled={submitting} className="font-bold">
                    Finish <Check className="w-5 h-5 ml-1" />
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleNext} className="font-bold">
                    Next <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                )}
              </div>
            </div>

          </div>
        </main>

        {/* Sidebar Palette */}
        <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 border-l border-slate-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${showPalette ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2"><Grid className="w-4 h-4 text-primary-400" /> Question Palette</h3>
              <button onClick={() => setShowPalette(false)} className="lg:hidden p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, idx) => {
                  const status = statusMap[idx] || 0;
                  const isActive = currentIndex === idx;
                  let bgClass = "bg-slate-800 text-slate-400 border-transparent"; // 0: unvisited
                  if (status === 1) bgClass = "bg-red-500/20 text-red-400 border-red-500/30"; // visited, unanswered
                  if (status === 2) bgClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"; // answered
                  if (status === 3) bgClass = "bg-amber-500/20 text-amber-400 border-amber-500/30"; // marked for review
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => navigateTo(idx)}
                      className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold text-sm transition-all hover:scale-105 ${bgClass} ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 space-y-2 text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" /> Answered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" /> Unanswered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" /> Marked for Review</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-800" /> Not Visited</div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile palette */}
        {showPalette && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowPalette(false)} />
        )}
      </div>
    </div>
  );
}
