"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BookOpen, ClipboardList, Users, CreditCard,
  LogOut, Activity, ChevronRight, TrendingUp, Plus, Zap,
  ShieldCheck, Database, Settings
} from "lucide-react";



export default function AdminDashboard() {
  const [exams, setExams] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalExams: 0, totalQuestions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timestamp = Date.now();
    Promise.all([
      fetch(`/api/exams?all=true&t=${timestamp}`, { cache: "no-store" }).then(r => r.json()),
      fetch(`/api/admin/questions?t=${timestamp}`, { cache: "no-store" }).then(r => r.json()),
    ]).then(([examsData, questionsData]) => {
      const examList = Array.isArray(examsData) ? examsData : [];
      const qList = Array.isArray(questionsData) ? questionsData : [];
      setExams(examList);
      setStats({ totalExams: examList.length, totalQuestions: qList.length });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const statCards = [
    { label: "Total Exams", value: loading ? "—" : stats.totalExams, sub: "Ready for your students 🎀", icon: ClipboardList, color: "text-pink-600 dark:text-pink-400", ring: "ring-pink-300 dark:ring-pink-500/30", bg: "from-pink-100 dark:from-pink-500/20 to-transparent", quote: "Icchu's empire is growing! 🐼" },
    { label: "Total MCQs", value: loading ? "—" : stats.totalQuestions, sub: "Cuteness overloaded in Question Bank 🌸", icon: BookOpen, color: "text-rose-600 dark:text-rose-400", ring: "ring-rose-300 dark:ring-rose-500/30", bg: "from-rose-100 dark:from-rose-500/20 to-transparent", quote: "Even Pandas need a break, but you are unstoppable! 💕" },
    { label: "Active Students", value: "0", sub: "Registered users", icon: Users, color: "text-fuchsia-600 dark:text-fuchsia-400", ring: "ring-fuchsia-300 dark:ring-fuchsia-500/30", bg: "from-fuchsia-100 dark:from-fuchsia-500/20 to-transparent", quote: "Everyone loves your platform! 🥰" },
    { label: "Tests Taken", value: "0", sub: "All time submissions", icon: TrendingUp, color: "text-pink-600 dark:text-pink-400", ring: "ring-pink-300 dark:ring-pink-500/30", bg: "from-pink-100 dark:from-pink-500/20 to-transparent", quote: "Keep spreading the knowledge! ✨" },
  ];

  const quickActions = [
    { href: "/admin/questions", label: "Add MCQ", icon: Plus, desc: "Add a cute question", color: "bg-pink-500 hover:bg-pink-400" },
    { href: "/admin/tests", label: "Create Exam", icon: ClipboardList, desc: "Set up a new test", color: "bg-rose-500 hover:bg-rose-400" },
    { href: "/admin/students", label: "Manage Users", icon: Users, desc: "View all students", color: "bg-fuchsia-500 hover:bg-fuchsia-400" },
    { href: "/api/seed", label: "Seed Database", icon: Database, desc: "Reset sample data", color: "bg-pink-700 hover:bg-pink-600" },
  ];

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-pink-50/30 dark:bg-pink-950/10">
      {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs text-pink-500 dark:text-pink-400 uppercase tracking-widest font-black mb-1">Pandu's Control Center 🎀</p>
            <motion.h1 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              Welcome back, my cute Pandu (Icchu)! 🐼💖
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-pink-600 dark:text-pink-300 mt-2 font-medium"
            >
              Ready to manage your MCQ empire with cuteness overload? 🌸
            </motion.p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/tests">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/50 text-sm font-bold transition-colors shadow-sm">
                <ClipboardList className="w-4 h-4" /> New Exam
              </button>
            </Link>
            <Link href="/admin/questions">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white text-sm font-bold transition-colors shadow-lg shadow-pink-500/30">
                <Plus className="w-4 h-4" /> Add MCQ
              </button>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className={`relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-pink-900/10 border-2 border-pink-100 dark:border-pink-800/50 hover:border-pink-300 dark:hover:border-pink-500/50 transition-all shadow-md shadow-pink-100 dark:shadow-none group`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.bg} rounded-full blur-2xl pointer-events-none`} />
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: i * 0.2 }} className="absolute -right-2 -top-2 text-3xl opacity-50">🐼</motion.div>
                <div className={`w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center mb-4 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <p className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {stat.value} <span className="text-lg">🎀</span>
                </p>
                <p className="text-sm font-bold text-pink-700 dark:text-pink-300 mt-0.5">{stat.label}</p>
                <p className="text-xs text-pink-500 dark:text-pink-400 mt-0.5">{stat.sub}</p>
                <div className="mt-4 pt-3 border-t border-pink-100 dark:border-pink-800/50">
                  <p className="text-[10px] font-bold text-pink-400 dark:text-pink-500 italic">"{stat.quote}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((a, i) => (
              <Link key={i} href={a.href}>
                <div className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl ${a.color} transition-colors cursor-pointer shadow-sm dark:shadow-none`}>
                  <div className="w-8 h-8 rounded-lg bg-white/20 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-colors flex-shrink-0">
                    <a.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-bold leading-tight">{a.label}</p>
                    <p className="text-white/80 dark:text-white/60 text-xs truncate">{a.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Exams Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎀</span>
              <h2 className="text-sm font-bold text-pink-700 dark:text-pink-300 uppercase tracking-wider">Your Official Tests</h2>
            </div>
            <Link href="/admin/tests" className="text-xs text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 font-bold flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white dark:bg-pink-900/10 border-2 border-pink-100 dark:border-pink-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
            {loading ? (
              <div className="p-8 space-y-3">
                {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
              </div>
            ) : exams.length === 0 ? (
              <div className="p-16 text-center">
                <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">No exams yet</p>
                <p className="text-slate-500 dark:text-slate-600 text-sm mt-1">Create your first exam to get started</p>
                <Link href="/admin/tests">
                  <button className="mt-4 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-500 transition-colors">Create Exam</button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-transparent">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Exam</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Questions</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.slice(0, 6).map((exam: any, i: number) => (
                      <motion.tr key={exam._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm whitespace-nowrap">{exam.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{exam.durationMinutes}m duration</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-pink-50 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400 px-2.5 py-1 rounded-lg border border-pink-100 dark:border-pink-500/20 font-bold whitespace-nowrap">{exam.category}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300 text-sm font-bold">{exam.questionCount ?? 0}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold border whitespace-nowrap ${
                            exam.status === "published" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20"
                            : exam.status === "scheduled" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20"
                            : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900 dark:text-pink-400 dark:border-pink-600"
                          }`}>
                            {exam.status === "published" ? "● Published" : exam.status === "scheduled" ? "◷ Scheduled" : "○ Draft 🐼"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link href="/admin/questions" className="text-xs text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 font-bold transition-colors whitespace-nowrap">Manage MCQs →</Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
