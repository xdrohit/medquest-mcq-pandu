"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, BookOpen, Activity, Play, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<"available" | "completed">("available");
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("/api/exams", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setExams(data);
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
      <Navbar />
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-primary-100/50 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Dashboard</h1>
          <p className="text-slate-600">Welcome back! Ready to test your medical knowledge?</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassCard className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Available Exams</p>
              <p className="text-2xl font-bold text-slate-900">{exams.length}</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent-100 text-accent-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Exams Completed</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Average Score</p>
              <p className="text-2xl font-bold text-slate-900">0%</p>
            </div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("available")}
            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === "available" ? "text-primary-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            Available Exams
            {activeTab === "available" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === "completed" ? "text-primary-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            Completed
            {activeTab === "completed" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
        </div>

        {/* Exams Grid */}
        {activeTab === "available" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-3xl bg-slate-100 animate-pulse" />
              ))
            ) : exams.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-500">No exams available yet.</div>
            ) : (
              exams.map((exam, idx) => (
                <motion.div
                  key={exam._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <GlassCard hoverEffect className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {exam.category}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="w-4 h-4" /> {exam.durationMinutes}m
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{exam.title}</h3>
                    <p className="text-slate-600 text-sm mb-6 flex-grow">
                      {exam.description || `Test your knowledge with carefully curated questions.`}
                    </p>
                    <Link href={`/exam/${exam._id}`}>
                      <Button variant="primary" className="w-full">
                        Start Exam <Play className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="text-center py-20 text-slate-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>You haven't completed any exams yet.</p>
          </div>
        )}

      </div>
    </main>
  );
}
