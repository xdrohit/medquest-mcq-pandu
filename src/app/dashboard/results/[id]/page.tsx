"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, CheckCircle2, XCircle, ArrowLeft, BrainCircuit, 
  Target, Clock, AlertTriangle, ChevronRight, ChevronLeft, Zap
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";

export default function ResultAnalyticsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/results/${id}`, { cache: 'no-store' });
        if (res.ok) {
          setResult(await res.json());
        }
      } catch (err) {
        console.error("Error fetching result:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-300 animate-pulse">Analyzing Performance...</h2>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-xl font-bold mb-4">Result not found</h2>
        <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const isPass = percentage >= 50; // Mock pass logic
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const currentAnswer = result.answers[activeQuestionIdx];
  const question = currentAnswer?.questionId;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-12 selection:bg-primary-500/30">
      <Navbar />
      
      {/* Background Glows */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b ${isPass ? 'from-emerald-900/20' : 'from-red-900/20'} to-transparent blur-3xl pointer-events-none -z-10`} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white font-bold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Top Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`lg:col-span-2 rounded-3xl bg-slate-900 border ${isPass ? 'border-emerald-500/30' : 'border-red-500/30'} p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8`}
          >
            {/* Score Ring */}
            <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-800" strokeWidth="10" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" 
                  className={isPass ? "stroke-emerald-500" : "stroke-red-500"} 
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(percentage / 100) * 283} 283`}
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{percentage}%</span>
              </div>
            </div>

            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-3 ${isPass ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {isPass ? <Trophy className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {isPass ? 'Mission Accomplished' : 'Requires Improvement'}
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2">{result.examId?.title}</h1>
              <p className="text-slate-400 mb-4">You scored {result.score} out of {result.totalQuestions} questions correctly.</p>
              
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-accent-400 bg-accent-500/10 px-4 py-2 rounded-xl border border-accent-500/20">
                  <Zap className="w-4 h-4" /> +{result.xpEarned || 0} XP Earned
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-300 bg-slate-800 px-4 py-2 rounded-xl">
                  <Clock className="w-4 h-4" /> {formatTime(result.timeTakenSeconds)}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col"
          >
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" /> Weak Topics
            </h3>
            {result.weakTopics?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.weakTopics.map((topic: string, idx: number) => (
                  <span key={idx} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-sm font-bold">
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mb-3" />
                <p className="text-slate-400 font-medium">Perfect! No weak topics identified in this exam.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Detailed Question Review */}
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-primary-400" /> Question Analysis
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Question Palette Sidebar */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit">
            <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {result.answers.map((ans: any, idx: number) => {
                const isActive = activeQuestionIdx === idx;
                const isCorrect = ans.isCorrect;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm transition-all hover:scale-105 ${
                      isCorrect 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                        : "bg-red-500/10 text-red-400 border-red-500/30"
                    } ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : ''}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question View */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-10 flex flex-col">
            {!question ? (
              <div className="text-center text-slate-500 py-10">Select a question to review.</div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQuestionIdx}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-lg">Question {activeQuestionIdx + 1}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                      currentAnswer.isCorrect ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {currentAnswer.isCorrect ? 'Correct (+10 XP)' : 'Incorrect'}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium text-white mb-8 leading-relaxed">{question.text}</h3>

                  <div className="space-y-3 mb-10">
                    {question.options.map((opt: string, idx: number) => {
                      const isSelected = currentAnswer.selectedOption === idx;
                      const isActualCorrect = question.correctAnswer === idx;
                      
                      let bgStyle = "border-slate-800 bg-slate-900/50 text-slate-400";
                      let icon = null;

                      if (isActualCorrect) {
                        bgStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)]";
                        icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
                      } else if (isSelected && !isActualCorrect) {
                        bgStyle = "border-red-500 bg-red-500/10 text-red-100";
                        icon = <XCircle className="w-5 h-5 text-red-400" />;
                      }

                      return (
                        <div key={idx} className={`w-full text-left p-4 rounded-2xl border-2 transition-all text-base flex items-center justify-between ${bgStyle}`}>
                          <div className="flex items-center gap-4">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                              isActualCorrect ? "border-emerald-500 bg-emerald-500 text-slate-900" 
                              : isSelected ? "border-red-500 bg-red-500 text-white" 
                              : "border-slate-700 text-slate-500"
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span className={isActualCorrect ? "font-bold text-white" : ""}>{opt}</span>
                          </div>
                          {icon}
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Explanation Box */}
                  <div className="relative rounded-2xl bg-gradient-to-br from-primary-900/20 to-slate-900 border border-primary-500/30 p-6 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
                    <h4 className="font-bold text-primary-400 flex items-center gap-2 mb-3">
                      <BrainCircuit className="w-5 h-5" /> AI Explanation
                    </h4>
                    <p className="text-slate-300 leading-relaxed relative z-10">
                      {question.explanation || "No specific explanation was provided for this concept."}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Navigation */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <Button 
                variant="secondary" 
                onClick={() => setActiveQuestionIdx(prev => prev - 1)} 
                disabled={activeQuestionIdx === 0}
                className="bg-slate-800 text-white font-bold hover:bg-slate-700"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Previous
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setActiveQuestionIdx(prev => prev + 1)} 
                disabled={activeQuestionIdx === result.answers.length - 1}
                className="bg-slate-800 text-white font-bold hover:bg-slate-700"
              >
                Next <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
