import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SiteContent from '@/models/SiteContent';
import jwt from 'jsonwebtoken';

// Default content — seeded if DB has no data
export const DEFAULT_CONTENT: Record<string, any> = {
  announcement: {
    enabled: false,
    text: "🎉 New BDS questions added! Start practicing now.",
    type: "info", // info | success | warning
    dismissible: true,
  },
  hero: {
    badge: "India's #1 MCQ Platform for Medical Students",
    headline: "Crack Your Medical Exams with",
    headlineHighlight: "Daily MCQ Practice",
    subtext: "Join <strong>5,000+ medical students</strong> who practice daily on our platform. Timed tests, AI analytics, leaderboards — everything you need to <strong>top your exam.</strong>",
    ctaPrimary: "Start Practicing Free",
    ctaSecondary: "Already a member? Login",
    trustLine: "✅ Free to start &nbsp;•&nbsp; ✅ No credit card needed &nbsp;•&nbsp; ✅ Instant access",
  },
  stats: [
    { value: "5,000+", label: "Active Students", color: "text-primary-600" },
    { value: "3,100+", label: "MCQ Questions", color: "text-emerald-600" },
    { value: "12,000+", label: "Tests Conducted", color: "text-amber-600" },
    { value: "4.9/5", label: "Student Rating", color: "text-rose-600" },
  ],
  features: [
    { icon: "Zap", iconColor: "text-yellow-500", title: "Real-Time Analytics", desc: "See your score, speed, accuracy & rank the moment you submit." },
    { icon: "ShieldCheck", iconColor: "text-emerald-500", title: "Verified Questions", desc: "Every MCQ is reviewed by experienced medical educators & toppers." },
    { icon: "Brain", iconColor: "text-primary-500", title: "AI Weakness Finder", desc: "Our system identifies your weak topics and creates a personalized study plan." },
    { icon: "Clock", iconColor: "text-rose-500", title: "Timed Practice Mode", desc: "Simulate real exam pressure with countdown timers and timed series." },
    { icon: "Trophy", iconColor: "text-amber-500", title: "Leaderboard & Badges", desc: "Compete with students across India and earn achievement badges." },
    { icon: "TrendingUp", iconColor: "text-indigo-500", title: "Daily Streak System", desc: "Build habits with daily practice challenges and streak rewards." },
  ],
  testimonials: [
    { name: "Priya Sharma", role: "MBBS Student, AIIMS Delhi", text: "Daily Dose MCQ is literally the best platform I've used for exam prep. The analytics helped me identify my weak chapters in Anatomy within a week.", rating: 5, avatar: "P", avatarColor: "bg-primary-500" },
    { name: "Rahul Verma", role: "BSc Nursing, Final Year", text: "I was scoring 55% before joining. After 3 weeks of daily practice here, I jumped to 82%. The questions are exactly like the real exam pattern!", rating: 5, avatar: "R", avatarColor: "bg-emerald-500" },
    { name: "Sneha Patel", role: "Pharmacy Student, Ahmedabad", text: "The interface feels so premium and clean. No distractions during the test. Plus the Instagram page (@docmcq) keeps me motivated every single day!", rating: 5, avatar: "S", avatarColor: "bg-rose-500" },
  ],
  about: {
    title: "About Us",
    intro: "Welcome to <strong>Daily Dose MCQ</strong>, the premier platform dedicated to empowering medical professionals, nursing students, and healthcare practitioners across the globe. Our mission is to transform the way medical students prepare for their crucial examinations through intelligent, high-quality, and accessible assessment tools.",
    cards: [
      { icon: "HeartPulse", iconColor: "text-rose-500", title: "Our Passion", desc: "Driven by a deep passion for healthcare education, we strive to make learning engaging and effective for every student." },
      { icon: "BrainCircuit", iconColor: "text-primary-500", title: "Smart Learning", desc: "We utilize data-driven insights and AI analytics to help you identify your weak points and improve your knowledge retention." },
      { icon: "ShieldCheck", iconColor: "text-emerald-500", title: "Quality Content", desc: "Every single question is curated, reviewed, and verified by top medical educators to ensure the highest standards of accuracy." },
    ],
    vision: "We envision a world where every medical student—whether pursuing their MBBS, BDS, Nursing, Pharmacy, or Paramedical studies—has access to a world-class testing environment. Traditional test series are often cluttered, outdated, and uninspiring. We set out to change that by building an interface that mimics real-world medical testing environments while remaining clean, fast, and completely distraction-free.",
    whyChoose: "Medical entrance exams and professional licensing tests are among the most competitive in the world. Success requires more than just reading textbooks; it requires active recall, strategic practice, and continuous self-assessment. That is exactly what we provide. Our dynamic gamified analytics, speed vs. accuracy matrices, and topic-wise weakness identifiers ensure that you are not just taking tests blindly, but actually learning and improving with every single attempt.",
    closing: "Join thousands of other students who have already trusted Daily Dose MCQ to guide their preparation. Start practicing today, track your growth, and confidently take the next step in your medical career.",
  },
  settings: {
    siteName: "Daily Dose MCQ",
    tagline: "India's #1 MCQ Platform for Medical Students",
    contactEmail: "support@dailydosemcq.com",
    instagram: "https://instagram.com/docmcq",
    youtube: "",
    whatsapp: "",
    telegram: "",
    footerText: "© 2025 Daily Dose MCQ. All rights reserved.",
  },
  faq: [
    { question: "Is the platform free to use?", answer: "Yes! You can start practicing for free. We offer unlimited access to our MCQ bank with no credit card required." },
    { question: "Which medical exams are covered?", answer: "We cover MBBS, BDS, Nursing (BSc/GNM), Pharmacy (B.Pharm/D.Pharm), and Paramedical exams. New categories are added regularly." },
    { question: "How are the questions verified?", answer: "Every MCQ is curated and reviewed by experienced medical educators and top-ranking students to ensure accuracy and relevance." },
    { question: "Can I track my progress?", answer: "Absolutely! Our analytics dashboard shows your score history, accuracy rates, topic-wise weaknesses, and average time per question." },
    { question: "How many questions are in the bank?", answer: "We have 3,100+ verified MCQs and add new questions every week based on the latest exam patterns." },
  ],
};

// ── GET: Public — return all content or a specific section ──────────────────
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const section = req.nextUrl.searchParams.get('section');

    if (section) {
      const doc = await SiteContent.findOne({ key: section }).lean();
      const data = doc ? (doc as any).data : DEFAULT_CONTENT[section] ?? null;
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
      });
    }

    // Return all sections merged with defaults
    const docs = await SiteContent.find({}).lean() as any[];
    const result: Record<string, any> = { ...DEFAULT_CONTENT };
    docs.forEach((doc) => { result[doc.key] = doc.data; });
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    });
  } catch (err) {
    return NextResponse.json(DEFAULT_CONTENT);
  }
}

// ── PUT: Admin only — update a section ─────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { key, data } = body;
    if (!key || data === undefined) return NextResponse.json({ error: 'Missing key or data' }, { status: 400 });

    await dbConnect();
    await SiteContent.findOneAndUpdate(
      { key },
      { key, data, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
