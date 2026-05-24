"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, HeartPulse, BrainCircuit, Heart, BookOpen, Star, Activity } from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck, HeartPulse, BrainCircuit, Heart, BookOpen, Star, Activity
};

export default function AboutClient({ about }: { about: any }) {
  const d = about ?? {};
  const cards: any[] = d.cards ?? [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-6 pt-32 pb-24 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            {d.title ?? "About Us"}
          </h1>

          <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
            <p className="text-xl leading-relaxed font-medium text-slate-700"
              dangerouslySetInnerHTML={{ __html: d.intro ?? "" }} />

            {cards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                {cards.map((card: any, i: number) => {
                  const Icon = ICON_MAP[card.icon] ?? ShieldCheck;
                  return (
                    <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                      <Icon className={`w-8 h-8 ${card.iconColor ?? "text-primary-500"} mb-4`} />
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                      <p className="text-sm text-slate-600">{card.desc}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {d.vision && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Our Vision</h2>
                <p className="leading-relaxed">{d.vision}</p>
              </>
            )}
            {d.whyChoose && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Why Choose Daily Dose MCQ?</h2>
                <p className="leading-relaxed">{d.whyChoose}</p>
              </>
            )}
            {d.closing && (
              <p className="leading-relaxed">{d.closing}</p>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
