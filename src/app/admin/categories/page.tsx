"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Trash2, Edit2, X, AlertCircle,
  Tag, Palette, CheckCircle2, Eye, EyeOff, Save, Check
} from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

const COLOR_PRESETS = [
  { label: "Indigo (MBBS Style)", value: "bg-primary-50 border-primary-200 border-2", text: "text-primary-500" },
  { label: "Rose (Nursing Style)", value: "bg-rose-50 border-rose-200 border-2", text: "text-rose-500" },
  { label: "Emerald (Pharmacy Style)", value: "bg-emerald-50 border-emerald-200 border-2", text: "text-emerald-500" },
  { label: "Amber (Paramedical Style)", value: "bg-amber-50 border-amber-200 border-2", text: "text-amber-500" },
  { label: "Sky Blue (BDS Style)", value: "bg-sky-50 border-sky-200 border-2", text: "text-sky-500" },
  { label: "Deep Violet", value: "bg-violet-50 border-violet-200 border-2", text: "text-violet-500" },
  { label: "Teal Green", value: "bg-teal-50 border-teal-200 border-2", text: "text-teal-500" },
];

const POPULAR_ICONS = [
  "Brain", "Stethoscope", "Pill", "Activity", "Microscope", "HeartPulse",
  "Sparkles", "ShieldCheck", "ClipboardList", "BookOpen", "Dna", "GraduationCap",
  "Heart", "Activity", "Trophy"
];

const emptyForm = {
  name: "",
  description: "Practice Questions",
  icon: "Brain",
  color: "bg-primary-50 border-primary-200 border-2",
  active: true,
};

// ─── Category Form Modal ───────────────────────────────────────────────────────
function CategoryModal({ category, onClose, onSaved }: { category?: any; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!category;
  const [form, setForm] = useState(() => {
    if (!category) return emptyForm;
    return {
      name: category.name || "",
      description: category.description || "Practice Questions",
      icon: category.icon || "Brain",
      color: category.color || "bg-primary-50 border-primary-200 border-2",
      active: category.active ?? true,
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Category Name is required."); return; }
    setSaving(true); setError("");
    try {
      const payload: any = { ...form };
      if (isEdit) payload.id = category._id;

      const res = await fetch("/api/categories", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Save failed");
      onSaved();
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const InputClass = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 placeholder-slate-500";
  const LabelClass = "text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative z-10 w-full max-w-xl h-screen bg-white dark:bg-slate-900 border-l border-slate-300 dark:border-slate-700 overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEdit ? "Edit Category" : "Create New Category"}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 font-medium">Add medical streams or subjects dynamically.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className={LabelClass}>Category Name</label>
            <input type="text" value={form.name} onChange={e => set("name", e.target.value)} required className={InputClass} placeholder="e.g. Lab Technician" />
          </div>

          {/* Description / Subtitle */}
          <div>
            <label className={LabelClass}>Subtitle / Subtext (shown on Card)</label>
            <input type="text" value={form.description} onChange={e => set("description", e.target.value)} className={InputClass} placeholder="e.g. 500+ Questions" />
          </div>

          {/* Icon Selector */}
          <div>
            <label className={LabelClass}>Select Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {POPULAR_ICONS.map(iconName => (
                <button
                  type="button" key={iconName}
                  onClick={() => set("icon", iconName)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${form.icon === iconName ? "border-primary-500 bg-primary-500/10 text-primary-400 scale-105" : "border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:border-slate-500"}`}
                >
                  <CategoryIcon name={iconName} className="w-5 h-5" />
                  <span className="text-[9px] truncate w-full text-center">{iconName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Scheme Picker */}
          <div>
            <label className={LabelClass}><Palette className="w-3.5 h-3.5 inline mr-1" /> Color Scheme Presets</label>
            <div className="space-y-2">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = form.color === preset.value;
                return (
                  <button
                    type="button" key={preset.value}
                    onClick={() => set("color", preset.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all text-left ${isSelected ? "border-primary-500 bg-primary-500/10" : "border-slate-300 dark:border-slate-800 hover:border-slate-500 bg-slate-50 dark:bg-slate-800"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${preset.value} flex items-center justify-center`}>
                        <CategoryIcon name={form.icon} className={`w-4 h-4 ${preset.text}`} />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{preset.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status active */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set("active", !form.active)}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${form.active ? "bg-primary-500" : "bg-slate-600"}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-7" : "translate-x-1"}`} />
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Active & Visible to students</span>
          </label>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 text-sm font-medium transition-colors">Cancel</button>
          <button
            type="submit"
            onClick={handleSubmit as any}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-slate-900 dark:text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const timestamp = Date.now();
    try {
      const res = await fetch(`/api/categories?all=true&t=${timestamp}`, { cache: "no-store" });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const filtered = categories.filter(cat => 
    !search || cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Exams under this category will not be deleted, but students won't see it on the home page.")) return;
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const handleToggleActive = async (cat: any) => {
    const nextActive = !cat.active;
    await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cat._id, active: nextActive }),
    });
    fetchCategories();
  };

  const openEdit = (cat: any) => { setEditCategory(cat); setModalOpen(true); };
  const openAdd = () => { setEditCategory(null); setModalOpen(true); };

  const activeCount = categories.filter(c => c.active).length;
  const inactiveCount = categories.length - activeCount;

  return (
    <div className="flex-1">
      <AnimatePresence>
        {modalOpen && (
          <CategoryModal
            category={editCategory}
            onClose={() => { setModalOpen(false); setEditCategory(null); }}
            onSaved={() => { setModalOpen(false); setEditCategory(null); fetchCategories(); }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Tag className="text-primary-400 w-6 h-6" /> Category Management
        </h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-slate-900 dark:text-white text-sm font-bold shadow-lg hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="px-8 py-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl p-4 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <p className="text-2xl font-black text-slate-900 dark:text-white">{categories.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Categories</p>
          </div>
          <div className="rounded-2xl p-4 border border-green-500/20 bg-green-500/10">
            <p className="text-2xl font-black text-green-400">{activeCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">Active</p>
          </div>
          <div className="rounded-2xl p-4 border border-slate-500/20 bg-slate-500/10">
            <p className="text-2xl font-black text-slate-500 dark:text-slate-400">{inactiveCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">Draft / Inactive</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="Search categories..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <span className="ml-auto text-slate-500 text-sm font-semibold">{filtered.length} categories</span>
        </div>

        {/* Categories Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Preview</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description Subtitle</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="border-b border-slate-200 dark:border-slate-800/50">
                      <td colSpan={5} className="p-4"><div className="h-5 bg-slate-50 dark:bg-slate-800 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-16 text-center text-slate-500">
                      <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      No categories found. Create your first category!
                    </td>
                  </tr>
                ) : (
                  filtered.map((cat) => (
                    <tr key={cat._id} className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className={`w-10 h-10 rounded-xl ${cat.color || 'bg-slate-50 border-slate-200'} flex items-center justify-center`}>
                          <CategoryIcon name={cat.icon} className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white text-sm">{cat.name}</td>
                      <td className="p-4 text-slate-500 text-sm font-medium">{cat.description}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                          cat.active ? "bg-green-500/15 text-green-400 border-green-500/20" : "bg-slate-500/15 text-slate-500 dark:text-slate-400 border-slate-600/30"
                        }`}>
                          {cat.active ? "● Active" : "○ Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(cat)}
                            className={`p-2 rounded-xl text-xs font-bold transition-colors ${cat.active ? "bg-slate-500/10 text-slate-400 hover:bg-slate-500/20" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"}`}
                            title={cat.active ? "Deactivate" : "Activate"}
                          >
                            {cat.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => openEdit(cat)} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-primary-400 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(cat._id)} className="p-2 rounded-xl hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
