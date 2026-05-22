"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, HeartPulse, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto px-6 pt-32 pb-24 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">About Us</h1>
          
          <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
            <p className="text-xl leading-relaxed font-medium text-slate-700">
              Welcome to <strong className="text-primary-600">Daily Dose MCQ</strong>, the premier platform dedicated to empowering medical professionals, nursing students, and healthcare practitioners across the globe. Our mission is to transform the way medical students prepare for their crucial examinations through intelligent, high-quality, and accessible assessment tools.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <HeartPulse className="w-8 h-8 text-rose-500 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Our Passion</h3>
                <p className="text-sm text-slate-600">Driven by a deep passion for healthcare education, we strive to make learning engaging and effective for every student.</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <BrainCircuit className="w-8 h-8 text-primary-500 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Learning</h3>
                <p className="text-sm text-slate-600">We utilize data-driven insights and AI analytics to help you identify your weak points and improve your knowledge retention.</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Quality Content</h3>
                <p className="text-sm text-slate-600">Every single question is curated, reviewed, and verified by top medical educators to ensure the highest standards of accuracy.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Our Vision</h2>
            <p className="leading-relaxed">
              We envision a world where every medical student—whether pursuing their MBBS, BDS, Nursing, Pharmacy, or Paramedical studies—has access to a world-class testing environment. Traditional test series are often cluttered, outdated, and uninspiring. We set out to change that by building an interface that mimics real-world medical testing environments while remaining clean, fast, and completely distraction-free. We believe that a premium user experience directly contributes to better learning outcomes and reduced exam anxiety.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Why Choose Daily Dose MCQ?</h2>
            <p className="leading-relaxed">
              Medical entrance exams and professional licensing tests are among the most competitive in the world. Success requires more than just reading textbooks; it requires active recall, strategic practice, and continuous self-assessment. That is exactly what we provide. Our dynamic gamified analytics, speed vs. accuracy matrices, and topic-wise weakness identifiers ensure that you are not just taking tests blindly, but actually learning and improving with every single attempt. We are more than just a test platform—we are your daily companion in your journey towards medical excellence.
            </p>

            <p className="leading-relaxed">
              Join thousands of other students who have already trusted Daily Dose MCQ to guide their preparation. Start practicing today, track your growth, and confidently take the next step in your medical career.
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
