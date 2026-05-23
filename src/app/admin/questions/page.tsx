"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Trash2, Edit2, Upload, BookOpen,
  ChevronDown, X, Check, AlertCircle, Shuffle, Image as ImageIcon, Tag
} from "lucide-react";

// Dynamic categories are managed via Exam categories in DB
const DIFFICULTIES = ["easy", "medium", "hard"];

const difficultyColor: Record<string, string> = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

// ─── Question Form Modal ───────────────────────────────────────────────────────
function QuestionModal({ categories, question, onClose, onSaved }: {
  categories: any[], question?: any, onClose: () => void, onSaved: () => void
}) {
  const isEdit = !!question;
  const [form, setForm] = useState({
    examId: question?.examId?._id || question?.examId || "",
    categoryId: question?.categoryId?._id || question?.categoryId || "",
    subCategory: question?.subCategory || "",
    text: question?.text || "",
    options: question?.options || ["", "", "", ""],
    correctAnswer: question?.correctAnswer ?? 0,
    explanation: question?.explanation || "",
    difficulty: question?.difficulty || "medium",
    topic: question?.topic || "",
    imageUrl: question?.imageUrl || "",
    randomize: question?.randomize || false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setOption = (i: number, val: string) => {
    const opts = [...form.options];
    opts[i] = val;
    setForm(f => ({ ...f, options: opts }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) { setError("Please select a category."); return; }
    if (form.options.some((o: string) => !o.trim())) { setError("All 4 options are required."); return; }
    setSaving(true); setError("");
    try {
      const payload = { ...form };
      payload.examId = "";
      
      const url = isEdit ? `/api/admin/questions/${question._id}` : "/api/admin/questions";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      onSaved();
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative z-10 w-full max-w-xl h-screen bg-white dark:bg-slate-900 border-l border-slate-300 dark:border-slate-700 overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEdit ? "Edit Question" : "Add New MCQ"}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Fill in all details carefully.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Selector based on target type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  value={form.categoryId}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value, subCategory: "" }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500"
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sub-category</label>
                <select
                  value={form.subCategory}
                  onChange={e => setForm(f => ({ ...f, subCategory: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="">-- No Sub-category --</option>
                  {categories.find((c:any) => c._id === form.categoryId)?.subCategories?.map((s: string) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

          {/* Question Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Question Text</label>
            <textarea
              value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              rows={3}
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 resize-none"
              placeholder="Enter the MCQ question..."
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Options (select correct answer)</label>
            {form.options.map((opt: string, i: number) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${form.correctAnswer === i ? 'border-green-500/50 bg-green-500/10' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, correctAnswer: i }))}
                  className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${form.correctAnswer === i ? 'border-green-400 bg-green-400' : 'border-slate-600 hover:border-slate-400'}`}
                >
                  {form.correctAnswer === i && <Check className="w-4 h-4 text-black" />}
                </button>
                <input
                  type="text"
                  value={opt}
                  onChange={e => setOption(i, e.target.value)}
                  required
                  className="flex-1 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none placeholder-slate-500"
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                />
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${form.correctAnswer === i ? 'text-green-400' : 'text-slate-600'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Explanation</label>
            <textarea
              value={form.explanation}
              onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
              rows={2}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 resize-none"
              placeholder="Explain why the correct answer is right..."
            />
          </div>

          {/* Difficulty + Topic */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500"
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topic Tag</label>
              <input
                type="text"
                value={form.topic}
                onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500"
                placeholder="e.g. Cardiology"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Image URL (optional)</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500"
              placeholder="https://..."
            />
          </div>

          {/* Randomize toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`relative w-12 h-6 rounded-full transition-colors ${form.randomize ? 'bg-primary-500' : 'bg-slate-700'}`} onClick={() => setForm(f => ({ ...f, randomize: !f.randomize }))}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.randomize ? 'translate-x-7' : 'translate-x-1'}`} />
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5"><Shuffle className="w-4 h-4" /> Randomize Options</span>
          </label>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 text-sm font-medium transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            form=""
            onClick={handleSubmit as any}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-slate-900 dark:text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Update Question" : "Add Question"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Bulk Upload Modal ─────────────────────────────────────────────────────────
function BulkUploadModal({ categories, onClose, onSaved }: { categories: any[], onClose: () => void, onSaved: () => void }) {
  const [categoryId, setCategoryId] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [csvText, setCsvText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row.");
    
    // Simple robust regex for CSV that respects double quotes
    const parsedData = lines.slice(1).map((line, rowIndex) => {
      const regex = /(?:"([^"]*(?:""[^"]*)*)"|([^,]*))(?:,|$)/g;
      let match;
      const values = [];
      while ((match = regex.exec(line)) !== null && match[0] !== '') {
        values.push(match[1] ? match[1].replace(/""/g, '"') : match[2]);
      }
      
      if (values.length < 6) return null; // Invalid line

      const text = values[0]?.trim();
      const options = [values[1]?.trim(), values[2]?.trim(), values[3]?.trim(), values[4]?.trim()];
      const correctVal = values[5]?.trim().toUpperCase();
      const explanation = values[6]?.trim() || "";
      const topic = values[7]?.trim() || "";

      const ansMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
      const correctAnswer = ansMap[correctVal] ?? 0;

      if (!text || options.some(o => !o)) {
        throw new Error(`Row ${rowIndex + 2} is missing question text or options.`);
      }

      return {
        text,
        options,
        correctAnswer,
        explanation,
        difficulty: "medium",
        topic
      };
    }).filter(Boolean);

    if (parsedData.length === 0) throw new Error("No valid questions found in CSV.");
    return parsedData;
  };

  const handleUpload = async () => {
    if (!categoryId) { setError("Select a category first."); return; }
    let parsed;
    try { 
      parsed = parseCSV(csvText); 
    } catch (err: any) { 
      setError(err.message || "Invalid CSV format."); 
      return; 
    }
    setUploading(true); setError(""); setResult("");
    try {
      const questions = parsed.map((q: any) => ({
        ...q,
        categoryId: categoryId,
        subCategory: subCategory,
      }));
      const res = await fetch("/api/admin/questions/bulk", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.message);
      onSaved();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const sampleCsv = `Question,Option_A,Option_B,Option_C,Option_D,Correct_Answer,Explanation,Topic
Dental arch ka cornerstone kis daant ko kaha jata hai?,Incisor,Canine,Premolar,Molar,B,Canines sabse strong aur longest roots wale teeth hote hain.,Dental Anatomy
Bachhon mein sabse pehle kaun sa primary tooth nikalta hai?,Maxillary central incisor,Mandibular central incisor,Mandibular first molar,Maxillary canine,B,Mandibular central incisor pehle erupt hota hai.,Pedodontics`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Upload className="w-5 h-5 text-primary-400" /> Bulk Upload MCQs</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Paste CSV data (Question, Opt A, Opt B, Opt C, Opt D, Answer, Explanation, Topic).</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {(error || result) && (
            <div className={`p-3 rounded-xl text-sm border ${result ? 'bg-green-950/50 border-green-700 text-green-400' : 'bg-red-950/50 border-red-800 text-red-400'}`}>
              {result || error}
            </div>
          )}

          {/* Target Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Category</label>
                <select
                  value={categoryId} onChange={e => { setCategoryId(e.target.value); setSubCategory(""); }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Sub-category</label>
                <select
                  value={subCategory} onChange={e => setSubCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="">-- No Sub-category --</option>
                  {categories.find((c:any) => c._id === categoryId)?.subCategories?.map((s: string) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">CSV Data</label>
            <textarea
              value={csvText} onChange={e => setCsvText(e.target.value)}
              rows={10}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-green-300 text-sm font-mono focus:outline-none focus:border-primary-500 resize-none whitespace-pre"
              placeholder={sampleCsv}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setCsvText(sampleCsv)} className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 text-sm transition-colors">
              Load Sample CSV
            </button>
            <button
              onClick={handleUpload} disabled={uploading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-slate-900 dark:text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Questions"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDiff, setFilterDiff] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [modalMode, setModalMode] = useState<null | "add" | "edit">(null);
  const [editQuestion, setEditQuestion] = useState<any>(null);
  const [bulkModal, setBulkModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterDiff) params.set("difficulty", filterDiff);
    if (search) params.set("search", search);
    const timestamp = Date.now();
    const qs = params.toString();
    const queryStr = qs ? `${qs}&t=${timestamp}` : `t=${timestamp}`;
    
    const fetchOpts = {
      cache: "no-store" as RequestCache,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache"
      }
    };

    try {
      const [qRes, cRes] = await Promise.all([
        fetch(`/api/admin/questions?${queryStr}`, fetchOpts),
        fetch(`/api/categories?all=true&t=${timestamp}`, fetchOpts),
      ]);
      const qData = await qRes.json();
      const cData = await cRes.json();
      setQuestions(Array.isArray(qData) ? qData : []);
      setCategories(Array.isArray(cData) ? cData : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setQuestions([]);
      setCategories([]);
    }
    setLoading(false);
  }, [filterDiff, search]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === questions.length ? [] : questions.map((q: any) => q._id));

  const handleBulkDelete = async () => {
    if (!selected.length || !confirm(`Delete ${selected.length} questions?`)) return;
    setDeleting(true);
    await fetch("/api/admin/questions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: selected }) });
    setSelected([]);
    fetchAll();
    setDeleting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const openEdit = (q: any) => { setEditQuestion(q); setModalMode("edit"); };

  return (
    <div className="flex-1">
      <AnimatePresence>
        {(modalMode === "add" || modalMode === "edit") && (
          <QuestionModal
            categories={categories}
            question={modalMode === "edit" ? editQuestion : undefined}
            onClose={() => { setModalMode(null); setEditQuestion(null); }}
            onSaved={() => { setModalMode(null); setEditQuestion(null); setTimeout(() => fetchAll(), 500); }}
          />
        )}
        {bulkModal && (
          <BulkUploadModal categories={categories} onClose={() => setBulkModal(false)} onSaved={() => { setBulkModal(false); setTimeout(() => fetchAll(), 500); }} />
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="text-primary-400 w-6 h-6" /> MCQ Management
        </h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setBulkModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium transition-colors">
            <Upload className="w-4 h-4" /> Bulk Upload
          </button>
          <button onClick={() => setModalMode("add")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-slate-900 dark:text-white text-sm font-bold shadow-lg hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="Search questions..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={filterDiff} onChange={e => setFilterDiff(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
          >
            <option value="">All Difficulties</option>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>
          {selected.length > 0 && (
            <button onClick={handleBulkDelete} disabled={deleting} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/20 border border-red-700 text-red-400 hover:bg-red-600/30 text-sm font-medium transition-colors">
              <Trash2 className="w-4 h-4" /> Delete {selected.length} Selected
            </button>
          )}
          <span className="ml-auto text-slate-500 text-sm">{questions.length} questions</span>
        </div>

        {/* Questions Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="p-4 w-10">
                    <input type="checkbox" checked={selected.length === questions.length && questions.length > 0} onChange={toggleAll} className="accent-primary-500 w-4 h-4 cursor-pointer" />
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Question</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topic</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Difficulty</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-slate-200 dark:border-slate-800/50">
                      <td colSpan={6} className="p-4"><div className="h-4 bg-slate-50 dark:bg-slate-800 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : questions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-slate-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      No questions found. Add your first MCQ!
                    </td>
                  </tr>
                ) : questions.map((q: any) => (
                  <motion.tr
                    key={q._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-b border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:bg-slate-800/30 transition-colors ${selected.includes(q._id) ? 'bg-primary-900/20' : ''}`}
                  >
                    <td className="p-4">
                      <input type="checkbox" checked={selected.includes(q._id)} onChange={() => toggleSelect(q._id)} className="accent-primary-500 w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="p-4 max-w-sm">
                      <p className="text-slate-900 dark:text-white text-sm font-medium line-clamp-2">{q.text}</p>
                      {q.randomize && <span className="text-xs text-purple-400 mt-1 flex items-center gap-1"><Shuffle className="w-3 h-3" /> Randomized</span>}
                    </td>
                    <td className="p-4">
                      {q.categoryId ? (
                        <span className="text-xs bg-accent-500/20 text-accent-400 px-2 py-1 rounded-lg border border-accent-500/30 font-semibold flex items-center w-max gap-1">
                          <BookOpen className="w-3 h-3" /> {q.categoryId?.name} {q.subCategory && `> ${q.subCategory}`}
                        </span>
                      ) : (
                        <span className="text-xs bg-slate-500/20 text-slate-400 px-2 py-1 rounded-lg border border-slate-500/30">Unknown</span>
                      )}
                    </td>
                    <td className="p-4">
                      {q.topic ? (
                        <span className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400"><Tag className="w-3 h-3" />{q.topic}</span>
                      ) : <span className="text-slate-600 text-xs">—</span>}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold capitalize ${difficultyColor[q.difficulty] || difficultyColor.medium}`}>
                        {q.difficulty || "medium"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(q)} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-primary-400 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(q._id)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
