"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqClient({ faq }: { faq: any[] }) {
  const faqs = Array.isArray(faq) ? faq : [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 max-w-3xl mx-auto px-6 pt-32 pb-24 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-3">
            <HelpCircle className="w-7 h-7 text-primary-600" />
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest">Help Center</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">Frequently Asked Questions</h1>
          <p className="text-slate-500 mb-12">Everything you need to know about Daily Dose MCQ. Can&apos;t find your answer? Contact us anytime.</p>

          <div className="space-y-3">
            {faqs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-slate-900 hover:text-primary-600 transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 text-primary-500 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-slate-600 leading-relaxed text-sm">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
