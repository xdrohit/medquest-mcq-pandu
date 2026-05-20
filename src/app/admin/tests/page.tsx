"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { BookOpen, Search, Edit2, Trash2, Plus, Play } from "lucide-react";
import Link from "next/link";

export default function AdminTestsPage() {
  const [search, setSearch] = useState("");
  
  // Mock data for UI demonstration
  const tests = [
    { id: "ex_1", title: "General Anatomy & Physiology", category: "MBBS", questions: 20, status: "Published" },
    { id: "ex_2", title: "Pharmacology Basics", category: "Pharmacy", questions: 30, status: "Published" },
    { id: "ex_5", title: "Neurology Advanced", category: "Specialization", questions: 0, status: "Draft" },
  ];

  return (
    <main className="min-h-screen bg-slate-900 p-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link href="/admin" className="text-primary-400 hover:text-primary-300 text-sm mb-2 inline-block">← Back to Dashboard</Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="text-primary-500" /> Exam Management
            </h1>
            <p className="text-slate-400 mt-1">Create, edit, and manage medical MCQs.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search exams..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <Button variant="primary" className="flex items-center gap-2"><Plus className="w-4 h-4" /> Create Exam</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {tests.map((test) => (
            <GlassCard key={test.id} className="bg-slate-800/50 border-slate-700 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{test.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${test.status === 'Published' ? 'bg-primary-500/20 text-primary-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {test.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="bg-slate-700 px-2 py-1 rounded-md">{test.category}</span>
                  <span>{test.questions} Questions</span>
                  <span>ID: {test.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700"><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
                <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/20"><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
              </div>
            </GlassCard>
          ))}
          {tests.length === 0 && (
            <div className="p-10 text-center text-slate-500">No exams found.</div>
          )}
        </div>
      </div>
    </main>
  );
}
