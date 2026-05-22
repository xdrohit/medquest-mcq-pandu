"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <div className="flex-1 max-w-3xl mx-auto px-6 pt-32 pb-24 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Terms and Conditions</h1>
          <p className="text-sm font-bold text-primary-600 mb-10 uppercase tracking-widest">Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          
          <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
            <p className="leading-relaxed">
              These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Daily Dose MCQ ("we," "us," or "our"), concerning your access to and use of the Daily Dose MCQ website and application (the "Site"). You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms and Conditions.
            </p>
            <p className="leading-relaxed font-semibold text-rose-500 bg-rose-50 p-4 rounded-xl border border-rose-100">
              IF YOU DO NOT AGREE WITH ALL OF THESE TERMS AND CONDITIONS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">1. Intellectual Property Rights</h2>
            <p className="leading-relaxed">
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us. The Content is provided on the Site "AS IS" for your information and personal use only.
            </p>
            <p className="leading-relaxed">
              Specifically, all Multiple Choice Questions (MCQs), test series formats, and proprietary analytics algorithms are the exclusive property of Daily Dose MCQ. You are strictly prohibited from scraping, copying, reproducing, aggregating, republishing, uploading, posting, publicly displaying, encoding, translating, transmitting, distributing, selling, licensing, or otherwise exploiting any part of the Site or Content for any commercial enterprise, without our express prior written permission.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">2. User Representations</h2>
            <p className="leading-relaxed">
              By using the Site, you represent and warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
              <li>You are not a minor in the jurisdiction in which you reside.</li>
              <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
              <li>You will not use the Site for any illegal or unauthorized purpose.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">3. User Registration</h2>
            <p className="leading-relaxed">
              You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">4. Prohibited Activities</h2>
            <p className="leading-relaxed">
              You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Prohibited activities include, but are not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Systematically retrieving data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
              <li>Tricking, defrauding, or misleading us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
              <li>Circumventing, disabling, or otherwise interfering with security-related features of the Site.</li>
              <li>Attempting to manipulate the leaderboard or test results using scripts or external tools.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">5. Modifications and Interruptions</h2>
            <p className="leading-relaxed">
              We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">6. Limitation of Liability</h2>
            <p className="leading-relaxed">
              In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the Site, even if we have been advised of the possibility of such damages.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">7. Contact Information</h2>
            <p className="leading-relaxed">
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at support@dailydosemcq.com.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Simple Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 px-6 text-center text-sm text-slate-500 mt-auto">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/about" className="hover:text-primary-600 transition-colors">About Us</Link>
          <Link href="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary-600 transition-colors">Terms & Conditions</Link>
        </div>
        <p>© {new Date().getFullYear()} Daily Dose MCQ. All rights reserved.</p>
      </footer>
    </main>
  );
}
