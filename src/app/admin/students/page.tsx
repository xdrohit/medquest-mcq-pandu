"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Users, Search, MoreVertical, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  
  // Mock data for UI demonstration
  const students = [
    { id: "st_1", name: "Sarah Connor", email: "sarah@example.com", status: "Active", enrolled: 4, lastLogin: "2 mins ago" },
    { id: "st_2", name: "John Doe", email: "john@example.com", status: "Inactive", enrolled: 1, lastLogin: "3 days ago" },
    { id: "st_3", name: "Emily Chen", email: "emily@example.com", status: "Active", enrolled: 6, lastLogin: "Just now" },
  ];

  return (
    <main className="min-h-screen bg-slate-900 p-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link href="/admin" className="text-primary-400 hover:text-primary-300 text-sm mb-2 inline-block">← Back to Dashboard</Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="text-primary-500" /> Student Management
            </h1>
            <p className="text-slate-400 mt-1">View, edit, and manage registered student accounts.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search students..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <Button variant="primary">Add Student</Button>
          </div>
        </header>

        <GlassCard className="bg-slate-800/50 border-slate-700 p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700">
                  <th className="p-4 text-sm font-semibold text-slate-300">Name</th>
                  <th className="p-4 text-sm font-semibold text-slate-300">Email</th>
                  <th className="p-4 text-sm font-semibold text-slate-300">Status</th>
                  <th className="p-4 text-sm font-semibold text-slate-300">Enrolled Courses</th>
                  <th className="p-4 text-sm font-semibold text-slate-300">Last Login</th>
                  <th className="p-4 text-sm font-semibold text-slate-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="p-4 font-medium">{student.name}</td>
                    <td className="p-4 text-slate-400">{student.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${student.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{student.enrolled}</td>
                    <td className="p-4 text-slate-400 text-sm">{student.lastLogin}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button className="p-2 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-red-500/20 rounded-md text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {students.length === 0 && (
            <div className="p-10 text-center text-slate-500">No students found.</div>
          )}
        </GlassCard>
      </div>
    </main>
  );
}
