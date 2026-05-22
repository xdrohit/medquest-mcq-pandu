"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <div className="flex-1 max-w-3xl mx-auto px-6 pt-32 pb-24 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-sm font-bold text-primary-600 mb-10 uppercase tracking-widest">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          
          <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
            <p className="leading-relaxed">
              At Daily Dose MCQ, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">1. Information We Collect</h2>
            <p className="leading-relaxed">
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and educational background, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
              <li><strong>Performance Data:</strong> We collect and store the results of the multiple-choice questions you answer, including your score, the time taken to complete tests, and your specific right/wrong answers to generate your performance analytics.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">2. Use of Your Information</h2>
            <p className="leading-relaxed">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create and manage your account.</li>
              <li>Generate personalized analytics, performance matrices, and weakness identifiers to aid your studies.</li>
              <li>Compile anonymous statistical data and analysis for use internally or with third parties to improve our testing algorithms.</li>
              <li>Deliver targeted updates, newsletters, and other information regarding the platform.</li>
              <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">3. Disclosure of Your Information</h2>
            <p className="leading-relaxed">
              We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information. We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            <p className="leading-relaxed">
              <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">4. Security of Your Information</h2>
            <p className="leading-relaxed">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">5. Policy for Children</h2>
            <p className="leading-relaxed">
              We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us immediately.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">6. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions or comments about this Privacy Policy, please contact us at privacy@dailydosemcq.com. We are committed to resolving your concerns promptly and ensuring that your data remains safe and secure with us.
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
