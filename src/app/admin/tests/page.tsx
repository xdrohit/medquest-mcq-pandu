"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Trash2, Edit2, BookOpen, X, AlertCircle,
  Clock, Target, Shuffle, Calendar, FileText, Eye, EyeOff,
  CheckCircle, AlertTriangle, Save
} from "lucide-react";

const CATEGORIES = ["MBBS", "Nursing", "Pharmacy", "BDS", "Paramedical"];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", color: "bg-slate-500/20 text-slate-400 border-slate-500/30", icon: <FileText className="w-3 h-3" /> },
  published: { label: "Published", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: <CheckCircle className="w-3 h-3" /> },
  scheduled: { label: "Scheduled", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: <Calendar className="w-3 h-3" /> },
};

const emptyForm = {
  title: "",
  description: "",
  category: "MBBS",
  durationMinutes: 30,
  negativeMarking: 0,
  passingMarks: 0,
  totalMarks: 100,
  randomQuestionOrder: false,
  status: "draft",
  scheduledAt: "",
  instructions: "",
  tags: "",
};

// ─── Exam Form Modal ───────────────────────────────────────────────────────────
function ExamModal({ exam, onClose, onSaved }: { exam?: any; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!exam;
  const [form, setForm] = useState(() => {
    if (!exam) return emptyForm;
    return {
      title: exam.title || "",
      description: exam.description || "",
      category: exam.category || "MBBS",
      durationMinutes: exam.durationMinutes || 30,
      negativeMarking: exam.negativeMarking ?? 0,
      passingMarks: exam.passingMarks ?? 0,
      totalMarks: exam.totalMarks ?? 100,
      randomQuestionOrder: exam.randomQuestionOrder || false,
      status: exam.status || "draft",
      scheduledAt: exam.scheduledAt ? new Date(exam.scheduledAt).toISOString().slice(0, 16) : "",
      instructions: exam.instructions || "",
      tags: Array.isArray(exam.tags) ? exam.tags.join(", ") : "",
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    setSaving(true); setError("");
    try {
      const payload: any = {
        ...form,
        durationMinutes: Number(form.durationMinutes),
        negativeMarking: Number(form.negativeMarking),
        passingMarks: Number(form.passingMarks),
        totalMarks: Number(form.totalMarks),
        tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        scheduledAt: form.status === "scheduled" && form.scheduledAt ? new Date(form.scheduledAt) : undefined,
        active: form.status === "published",
      };
      if (isEdit) payload.id = exam._id;

      const res = await fetch("/api/exams", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      onSaved();
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const InputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500 placeholder-slate-500";
  const LabelClass = "text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative z-10 w-full max-w-2xl h-screen bg-slate-900 border-l border-slate-700 overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 z-10 flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">{isEdit ? "Edit Exam" : "Create New Exam"}</h2>
            <p className="text-slate-400 text-sm mt-0.5">All changes sync live to the database.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Status Selector */}
          <div>
            <label className={LabelClass}>Exam Status</label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <button
                  type="button" key={key}
                  onClick={() => set("status", key)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all ${form.status === key ? cfg.color + " scale-[1.02]" : "border-slate-700 text-slate-500 hover:border-slate-500"}`}
                >
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title + Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className={LabelClass}>Exam Title</label>
              <input type="text" value={form.title} onChange={e => set("title", e.target.value)} required className={InputClass} placeholder="e.g. Cardiology Final Exam" />
            </div>
            <div>
              <label className={LabelClass}>Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className={InputClass}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={LabelClass}>Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} className={InputClass + " resize-none"} placeholder="Brief description of this exam..." />
          </div>

          {/* Marks & Timer Row */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-primary-400" /> Time & Marks Configuration</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={LabelClass}>Duration (min)</label>
                <input type="number" min={1} max={300} value={form.durationMinutes} onChange={e => set("durationMinutes", e.target.value)} className={InputClass} />
              </div>
              <div>
                <label className={LabelClass}>Total Marks</label>
                <input type="number" min={0} value={form.totalMarks} onChange={e => set("totalMarks", e.target.value)} className={InputClass} />
              </div>
              <div>
                <label className={LabelClass}>Passing Marks</label>
                <input type="number" min={0} value={form.passingMarks} onChange={e => set("passingMarks", e.target.value)} className={InputClass} />
              </div>
              <div>
                <label className={LabelClass}>Negative Marking</label>
                <input type="number" min={0} step={0.25} max={1} value={form.negativeMarking} onChange={e => set("negativeMarking", e.target.value)} className={InputClass} placeholder="e.g. 0.25" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Negative marking = marks deducted per wrong answer (0 = no negative marking)</p>
          </div>

          {/* Scheduled Date (only if status = scheduled) */}
          {form.status === "scheduled" && (
            <div>
              <label className={LabelClass + " flex items-center gap-1.5"}><Calendar className="w-3.5 h-3.5 text-blue-400" /> Schedule Date & Time</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={e => set("scheduledAt", e.target.value)} className={InputClass} />
            </div>
          )}

          {/* Options Row */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3 flex items-center gap-2"><Target className="w-3.5 h-3.5 text-accent-400" /> Exam Options</label>
            <div className="space-y-3">
              {/* Random Question Order */}
              <label className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 cursor-pointer group hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-3">
                  <Shuffle className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">Random Question Order</p>
                    <p className="text-xs text-slate-500">Questions appear in random order for each student</p>
                  </div>
                </div>
                <div
                  onClick={() => set("randomQuestionOrder", !form.randomQuestionOrder)}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${form.randomQuestionOrder ? "bg-primary-500" : "bg-slate-600"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.randomQuestionOrder ? "translate-x-7" : "translate-x-1"}`} />
                </div>
              </label>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className={LabelClass}>Instructions (shown to students before exam)</label>
            <textarea value={form.instructions} onChange={e => set("instructions", e.target.value)} rows={3} className={InputClass + " resize-none"} placeholder="Read all questions carefully. Each correct answer carries 1 mark..." />
          </div>

          {/* Tags */}
          <div>
            <label className={LabelClass}>Topic Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={e => set("tags", e.target.value)} className={InputClass} placeholder="e.g. Cardiology, Anatomy, Physiology" />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors">Cancel</button>
          <button
            onClick={handleSubmit as any}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : isEdit ? "Update Exam" : "Create Exam"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function AdminTestsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editExam, setEditExam] = useState<any>(null);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/exams?all=true");
    const data = await res.json();
    setExams(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const filtered = exams.filter(ex => {
    const matchSearch = !search || ex.title.toLowerCase().includes(search.toLowerCase()) || ex.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || ex.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this exam and ALL its questions? This cannot be undone.")) return;
    await fetch("/api/exams", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchExams();
  };

  const handleTogglePublish = async (exam: any) => {
    const newStatus = exam.status === "published" ? "draft" : "published";
    await fetch("/api/exams", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: exam._id, status: newStatus, active: newStatus === "published" }),
    });
    fetchExams();
  };

  const openEdit = (exam: any) => { setEditExam(exam); setModalOpen(true); };
  const openAdd = () => { setEditExam(null); setModalOpen(true); };

  const statCounts = {
    total: exams.length,
    published: exams.filter(e => e.status === "published").length,
    draft: exams.filter(e => e.status === "draft").length,
    scheduled: exams.filter(e => e.status === "scheduled").length,
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <AnimatePresence>
        {modalOpen && (
          <ExamModal
            exam={editExam}
            onClose={() => { setModalOpen(false); setEditExam(null); }}
            onSaved={() => { setModalOpen(false); setEditExam(null); fetchExams(); }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-slate-400 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-primary-400 w-6 h-6" /> Test Management
          </h1>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-bold shadow-lg hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Create New Exam
        </button>
      </div>

      <div className="px-8 py-6 max-w-7xl mx-auto">
        {/* Stat Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Exams", value: statCounts.total, color: "text-white", bg: "bg-slate-800 border-slate-700" },
            { label: "Published", value: statCounts.published, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
            { label: "Drafts", value: statCounts.draft, color: "text-slate-400", bg: "bg-slate-700/30 border-slate-700" },
            { label: "Scheduled", value: statCounts.scheduled, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl p-4 border ${s.bg}`}>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search exams..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <span className="ml-auto text-slate-500 text-sm">{filtered.length} exams</span>
        </div>

        {/* Exams Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-48 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-slate-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No exams found.</p>
            <p className="text-sm mt-1">Create your first exam to get started!</p>
            <button onClick={openAdd} className="mt-6 px-6 py-3 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors">Create Exam</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((exam, idx) => {
              const statusCfg = statusConfig[exam.status] || statusConfig.draft;
              return (
                <motion.div key={exam._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-slate-700 transition-all group relative overflow-hidden">
                    {/* Status stripe */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 ${exam.status === 'published' ? 'bg-green-500' : exam.status === 'scheduled' ? 'bg-blue-500' : 'bg-slate-600'}`} />

                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-grow min-w-0">
                        <h3 className="text-white font-bold text-base leading-tight truncate">{exam.title}</h3>
                        <p className="text-slate-500 text-xs mt-0.5 truncate">{exam.description || "No description"}</p>
                      </div>
                      <span className={`flex-shrink-0 flex items-center gap-1 text-xs px-2 py-1 rounded-lg border font-semibold ${statusCfg.color}`}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-lg border border-primary-500/20">{exam.category}</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-lg flex items-center gap-1"><Clock className="w-3 h-3" />{exam.durationMinutes}m</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-lg">{exam.questionCount ?? 0} Qs</span>
                      {exam.negativeMarking > 0 && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-lg">-{exam.negativeMarking} neg</span>}
                      {exam.randomQuestionOrder && <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-lg flex items-center gap-1"><Shuffle className="w-3 h-3" />Random</span>}
                    </div>

                    {/* Marks info */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-800 rounded-lg px-3 py-2">
                        <p className="text-slate-500">Total Marks</p>
                        <p className="text-white font-bold">{exam.totalMarks}</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg px-3 py-2">
                        <p className="text-slate-500">Passing Marks</p>
                        <p className="text-green-400 font-bold">{exam.passingMarks}</p>
                      </div>
                    </div>

                    {/* Scheduled date */}
                    {exam.status === "scheduled" && exam.scheduledAt && (
                      <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        Goes live: {new Date(exam.scheduledAt).toLocaleString()}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                      <button
                        onClick={() => handleTogglePublish(exam)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-colors ${exam.status === "published" ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"}`}
                      >
                        {exam.status === "published" ? <><EyeOff className="w-3.5 h-3.5" /> Unpublish</> : <><Eye className="w-3.5 h-3.5" /> Publish</>}
                      </button>
                      <button onClick={() => openEdit(exam)} className="p-2 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-primary-400 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <Link href="/admin/questions" className="p-2 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-accent-400 transition-colors">
                        <BookOpen className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(exam._id)} className="p-2 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
