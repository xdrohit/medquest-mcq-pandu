"use client";

import React from "react";
import Link from "next/link";
import { Activity, Mail, Phone, MapPin, ChevronRight, ExternalLink } from "lucide-react";

// ✅ Replace this with your actual Instagram username
const INSTAGRAM_HANDLE = "docmcq";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`;

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-10 relative z-20 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6">

        {/* ─── Instagram CTA Banner ─── */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block w-full rounded-3xl mb-16 overflow-hidden relative cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
          }}
        >
          {/* Shimmer animation overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-8 md:px-12">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
                <InstagramIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-1">Follow us on Instagram</p>
                <p className="text-white font-extrabold text-2xl md:text-3xl tracking-tight">@{INSTAGRAM_HANDLE}</p>
                <p className="text-white/70 text-sm mt-1">Daily MCQs, Exam Tips &amp; Medical Reels 🩺</p>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 bg-white text-pink-600 font-bold px-6 py-3 rounded-xl group-hover:scale-105 transition-transform shadow-lg">
              <InstagramIcon className="w-4 h-4" />
              Follow Now
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </a>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">Daily Dose MCQ</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Empowering medical students with AI-driven analytics, professional test conduction, and a premium learning experience tailored for excellence.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-pink-500 hover:text-pink-600 transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
              @{INSTAGRAM_HANDLE}
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/dashboard", label: "Student Dashboard" },
                { href: "/login", label: "Login / Register" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-500 hover:text-primary-600 text-sm flex items-center gap-2 transition-colors group">
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-primary-600 transition-colors" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-4">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms & Conditions" },
                { href: "/about", label: "About Us" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-500 hover:text-primary-600 text-sm flex items-center gap-2 transition-colors group">
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-primary-600 transition-colors" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Connect With Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-500">support@dailydosemcq.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-500">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-500">Medical Hub, Innovation Center<br />New Delhi, India</span>
              </li>
              <li className="flex items-start gap-3">
                <InstagramIcon className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-pink-500 transition-colors">
                  instagram.com/{INSTAGRAM_HANDLE}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © {currentYear} Daily Dose MCQ. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm flex items-center gap-1.5">
            Crafted with <span className="text-rose-500 text-base leading-none">♥</span> for medical professionals
          </p>
        </div>

      </div>
    </footer>
  );
}
