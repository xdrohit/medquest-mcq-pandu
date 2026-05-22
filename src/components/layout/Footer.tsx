"use client";

import React from "react";
import Link from "next/link";
import { Activity, Mail, Phone, MapPin, ChevronRight, Globe, Share2 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 relative z-20 transition-colors duration-300 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">Daily Dose MCQ</span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Empowering medical students with AI-driven analytics, professional test conduction, and a premium learning experience tailored for excellence.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-2 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-primary-600 transition-colors" /> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-2 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-primary-600 transition-colors" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-2 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-primary-600 transition-colors" /> Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-2 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-primary-600 transition-colors" /> Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-2 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-primary-600 transition-colors" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-2 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-primary-600 transition-colors" /> Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-500 mt-0.5" />
                <span className="text-sm text-slate-600 dark:text-slate-400">support@dailydosemcq.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-500 mt-0.5" />
                <span className="text-sm text-slate-600 dark:text-slate-400">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Medical Hub, Innovation Center<br/>New Delhi, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Daily Dose MCQ. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Crafted with <span className="text-rose-500 text-lg leading-none">♥</span> for medical professionals.
          </p>
        </div>

      </div>
    </footer>
  );
}
