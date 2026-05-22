import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const BASE_URL = "https://www.dailydosemcq.com";

export const metadata: Metadata = {
  // ─── Core ───────────────────────────────────────────────────────────────
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Daily Dose MCQ | Free Medical MCQ Practice for MBBS, Nursing & Pharmacy",
    template: "%s | Daily Dose MCQ",
  },
  description:
    "India's #1 free online MCQ platform for MBBS, Nursing, BDS, Pharmacy & Paramedical students. Take timed tests, get AI analytics, track your rank, and crack your medical exams. Practice 3000+ verified questions daily.",

  // ─── Keywords (White Hat – all relevant, no stuffing) ────────────────────
  keywords: [
    "medical MCQ online",
    "MBBS MCQ questions",
    "nursing MCQ questions India",
    "free medical MCQ test",
    "online MCQ test for nursing students",
    "NEET MCQ practice",
    "pharmacy MCQ questions",
    "BDS MCQ practice",
    "paramedical MCQ questions",
    "daily MCQ practice medical",
    "online medical exam preparation",
    "MBBS question bank",
    "nursing exam questions",
    "medical entrance MCQ",
    "staff nurse MCQ",
    "ANM MCQ questions",
    "GNM nursing MCQ",
    "AIIMS nursing MCQ",
    "PGIMER nursing exam",
    "medical quiz online",
    "MCQ test with answers",
    "timed MCQ test medical",
    "medical student practice test",
    "anatomy MCQ",
    "physiology MCQ",
    "pharmacology MCQ",
    "microbiology MCQ",
    "pathology MCQ",
    "community health nursing MCQ",
    "docmcq",
    "daily dose mcq",
  ],

  // ─── Authors & Creator ───────────────────────────────────────────────────
  authors: [{ name: "Daily Dose MCQ", url: BASE_URL }],
  creator: "Daily Dose MCQ (@docmcq)",
  publisher: "Daily Dose MCQ",

  // ─── Canonical ───────────────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  // ─── Robots ──────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── Open Graph (WhatsApp, Facebook, LinkedIn) ──────────────────────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Daily Dose MCQ",
    title: "Daily Dose MCQ | Free Medical MCQ Practice — MBBS, Nursing, Pharmacy",
    description:
      "Practice 3000+ verified MCQ questions for MBBS, Nursing, BDS, and Pharmacy. AI analytics, timed tests, leaderboard & daily streaks. Join 5000+ students today — completely free!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Daily Dose MCQ — Medical MCQ Platform for Indian Students",
      },
    ],
  },

  // ─── Twitter / X ─────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Daily Dose MCQ | Free Medical MCQ Practice for MBBS & Nursing",
    description:
      "India's best free MCQ platform for medical students. Timed tests, AI analytics, leaderboards. Join free → dailydosemcq.com",
    images: ["/og-image.png"],
    creator: "@docmcq",
  },

  // ─── App / PWA ────────────────────────────────────────────────────────────
  applicationName: "Daily Dose MCQ",
  category: "Education",
  classification: "Medical Education, Exam Preparation",
};

// ─── JSON-LD Structured Data ────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Daily Dose MCQ",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon.png`,
      },
      sameAs: ["https://www.instagram.com/docmcq"],
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@dailydosemcq.com",
        contactType: "customer support",
        availableLanguage: ["English", "Hindi"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Daily Dose MCQ",
      description:
        "India's #1 free MCQ platform for MBBS, Nursing, BDS, Pharmacy & Paramedical students.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/dashboard?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${BASE_URL}/#edorg`,
      name: "Daily Dose MCQ",
      url: BASE_URL,
      description:
        "We conduct high-quality MCQ tests for medical students across India including MBBS, Nursing, Pharmacy, BDS, and Paramedical programs.",
      foundingDate: "2024",
      areaServed: "IN",
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is Daily Dose MCQ free for medical students?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! Daily Dose MCQ is completely free to get started. Students can register, access tests, and view their analytics at no cost.",
          },
        },
        {
          "@type": "Question",
          name: "Which medical exams does Daily Dose MCQ cover?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Daily Dose MCQ covers MBBS, Nursing (GNM, ANM, BSc Nursing), BDS, Pharmacy (B.Pharm, D.Pharm), and Paramedical entrance and licensing exams across India.",
          },
        },
        {
          "@type": "Question",
          name: "How does the AI analytics feature work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "After every test, our platform analyzes your performance topic-by-topic, identifies your weak areas, and generates a personalized improvement recommendation to help you study smarter.",
          },
        },
        {
          "@type": "Question",
          name: "Where can I find Daily Dose MCQ on social media?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Follow us on Instagram at @docmcq for daily MCQ questions, exam tips, medical reels, and motivational content for medical students.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Geo tags for India targeting */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta name="rating" content="general" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
