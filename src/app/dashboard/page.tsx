"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Play, BookOpen, Activity, Target, Flame, Zap, 
  ChevronRight, Trophy, TrendingUp, AlertTriangle, CheckCircle2, Clock 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<"available" | "analytics">("available");
  const [exams, setExams] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, profileRes] = await Promise.all([
          fetch("/api/exams", { cache: "no-store" }),
          fetch("/api/user/profile", { cache: "no-store" })
        ]);
        
        if (examsRes.ok) setExams(await examsRes.json());
        if (profileRes.ok) setProfile(await profileRes.json());
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center transition-colors duration-300">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 animate-pulse">Loading AI Interface...</h2>
      </div>
    );
  }

  const { user, stats } = profile || { user: {}, stats: {} };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-20 pb-12 overflow-hidden selection:bg-primary-500/30 transition-colors duration-300">
      <Navbar />
      
      {/* Background Holographic Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-gradient-to-b from-primary-900/10 dark:from-primary-900/20 via-primary-900/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Welcome Hero & Gamification */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm dark:shadow-none"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">{user?.name?.split(' ')[0] || 'Student'}</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">Your AI medical training program is ready. Continue practicing to dominate your exams.</p>
              
              <div className="flex flex-wrap gap-4">
                {exams.length > 0 ? (
                  <Link href={`/exam/${exams[0]._id}`}>
                    <Button variant="primary" className="shadow-lg shadow-primary-500/20 rounded-xl px-6 py-3 font-bold">
                      Resume Training <Play className="w-4 h-4 ml-2 fill-current" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="primary" disabled className="rounded-xl px-6 py-3 font-bold">
                    No active tests <Play className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-4"
          >
            {/* XP Card */}
            <div className="flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-accent-500/50 transition-colors shadow-sm dark:shadow-none">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Zap className="w-8 h-8 text-accent-500 dark:text-accent-400 mb-2" />
              <div className="text-3xl font-black text-slate-900 dark:text-white">{user?.xp || 0}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total XP</div>
            </div>
            {/* Streak Card */}
            <div className="flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-orange-500/50 transition-colors shadow-sm dark:shadow-none">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Flame className="w-8 h-8 text-orange-500 mb-2" />
              <div className="text-3xl font-black text-slate-900 dark:text-white">{user?.streak || 0}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Day Streak</div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-fit shadow-sm dark:shadow-none">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "available" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            Available Tests
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "analytics" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            My Analytics
          </button>
        </div>

        {/* Available Tests Grid */}
        {activeTab === "available" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400">No active tests found</h3>
              </div>
            ) : (
              exams.map((exam, idx) => (
                <motion.div
                  key={exam._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:border-primary-500/50 transition-all hover:shadow-2xl hover:shadow-primary-500/10 flex flex-col h-full shadow-sm dark:shadow-none"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-primary-50 text-primary-600 border border-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/20">
                      {exam.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5" /> {exam.durationMinutes}m
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{exam.title}</h3>
                  <p className="text-slate-500 text-sm mb-8 flex-grow line-clamp-2">
                    {exam.description || `Comprehensive mock exam covering key concepts for your medical preparation.`}
                  </p>
                  <Link href={`/exam/${exam._id}`}>
                    <Button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-primary-600 dark:hover:bg-primary-600 text-slate-900 dark:text-white hover:text-white rounded-xl py-3 transition-colors border border-slate-200 dark:border-slate-700 hover:border-primary-500 group-hover:bg-primary-600 group-hover:text-white font-bold">
                      Start Mission <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"><Target className="w-5 h-5" /></div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300">Average Score</h3>
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white">{stats?.averageScore || 0}%</div>
              </div>
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"><CheckCircle2 className="w-5 h-5" /></div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300">Tests Completed</h3>
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white">{stats?.totalExams || 0}</div>
              </div>
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"><TrendingUp className="w-5 h-5" /></div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300">Global Rank</h3>
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white">#42</div>
                <p className="text-xs text-slate-500 mt-1">Top 5% of students</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weak Topics AI Analysis */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"><AlertTriangle className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">AI Weakness Analysis</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Topics you need to revise</p>
                  </div>
                </div>
                
                {stats?.topWeakTopics?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.topWeakTopics.map((topic: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{topic}</span>
                        <Button variant="ghost" className="h-8 px-3 text-xs border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Practice</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Take more tests to generate insights.</p>
                  </div>
                )}
              </div>

              {/* Recent History */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-sm dark:shadow-none">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" /> Recent Battles
                </h3>
                
                {stats?.recentResults?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentResults.map((result: any, i: number) => (
                      <Link key={result._id} href={`/dashboard/results/${result._id}`}>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500/50 transition-all cursor-pointer group">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{result.examId?.title || 'Unknown Exam'}</h4>
                            <p className="text-xs text-slate-500 mt-1">{new Date(result.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-lg text-slate-900 dark:text-white">
                              {Math.round((result.score / result.totalQuestions) * 100)}%
                            </div>
                            <div className="text-xs font-bold text-accent-600 dark:text-accent-400">+{result.xpEarned || 0} XP</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-10">No recent activity.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
}
