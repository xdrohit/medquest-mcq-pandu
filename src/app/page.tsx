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
    <main className="flex min-h-screen flex-col items-center pt-24 pb-12 px-4 overflow-hidden relative">
      <Navbar />

      {/* Decorative background elements */}
      <div className="absolute top-40 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-60 right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <section className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-sm font-medium text-primary-700 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-accent-500 animate-pulse"></span>
          Next-Generation AI Learning Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl"
        >
          Master Your <span className="text-gradient">Medical Exams</span> With AI-Powered Precision
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl"
        >
          An immersive, distraction-free MCQ platform designed specifically for Nursing, MBBS, BDS, and Pharmacy students.
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
              <GlassCard hoverEffect className="flex flex-col items-center justify-center p-8 gap-4 text-center cursor-pointer group">
                <div className="p-4 rounded-2xl bg-slate-50/50 group-hover:bg-white/80 transition-colors shadow-sm">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800">{cat.name}</h3>
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Distraction-Free, <span className="text-gradient">Lightning Fast</span> Performance
            </h2>
            <p className="text-slate-600 text-lg mb-8">
              Our interface is meticulously crafted to keep you focused. No clutter, just pure performance and intelligent analytics to track your growth.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600"><Zap className="w-5 h-5" /></div>
                Real-time performance analytics
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="p-2 rounded-lg bg-accent-100 text-accent-600"><ShieldCheck className="w-5 h-5" /></div>
                Verified questions by top educators
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600"><Brain className="w-5 h-5" /></div>
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
            <GlassCard className="absolute inset-0 m-auto w-4/5 h-4/5 flex flex-col p-6 shadow-2xl z-20" hoverEffect>
               <div className="w-full flex justify-between items-center mb-6">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400" />
                   <div className="w-3 h-3 rounded-full bg-yellow-400" />
                   <div className="w-3 h-3 rounded-full bg-green-400" />
                 </div>
                 <span className="text-sm font-medium text-slate-500">Live Exam View</span>
               </div>
               <h4 className="text-lg font-semibold text-slate-800 mb-4">Q. What is the primary function of ribosomes?</h4>
               <div className="space-y-3">
                 {['Protein synthesis', 'Lipid storage', 'Energy production', 'DNA replication'].map((opt, i) => (
                   <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white/50 text-slate-700 text-sm hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer">
                     {opt}
                   </div>
                 ))}
               </div>
               <div className="mt-auto pt-4 border-t border-slate-200/50 flex justify-between items-center">
                 <span className="text-sm font-bold text-accent-600">01:45 remaining</span>
                 <Button variant="primary" size="sm">Next</Button>
               </div>
            </GlassCard>
            
            {/* Decorative blurred back card */}
            <div className="absolute inset-0 m-auto w-4/5 h-4/5 bg-gradient-to-tr from-primary-200 to-accent-200 rounded-[1.5rem] blur-xl opacity-60 z-10 translate-x-4 translate-y-4" />
          </motion.div>
        </div>
      </section>

    </main>
  );
}
