"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, BookOpen, Plus, Activity, Settings, TrendingUp, MoreVertical } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { mockExams } from "@/lib/mockData";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden bg-slate-50">
      <Navbar />
      
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-gradient-to-bl from-accent-200/40 to-transparent pointer-events-none -z-10 blur-3xl" />

      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Control Center</h1>
            <p className="text-slate-600">Manage exams, questions, and view platform analytics.</p>
          </div>
          <Button variant="primary">
            <Plus className="w-5 h-5 mr-1" /> Create New Exam
          </Button>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Exams", value: mockExams.length, icon: <BookOpen className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-100" },
            { label: "Active Students", value: "1,248", icon: <Users className="w-5 h-5" />, color: "text-green-600", bg: "bg-green-100" },
            { label: "Tests Taken", value: "8,930", icon: <Activity className="w-5 h-5" />, color: "text-purple-600", bg: "bg-purple-100" },
            { label: "Avg. Pass Rate", value: "68%", icon: <TrendingUp className="w-5 h-5" />, color: "text-orange-600", bg: "bg-orange-100" },
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <GlassCard className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Recent Exams</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="pb-3 font-medium text-slate-500 text-sm">Exam Title</th>
                      <th className="pb-3 font-medium text-slate-500 text-sm">Category</th>
                      <th className="pb-3 font-medium text-slate-500 text-sm">Questions</th>
                      <th className="pb-3 font-medium text-slate-500 text-sm">Status</th>
                      <th className="pb-3 font-medium text-slate-500 text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockExams.map((exam, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-semibold text-slate-800">{exam.title}</td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {exam.category}
                          </span>
                        </td>
                        <td className="py-4 text-slate-600">{exam.totalQuestions}</td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-xl font-bold text-slate-800 mb-6">System Settings</h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-left group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                      <Settings className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-700">General Configuration</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-left group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-700">Manage Users</span>
                  </div>
                </button>
              </div>
            </GlassCard>
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
              <h3 className="text-lg font-bold mb-2 relative z-10">Database Status</h3>
              <p className="text-primary-100 text-sm mb-4 relative z-10">MongoDB is currently disconnected. Running on mock data mode.</p>
              <Button className="w-full bg-white text-primary-600 hover:bg-slate-50 relative z-10 border-none">
                Connect Database
              </Button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
