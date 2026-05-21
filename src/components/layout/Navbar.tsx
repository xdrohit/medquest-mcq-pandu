"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, LogIn, LogOut, ChevronDown, User, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";

interface AuthUser {
  name: string;
  role: string;
  userId: string;
}

export const Navbar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(37,99,235,0.1)]">
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 text-white shadow-[0_0_15px_rgba(14,165,233,0.5)] group-hover:shadow-[0_0_25px_rgba(14,165,233,0.8)] transition-shadow">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              Daily Dose <span className="text-primary-600 dark:text-primary-400">MCQ</span>
            </span>
          </Link>


          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-300'}`}>
              Home
            </Link>
            <Link href="/dashboard" className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-300'}`}>
              Exams
            </Link>
            <Link href="/dashboard" className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-300'}`}>
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : user ? (
              // ✅ LOGGED IN: Show user info + dropdown
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl bg-primary-50 dark:bg-slate-900 border border-primary-100 dark:border-slate-800 hover:bg-primary-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{user.name}</p>
                    <p className="text-xs text-primary-600 dark:text-primary-400 capitalize leading-tight">{user.role}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-slate-800 dark:to-slate-800 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role} account</p>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        <Link
                          href={user.role === 'admin' ? '/admin' : '/dashboard'}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
                        >
                          {user.role === 'admin' ? (
                            <ShieldCheck className="w-4 h-4 text-primary-500" />
                          ) : (
                            <LayoutDashboard className="w-4 h-4 text-primary-500" />
                          )}
                          {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                        </Link>

                        {user.role === 'student' && (
                          <Link
                            href="/dashboard/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            My Profile
                          </Link>
                        )}

                        <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
                          <button
                            onClick={() => { setDropdownOpen(false); handleLogout(); }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Click outside to close */}
                {dropdownOpen && (
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                )}
              </div>
            ) : (
              // ❌ NOT LOGGED IN: Show Sign In button
              <Link href="/login">
                <Button variant="primary" size="sm">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

        </div>
      </div>
    </motion.header>
  );
};
