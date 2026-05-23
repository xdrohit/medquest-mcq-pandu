"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Play, BookOpen, Activity, Target,
  ChevronRight, Trophy, TrendingUp, AlertTriangle, CheckCircle2, Clock, Zap, Flame, Award, BarChart3, Shield, ArrowLeft
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<"available" | "analytics">("available");
  const [exams, setExams] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  // Separate states so name shows INSTANTLY from JWT, stats come later
  const [authUser, setAuthUser] = useState<{ name: string; role: string } | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [generatingMock, setGeneratingMock] = useState(false);
  const router = useRouter();

  const updateUrl = (catId: string | null, subId: string | null) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (catId) url.searchParams.set('category', catId);
    else url.searchParams.delete('category');
    
    if (subId) url.searchParams.set('sub', subId);
    else url.searchParams.delete('sub');

    window.history.replaceState({}, '', url.toString());
  };

  useEffect(() => {
    const ts = Date.now();

    // ── STEP 1: Instant auth (JWT decode, no DB) ──────────────────────────
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => { if (d?.user) setAuthUser(d.user); })
      .catch(() => {});

    // ── STEP 2 & 3: Stats + Exams in parallel (DB calls) ─────────────────
    Promise.all([
      fetch(`/api/user/profile?t=${ts}`, { cache: "no-store" }),
      fetch(`/api/exams?t=${ts}`, { cache: "no-store" }),
      fetch(`/api/categories?t=${ts}`, { cache: "no-store" }),
    ])
      .then(async ([profileRes, examsRes, categoriesRes]) => {
        if (profileRes.ok) {
          const pd = await profileRes.json();
          setStats(pd?.stats ?? {});
          // Also update name from DB in case JWT is slightly stale
          if (pd?.user?.name) setAuthUser(prev => ({ ...prev!, name: pd.user.name }));
        } else {
          setStats({});
        }
        if (examsRes.ok) {
          const ed = await examsRes.json();
          setExams(Array.isArray(ed) ? ed : []);
        }
        if (categoriesRes?.ok) {
          const cd = await categoriesRes.json();
          const cats = Array.isArray(cd) ? cd : [];
          setCategories(cats);

          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const catId = params.get('category');
            const subId = params.get('sub');
            if (catId) {
              const matchedCat = cats.find((c: any) => c._id === catId);
              if (matchedCat) {
                setSelectedCategory(matchedCat);
                if (subId) setSelectedSubCategory(subId);
              }
            }
          }
        }
      })
      .catch(() => setStats({}))
      .finally(() => setStatsLoading(false));
  }, []);

  // Pre-compute values (always safe after statsLoading=false)
  const totalExams    = stats?.totalExams   ?? 0;
  const avgScore      = stats?.averageScore ?? 0;
  const avgTime       = stats?.averageTimeSeconds ?? 0;
  const weakTopics: string[] = stats?.topWeakTopics ?? [];
  const recentResults: any[] = stats?.recentResults  ?? [];
  const firstName = authUser?.name?.split(" ")[0] || "Student";

  // Gamification logic
  const isSpeedDemon = avgTime > 0 && avgTime < 45; // Under 45s per question
  const isAccuracyKing = avgScore >= 80;
  
  let performanceText = "Keep practicing to establish a baseline.";
  if (totalExams > 0) {
    if (isSpeedDemon && isAccuracyKing) performanceText = "Elite Performance: Extremely fast and highly accurate.";
    else if (isSpeedDemon && !isAccuracyKing) performanceText = "You are fast, but accuracy is suffering. Slow down.";
    else if (!isSpeedDemon && isAccuracyKing) performanceText = "Great accuracy, but try to improve your speed.";
    else performanceText = "Work on both speed and accuracy. Focus on weak concepts.";
  }

  const handleQuickPractice = async () => {
    if (!selectedCategory) return;
    setGeneratingMock(true);
    try {
      const res = await fetch("/api/exams/quick-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: selectedCategory._id,
          subCategory: selectedSubCategory || "All"
        })
      });
      const data = await res.json();
      if (res.ok && data.examId) {
        router.push(`/exam/${data.examId}`);
      } else {
        alert(data.error || "Failed to generate mock test.");
        setGeneratingMock(false);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
      setGeneratingMock(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-20 pb-12 overflow-hidden selection:bg-primary-500/30 transition-colors duration-300">
      <Navbar />
      
      {/* Background Holographic Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-gradient-to-b from-primary-900/10 dark:from-primary-900/20 via-primary-900/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Welcome Hero & Gamification */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm dark:shadow-none"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">{firstName}</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">Your AI medical training program is ready. Continue practicing to dominate your exams.</p>
              
              <div className="flex flex-wrap gap-4">
                {statsLoading ? (
                  <Button variant="primary" disabled className="rounded-xl px-6 py-3 font-bold opacity-70 cursor-wait">
                    Loading... <span className="ml-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  </Button>
                ) : exams.length > 0 ? (
                  <Link href={`/exam/${exams[0]._id}`}>
                    <Button variant="primary" className="shadow-lg shadow-primary-500/20 rounded-xl px-6 py-3 font-bold">
                      Resume Training <Play className="w-4 h-4 ml-2 fill-current" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="primary" disabled className="rounded-xl px-6 py-3 font-bold">
                    No active tests <Play className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-4"
          >
            {/* Tests Completed Card */}
            <div className="flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-emerald-500/50 transition-colors shadow-sm dark:shadow-none">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mb-2" />
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {statsLoading ? <span className="inline-block w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" /> : totalExams}
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Tests Completed</div>
            </div>
            {/* Avg Score Card */}
            <div className="flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary-500/50 transition-colors shadow-sm dark:shadow-none">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Target className="w-8 h-8 text-primary-500 mb-2" />
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {statsLoading ? <span className="inline-block w-12 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" /> : `${avgScore}%`}
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Avg Score</div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-fit shadow-sm dark:shadow-none">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "available" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            Available Tests
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "analytics" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            My Analytics
          </button>
        </div>

        {/* Available Tests / Categories Grid */}
        {activeTab === "available" && selectedCategory === null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsLoading ? (
              // Skeleton Loaders
              [1, 2, 3].map((n) => (
                <div key={n} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full shadow-sm dark:shadow-none animate-pulse">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  </div>
                  <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
                  <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded-lg mb-8" />
                  <div className="w-full h-12 bg-slate-200 dark:bg-slate-800 rounded-xl mt-auto" />
                </div>
              ))
            ) : categories.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400">No categories found</h3>
              </div>
            ) : (
              categories.map((cat, idx) => {
                // Use the accurate mcqCount from the API
                const catExams = exams.filter(e => e.category === cat.name);
                const mcqCount = cat.mcqCount || 0;
                
                return (
                  <motion.div
                    key={cat._id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    onClick={() => { setSelectedCategory(cat); setSelectedSubCategory(null); updateUrl(cat._id, null); }}
                    className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:border-primary-500/50 transition-all hover:shadow-2xl hover:shadow-primary-500/10 flex flex-col h-full shadow-sm dark:shadow-none cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${cat.color || 'bg-primary-50 border-primary-200 border-2'} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <CategoryIcon name={cat.icon || 'BookOpen'} className={`w-7 h-7 ${cat.color ? '' : 'text-primary-500'}`} />
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                        {catExams.length} Tests
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{cat.name}</h3>
                    <p className="text-slate-500 text-sm mb-8 flex-grow">
                      {cat.description || "Practice Questions"}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                         <BookOpen className="w-4 h-4" /> {mcqCount} MCQs
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white text-slate-400 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {/* Exams List / Subcategories for Selected Category */}
        {activeTab === "available" && selectedCategory !== null && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => {
                  if (selectedSubCategory) {
                    setSelectedSubCategory(null);
                    updateUrl(selectedCategory._id, null);
                  } else {
                    setSelectedCategory(null);
                    updateUrl(null, null);
                  }
                }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CategoryIcon name={selectedCategory.icon || 'BookOpen'} className="w-6 h-6 text-primary-500" />
                  {selectedCategory.name} {selectedSubCategory && selectedSubCategory !== "All" && `> ${selectedSubCategory}`}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Select a test to start your mission</p>
              </div>
            </div>

            {selectedCategory.subCategories?.length > 0 && selectedSubCategory === null ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCategory.subCategories.map((sub: string, idx: number) => (
                  <motion.div
                    key={sub}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    onClick={() => { setSelectedSubCategory(sub); updateUrl(selectedCategory._id, sub); }}
                    className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:border-primary-500/50 transition-all hover:shadow-2xl hover:shadow-primary-500/10 flex flex-col justify-center items-center h-40 shadow-sm dark:shadow-none cursor-pointer text-center relative overflow-hidden"
                  >
                    <div className="absolute top-3 right-3 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {selectedCategory.subCategoryCounts?.[sub] || 0} MCQs
                    </div>
                    <BookOpen className="w-8 h-8 text-primary-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{sub}</h3>
                  </motion.div>
                ))}
                {/* View All Option */}
                <motion.div
                  onClick={() => { setSelectedSubCategory("All"); updateUrl(selectedCategory._id, "All"); }}
                  className="group rounded-3xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 p-6 hover:border-primary-500/50 transition-all hover:shadow-2xl hover:shadow-primary-500/10 flex flex-col justify-center items-center h-40 shadow-sm dark:shadow-none cursor-pointer text-center"
                >
                  <ChevronRight className="w-8 h-8 text-primary-500 mb-3 group-hover:translate-x-2 transition-transform" />
                  <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 leading-tight">View All Tests</h3>
                </motion.div>
              </div>
            ) : (
              <div>
                <div className="flex justify-end mb-6">
                  <Button 
                    onClick={handleQuickPractice} 
                    disabled={generatingMock}
                    className="bg-accent-500 hover:bg-accent-600 text-white rounded-xl py-2 px-6 font-bold flex items-center gap-2 shadow-lg shadow-accent-500/20"
                  >
                    {generatingMock ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
                    ) : (
                      <><Zap className="w-5 h-5" /> Quick Practice (20 MCQs)</>
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exams.filter(e => e.category === selectedCategory.name && (!selectedSubCategory || selectedSubCategory === "All" || e.subCategory === selectedSubCategory)).length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                      <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400">No official tests available in this category.</h3>
                      <p className="text-slate-500 mt-2">Use the Quick Practice button above to generate a mock test from the Question Bank!</p>
                    </div>
                  ) : (
                    exams.filter(e => e.category === selectedCategory.name && (!selectedSubCategory || selectedSubCategory === "All" || e.subCategory === selectedSubCategory)).map((exam, idx) => (
                  <motion.div
                    key={exam._id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:border-primary-500/50 transition-all hover:shadow-2xl hover:shadow-primary-500/10 flex flex-col h-full shadow-sm dark:shadow-none"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                        <BookOpen className="w-3.5 h-3.5" /> {exam.questionCount || 0} MCQs
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5" /> {exam.durationMinutes}m
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{exam.title}</h3>
                    <p className="text-slate-500 text-sm mb-8 flex-grow line-clamp-2">
                      {exam.description || `Comprehensive mock exam covering key concepts for your medical preparation.`}
                    </p>
                    <Link href={`/exam/${exam._id}`}>
                      <Button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-primary-600 dark:hover:bg-primary-600 text-slate-900 dark:text-white hover:text-white rounded-xl py-3 transition-colors border border-slate-200 dark:border-slate-700 hover:border-primary-500 group-hover:bg-primary-600 group-hover:text-white font-bold">
                        Start Mission <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Top Stats - Glowing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none overflow-hidden transition-all hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 dark:opacity-5 dark:group-hover:opacity-20 transition-opacity duration-500 ${avgScore >= 80 ? 'from-emerald-500' : avgScore >= 50 ? 'from-amber-500' : 'from-red-500'}`} />
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className={`p-2.5 rounded-xl ${avgScore >= 80 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : avgScore >= 50 ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300">Average Score</h3>
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10">
                  {statsLoading ? <span className="inline-block w-20 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" /> : `${avgScore}%`}
                </div>
              </div>
              <div className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none overflow-hidden transition-all hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-transparent opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500" />
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"><CheckCircle2 className="w-5 h-5" /></div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300">Tests Completed</h3>
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10">
                  {statsLoading ? <span className="inline-block w-12 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" /> : totalExams}
                </div>
              </div>
              <div className="group relative rounded-3xl bg-gradient-to-br from-indigo-900/90 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden transition-all hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-transparent to-transparent opacity-50 mix-blend-overlay" />
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-yellow-500/20 blur-3xl rounded-full pointer-events-none" />
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"><Award className="w-5 h-5" /></div>
                  <h3 className="font-bold text-indigo-100">Global Rank</h3>
                </div>
                <div className="text-4xl font-black text-white relative z-10 flex items-baseline gap-2">
                  #42 <span className="text-sm font-medium text-indigo-300">Top 5%</span>
                </div>
              </div>
            </div>

            {/* Gamification / Performance Matrix */}
            {!statsLoading && totalExams > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Performance Matrix</h3>
                    <p className="font-bold text-slate-900 dark:text-white">{performanceText}</p>
                  </div>
                  <BarChart3 className={`w-8 h-8 opacity-20 ${isAccuracyKing ? 'text-emerald-500' : 'text-amber-500'}`} />
                </div>
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Earned Badges</h3>
                  <div className="flex gap-3">
                    {isAccuracyKing ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 text-xs font-bold"><Target className="w-3.5 h-3.5" /> Accuracy King</div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500 text-xs font-bold grayscale"><Target className="w-3.5 h-3.5" /> Accuracy King</div>
                    )}
                    {isSpeedDemon ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400 text-xs font-bold"><Zap className="w-3.5 h-3.5" /> Speed Demon</div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500 text-xs font-bold grayscale"><Zap className="w-3.5 h-3.5" /> Speed Demon</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weak Topics AI Analysis (Upgraded) */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"><AlertTriangle className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">AI Weakness Analysis</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Topics needing immediate attention</p>
                  </div>
                </div>
                
                {weakTopics.length > 0 ? (
                  <div className="space-y-4">
                    {weakTopics.map((topic: string, i: number) => {
                      // Mock severity based on index (index 0 is most frequent weakness)
                      const severity = 100 - (i * 15);
                      return (
                      <div key={i} className="group flex flex-col p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-red-200 dark:hover:border-red-500/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{topic}</span>
                          <Button variant="ghost" className="h-7 px-3 text-[10px] uppercase font-bold tracking-wider rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border-none transition-colors opacity-0 group-hover:opacity-100">Practice</Button>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                          <div className={`h-full rounded-full transition-all duration-1000 ${severity > 80 ? 'bg-red-500' : severity > 50 ? 'bg-amber-500' : 'bg-primary-500'}`} style={{ width: `${severity}%` }} />
                        </div>
                      </div>
                    )})}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Shield className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No severe weaknesses detected yet.</p>
                  </div>
                )}
              </div>

              {/* Recent History (Upgraded) */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-sm dark:shadow-none">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" /> Recent Battles
                  </h3>
                  {/* Mini Sparkline indicator */}
                  <div className="flex items-end gap-1 h-6">
                    {recentResults.slice(0, 5).reverse().map((r: any, i: number) => {
                      const hPct = Math.max(10, Math.round((r.score / r.totalQuestions) * 100));
                      return (
                        <div key={i} className="w-2 rounded-t-sm bg-primary-500/30 dark:bg-primary-500/50 hover:bg-primary-500 transition-colors cursor-pointer" style={{ height: `${hPct}%` }} title={`${hPct}%`} />
                      );
                    })}
                  </div>
                </div>
                
                {recentResults.length > 0 ? (
                  <div className="space-y-3">
                    {recentResults.map((result: any, i: number) => {
                      const pct = Math.round((result.score / result.totalQuestions) * 100);
                      const colorClass = pct >= 80 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';
                      
                      return (
                      <Link key={result._id} href={`/dashboard/results/${result._id}`}>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all cursor-pointer group">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{result.examId?.title || 'Unknown Exam'}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-bold">{new Date(result.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <div className={`font-black text-lg ${colorClass}`}>
                              {pct}%
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{result.score}/{result.totalQuestions} correct</div>
                          </div>
                        </div>
                      </Link>
                    )})}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No battles fought yet.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
}
