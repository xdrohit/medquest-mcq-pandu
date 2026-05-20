"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, BookOpen, Activity, TrendingUp, Plus, LogOut,
  ClipboardList, CreditCard, ChevronRight, Zap, ShieldCheck
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

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
      const questionList = Array.isArray(questionsData) ? questionsData : [];
      setExams(examList);
      setStats({ totalExams: examList.length, totalQuestions: questionList.length });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const quickActions = [
    { href: "/admin/questions", icon: <BookOpen className="w-5 h-5" />, label: "MCQ Manager", desc: "Add, edit, bulk upload questions", color: "from-primary-600 to-blue-600" },
    { href: "/admin/students", icon: <Users className="w-5 h-5" />, label: "Students", desc: "Manage registered students", color: "from-purple-600 to-indigo-600" },
    { href: "/admin/tests", icon: <ClipboardList className="w-5 h-5" />, label: "Exams", desc: "Create and manage exams", color: "from-amber-600 to-orange-600" },
    { href: "/admin/payments", icon: <CreditCard className="w-5 h-5" />, label: "Payments", desc: "Track revenue and transactions", color: "from-green-600 to-teal-600" },
  ];

  const statCards = [
    { label: "Total Exams", value: loading ? "—" : stats.totalExams, icon: <BookOpen className="w-5 h-5" />, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Total MCQs", value: loading ? "—" : stats.totalQuestions, icon: <ClipboardList className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Active Students", value: "0", icon: <Users className="w-5 h-5" />, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
    { label: "Tests Taken", value: "0", icon: <Activity className="w-5 h-5" />, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary-900/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-28 pb-16 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-primary-400" />
              <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest">Admin Control Center</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white">MedQuest Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your entire medical MCQ platform from here.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/questions">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-bold shadow-lg hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" /> Add MCQ
              </button>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-700 text-sm transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statCards.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className={`rounded-2xl p-5 border ${stat.bg} backdrop-blur-sm`}>
                <div className={`${stat.color} mb-3`}>{stat.icon}</div>
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /> Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <div className={`group relative rounded-2xl p-6 bg-gradient-to-br ${action.color} bg-opacity-10 border border-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <h3 className="text-white font-bold mb-1">{action.label}</h3>
                    <p className="text-white/60 text-sm">{action.desc}</p>
                    <ChevronRight className="w-4 h-4 text-white/40 mt-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Exams */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary-400" /> Exams Overview</h2>
            <Link href="/admin/tests" className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">View All →</Link>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading...</div>
            ) : exams.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No exams yet. <Link href="/admin/tests" className="text-primary-400">Create one</Link></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-800/30">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Exam Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Questions</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.slice(0, 5).map((exam: any) => (
                      <tr key={exam._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4 font-semibold text-white">{exam.title}</td>
                        <td className="px-6 py-4"><span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-lg">{exam.category}</span></td>
                        <td className="px-6 py-4 text-slate-300">{exam.questionCount ?? "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${exam.active ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500'}`}>
                            {exam.active ? "Active" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link href="/admin/questions" className="text-xs text-primary-400 hover:text-primary-300 font-medium">Manage MCQs →</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
