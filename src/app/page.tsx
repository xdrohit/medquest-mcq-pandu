"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Stethoscope, Pill, Activity, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export default function HomePage() {
  const categories = [
    { name: "MBBS", icon: <Brain className="w-8 h-8 text-primary-500" /> },
    { name: "Nursing", icon: <Stethoscope className="w-8 h-8 text-accent-500" /> },
    { name: "Pharmacy", icon: <Pill className="w-8 h-8 text-primary-400" /> },
    { name: "Paramedical", icon: <Activity className="w-8 h-8 text-accent-400" /> },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center pt-24 pb-12 px-4 overflow-hidden relative transition-colors duration-300">
      <Navbar />

      {/* Cinematic Medical Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* The medical image we generated */}
        <div className="absolute inset-0 bg-[url('/medical-bg.png')] bg-cover bg-center bg-no-repeat opacity-60 dark:opacity-20 transition-opacity duration-300" />
        {/* Gradient overlays to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-slate-50 dark:from-slate-950/80 dark:via-slate-950/95 dark:to-slate-950 transition-colors duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-transparent dark:from-slate-950/90 dark:via-transparent dark:to-transparent transition-colors duration-300" />
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-40 left-20 w-72 h-72 bg-primary-400/30 dark:bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute top-60 right-20 w-96 h-96 bg-accent-400/30 dark:bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow z-0" style={{ animationDelay: '2s' }} />


      <section className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-sm font-medium text-primary-700 dark:text-primary-300 shadow-sm dark:shadow-none"
        >
          <span className="flex h-2 w-2 rounded-full bg-accent-500 animate-pulse"></span>
          Daily Dose MCQ • Professional Test Conductors
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-5xl transition-colors"
        >
          Your Daily Dose of Excellence: <span className="text-gradient">Premium Medical Tests</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl transition-colors leading-relaxed"
        >
          We conduct high-quality, professional MCQ tests designed specifically for Nursing, MBBS, BDS, and Pharmacy students. Join thousands of students practicing daily to guarantee their success.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Button variant="primary" size="lg">
            Start Practice Now <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="glass" size="lg">
            Explore Exams
          </Button>
        </motion.div>
      </section>

      {/* Floating 3D Elements Section */}
      <section className="w-full max-w-6xl mx-auto mt-24 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
            >
              <GlassCard hoverEffect className="flex flex-col items-center justify-center p-8 gap-4 text-center cursor-pointer group border-slate-200/60 dark:border-slate-700/50">
                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 group-hover:bg-white/80 dark:group-hover:bg-slate-700/80 transition-colors shadow-sm dark:shadow-none">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 transition-colors">{cat.name}</h3>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto mt-32 relative z-10 mb-20">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">
              We Conduct The <span className="text-gradient">Most Realistic</span> MCQ Exams
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 transition-colors">
              Our interface is meticulously crafted to mimic real-world medical testing environments. No clutter, just pure performance, verified questions, and intelligent analytics to track your growth daily.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium transition-colors">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400"><Zap className="w-5 h-5" /></div>
                Real-time performance analytics
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium transition-colors">
                <div className="p-2 rounded-lg bg-accent-100 text-accent-600 dark:bg-accent-500/20 dark:text-accent-400"><ShieldCheck className="w-5 h-5" /></div>
                Verified questions by top educators
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium transition-colors">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400"><Brain className="w-5 h-5" /></div>
                AI-driven weak-point analysis
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[500px]"
          >
            <GlassCard className="absolute inset-0 m-auto w-4/5 h-4/5 flex flex-col p-6 shadow-2xl dark:shadow-none z-20 border-white/60 dark:border-slate-700/60" hoverEffect>
               <div className="w-full flex justify-between items-center mb-6">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400" />
                   <div className="w-3 h-3 rounded-full bg-yellow-400" />
                   <div className="w-3 h-3 rounded-full bg-green-400" />
                 </div>
                 <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Live Exam View</span>
               </div>
               <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 transition-colors">Q. What is the primary function of ribosomes?</h4>
               <div className="space-y-3">
                 {['Protein synthesis', 'Lipid storage', 'Energy production', 'DNA replication'].map((opt, i) => (
                   <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors cursor-pointer">
                     {opt}
                   </div>
                 ))}
               </div>
               <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center transition-colors">
                 <span className="text-sm font-bold text-accent-600 dark:text-accent-400">01:45 remaining</span>
                 <Button variant="primary" size="sm">Next</Button>
               </div>
            </GlassCard>
            
            {/* Decorative blurred back card */}
            <div className="absolute inset-0 m-auto w-4/5 h-4/5 bg-gradient-to-tr from-primary-200 to-accent-200 dark:from-primary-900/50 dark:to-accent-900/50 rounded-[1.5rem] blur-xl opacity-60 z-10 translate-x-4 translate-y-4" />
          </motion.div>
        </div>
      </section>

    </main>
  );
}
