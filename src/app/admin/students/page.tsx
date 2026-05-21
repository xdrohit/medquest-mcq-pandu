"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BookOpen, ClipboardList, Users, CreditCard,
  LogOut, Activity, ShieldCheck, Search, Edit2, Trash2, Plus
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
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg leading-none">Daily Dose MCQ</span>
            <p className="text-xs text-primary-400 font-semibold mt-0.5 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">Navigation</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${isActive ? "bg-primary-500/15 text-primary-400 border border-primary-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                {label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-slate-800">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const students = [
    { id: "st_1", name: "Sarah Connor", email: "sarah@example.com", status: "Active", enrolled: 4, lastLogin: "2 mins ago" },
    { id: "st_2", name: "John Doe", email: "john@example.com", status: "Inactive", enrolled: 1, lastLogin: "3 days ago" },
    { id: "st_3", name: "Emily Chen", email: "emily@example.com", status: "Active", enrolled: 6, lastLogin: "Just now" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar onLogout={handleLogout} />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Admin</p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Users className="text-primary-400 w-7 h-7" /> Student Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">View and manage all registered students.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold transition-colors shadow-lg shadow-primary-500/20">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="Search students..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <span className="text-slate-500 text-sm">{students.length} students</span>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/40">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/30 to-accent-400/30 flex items-center justify-center text-white font-bold text-sm border border-primary-500/20">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{s.name}</p>
                        <p className="text-slate-500 text-xs">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${s.status === "Active" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : "bg-slate-700 text-slate-500 border-slate-600"}`}>
                      {s.status === "Active" ? "● Active" : "○ Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm font-semibold">{s.enrolled} courses</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{s.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-primary-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
