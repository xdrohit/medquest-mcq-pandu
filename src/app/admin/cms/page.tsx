"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Plus, Trash2, CheckCircle, AlertCircle, Loader2,
  Megaphone, LayoutTemplate, BarChart3, Star, Sparkles, Info,
  Settings, HelpCircle, Globe, ChevronDown, ChevronUp, Eye, EyeOff,
  Monitor, Newspaper, LayoutGrid, Palette as Palette2, CalendarDays,
  Type, Image as ImageIcon, ToggleLeft, ToggleRight
} from "lucide-react";

const TABS = [
  { key: "announcement", label: "📢 Announcement", icon: Megaphone },
  { key: "hero",         label: "🏠 Hero Section",  icon: LayoutTemplate },
  { key: "stats",        label: "📊 Stats Bar",     icon: BarChart3 },
  { key: "features",     label: "✨ Features Grid", icon: Sparkles },
  { key: "testimonials", label: "💬 Testimonials",  icon: Star },
  { key: "about",        label: "ℹ️ About Page",   icon: Info },
  { key: "faq",          label: "❓ FAQ",           icon: HelpCircle },
  { key: "blog",         label: "📰 Blog / News",   icon: Newspaper },
  { key: "sections",     label: "🔲 Section Visibility", icon: LayoutGrid },
  { key: "brand",        label: "🎨 Brand & Logo",  icon: Palette2 },
  { key: "settings",     label: "⚙️ Site Settings", icon: Settings },
];

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState("announcement");
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [mobileTabOpen, setMobileTabOpen] = useState(false);

  // Load all CMS data
  useEffect(() => {
    fetch(`/api/site-content?t=${Date.now()}`)
      .then(r => r.json())
      .then(data => { setContent(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateSection = useCallback((section: string, newData: any) => {
    setContent(prev => ({ ...prev, [section]: newData }));
  }, []);

  const save = async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: activeTab, data: content[activeTab] }),
      });
      if (!res.ok) throw new Error();
      // Trigger cache revalidation on public pages
      await fetch("/api/revalidate", { method: "POST" });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const activeTabLabel = TABS.find(t => t.key === activeTab)?.label ?? "";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
          <p className="text-slate-500 font-medium">Loading CMS data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50/30 dark:bg-slate-950 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <span className="text-4xl">🎛️</span> Site CMS Editor
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Edit every part of your website without touching code</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
            <Monitor className="w-4 h-4" /> Preview Site
          </a>
          <button
            onClick={save}
            disabled={saveStatus === "saving"}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 disabled:opacity-70 text-white text-sm font-bold transition-colors shadow-lg shadow-pink-500/30"
          >
            {saveStatus === "saving" && <Loader2 className="w-4 h-4 animate-spin" />}
            {saveStatus === "saved" && <CheckCircle className="w-4 h-4" />}
            {saveStatus === "error" && <AlertCircle className="w-4 h-4" />}
            {saveStatus === "idle" && <Save className="w-4 h-4" />}
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : saveStatus === "error" ? "Error!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar Tabs */}
        <aside className="lg:w-56 flex-shrink-0">
          {/* Mobile: Dropdown */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileTabOpen(p => !p)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white shadow-sm"
            >
              <span>{activeTabLabel}</span>
              {mobileTabOpen ? <ChevronUp className="w-4 h-4 text-pink-500" /> : <ChevronDown className="w-4 h-4 text-pink-500" />}
            </button>
            {mobileTabOpen && (
              <div className="mt-2 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-lg z-10 relative">
                {TABS.map(tab => (
                  <button key={tab.key} onClick={() => { setActiveTab(tab.key); setMobileTabOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors hover:bg-pink-50 dark:hover:bg-pink-900/20 ${activeTab === tab.key ? 'bg-pink-50 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop: Vertical tabs */}
          <div className="hidden lg:block bg-white dark:bg-slate-800 border border-pink-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center gap-2.5 transition-colors border-b border-pink-50 dark:border-slate-700/50 last:border-0 ${active ? 'bg-pink-50 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400' : 'text-slate-600 dark:text-slate-400 hover:bg-pink-50/50 dark:hover:bg-pink-900/10'}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" /> {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Editor Panel */}
        <div className="flex-1 bg-white dark:bg-slate-800 border border-pink-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {activeTab === "announcement" && <AnnouncementEditor data={content.announcement} onChange={d => updateSection("announcement", d)} />}
              {activeTab === "hero" && <HeroEditor data={content.hero} onChange={d => updateSection("hero", d)} />}
              {activeTab === "stats" && <StatsEditor data={content.stats} onChange={d => updateSection("stats", d)} />}
              {activeTab === "features" && <FeaturesEditor data={content.features} onChange={d => updateSection("features", d)} />}
              {activeTab === "testimonials" && <TestimonialsEditor data={content.testimonials} onChange={d => updateSection("testimonials", d)} />}
              {activeTab === "about" && <AboutEditor data={content.about} onChange={d => updateSection("about", d)} />}
              {activeTab === "faq" && <FaqEditor data={content.faq} onChange={d => updateSection("faq", d)} />}
              {activeTab === "blog" && <BlogEditor data={content.blog} onChange={d => updateSection("blog", d)} />}
              {activeTab === "sections" && <SectionsEditor data={content.sections} onChange={d => updateSection("sections", d)} />}
              {activeTab === "brand" && <BrandEditor data={content.brand} onChange={d => updateSection("brand", d)} />}
              {activeTab === "settings" && <SettingsEditor data={content.settings} onChange={d => updateSection("settings", d)} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Inputs ───────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">{children}</h2>;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5 mb-5">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, multiline = false }: any) {
  const cls = "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-pink-400 dark:focus:border-pink-500 transition-colors resize-none";
  return multiline
    ? <textarea rows={4} className={cls} value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    : <input type="text" className={cls} value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} />;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all w-full text-sm font-bold ${checked ? 'border-pink-400 bg-pink-50 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400' : 'border-slate-200 dark:border-slate-600 text-slate-500 hover:border-pink-200'}`}>
      {checked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      {label}: <span className={checked ? 'text-pink-500' : 'text-slate-400'}>{checked ? 'ON ✅' : 'OFF ❌'}</span>
    </button>
  );
}

function ItemCard({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  return (
    <div className="relative bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
      {children}
      <button onClick={onDelete} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-pink-200 dark:border-pink-700 text-pink-500 dark:text-pink-400 font-bold text-sm hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
      <Plus className="w-4 h-4" /> {label}
    </button>
  );
}

// ─── Section Editors ──────────────────────────────────────────────────────────

function AnnouncementEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const d = data ?? {};
  const set = (k: string, v: any) => onChange({ ...d, [k]: v });
  return (
    <div>
      <SectionTitle>📢 Announcement Banner</SectionTitle>
      <p className="text-sm text-slate-500 mb-6">This shows a colored banner at the very top of the site. Great for announcing new MCQs, events, or updates!</p>
      <div className="grid gap-4">
        <Toggle label="Banner Visible" checked={d.enabled ?? false} onChange={v => set("enabled", v)} />
        <Field label="Announcement Text">
          <Input value={d.text} onChange={(v: string) => set("text", v)} placeholder="🎉 New BDS questions added!" />
        </Field>
        <Field label="Banner Type">
          <div className="flex gap-3 flex-wrap">
            {["info", "success", "warning"].map(type => (
              <button key={type} onClick={() => set("type", type)}
                className={`px-5 py-2 rounded-xl text-sm font-bold capitalize border-2 transition-all ${d.type === type ? 'border-pink-400 bg-pink-50 text-pink-600' : 'border-slate-200 text-slate-500 hover:border-pink-200'}`}>
                {type === "info" ? "🔵 Info" : type === "success" ? "🟢 Success" : "🟡 Warning"}
              </button>
            ))}
          </div>
        </Field>
        <Toggle label="Allow Dismiss" checked={d.dismissible ?? true} onChange={v => set("dismissible", v)} />
      </div>
    </div>
  );
}

function HeroEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const d = data ?? {};
  const set = (k: string, v: any) => onChange({ ...d, [k]: v });
  return (
    <div>
      <SectionTitle>🏠 Hero Section</SectionTitle>
      <div className="grid md:grid-cols-2 gap-x-6">
        <Field label="Badge Text"><Input value={d.badge} onChange={(v: string) => set("badge", v)} placeholder="India's #1 MCQ Platform" /></Field>
        <Field label="Main Headline"><Input value={d.headline} onChange={(v: string) => set("headline", v)} placeholder="Crack Your Medical Exams with" /></Field>
        <Field label="Headline Highlight (gradient part)"><Input value={d.headlineHighlight} onChange={(v: string) => set("headlineHighlight", v)} placeholder="Daily MCQ Practice" /></Field>
        <Field label="Primary CTA Button"><Input value={d.ctaPrimary} onChange={(v: string) => set("ctaPrimary", v)} placeholder="Start Practicing Free" /></Field>
        <Field label="Secondary CTA Button"><Input value={d.ctaSecondary} onChange={(v: string) => set("ctaSecondary", v)} placeholder="Already a member? Login" /></Field>
      </div>
      <Field label="Subtext (supports HTML tags like <strong>)" hint="Use <strong> for bold text">
        <Input multiline value={d.subtext} onChange={(v: string) => set("subtext", v)} placeholder="Join <strong>5,000+ students...</strong>" />
      </Field>
      <Field label="Trust Line (below buttons)"><Input value={d.trustLine} onChange={(v: string) => set("trustLine", v)} /></Field>
    </div>
  );
}

function StatsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const stats = Array.isArray(data) ? data : [];
  const update = (i: number, field: string, val: string) => {
    const next = stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    onChange(next);
  };
  const remove = (i: number) => onChange(stats.filter((_, idx) => idx !== i));
  const add = () => onChange([...stats, { value: "1,000+", label: "New Stat", color: "text-primary-600" }]);
  return (
    <div>
      <SectionTitle>📊 Stats Bar (Numbers shown on homepage)</SectionTitle>
      {stats.map((s, i) => (
        <ItemCard key={i} onDelete={() => remove(i)}>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Value"><Input value={s.value} onChange={(v: string) => update(i, "value", v)} placeholder="5,000+" /></Field>
            <Field label="Label"><Input value={s.label} onChange={(v: string) => update(i, "label", v)} placeholder="Active Students" /></Field>
            <Field label="Color Class"><Input value={s.color} onChange={(v: string) => update(i, "color", v)} placeholder="text-primary-600" /></Field>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={add} label="Add Stat Card" />
    </div>
  );
}

const ICON_OPTIONS = ["Zap", "ShieldCheck", "Brain", "Clock", "Trophy", "TrendingUp", "BookOpen", "Star", "Target", "Activity", "Heart", "Flame"];

function FeaturesEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const features = Array.isArray(data) ? data : [];
  const update = (i: number, field: string, val: string) => onChange(features.map((f, idx) => idx === i ? { ...f, [field]: val } : f));
  const remove = (i: number) => onChange(features.filter((_, idx) => idx !== i));
  const add = () => onChange([...features, { icon: "Star", iconColor: "text-primary-500", title: "New Feature", desc: "Description..." }]);
  return (
    <div>
      <SectionTitle>✨ Features Grid (6 cards on homepage)</SectionTitle>
      {features.map((f, i) => (
        <ItemCard key={i} onDelete={() => remove(i)}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Icon Name" hint={`Options: ${ICON_OPTIONS.join(", ")}`}>
              <Input value={f.icon} onChange={(v: string) => update(i, "icon", v)} />
            </Field>
            <Field label="Icon Color Class"><Input value={f.iconColor} onChange={(v: string) => update(i, "iconColor", v)} placeholder="text-yellow-500" /></Field>
          </div>
          <Field label="Feature Title"><Input value={f.title} onChange={(v: string) => update(i, "title", v)} /></Field>
          <Field label="Description"><Input multiline value={f.desc} onChange={(v: string) => update(i, "desc", v)} /></Field>
        </ItemCard>
      ))}
      <AddButton onClick={add} label="Add Feature Card" />
    </div>
  );
}

function TestimonialsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const testimonials = Array.isArray(data) ? data : [];
  const update = (i: number, field: string, val: any) => onChange(testimonials.map((t, idx) => idx === i ? { ...t, [field]: val } : t));
  const remove = (i: number) => onChange(testimonials.filter((_, idx) => idx !== i));
  const add = () => onChange([...testimonials, { name: "Student Name", role: "College, Course", text: "Review...", rating: 5, avatar: "S", avatarColor: "bg-primary-500" }]);
  return (
    <div>
      <SectionTitle>💬 Student Testimonials</SectionTitle>
      {testimonials.map((t, i) => (
        <ItemCard key={i} onDelete={() => remove(i)}>
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <Field label="Student Name"><Input value={t.name} onChange={(v: string) => update(i, "name", v)} /></Field>
            <Field label="Role / College"><Input value={t.role} onChange={(v: string) => update(i, "role", v)} /></Field>
            <Field label="Avatar Letter (e.g. P)" hint="First letter of name"><Input value={t.avatar} onChange={(v: string) => update(i, "avatar", v)} /></Field>
            <Field label="Avatar Color Class" hint="e.g. bg-primary-500, bg-emerald-500"><Input value={t.avatarColor} onChange={(v: string) => update(i, "avatarColor", v)} /></Field>
            <Field label="Rating (1-5)">
              <div className="flex gap-2">
                {[1,2,3,4,5].map(r => (
                  <button key={r} onClick={() => update(i, "rating", r)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold border-2 transition-all ${t.rating >= r ? 'border-amber-400 bg-amber-50 text-amber-600' : 'border-slate-200 text-slate-400'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <Field label="Review Text">
            <Input multiline value={t.text} onChange={(v: string) => update(i, "text", v)} />
          </Field>
        </ItemCard>
      ))}
      <AddButton onClick={add} label="Add Testimonial" />
    </div>
  );
}

function AboutEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const d = data ?? {};
  const set = (k: string, v: any) => onChange({ ...d, [k]: v });
  const setCard = (i: number, field: string, v: string) => {
    const cards = [...(d.cards ?? [])];
    cards[i] = { ...cards[i], [field]: v };
    set("cards", cards);
  };
  return (
    <div>
      <SectionTitle>ℹ️ About Page Content</SectionTitle>
      <Field label="Page Title"><Input value={d.title} onChange={(v: string) => set("title", v)} /></Field>
      <Field label="Intro Paragraph (supports HTML <strong>)" hint="Use <strong> for bold">
        <Input multiline value={d.intro} onChange={(v: string) => set("intro", v)} />
      </Field>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Three Info Cards</div>
      {(d.cards ?? []).map((card: any, i: number) => (
        <div key={i} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Card Title"><Input value={card.title} onChange={(v: string) => setCard(i, "title", v)} /></Field>
            <Field label="Icon Name"><Input value={card.icon} onChange={(v: string) => setCard(i, "icon", v)} /></Field>
          </div>
          <Field label="Card Description"><Input multiline value={card.desc} onChange={(v: string) => setCard(i, "desc", v)} /></Field>
        </div>
      ))}
      <Field label="Vision Section"><Input multiline value={d.vision} onChange={(v: string) => set("vision", v)} /></Field>
      <Field label="Why Choose Us Section"><Input multiline value={d.whyChoose} onChange={(v: string) => set("whyChoose", v)} /></Field>
      <Field label="Closing Paragraph"><Input multiline value={d.closing} onChange={(v: string) => set("closing", v)} /></Field>
    </div>
  );
}

function FaqEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const faqs = Array.isArray(data) ? data : [];
  const update = (i: number, field: string, val: string) => onChange(faqs.map((f, idx) => idx === i ? { ...f, [field]: val } : f));
  const remove = (i: number) => onChange(faqs.filter((_, idx) => idx !== i));
  const add = () => onChange([...faqs, { question: "New Question?", answer: "Answer..." }]);
  return (
    <div>
      <SectionTitle>❓ FAQ (Frequently Asked Questions)</SectionTitle>
      <p className="text-sm text-slate-500 mb-5">These FAQs will appear on the website's FAQ page. Keep them concise and helpful!</p>
      {faqs.map((f, i) => (
        <ItemCard key={i} onDelete={() => remove(i)}>
          <Field label="Question"><Input value={f.question} onChange={(v: string) => update(i, "question", v)} /></Field>
          <Field label="Answer"><Input multiline value={f.answer} onChange={(v: string) => update(i, "answer", v)} /></Field>
        </ItemCard>
      ))}
      <AddButton onClick={add} label="Add FAQ" />
    </div>
  );
}

function SettingsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const d = data ?? {};
  const set = (k: string, v: any) => onChange({ ...d, [k]: v });
  return (
    <div>
      <SectionTitle>⚙️ Site Settings</SectionTitle>
      <div className="grid md:grid-cols-2 gap-x-6">
        <Field label="Site Name"><Input value={d.siteName} onChange={(v: string) => set("siteName", v)} /></Field>
        <Field label="Contact Email"><Input value={d.contactEmail} onChange={(v: string) => set("contactEmail", v)} /></Field>
        <Field label="Tagline"><Input value={d.tagline} onChange={(v: string) => set("tagline", v)} /></Field>
        <Field label="Footer Text"><Input value={d.footerText} onChange={(v: string) => set("footerText", v)} /></Field>
      </div>
      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 mt-2 flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Social Media Links</div>
      <div className="grid md:grid-cols-2 gap-x-6">
        <Field label="Instagram URL"><Input value={d.instagram} onChange={(v: string) => set("instagram", v)} placeholder="https://instagram.com/..." /></Field>
        <Field label="YouTube URL"><Input value={d.youtube} onChange={(v: string) => set("youtube", v)} placeholder="https://youtube.com/..." /></Field>
        <Field label="WhatsApp URL/Number"><Input value={d.whatsapp} onChange={(v: string) => set("whatsapp", v)} placeholder="https://wa.me/91..." /></Field>
        <Field label="Telegram URL"><Input value={d.telegram} onChange={(v: string) => set("telegram", v)} placeholder="https://t.me/..." /></Field>
      </div>
    </div>
  );
}

// ─── Blog Editor ──────────────────────────────────────────────────────────────
function BlogEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const posts = Array.isArray(data) ? data : [];
  const update = (i: number, field: string, val: any) =>
    onChange(posts.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  const remove = (i: number) => onChange(posts.filter((_, idx) => idx !== i));
  const add = () => onChange([...posts, {
    id: Date.now().toString(),
    title: "New Post Title",
    summary: "Short description of this post...",
    category: "Update",
    date: new Date().toISOString().split("T")[0],
    published: false,
  }]);

  const CATEGORIES = ["Update", "Tips", "News", "Guide"];

  return (
    <div>
      <SectionTitle>📰 Blog / News Section</SectionTitle>
      <p className="text-sm text-slate-500 mb-6">Add news posts and study tips that appear on the homepage. Toggle each post on/off without deleting it.</p>
      {posts.map((p, i) => (
        <ItemCard key={p.id ?? i} onDelete={() => remove(i)}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Post #{i + 1}</span>
            <button
              onClick={() => update(i, "published", !p.published)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 ${p.published ? "border-emerald-400 bg-emerald-50 text-emerald-600" : "border-slate-200 text-slate-400 hover:border-pink-300"}`}
            >
              {p.published ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              {p.published ? "Published ✅" : "Draft 📝"}
            </button>
          </div>
          <Field label="Post Title"><Input value={p.title} onChange={(v: string) => update(i, "title", v)} /></Field>
          <Field label="Summary (shown on homepage)"><Input multiline value={p.summary} onChange={(v: string) => update(i, "summary", v)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => update(i, "category", cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${p.category === cat ? "border-pink-400 bg-pink-50 text-pink-600" : "border-slate-200 text-slate-400 hover:border-pink-200"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Date">
              <input type="date" value={p.date ?? ""} onChange={e => update(i, "date", e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-pink-400 transition-colors" />
            </Field>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={add} label="Add New Post" />
    </div>
  );
}

// ─── Sections Visibility Editor ───────────────────────────────────────────────
function SectionsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const d = data ?? {};
  const set = (k: string, v: boolean) => onChange({ ...d, [k]: v });

  const SECTION_LIST = [
    { key: "showStats",        label: "📊 Stats Bar",          desc: "Numbers like '5,000+ Students', '3,100+ MCQs'" },
    { key: "showCategories",   label: "🎓 Exam Categories",    desc: "The 'Pick Your Stream' grid of departments" },
    { key: "showHowItWorks",   label: "🔢 How It Works",       desc: "The 3-step process section" },
    { key: "showFeatures",     label: "✨ Features Grid",      desc: "The 6 platform feature cards" },
    { key: "showTestimonials", label: "💬 Testimonials",       desc: "Student reviews and ratings" },
    { key: "showBlog",         label: "📰 Blog / News",        desc: "News posts and study tips section" },
  ];

  return (
    <div>
      <SectionTitle>🔲 Section Visibility</SectionTitle>
      <p className="text-sm text-slate-500 mb-6">Toggle entire homepage sections on or off instantly. Changes take effect within 60 seconds on the live site.</p>
      <div className="space-y-3">
        {SECTION_LIST.map(({ key, label, desc }) => {
          const isOn = d[key] !== false;
          return (
            <button
              key={key}
              onClick={() => set(key, !isOn)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${isOn ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 opacity-70"}`}
            >
              <div>
                <p className={`font-bold text-sm ${isOn ? "text-emerald-800 dark:text-emerald-300" : "text-slate-500"}`}>{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black ${isOn ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                {isOn ? <><Eye className="w-3.5 h-3.5" /> Visible</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Brand Editor ─────────────────────────────────────────────────────────────
function BrandEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const d = data ?? {};
  const set = (k: string, v: any) => onChange({ ...d, [k]: v });

  return (
    <div>
      <SectionTitle>🎨 Brand & Logo Settings</SectionTitle>
      <p className="text-sm text-slate-500 mb-6">Customize your site&apos;s identity. Changes to brand colors affect the whole site.</p>

      <div className="grid md:grid-cols-2 gap-x-6">
        <Field label="Site Logo Text" hint="Shown in the navbar and footer">
          <Input value={d.logoText} onChange={(v: string) => set("logoText", v)} placeholder="Daily Dose MCQ" />
        </Field>
        <Field label="Logo Emoji / Icon" hint="Emoji shown next to the logo text">
          <Input value={d.logoEmoji} onChange={(v: string) => set("logoEmoji", v)} placeholder="🩺" />
        </Field>
      </div>

      <div className="mt-2 mb-6">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Palette2 className="w-3.5 h-3.5" /> Theme Colors
        </div>
        <p className="text-xs text-slate-400 mb-4">⚠️ Note: Color picker sets CSS variable overrides. For best results, use hex colors. Full color system changes require a redeployment.</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={d.primaryColor ?? "#6366f1"}
                onChange={e => set("primaryColor", e.target.value)}
                className="w-12 h-12 rounded-xl border-2 border-slate-200 cursor-pointer p-0.5 bg-white"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{d.primaryColor ?? "#6366f1"}</p>
                <p className="text-xs text-slate-400">Used for buttons, links, badges</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={d.accentColor ?? "#a855f7"}
                onChange={e => set("accentColor", e.target.value)}
                className="w-12 h-12 rounded-xl border-2 border-slate-200 cursor-pointer p-0.5 bg-white"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{d.accentColor ?? "#a855f7"}</p>
                <p className="text-xs text-slate-400">Used for gradients and highlights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Live Preview</p>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `linear-gradient(135deg, ${d.primaryColor ?? "#6366f1"}, ${d.accentColor ?? "#a855f7"})` }}>
            {d.logoEmoji ?? "🩺"}
          </div>
          <span className="font-black text-lg text-slate-900 dark:text-white">{d.logoText ?? "Daily Dose MCQ"}</span>
        </div>
        <button
          style={{ background: `linear-gradient(135deg, ${d.primaryColor ?? "#6366f1"}, ${d.accentColor ?? "#a855f7"})` }}
          className="px-5 py-2 rounded-xl text-white text-sm font-bold shadow-lg"
        >
          Sample Button →
        </button>
      </div>
    </div>
  );
}

