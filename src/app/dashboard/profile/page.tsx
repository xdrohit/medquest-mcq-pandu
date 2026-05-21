"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // In a real app, you would fetch the user profile from /api/auth/me
    // Since we store basic info in the JWT cookie (which is http-only),
    // the backend route /api/auth/me needs to return the decoded user.
    // For now, we mock the fetch or expect a future API integration.
    setUser({
      name: "Student Profile",
      email: "student@dailydosemcq.com",
      role: "student",
      lastLogin: new Date().toLocaleDateString()
    });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden bg-slate-50">
      <Navbar />
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary-200/40 to-transparent pointer-events-none -z-10 rounded-full blur-[100px]" />

      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Identity</h1>
          <p className="text-slate-500 mt-2">Manage your Daily Dose MCQ profile and security settings.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <GlassCard className="text-center p-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white shadow-xl mb-4 relative">
                <User className="w-10 h-10" />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-4 border-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Loading...'}</h2>
              <p className="text-sm text-primary-600 font-medium capitalize">{user?.role}</p>
              
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
                <Button onClick={handleLogout} variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" /> End Session
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Settings Details */}
          <div className="md:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className="p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" /> Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm text-slate-500 font-medium">Full Name</label>
                      <input type="text" defaultValue={user?.name} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-slate-500 font-medium">Email Address</label>
                      <input type="email" defaultValue={user?.email} disabled className="w-full bg-slate-100 border border-slate-200 text-slate-400 rounded-xl px-4 py-2 cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button variant="primary">Update Profile</Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <GlassCard className="p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent-500" /> Security
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm text-slate-500 font-medium">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-slate-500 font-medium">Confirm Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent-500 outline-none" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Last login recorded on {user?.lastLogin}</p>
                  <div className="pt-4 flex justify-end">
                    <Button variant="secondary" className="border-accent-200 text-accent-600 hover:bg-accent-50 hover:border-accent-300">Change Password</Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
