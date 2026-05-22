"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy, CheckCircle2, XCircle, Clock, Target,
  ChevronRight, TrendingUp, BookOpen, BarChart2, Calendar, Award
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getGrade(pct: number) {
  if (pct >= 90) return { label: "Outstanding", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" };
  if (pct >= 75) return { label: "Excellent",    color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/30" };
  if (pct >= 60) return { label: "Good",         color: "text-primary-400", bg: "bg-primary-500/10 border-primary-500/30" };
  if (pct >= 40) return { label: "Average",      color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/30" };
  return            { label: "Needs Work",       color: "text-red-400",     bg: "bg-red-500/10 border-red-500/30" };
}

export default function MyResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");

  const loadResults = () => {
    setLoading(true);
    setError(false);
    fetch(`/api/results/my?t=${Date.now()}`, { cache: "no-store" })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        setResults(Array.isArray(data) ? data : []);
        setError(false);
      })
      .catch(err => {
        console.error("Failed to load results:", err);
        setError(true);
        setResults([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadResults(); }, []);

  const filtered = results
    .filter(r => {
      const title = r.examId?.title?.toLowerCase() ?? "";
      const cat = r.examId?.category?.toLowerCase() ?? "";
      const q = search.toLowerCase();
      return !search || title.includes(q) || cat.includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "score") {
        const pA = (a.score / a.totalQuestions) * 100;
        const pB = (b.score / b.totalQuestions) * 100;
        return pB - pA;
      }
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

  // Aggregate stats
  const totalTests = results.length;
  const avgScore = totalTests > 0
    ? Math.round(results.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / totalTests)
    : 0;
  const bestScore = totalTests > 0
    ? Math.round(Math.max(...results.map(r => (r.score / r.totalQuestions) * 100)))
    : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-16">
      <Navbar />

      {/* Hero Header */}
      <div className="relative overflow-hidden pt-28 pb-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">Your Journey</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Results</span>
            </h1>
            <p className="text-slate-400 text-lg">Every test you've taken, preserved forever.</p>
          </motion.div>

          {/* Summary Cards */}
          {!loading && totalTests > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="grid grid-cols-3 gap-2 sm:gap-4 mt-8 max-w-lg"
            >
              {[
                { icon: BookOpen,   label: "Tests Taken",  value: totalTests,         color: "text-primary-400" },
                { icon: Target,     label: "Avg Score",    value: `${avgScore}%`,      color: "text-emerald-400" },
                { icon: Award,      label: "Best Score",   value: `${bestScore}%`,     color: "text-amber-400" },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-2 sm:p-4 text-center backdrop-blur-sm">
                  <s.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${s.color} mx-auto mb-1`} />
                  <div className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 whitespace-nowrap">{s.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search by exam name or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
          <div className="flex gap-2">
            {(["date", "score"] as const).map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${sortBy === s ? "bg-primary-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"}`}
              >
                {s === "date" ? "Latest First" : "Best Score"}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-slate-800 rounded-lg" />
                    <div className="h-3 w-32 bg-slate-800/70 rounded-lg" />
                  </div>
                  <div className="w-20 h-10 bg-slate-800 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <Trophy className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">No results yet</h3>
            <p className="text-slate-500 mb-6">Take your first test to see your results here.</p>
            <Link href="/dashboard" className="inline-block px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm transition-colors">
              Browse Tests
            </Link>
          </motion.div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">Couldn&apos;t load results</h3>
            <p className="text-slate-500 mb-6">There was a connection issue. Your results are safe.</p>
            <button
              onClick={loadResults}
              className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* No search match */}
        {!loading && results.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">No results match your search.</div>
        )}

        {/* Results List */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((result, idx) => {
              const pct = Math.round((result.score / result.totalQuestions) * 100);
              const grade = getGrade(pct);
              const isPass = pct >= 50;
              return (
                <motion.div
                  key={result._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link href={`/dashboard/results/${result._id}`}>
                    <div className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 p-5 sm:p-6 cursor-pointer">

                      {/* Subtle gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative flex items-center gap-4 sm:gap-6">

                        {/* Score Circle */}
                        <div className={`relative flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 ${isPass ? "border-emerald-500/40 bg-emerald-500/10" : "border-red-500/40 bg-red-500/10"}`}>
                          <span className={`text-xl font-black ${isPass ? "text-emerald-400" : "text-red-400"}`}>{pct}%</span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-white text-base group-hover:text-primary-300 transition-colors truncate">
                              {result.examId?.title || "Unknown Exam"}
                            </h3>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${grade.bg} ${grade.color}`}>
                              {grade.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              {result.score}/{result.totalQuestions} correct
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              {formatTime(result.timeTakenSeconds)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              {formatDate(result.submittedAt)}
                            </span>
                            {result.examId?.category && (
                              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                                {result.examId.category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Score bar + CTA */}
                        <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                          {/* Mini progress bar */}
                          <div className="w-28 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isPass ? "bg-emerald-500" : "bg-red-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            View Details <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
