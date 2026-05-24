"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, LogIn, LogOut, ChevronDown, User, LayoutDashboard, ShieldCheck, Menu, X, Bell, ExternalLink } from "lucide-react";
import { Button } from "../ui/Button";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [brand, setBrand] = useState<any>({
    logoText: "Daily Dose MCQ",
    logoEmoji: "🩺",
  });
  const [popup, setPopup] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch CMS settings/brand
    fetch("/api/site-content?t=" + Date.now())
      .then((r) => r.json())
      .then((data) => {
        if (data?.brand) setBrand(data.brand);
        if (data?.popup) {
          setPopup(data.popup);
          if (data.popup.enabled) {
            try {
              const dismissKey = `dismiss_pop_${btoa(unescape(encodeURIComponent(data.popup.title))).slice(0, 16)}`;
              if (!localStorage.getItem(dismissKey)) {
                setShowPopup(true);
              }
            } catch {
              setShowPopup(true);
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const dismissPopup = () => {
    setShowPopup(false);
    if (popup?.title) {
      try {
        const dismissKey = `dismiss_pop_${btoa(unescape(encodeURIComponent(popup.title))).slice(0, 16)}`;
        localStorage.setItem(dismissKey, "true");
      } catch {}
    }
  };

  return (
    <>
      <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(37,99,235,0.1)] relative z-50">
          
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 text-white shadow-[0_0_15px_rgba(14,165,233,0.5)] group-hover:shadow-[0_0_25px_rgba(14,165,233,0.8)] transition-shadow text-xl font-bold">
              {brand.logoEmoji || "🩺"}
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              {brand.logoText || "Daily Dose MCQ"}
            </span>
          </Link>


          <nav className="hidden md:flex items-center gap-8">
            <Link href={user ? "/dashboard" : "/"} className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-300'}`}>
              Home
            </Link>
            <Link href="/dashboard" className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-300'}`}>
              Dashboard
            </Link>
            {user && (
              <Link href="/dashboard/results" className={`text-sm font-medium transition-colors ${pathname === '/dashboard/results' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-300'}`}>
                Results
              </Link>
            )}
            <Link href="/dashboard" className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-300'}`}>
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
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

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center ml-2">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute left-4 right-4 top-[80px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-40"
            >
              <div className="flex flex-col p-4 gap-2">
                <Link href={user ? "/dashboard" : "/"} onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/' ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  Home
                </Link>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  Dashboard
                </Link>
                {user && (
                  <Link href="/dashboard/results" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/dashboard/results' ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    Results
                  </Link>
                )}
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  Leaderboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>

    {/* Dynamic Pop-up Alert Modal */}
    <AnimatePresence>
      {showPopup && popup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden text-center"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-accent-500" />
            
            {popup.dismissible && (
              <button
                onClick={dismissPopup}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-500 text-3xl">
              {brand.logoEmoji || "🩺"}
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
              {popup.title}
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
              {popup.text}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {popup.btnText && (
                <Link href={popup.btnLink || "/dashboard"} className="w-full" onClick={dismissPopup}>
                  <Button variant="primary" className="w-full py-3.5 font-bold shadow-lg shadow-primary-500/20">
                    {popup.btnText}
                  </Button>
                </Link>
              )}
              {popup.dismissible && (
                <button
                  onClick={dismissPopup}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl transition-colors text-sm"
                >
                  Later
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </>
);
};
