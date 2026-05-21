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
import { ThemeToggle } from "@/components/ui/ThemeToggle";



export default function AdminDashboard() {
  const [exams, setExams] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalExams: 0, totalQuestions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/exams?all=true").then(r => r.json()),
      fetch("/api/admin/questions").then(r => r.json()),
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
    { label: "Total Exams", value: loading ? "—" : stats.totalExams, sub: "In database", icon: ClipboardList, color: "text-violet-600 dark:text-violet-400", ring: "ring-violet-200 dark:ring-violet-500/20", bg: "from-violet-50 dark:from-violet-500/10 to-transparent" },
    { label: "Total MCQs", value: loading ? "—" : stats.totalQuestions, sub: "Across all exams", icon: BookOpen, color: "text-cyan-600 dark:text-cyan-400", ring: "ring-cyan-200 dark:ring-cyan-500/20", bg: "from-cyan-50 dark:from-cyan-500/10 to-transparent" },
    { label: "Active Students", value: "0", sub: "Registered users", icon: Users, color: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-200 dark:ring-emerald-500/20", bg: "from-emerald-50 dark:from-emerald-500/10 to-transparent" },
    { label: "Tests Taken", value: "0", sub: "All time submissions", icon: TrendingUp, color: "text-amber-600 dark:text-amber-400", ring: "ring-amber-200 dark:ring-amber-500/20", bg: "from-amber-50 dark:from-amber-500/10 to-transparent" },
  ];

  const quickActions = [
    { href: "/admin/questions", label: "Add MCQ", icon: Plus, desc: "Add a new question", color: "bg-primary-600 hover:bg-primary-500" },
    { href: "/admin/tests", label: "Create Exam", icon: ClipboardList, desc: "Set up a new test", color: "bg-violet-600 hover:bg-violet-500" },
    { href: "/admin/students", label: "Manage Users", icon: Users, desc: "View all students", color: "bg-emerald-600 hover:bg-emerald-500" },
    { href: "/api/seed", label: "Seed Database", icon: Database, desc: "Reset sample data", color: "bg-slate-700 hover:bg-slate-600" },
  ];

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950">
      {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-1">Admin Control Center</p>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/tests">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium transition-colors shadow-sm dark:shadow-none">
                <ClipboardList className="w-4 h-4" /> New Exam
              </button>
            </Link>
            <Link href="/admin/questions">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold transition-colors shadow-lg shadow-primary-500/20">
                <Plus className="w-4 h-4" /> Add MCQ
              </button>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className={`relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ring-1 ${stat.ring} hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.bg} rounded-full blur-2xl pointer-events-none`} />
                <div className={`w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{stat.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.sub}</p>
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
              <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Exams Overview</h2>
            </div>
            <Link href="/admin/tests" className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-semibold flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
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
                          <span className="text-xs bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400 px-2.5 py-1 rounded-lg border border-primary-100 dark:border-primary-500/20 font-medium whitespace-nowrap">{exam.category}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300 text-sm font-semibold">{exam.questionCount ?? 0}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold border whitespace-nowrap ${
                            exam.status === "published" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20"
                            : exam.status === "scheduled" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20"
                            : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600"
                          }`}>
                            {exam.status === "published" ? "● Published" : exam.status === "scheduled" ? "◷ Scheduled" : "○ Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link href="/admin/questions" className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors whitespace-nowrap">Manage MCQs →</Link>
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
