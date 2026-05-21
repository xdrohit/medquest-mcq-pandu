"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, CheckCircle2, XCircle, ArrowLeft, BrainCircuit,
  Clock, AlertTriangle, ChevronRight, ChevronLeft,
  Target, BookOpen, BarChart2, Award, Bookmark, Lightbulb, SkipForward
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

function getGrade(pct: number) {
  if (pct >= 90) return { label: "Outstanding", color: "text-emerald-400",  ring: "ring-emerald-500/40",  bg: "from-emerald-500/20 to-emerald-500/5",  bar: "bg-emerald-500" };
  if (pct >= 75) return { label: "Excellent",   color: "text-blue-400",     ring: "ring-blue-500/40",     bg: "from-blue-500/20 to-blue-500/5",     bar: "bg-blue-500"    };
  if (pct >= 60) return { label: "Good",         color: "text-primary-400",  ring: "ring-primary-500/40",  bg: "from-primary-500/20 to-primary-500/5", bar: "bg-primary-500" };
  if (pct >= 40) return { label: "Average",      color: "text-amber-400",    ring: "ring-amber-500/40",    bg: "from-amber-500/20 to-amber-500/5",   bar: "bg-amber-500"   };
  return           { label: "Needs Work",        color: "text-red-400",      ring: "ring-red-500/40",      bg: "from-red-500/20 to-red-500/5",       bar: "bg-red-500"     };
}

export default function ResultDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeQ, setActiveQ] = useState(0);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [isBookmarking, setIsBookmarking] = useState(false);

  useEffect(() => {
    fetch(`/api/results/${id}`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(async (d) => {
        setResult(d);
        // Fetch bookmarks
        try {
          const bRes = await fetch('/api/bookmarks');
          if (bRes.ok) {
            const bData = await bRes.json();
            const bMap: Record<string, boolean> = {};
            bData.forEach((b: any) => { bMap[b.questionId] = true; });
            setBookmarks(bMap);
          }
        } catch (e) {}
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const toggleBookmark = async (questionId: string) => {
    if (isBookmarking) return;
    setIsBookmarking(true);
    try {
      const isSaved = bookmarks[questionId];
      if (isSaved) {
        await fetch(`/api/bookmarks?questionId=${questionId}`, { method: 'DELETE' });
        setBookmarks(prev => ({ ...prev, [questionId]: false }));
      } else {
        await fetch('/api/bookmarks', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId, examId: result?.examId?._id })
        });
        setBookmarks(prev => ({ ...prev, [questionId]: true }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsBookmarking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center transition-colors">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-400 font-bold animate-pulse">Analyzing your performance...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-900 dark:text-white transition-colors">
        <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-300">Result not found</h2>
        <Button onClick={() => router.push("/dashboard/results")}>← Back to Results</Button>
      </div>
    );
  }

  const pct = Math.round((result.score / result.totalQuestions) * 100);
  const grade = getGrade(pct);
  const isPass = pct >= (result.examId?.passingMarks || 50);

  const currentAnswer = result.answers[activeQ];
  const question = currentAnswer?.questionId;
  const correctCount = result.answers.filter((a: any) => a.isCorrect).length;
  const skippedCount = result.answers.filter((a: any) => a.selectedOption === -1).length;
  const wrongCount = result.totalQuestions - correctCount - skippedCount;

  // Calculate Topic Analytics
  const topicStats: Record<string, { total: number; correct: number }> = {};
  if (result.answers) {
    result.answers.forEach((ans: any) => {
      const topic = ans.questionId?.topic || 'General';
      if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0 };
      topicStats[topic].total += 1;
      if (ans.isCorrect) topicStats[topic].correct += 1;
    });
  }
  const topics = Object.entries(topicStats)
    .map(([name, stats]) => ({ name, pct: Math.round((stats.correct / stats.total) * 100), ...stats }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20 transition-colors">
      <Navbar />

      {/* Header Hero */}
      <div className="relative overflow-hidden pt-28 pb-10 px-4">
        <div className={`absolute inset-0 bg-gradient-to-br ${grade.bg} opacity-30`} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-600/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={() => router.push("/dashboard/results")}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold mb-8 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Results
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Score Ring */}
            <div className={`relative flex-shrink-0 w-44 h-44 ring-4 ${grade.ring} rounded-full flex items-center justify-center`}>
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" className="stroke-slate-800" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="44" fill="none"
                  className={grade.bar.replace("bg-", "stroke-")}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 276} 276`}
                />
              </svg>
              <div className="text-center z-10">
                <div className={`text-4xl font-black ${grade.color}`}>{pct}%</div>
                <div className={`text-xs font-bold ${grade.color} opacity-80`}>{grade.label}</div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border mb-3 ring-1 ${grade.ring} ${isPass ? "border-emerald-500/30 text-emerald-400" : "border-red-500/30 text-red-400"}`}>
                {isPass ? <Trophy className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {isPass ? "Test Passed" : "Keep Practicing"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
                {result.examId?.title || "Result Analysis"}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-5">
                {result.examId?.category && <span className="text-primary-600 dark:text-primary-400 font-bold mr-2">{result.examId.category}</span>}
                {formatDate(result.submittedAt)}
              </p>

              {/* Quick stats row */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: CheckCircle2, label: `${correctCount} Correct`,    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
                  { icon: XCircle,      label: `${wrongCount} Wrong`,        color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" },
                  { icon: SkipForward,  label: `${skippedCount} Skipped`,    color: "text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" },
                  { icon: Clock,        label: formatTime(result.timeTakenSeconds), color: "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" },
                  { icon: Target,       label: `${result.score}/${result.totalQuestions} Score`, color: "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/20" },
                ].map((s, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-bold ${s.color}`}>
                    <s.icon className="w-4 h-4" /> {s.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-6">

        {/* Weak Topics & Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.weakTopics?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-500/20 p-6 flex flex-col shadow-sm dark:shadow-none"
            >
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" /> Topics to Revise
              </h2>
              <div className="flex flex-wrap gap-2">
                {result.weakTopics.map((t: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {topics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm dark:shadow-none"
            >
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <BarChart2 className="w-5 h-5 text-primary-500 dark:text-primary-400" /> Subject Performance
              </h2>
              <div className="space-y-4">
                {topics.slice(0, 4).map((t, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-600 dark:text-slate-300">{t.name}</span>
                      <span className={t.pct >= 50 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>{t.pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                      <div className={`h-full rounded-full transition-all duration-1000 ${t.pct >= 75 ? "bg-emerald-500" : t.pct >= 50 ? "bg-primary-500" : "bg-amber-500"}`} style={{ width: `${t.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Question Review */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        >
          {/* Question Palette */}
          <div className="lg:col-span-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 h-fit shadow-sm dark:shadow-none">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Questions
            </h3>
            <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
              {result.answers.map((ans: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveQ(idx)}
                  className={`aspect-square rounded-xl border-2 flex items-center justify-center text-xs font-bold transition-all hover:scale-110 ${
                    ans.selectedOption === -1
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      : ans.isCorrect
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                        : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30"
                  } ${activeQ === idx ? "ring-2 ring-primary-500 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110" : ""}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-500/30 border border-emerald-200 dark:border-emerald-500/30" /> Correct</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-100 dark:bg-red-500/30 border border-red-200 dark:border-red-500/30" /> Incorrect</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" /> Skipped</div>
            </div>
          </div>

          {/* Question Detail */}
          <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-8 flex flex-col shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                  Question {activeQ + 1} of {result.answers.length}
                </span>
                {currentAnswer && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                    currentAnswer.selectedOption === -1
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      : currentAnswer.isCorrect
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                        : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30"
                  }`}>
                    {currentAnswer.selectedOption === -1 ? "Skipped" : currentAnswer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                )}
              </div>
              
              {question && (
                <button
                  onClick={() => toggleBookmark(question._id)}
                  disabled={isBookmarking}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm font-bold ${
                    bookmarks[question._id]
                      ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-500/30 hover:bg-primary-100 dark:hover:bg-primary-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarks[question._id] ? "fill-primary-400" : ""}`} />
                  <span className="hidden sm:inline">{bookmarks[question._id] ? "Saved" : "Save"}</span>
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {!question ? (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                  Select a question to review
                </div>
              ) : (
                <motion.div
                  key={activeQ}
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="flex-1 flex flex-col"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 leading-relaxed">{question.text}</h3>

                  <div className="space-y-3 mb-8">
                    {question.options.map((opt: string, oIdx: number) => {
                      const isSelected = currentAnswer.selectedOption === oIdx;
                      const isCorrect = question.correctAnswer === oIdx;

                      let style = "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400";
                      if (isCorrect) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-100";
                      else if (isSelected && !isCorrect) style = "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-100";

                      return (
                        <div key={oIdx} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${style}`}>
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-sm flex-shrink-0 ${
                            isCorrect ? "border-emerald-500 bg-emerald-500 text-white"
                            : (isSelected && !isCorrect) ? "border-red-500 bg-red-500 text-white"
                            : "border-slate-600 text-slate-500"
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </div>
                          <span className="flex-1 text-sm font-medium">{opt}</span>
                          {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                          {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Clinical Pearl / Explanation */}
                  {question.explanation && (
                    <div className="mt-auto rounded-2xl bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex flex-shrink-0 items-center justify-center border border-indigo-500/30">
                          <Lightbulb className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-indigo-300 mb-1">Clinical Pearl</h4>
                          <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setActiveQ(p => p - 1)}
                disabled={activeQ === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-600">{activeQ + 1} / {result.answers.length}</span>
              <button
                onClick={() => setActiveQ(p => p + 1)}
                disabled={activeQ === result.answers.length - 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Back CTA */}
        <div className="text-center pt-4">
          <Link
            href="/dashboard/results"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-500/50 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> All My Results
          </Link>
        </div>
      </div>
    </main>
  );
}
