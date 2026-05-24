"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Stethoscope, Pill, Activity, ArrowRight, ShieldCheck, Zap,
  Trophy, Clock, Target, BarChart3, Users, BookOpen, CheckCircle, Star,
  TrendingUp, Flame, LogIn, X, Info, CheckCircle2, AlertTriangle,
  Heart, BrainCircuit, HeartPulse
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, ShieldCheck, Brain, Clock, Trophy, TrendingUp, BookOpen, Star,
  Target, Activity, Heart, Flame, Users, BarChart3, BrainCircuit, HeartPulse,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

// Announcement Banner Component
function AnnouncementBanner({ announcement }: { announcement: any }) {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (announcement?.text) {
      const key = `dismiss_${btoa(announcement.text).slice(0, 16)}`;
      if (sessionStorage.getItem(key)) setDismissed(true);
    }
  }, [announcement?.text]);

  if (!announcement?.enabled || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    if (announcement?.text) {
      const key = `dismiss_${btoa(announcement.text).slice(0, 16)}`;
      sessionStorage.setItem(key, "1");
    }
  };

  const colors: Record<string, string> = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  };
  const icons: Record<string, React.ElementType> = { info: Info, success: CheckCircle2, warning: AlertTriangle };
  const BannerIcon = icons[announcement.type ?? "info"] ?? Info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
        className={`w-full border-b ${colors[announcement.type ?? "info"]} px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-semibold relative`}
        style={{ marginTop: "64px" }} // below navbar
      >
        <BannerIcon className="w-4 h-4 flex-shrink-0" />
        <span dangerouslySetInnerHTML={{ __html: announcement.text ?? "" }} />
        {announcement.dismissible && (
          <button onClick={dismiss} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default function HomepageClient({ cms }: { cms: Record<string, any> }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Only categories are fetched client-side (they change often and are personalized)
  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {})
      .finally(() => setLoadingCategories(false));
  }, []);

  const hero = cms.hero ?? {};
  const stats: any[] = cms.stats ?? [];
  const features: any[] = cms.features ?? [];
  const testimonials: any[] = cms.testimonials ?? [];
  const announcement = cms.announcement;

  const getTextColor = (colorStr: string) => {
    if (!colorStr) return 'text-slate-500';
    if (colorStr.includes('primary')) return 'text-primary-500';
    if (colorStr.includes('rose')) return 'text-rose-500';
    if (colorStr.includes('emerald')) return 'text-emerald-500';
    if (colorStr.includes('amber')) return 'text-amber-500';
    if (colorStr.includes('indigo')) return 'text-indigo-500';
    if (colorStr.includes('teal')) return 'text-teal-500';
    if (colorStr.includes('sky')) return 'text-sky-500';
    if (colorStr.includes('blue')) return 'text-blue-500';
    return 'text-slate-500';
  };

  return (
    <>
      <main className="flex flex-col items-center overflow-hidden relative bg-slate-50 transition-colors duration-300">
        <Navbar />
        <AnnouncementBanner announcement={announcement} />

        {/* ─── HERO SECTION ─── */}
        <section className="w-full relative pt-36 pb-24 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[url('/medical-bg.png')] bg-cover bg-center bg-no-repeat opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/85 to-slate-50" />
          </div>
          <div className="absolute top-40 left-10 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl z-0" />
          <div className="absolute top-60 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl z-0" />

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-100 shadow-sm mb-8 text-sm font-semibold text-primary-700"
            >
              <Flame className="w-4 h-4 text-orange-500" />
              {hero.badge || "India's #1 MCQ Platform for Medical Students"}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-5xl"
            >
              {hero.headline || "Crack Your Medical Exams with"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
                {hero.headlineHighlight || "Daily MCQ Practice"}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed"
              dangerouslySetInnerHTML={{ __html: hero.subtext || "Join <strong>5,000+ medical students</strong> who practice daily on our platform." }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link href="/register">
                <Button variant="primary" size="lg">
                  {hero.ctaPrimary || "Start Practicing Free"} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="glass" size="lg">
                  {hero.ctaSecondary || "Already a member? Login"}
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="mt-4 text-sm text-slate-500"
              dangerouslySetInnerHTML={{ __html: hero.trustLine || "✅ Free to start &nbsp;•&nbsp; ✅ No credit card needed &nbsp;•&nbsp; ✅ Instant access" }}
            />
          </div>
        </section>

        {/* ─── STATS BAR ─── */}
        {stats.length > 0 && (
          <section className="w-full max-w-6xl mx-auto px-4 -mt-2 mb-20 relative z-10">
            <motion.div {...fadeUp()} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                  <p className={`text-3xl font-black ${s.color ?? "text-primary-600"}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </section>
        )}

        {/* ─── CATEGORIES ─── */}
        <section className="w-full max-w-6xl mx-auto px-4 mb-24">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Exam Categories</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Pick Your Stream</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">Whether you&apos;re in Nursing, MBBS, Pharmacy or BDS — we have the right question bank for you.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {loadingCategories ? (
              [...Array(4)].map((_, idx) => (
                <div key={idx} className="border-2 border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-4 text-center bg-white animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-slate-200" />
                  <div className="w-20 h-4 bg-slate-200 rounded mt-2" />
                  <div className="w-24 h-3 bg-slate-100 rounded mt-1" />
                </div>
              ))
            ) : (
              categories.map((cat, idx) => (
                <motion.div key={cat.name} {...fadeUp(0.08 * idx)}>
                  <Link href="/register">
                    <div className={`group border-2 ${cat.color || 'bg-slate-50 border-slate-200'} rounded-2xl p-6 flex flex-col items-center gap-4 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all bg-white`}>
                      <div className="p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                        <CategoryIcon name={cat.icon} className={`w-7 h-7 ${getTextColor(cat.color || '')}`} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{cat.description || 'Practice Questions'}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
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
              <div className="hidden md:block absolute top-14 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-200 to-emerald-200" />
              {[
                { step: "01", icon: <LogIn className="w-6 h-6 text-primary-600" />, title: "Sign Up for Free", desc: "Create your account in under 30 seconds. No credit card required. Instant access to all free practice tests.", color: "bg-primary-50 border-primary-100" },
                { step: "02", icon: <Target className="w-6 h-6 text-emerald-600" />, title: "Pick Your Subject", desc: "Choose from MBBS, Nursing, Pharmacy, BDS, and Paramedical exams. We have daily updated question banks.", color: "bg-emerald-50 border-emerald-100" },
                { step: "03", icon: <BarChart3 className="w-6 h-6 text-amber-600" />, title: "Track & Improve", desc: "Get detailed analytics after every test. Our AI identifies your weak points so you improve faster each day.", color: "bg-amber-50 border-amber-100" },
              ].map((step, i) => (
                <motion.div key={i} {...fadeUp(0.15 * i)} className={`relative border-2 ${step.color} rounded-3xl p-8 text-center`}>
                  <span className="text-6xl font-black text-slate-100 absolute top-4 right-5 leading-none">{step.step}</span>
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-5 mx-auto">{step.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES GRID ─── */}
        {features.length > 0 && (
          <section className="w-full max-w-6xl mx-auto px-4 py-24">
            <motion.div {...fadeUp()} className="text-center mb-14">
              <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Platform Features</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Everything You Need to Succeed</h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">We built Daily Dose MCQ to be the only platform you&apos;ll ever need for medical exam preparation.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => {
                const Icon = ICON_MAP[f.icon] ?? BookOpen;
                return (
                  <motion.div key={i} {...fadeUp(0.08 * i)} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className={`w-5 h-5 ${f.iconColor ?? "text-primary-500"}`} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── TESTIMONIALS ─── */}
        {testimonials.length > 0 && (
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
                      {[...Array(t.rating ?? 5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-200">
                      <div className={`w-10 h-10 rounded-full ${t.avatarColor ?? "bg-primary-500"} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
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
        )}

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
                {["Timer countdown with auto-submit", "Question palette for quick navigation", "Instant result & detailed explanation", "Accuracy & time-per-question breakdown"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/register">
                  <Button variant="primary" size="lg">Try a Free Test Now <ArrowRight className="w-5 h-5" /></Button>
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
                  {[{ opt: "Protein synthesis", correct: true }, { opt: "Lipid storage", correct: false }, { opt: "Energy production", correct: false }, { opt: "DNA replication", correct: false }].map((o, i) => (
                    <div key={i} className={`p-3 rounded-xl border text-sm cursor-pointer transition-colors ${o.correct ? "border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold" : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"}`}>
                      <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{o.opt}
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
          <motion.div {...fadeUp()} className="max-w-4xl mx-auto rounded-3xl overflow-hidden relative text-center" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)" }}>
            <div className="absolute inset-0 bg-[url('/medical-bg.png')] bg-cover opacity-10" />
            <div className="relative px-8 py-16">
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                🎯 Limited Time — Join Free Today
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">Your Exam is Waiting.<br />Are You Ready?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Every topper had a strategy. Yours starts here. Sign up now and take your first test in under 2 minutes.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <button className="px-8 py-4 bg-white text-indigo-700 font-extrabold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-base">Create Free Account →</button>
                </Link>
                <Link href="/login">
                  <button className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-base">Sign In Instead</button>
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
