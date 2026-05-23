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
  const [stats, setStats] = useState({ totalExams: 0, totalQuestions: 0, totalStudents: 0, totalTestsTaken: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timestamp = Date.now();
    fetch(`/api/admin/stats?t=${timestamp}`, { cache: "no-store" })
      .then(r => r.json())
      .then(statsData => {
        setStats({ 
          totalExams: statsData.totalExams || 0, 
          totalQuestions: statsData.totalQuestions || 0,
          totalStudents: statsData.totalStudents || 0,
          totalTestsTaken: statsData.totalTestsTaken || 0
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const statCards = [
    { label: "Total MCQs", value: loading ? "—" : stats.totalQuestions, sub: "Cuteness overloaded in Question Bank 🌸", icon: BookOpen, color: "text-rose-600 dark:text-rose-400", ring: "ring-rose-300 dark:ring-rose-500/30", bg: "from-rose-100 dark:from-rose-500/20 to-transparent", quote: "Even Pandas need a break, but you are unstoppable! 💕" },
    { label: "Active Students", value: loading ? "—" : stats.totalStudents, sub: "Registered users", icon: Users, color: "text-fuchsia-600 dark:text-fuchsia-400", ring: "ring-fuchsia-300 dark:ring-fuchsia-500/30", bg: "from-fuchsia-100 dark:from-fuchsia-500/20 to-transparent", quote: "Everyone loves your platform! 🥰" },
    { label: "Practice Sessions", value: loading ? "—" : stats.totalTestsTaken, sub: "All time practices", icon: TrendingUp, color: "text-pink-600 dark:text-pink-400", ring: "ring-pink-300 dark:ring-pink-500/30", bg: "from-pink-100 dark:from-pink-500/20 to-transparent", quote: "Keep spreading the knowledge! ✨" },
  ];

  const quickActions = [
    { href: "/admin/questions", label: "Add MCQ", icon: Plus, desc: "Add a cute question", color: "bg-pink-500 hover:bg-pink-400" },
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

        {/* Removed Exams Table */}
    </div>
  );
}
