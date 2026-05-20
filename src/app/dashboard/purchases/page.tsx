"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PurchasesPage() {
  const purchases = [
    {
      id: "ord_1",
      title: "Mastering Clinical Anatomy",
      date: "Oct 12, 2026",
      status: "Active",
      price: "$49.99"
    },
    {
      id: "ord_2",
      title: "Pharmacology Crash Course",
      date: "Sep 05, 2026",
      status: "Completed",
      price: "$29.99"
    }
  ];

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden bg-slate-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <ShoppingBag className="text-primary-500" /> My Purchases
            </h1>
            <p className="text-slate-500 mt-1">Manage your active course subscriptions and transaction history.</p>
          </div>
          <Button variant="secondary" className="hidden md:flex">Browse Catalog</Button>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {purchases.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg transition-shadow">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">Purchased on {item.date} • Transaction ID: {item.id}</p>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="text-right flex-grow md:flex-grow-0">
                    <p className="text-2xl font-black text-slate-900">{item.price}</p>
                  </div>
                  <Button variant="primary" className="whitespace-nowrap">
                    View Course <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
          
          <GlassCard className="p-8 text-center bg-primary-50/50 border-primary-100 mt-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Looking for more modules?</h3>
            <p className="text-slate-600 mb-6">Explore our extensive catalog of AI-curated medical examinations.</p>
            <Button variant="primary">Explore Catalog <ExternalLink className="w-4 h-4 ml-2" /></Button>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
