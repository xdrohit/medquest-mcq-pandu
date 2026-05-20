"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { CreditCard, Search, ArrowUpRight, DollarSign } from "lucide-react";
import Link from "next/link";

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");

  // Mock data for UI demonstration
  const transactions = [
    { id: "txn_101", student: "Sarah Connor", item: "Mastering Clinical Anatomy", amount: "$49.99", date: "Oct 12, 2026", status: "Successful" },
    { id: "txn_102", student: "John Doe", item: "Pharmacology Crash Course", amount: "$29.99", date: "Oct 10, 2026", status: "Successful" },
    { id: "txn_103", student: "Emily Chen", item: "Fundamentals of Nursing", amount: "$59.99", date: "Oct 09, 2026", status: "Refunded" },
  ];

  return (
    <main className="min-h-screen bg-slate-900 p-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link href="/admin" className="text-primary-400 hover:text-primary-300 text-sm mb-2 inline-block">← Back to Dashboard</Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <CreditCard className="text-green-500" /> Payment History
            </h1>
            <p className="text-slate-400 mt-1">Track platform revenue and student course purchases.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-green-500/20 text-green-400 rounded-xl"><DollarSign className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-slate-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">$12,450.00</p>
              </div>
            </div>
            <p className="text-xs text-green-400 flex items-center mt-4"><ArrowUpRight className="w-3 h-3 mr-1" /> +14% this month</p>
          </GlassCard>
        </div>

        <GlassCard className="bg-slate-800/50 border-slate-700 p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700">
                  <th className="p-4 text-sm font-semibold text-slate-300">Transaction ID</th>
                  <th className="p-4 text-sm font-semibold text-slate-300">Student</th>
                  <th className="p-4 text-sm font-semibold text-slate-300">Purchased Item</th>
                  <th className="p-4 text-sm font-semibold text-slate-300">Amount</th>
                  <th className="p-4 text-sm font-semibold text-slate-300">Date</th>
                  <th className="p-4 text-sm font-semibold text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="p-4 text-slate-400 font-mono text-sm">{txn.id}</td>
                    <td className="p-4 font-medium text-white">{txn.student}</td>
                    <td className="p-4 text-slate-300">{txn.item}</td>
                    <td className="p-4 font-bold text-white">{txn.amount}</td>
                    <td className="p-4 text-slate-400 text-sm">{txn.date}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${txn.status === 'Successful' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
