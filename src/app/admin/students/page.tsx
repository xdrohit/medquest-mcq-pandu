"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, ClipboardList, Users, CreditCard,
  LogOut, Activity, ShieldCheck, Search, Edit2, Trash2, Plus, X, AlertCircle
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

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const timestamp = Date.now();
      const res = await fetch(`/api/admin/users?t=${timestamp}`, { cache: "no-store" });
      if (res.ok) {
        setStudents(await res.json());
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add admin");
      setModalOpen(false);
      setForm({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar onLogout={handleLogout} />

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary-400" /> Add New Admin</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500" placeholder="Admin Name" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500" placeholder="admin@dailydosemcq.com" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Password</label>
                  <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500" placeholder="••••••••" />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                    {saving ? "Creating Admin..." : "Create Admin Account"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="ml-64 flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Admin</p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Users className="text-primary-400 w-7 h-7" /> Student Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">View and manage all registered students.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold transition-colors shadow-lg shadow-primary-500/20">
            <Plus className="w-4 h-4" /> Add Admin
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Loading users...
                  </td>
                </tr>
              ) : students.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase())).map((s, i) => (
                <motion.tr key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/30 to-accent-400/30 flex items-center justify-center text-white font-bold text-sm border border-primary-500/20">
                        {s.name ? s.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm flex items-center gap-2">
                          {s.name} {s.role === 'admin' && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">Admin</span>}
                        </p>
                        <p className="text-slate-500 text-xs">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold border bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
                      ● Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm font-semibold text-center">
                     -
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-primary-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-2 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
