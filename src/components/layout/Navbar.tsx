"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, LogIn, User } from "lucide-react";
import { Button } from "../ui/Button";

export const Navbar = () => {
  const pathname = usePathname();

  // Mock state for authentication (to be replaced with actual auth logic)
  const isAuthenticated = false;

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
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              Med<span className="text-primary-600">Quest</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-500'}`}>
              Home
            </Link>
            <Link href="/exams" className={`text-sm font-medium transition-colors ${pathname === '/exams' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-500'}`}>
              Exams
            </Link>
            <Link href="/leaderboard" className={`text-sm font-medium transition-colors ${pathname === '/leaderboard' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-500'}`}>
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="glass" size="sm">
                  <User className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
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
