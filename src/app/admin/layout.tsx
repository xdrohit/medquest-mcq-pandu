"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, ClipboardList, Users, CreditCard,
  LogOut, Activity, ShieldCheck, Menu, X, Tag, Heart
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Category Manager", icon: Tag },
  { href: "/admin/questions", label: "MCQ Manager", icon: BookOpen },
  { href: "/admin/tests", label: "Test Management", icon: ClipboardList },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard", label: "Student View", icon: Activity },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const SidebarContent = (
    <>
      <div className="px-6 py-5 border-b border-pink-200 dark:border-pink-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-500/40 transform hover:scale-110 transition-transform">
            <span className="text-2xl">🐼</span>
          </div>
          <div>
            <span className="text-slate-900 dark:text-white font-black text-lg leading-none tracking-tight">Pandu's Empire 🎀</span>
            <p className="text-xs text-pink-600 dark:text-pink-400 font-bold mt-0.5 flex items-center gap-1">
              <Heart className="w-3 h-3 fill-current" /> Admin Panel
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-black text-pink-400 dark:text-pink-500 uppercase tracking-widest px-3 mb-3">Empire Navigation</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer group ${isActive ? "bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-pink-50 dark:hover:bg-pink-900/20"}`}>
                <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-pink-600 dark:text-pink-400" : "text-slate-400 group-hover:text-pink-500"}`} />
                {label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />}
              </div>
            </Link>
          );
        })}

        {/* Cute Floating Box */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: [0, -5, 0], opacity: 1 }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="mt-8 mx-2 p-4 bg-gradient-to-br from-pink-100 to-rose-50 dark:from-pink-900/40 dark:to-rose-900/20 rounded-2xl border border-pink-200 dark:border-pink-700/50 shadow-sm relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 text-4xl opacity-20 transform rotate-12">🌸</div>
          <p className="text-xs font-bold text-pink-800 dark:text-pink-300 leading-relaxed relative z-10 italic">
            "pandu leee meya pandu leee, makai ka dana meya pandu le 🐼✨"
          </p>
        </motion.div>
      </nav>
      <div className="px-3 py-4 border-t border-pink-200 dark:border-pink-800/50">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-pink-50/50 dark:bg-pink-950/20 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md dark:bg-slate-900/90 border-b border-pink-200 dark:border-pink-800/50 z-30 flex items-center justify-between px-4 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐼</span>
          <span className="text-slate-900 dark:text-white font-black tracking-tight">Pandu's Empire 🎀</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 border-r border-pink-200 dark:border-pink-800/50 flex-col fixed left-0 top-0 z-40 transition-colors shadow-[4px_0_24px_rgba(236,72,153,0.05)]">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-900 border-r border-pink-200 dark:border-pink-800/50 z-50 flex flex-col shadow-2xl shadow-pink-500/20"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 w-full">
        {/* Padding top for mobile header */}
        <div className="pt-16 md:pt-0 min-h-screen flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
