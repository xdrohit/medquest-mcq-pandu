"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Lock, Activity, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { AIOrb } from "@/components/ui/AIOrb";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
        // isHiddenAdminRoute is false for standard student login
        body: JSON.stringify({ email, password, rememberMe, isHiddenAdminRoute: false }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      <ParticleBackground />
      
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent-400/20 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Side: AI Assistant & Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col items-center justify-center text-center"
        >
          <AIOrb />
          <h1 className="mt-12 text-5xl font-extrabold text-slate-800 tracking-tight">
            Med<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Quest</span> AI
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-md">
            Enter the next generation of medical assessments. Immersive, intelligent, and personalized for your success.
          </p>
        </motion.div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto relative"
        >
          {/* Glass Card Container */}
          <div className="backdrop-blur-2xl bg-white/40 border border-white/60 rounded-3xl p-8 shadow-[0_8px_32px_rgba(14,165,233,0.1)] relative overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-[shimmer_3s_infinite]" />
            
            <div className="relative z-10">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-8 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 text-white shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  Med<span className="text-primary-600">Quest</span>
                </span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-2">Student Portal</h2>
              <p className="text-slate-500 mb-8">Access your personalized AI learning space.</p>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-2xl text-sm flex items-center gap-3"
                  >
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 border-2 border-white/60 rounded-2xl leading-5 bg-white/30 backdrop-blur-md placeholder-slate-400 text-slate-900 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 focus:bg-white/50 transition-all shadow-inner"
                      placeholder="student@dailydosemcq.com"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 border-2 border-white/60 rounded-2xl leading-5 bg-white/30 backdrop-blur-md placeholder-slate-400 text-slate-900 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 focus:bg-white/50 transition-all shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center text-sm ml-1">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded-md group-hover:border-primary-400 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer absolute opacity-0 w-full h-full cursor-pointer" 
                      />
                      <div className="absolute w-3 h-3 bg-primary-500 rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity scale-50 peer-checked:scale-100" />
                    </div>
                    <span className="text-slate-600 font-medium select-none">Remember my AI profile</span>
                  </label>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 p-[2px]"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl py-4 px-6 flex items-center justify-center gap-2 text-white font-bold shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-shadow group-hover:shadow-[0_0_30px_rgba(14,165,233,0.6)]">
                      {loading ? (
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Initialize Session <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </div>
                  </button>
                </motion.div>
              </form>

              <div className="mt-8 text-center text-sm font-medium text-slate-500">
                New to Daily Dose MCQ?{" "}
                <Link href="/register" className="text-primary-600 hover:text-primary-700 hover:underline underline-offset-4 transition-all">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { left: 200%; }
        }
      `}} />
    </main>
  );
}
