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

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/questions", label: "MCQ Manager", icon: BookOpen },
  { href: "/admin/tests", label: "Test Management", icon: ClipboardList },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
];

function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg leading-none">MedQuest</span>
            <p className="text-xs text-primary-400 font-semibold mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">Navigation</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                isActive
                  ? "bg-primary-500/15 text-primary-400 border border-primary-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}>
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                {label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

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
    { label: "Total Exams", value: loading ? "—" : stats.totalExams, sub: "In database", icon: ClipboardList, color: "text-violet-400", ring: "ring-violet-500/20", bg: "from-violet-500/10 to-transparent" },
    { label: "Total MCQs", value: loading ? "—" : stats.totalQuestions, sub: "Across all exams", icon: BookOpen, color: "text-cyan-400", ring: "ring-cyan-500/20", bg: "from-cyan-500/10 to-transparent" },
    { label: "Active Students", value: "0", sub: "Registered users", icon: Users, color: "text-emerald-400", ring: "ring-emerald-500/20", bg: "from-emerald-500/10 to-transparent" },
    { label: "Tests Taken", value: "0", sub: "All time submissions", icon: TrendingUp, color: "text-amber-400", ring: "ring-amber-500/20", bg: "from-amber-500/10 to-transparent" },
  ];

  const quickActions = [
    { href: "/admin/questions", label: "Add MCQ", icon: Plus, desc: "Add a new question", color: "bg-primary-500 hover:bg-primary-400" },
    { href: "/admin/tests", label: "Create Exam", icon: ClipboardList, desc: "Set up a new test", color: "bg-violet-600 hover:bg-violet-500" },
    { href: "/admin/students", label: "Manage Users", icon: Users, desc: "View all students", color: "bg-emerald-600 hover:bg-emerald-500" },
    { href: "/api/seed", label: "Seed Database", icon: Database, desc: "Reset sample data", color: "bg-slate-600 hover:bg-slate-500" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Admin Control Center</p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/tests">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-sm font-medium transition-colors">
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
              <div className={`relative overflow-hidden rounded-2xl p-5 bg-slate-900 border border-slate-800 ring-1 ${stat.ring} hover:border-slate-700 transition-colors`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.bg} rounded-full blur-2xl pointer-events-none`} />
                <div className={`w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center mb-4 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-sm font-semibold text-slate-300 mt-0.5">{stat.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((a, i) => (
              <Link key={i} href={a.href}>
                <div className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl ${a.color} transition-colors cursor-pointer`}>
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                    <a.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-bold leading-tight">{a.label}</p>
                    <p className="text-white/60 text-xs truncate">{a.desc}</p>
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
              <BookOpen className="w-4 h-4 text-primary-400" />
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Exams Overview</h2>
            </div>
            <Link href="/admin/tests" className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-3">
                {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-800 rounded-xl animate-pulse" />)}
              </div>
            ) : exams.length === 0 ? (
              <div className="p-16 text-center">
                <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No exams yet</p>
                <p className="text-slate-600 text-sm mt-1">Create your first exam to get started</p>
                <Link href="/admin/tests">
                  <button className="mt-4 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-500 transition-colors">Create Exam</button>
                </Link>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Exam</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Questions</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.slice(0, 6).map((exam: any, i: number) => (
                    <motion.tr key={exam._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white text-sm">{exam.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{exam.durationMinutes}m duration</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-primary-500/15 text-primary-400 px-2.5 py-1 rounded-lg border border-primary-500/20 font-medium">{exam.category}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-300 text-sm font-semibold">{exam.questionCount ?? 0}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                          exam.status === "published" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                          : exam.status === "scheduled" ? "bg-blue-500/15 text-blue-400 border-blue-500/20"
                          : "bg-slate-700 text-slate-400 border-slate-600"
                        }`}>
                          {exam.status === "published" ? "● Published" : exam.status === "scheduled" ? "◷ Scheduled" : "○ Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href="/admin/questions" className="text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors">Manage MCQs →</Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
