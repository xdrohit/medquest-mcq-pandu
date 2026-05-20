"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Lock, ShieldAlert } from "lucide-react";

export default function AdminPortalPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // isHiddenAdminRoute flag prevents students from logging in here
        body: JSON.stringify({ email, password, isHiddenAdminRoute: true }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = "/admin";
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError("System offline or unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      
      {/* Dark Ambient Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="backdrop-blur-3xl bg-slate-900/60 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Top Edge Highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 text-center tracking-wide uppercase text-slate-200">
            Secure Access Portal
          </h1>
          <p className="text-slate-500 mb-8 text-center text-sm">
            Restricted System. Authorized Personnel Only.
          </p>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-950/50 border border-red-900/50 text-red-400 rounded-xl text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Admin Identity</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-red-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-slate-800 rounded-xl leading-5 bg-slate-950/50 text-slate-300 placeholder-slate-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                  placeholder="admin@system.local"
                />
              </div>
            </div>

            <div className="space-y-1 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Clearance Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-red-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-slate-800 rounded-xl leading-5 bg-slate-950/50 text-slate-300 placeholder-slate-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-8 bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 border border-slate-700 hover:border-slate-600 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              {loading ? (
                 <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
              ) : (
                <>Authenticate <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
