"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain, Stethoscope, Pill, Activity, ArrowRight, ShieldCheck, Zap,
  Trophy, Clock, Target, BarChart3, Users, BookOpen, CheckCircle, Star,
  TrendingUp, Flame, LogIn
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

export default function HomePage() {
  const categories = [
    { name: "MBBS", icon: <Brain className="w-7 h-7 text-primary-500" />, count: "1200+ Questions", color: "bg-primary-50 border-primary-200" },
    { name: "Nursing", icon: <Stethoscope className="w-7 h-7 text-rose-500" />, count: "900+ Questions", color: "bg-rose-50 border-rose-200" },
    { name: "Pharmacy", icon: <Pill className="w-7 h-7 text-emerald-500" />, count: "600+ Questions", color: "bg-emerald-50 border-emerald-200" },
    { name: "Paramedical", icon: <Activity className="w-7 h-7 text-amber-500" />, count: "400+ Questions", color: "bg-amber-50 border-amber-200" },
  ];

  const stats = [
    { icon: <Users className="w-5 h-5" />, value: "5,000+", label: "Active Students", color: "text-primary-600" },
    { icon: <BookOpen className="w-5 h-5" />, value: "3,100+", label: "MCQ Questions", color: "text-emerald-600" },
    { icon: <Trophy className="w-5 h-5" />, value: "12,000+", label: "Tests Conducted", color: "text-amber-600" },
    { icon: <Star className="w-5 h-5" />, value: "4.9/5", label: "Student Rating", color: "text-rose-600" },
  ];

  const steps = [
    {
      step: "01",
      icon: <LogIn className="w-6 h-6 text-primary-600" />,
      title: "Sign Up for Free",
      desc: "Create your account in under 30 seconds. No credit card required. Instant access to all free practice tests.",
      color: "bg-primary-50 border-primary-100",
    },
    {
      step: "02",
      icon: <Target className="w-6 h-6 text-emerald-600" />,
      title: "Pick Your Subject",
      desc: "Choose from MBBS, Nursing, Pharmacy, BDS, and Paramedical exams. We have daily updated question banks.",
      color: "bg-emerald-50 border-emerald-100",
    },
    {
      step: "03",
      icon: <BarChart3 className="w-6 h-6 text-amber-600" />,
      title: "Track & Improve",
      desc: "Get detailed analytics after every test. Our AI identifies your weak points so you improve faster each day.",
      color: "bg-amber-50 border-amber-100",
    },
  ];

  const features = [
    { icon: <Zap className="w-5 h-5 text-yellow-500" />, title: "Real-Time Analytics", desc: "See your score, speed, accuracy & rank the moment you submit." },
    { icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, title: "Verified Questions", desc: "Every MCQ is reviewed by experienced medical educators & toppers." },
    { icon: <Brain className="w-5 h-5 text-primary-500" />, title: "AI Weakness Finder", desc: "Our system identifies your weak topics and creates a personalized study plan." },
    { icon: <Clock className="w-5 h-5 text-rose-500" />, title: "Timed Practice Mode", desc: "Simulate real exam pressure with countdown timers and timed series." },
    { icon: <Trophy className="w-5 h-5 text-amber-500" />, title: "Leaderboard & Badges", desc: "Compete with students across India and earn achievement badges." },
    { icon: <TrendingUp className="w-5 h-5 text-indigo-500" />, title: "Daily Streak System", desc: "Build habits with daily practice challenges and streak rewards." },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "MBBS Student, AIIMS Delhi",
      text: "Daily Dose MCQ is literally the best platform I've used for exam prep. The analytics helped me identify my weak chapters in Anatomy within a week.",
      rating: 5,
      avatar: "P",
      avatarColor: "bg-primary-500",
    },
    {
      name: "Rahul Verma",
      role: "BSc Nursing, Final Year",
      text: "I was scoring 55% before joining. After 3 weeks of daily practice here, I jumped to 82%. The questions are exactly like the real exam pattern!",
      rating: 5,
      avatar: "R",
      avatarColor: "bg-emerald-500",
    },
    {
      name: "Sneha Patel",
      role: "Pharmacy Student, Ahmedabad",
      text: "The interface feels so premium and clean. No distractions during the test. Plus the Instagram page (@docmcq) keeps me motivated every single day!",
      rating: 5,
      avatar: "S",
      avatarColor: "bg-rose-500",
    },
  ];

  return (
    <>
      <main className="flex flex-col items-center overflow-hidden relative bg-slate-50 transition-colors duration-300">
        <Navbar />

        {/* ─── HERO SECTION ─── */}
        <section className="w-full relative pt-36 pb-24 px-4 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[url('/medical-bg.png')] bg-cover bg-center bg-no-repeat opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/85 to-slate-50" />
          </div>
          <div className="absolute top-40 left-10 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl z-0" />
          <div className="absolute top-60 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl z-0" style={{ animationDelay: "2s" }} />

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-100 shadow-sm mb-8 text-sm font-semibold text-primary-700"
            >
              <Flame className="w-4 h-4 text-orange-500" />
              India&apos;s #1 MCQ Platform for Medical Students
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-5xl"
            >
              Crack Your Medical Exams with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
                Daily MCQ Practice
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed"
            >
              Join <strong className="text-slate-900">5,000+ medical students</strong> who practice daily on our platform.
              Timed tests, AI analytics, leaderboards — everything you need to{" "}
              <strong className="text-primary-600">top your exam.</strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Start Practicing Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="glass" size="lg">
                  Already a member? Login
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="mt-4 text-sm text-slate-500"
            >
              ✅ Free to start &nbsp;•&nbsp; ✅ No credit card needed &nbsp;•&nbsp; ✅ Instant access
            </motion.p>
          </div>
        </section>

        {/* ─── STATS BAR ─── */}
        <section className="w-full max-w-6xl mx-auto px-4 -mt-2 mb-20 relative z-10">
          <motion.div {...fadeUp()} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className={`flex justify-center mb-2 ${s.color}`}>{s.icon}</div>
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ─── CATEGORIES ─── */}
        <section className="w-full max-w-6xl mx-auto px-4 mb-24">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Exam Categories</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Pick Your Stream</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">Whether you&apos;re in Nursing, MBBS, Pharmacy or BDS — we have the right question bank for you.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((cat, idx) => (
              <motion.div key={cat.name} {...fadeUp(0.1 * idx)}>
                <Link href="/register">
                  <div className={`group border-2 ${cat.color} rounded-2xl p-6 flex flex-col items-center gap-4 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all bg-white`}>
                    <div className="p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="w-full bg-white border-y border-slate-200 py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp()} className="text-center mb-14">
              <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Simple Process</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">How It Works</h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">Getting started takes less than a minute. Zero confusion, pure learning.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line on desktop */}
              <div className="hidden md:block absolute top-14 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-200 to-emerald-200" />
              {steps.map((step, i) => (
                <motion.div key={i} {...fadeUp(0.15 * i)} className={`relative border-2 ${step.color} rounded-3xl p-8 text-center`}>
                  <span className="text-6xl font-black text-slate-100 absolute top-4 right-5 leading-none">{step.step}</span>
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-5 mx-auto">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES GRID ─── */}
        <section className="w-full max-w-6xl mx-auto px-4 py-24">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Platform Features</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Everything You Need to Succeed</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">We built Daily Dose MCQ to be the only platform you&apos;ll ever need for medical exam preparation.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp(0.08 * i)} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="w-full bg-white border-y border-slate-200 py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp()} className="text-center mb-14">
              <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Student Reviews</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">What Our Students Say</h2>
              <p className="text-slate-500 mt-3">Trusted by thousands. Loved by toppers.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} {...fadeUp(0.12 * i)} className="bg-slate-50 border border-slate-200 rounded-3xl p-7 flex flex-col gap-4 hover:shadow-md transition-all">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-200">
                    <div className={`w-10 h-10 rounded-full ${t.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LIVE EXAM PREVIEW ─── */}
        <section className="w-full max-w-7xl mx-auto px-4 py-24">
          <div className="flex flex-col lg:flex-row gap-14 items-center">
            <motion.div {...fadeUp()} className="flex-1">
              <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-3">Live Platform Preview</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5">
                A Test Interface Built for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
                  Real Exam Confidence
                </span>
              </h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                No distractions, no clutter. Our clean interface mimics the real exam environment so you are never caught off guard on exam day.
              </p>
              <ul className="space-y-3">
                {[
                  "Timer countdown with auto-submit",
                  "Question palette for quick navigation",
                  "Instant result & detailed explanation",
                  "Accuracy & time-per-question breakdown",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/register">
                  <Button variant="primary" size="lg">
                    Try a Free Test Now <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="flex-1 relative w-full h-[480px]"
            >
              <GlassCard className="absolute inset-0 m-auto w-4/5 h-full flex flex-col p-6 shadow-2xl z-20 border-white/60" hoverEffect>
                <div className="w-full flex justify-between items-center mb-5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Live Exam View</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">Question 12 of 50</p>
                <h4 className="text-base font-semibold text-slate-800 mb-4">Q. What is the primary function of ribosomes?</h4>
                <div className="space-y-2.5">
                  {[
                    { opt: "Protein synthesis", correct: true },
                    { opt: "Lipid storage", correct: false },
                    { opt: "Energy production", correct: false },
                    { opt: "DNA replication", correct: false },
                  ].map((o, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-sm cursor-pointer transition-colors ${
                        o.correct
                          ? "border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold"
                          : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"
                      }`}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                      {o.opt}
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-rose-500">⏱ 01:45 remaining</span>
                  <Button variant="primary" size="sm">Next →</Button>
                </div>
              </GlassCard>
              <div className="absolute inset-0 m-auto w-4/5 h-full bg-gradient-to-tr from-primary-200 to-accent-200 rounded-[1.5rem] blur-xl opacity-50 z-10 translate-x-4 translate-y-4" />
            </motion.div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="w-full px-4 pb-24">
          <motion.div
            {...fadeUp()}
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden relative text-center"
            style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)" }}
          >
            <div className="absolute inset-0 bg-[url('/medical-bg.png')] bg-cover opacity-10" />
            <div className="relative px-8 py-16">
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                🎯 Limited Time — Join Free Today
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
                Your Exam is Waiting.<br />Are You Ready?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Every topper had a strategy. Yours starts here. Sign up now and take your first test in under 2 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <button className="px-8 py-4 bg-white text-indigo-700 font-extrabold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-base">
                    Create Free Account →
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-base">
                    Sign In Instead
                  </button>
                </Link>
              </div>
              <p className="text-white/50 text-sm mt-6">No credit card • Takes 30 seconds • 5,000+ students already inside</p>
            </div>
          </motion.div>
        </section>

      </main>

      <Footer />
    </>
  );
}
