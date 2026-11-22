import Link from "next/link";
import {
  Sparkles,
  Gamepad2,
  LayoutDashboard,
  Zap,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  BookOpen,
  Mic,
  PenTool,
  Brain,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-edu-50 text-edu-900 flex flex-col justify-between selection:bg-edu-primaryLight selection:text-edu-primary">
      {/* Top Navbar */}
      <header className="bg-white border-b border-edu-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-edu-primary text-white flex items-center justify-center shadow-soft">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-edu-900">
                  VidyaSathi
                </span>
                <span className="text-sm font-semibold text-edu-primary bg-edu-primaryLight px-2 py-0.5 rounded-full">
                  विद्यासाथी
                </span>
              </div>
              <p className="text-xs text-edu-500 font-medium">
                PRASUNEX INNOVATHON 2026 • Team Dynamic Duo
              </p>
            </div>
          </div>

          {/* Institutional Status & Fast Navigation */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium bg-edu-emeraldLight text-edu-emerald border border-edu-emerald/20">
              <span className="w-2 h-2 rounded-full bg-edu-emerald animate-pulse" />
              NEP 2020 & DPDP Act Compliant
            </span>
            <Link
              href="/demo"
              className="px-3.5 py-1.5 rounded-xl bg-edu-amber text-edu-900 font-bold hover:bg-amber-400 transition-colors shadow-soft flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Jury Fast-Pass</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 my-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Category Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-edu-200 text-xs font-semibold text-edu-700 shadow-soft mb-6">
            <HeartHandshake className="w-4 h-4 text-edu-primary" />
            <span>Turnkey Inclusive Education Module for PRASUNEX Education OS</span>
          </div>

          {/* Main Pedagogical Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-edu-900 leading-[1.18] mb-5">
            Every child learns differently. <br />
            <span className="text-edu-primary">
              Let&apos;s understand them early, without clinical fear.
            </span>
          </h1>

          {/* Empathetic Subtext */}
          <p className="text-base sm:text-lg text-edu-600 leading-relaxed max-w-2xl mx-auto mb-8">
            A 15-minute gamified space quest for elementary schools (Classes 1–8).
            Identifies early signs of <strong>Dyslexia, Dysgraphia, Dyscalculia, and ADHD</strong> directly in any web browser at zero cloud compute cost.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-edu-600 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-edu-emerald" />
              15-Min Gamified Quest
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-edu-emerald" />
              ₹0.00 In-Browser AI (No GPU bill)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-edu-emerald" />
              Bilingual IEP (English &amp; हिंदी)
            </span>
          </div>
        </div>

        {/* 3 Core Pathway Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Student Space Quest */}
          <Link
            href="/quest"
            className="group p-6 sm:p-7 rounded-3xl bg-white border-2 border-edu-200 hover:border-edu-primary transition-all shadow-soft hover:shadow-elevated flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-edu-skyLight text-edu-sky flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-bold text-edu-900">Student Space Quest</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-edu-skyLight text-edu-sky px-2 py-0.5 rounded-md">
                  For Kids
                </span>
              </div>
              <p className="text-xs sm:text-sm text-edu-600 leading-relaxed mb-6">
                Interactive space missions: microphone speech reading, handwriting star tracing, and 400ms flash comet counting.
              </p>
            </div>
            <div className="pt-4 border-t border-edu-100 flex items-center justify-between text-xs font-bold text-edu-primary group-hover:translate-x-1 transition-transform">
              <span>Start 15-Min Screening Quest</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Teacher & Clinical Hub */}
          <Link
            href="/dashboard"
            className="group p-6 sm:p-7 rounded-3xl bg-white border-2 border-edu-200 hover:border-edu-primary transition-all shadow-soft hover:shadow-elevated flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-edu-emeraldLight text-edu-emerald flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-bold text-edu-900">Teacher Diagnostic Hub</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-edu-emeraldLight text-edu-emerald px-2 py-0.5 rounded-md">
                  Educators
                </span>
              </div>
              <p className="text-xs sm:text-sm text-edu-600 leading-relaxed mb-6">
                Classroom risk rosters, 4-gauge DSM-5 percentile breakdowns, printable NEP 2020 IEPs, and PRASUNEX ERP sync.
              </p>
            </div>
            <div className="pt-4 border-t border-edu-100 flex items-center justify-between text-xs font-bold text-edu-emerald group-hover:translate-x-1 transition-transform">
              <span>Open Class Roster &amp; IEPs</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Jury Fast-Pass (30-Sec Evaluation) */}
          <Link
            href="/demo"
            className="group p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-amber-50 to-white border-2 border-edu-amber hover:border-amber-500 transition-all shadow-card hover:shadow-elevated flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-edu-amberLight text-edu-amber flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-bold text-edu-900">⚡ Jury Fast-Pass</h2>
                <span className="text-[10px] font-black uppercase tracking-wider bg-edu-amber text-edu-900 px-2 py-0.5 rounded-md">
                  30 SEC DEMO
                </span>
              </div>
              <p className="text-xs sm:text-sm text-edu-700 leading-relaxed mb-6">
                Pre-calibrated profiles allowing hackathon judges to verify real-time scoring, live Gemini IEP, and ERP webhook sync in 30s.
              </p>
            </div>
            <div className="pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">
              <span>Launch 30-Sec Evaluation Console</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* 4 Pedagogical Pillars Section */}
        <section className="mt-16 pt-12 border-t border-edu-200">
          <div className="text-center mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-edu-500">
              Multi-Modal Screening Architecture
            </h3>
            <p className="text-lg font-bold text-edu-900 mt-1">
              How VidyaSathi screens without psychological intimidation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-edu-200 shadow-soft">
              <div className="flex items-center gap-2 text-edu-primary font-bold text-xs mb-2">
                <Mic className="w-4 h-4" />
                <span>1. Dyslexia Screener</span>
              </div>
              <p className="text-xs text-edu-600">
                In-browser Web Audio API measures Vocal Onset Latency (VOL) and mid-word pauses against visual words.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-edu-200 shadow-soft">
              <div className="flex items-center gap-2 text-edu-sky font-bold text-xs mb-2">
                <PenTool className="w-4 h-4" />
                <span>2. Dysgraphia Screener</span>
              </div>
              <p className="text-xs text-edu-600">
                HTML5 pointer kinematics track pencil tremor, micro-jitter, pen-lifts, and character reversal curves.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-edu-200 shadow-soft">
              <div className="flex items-center gap-2 text-edu-amber font-bold text-xs mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>3. Dyscalculia Screener</span>
              </div>
              <p className="text-xs text-edu-600">
                400ms flash subitizing tests measuring rapid visual number sense versus slow serial counting.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-edu-200 shadow-soft">
              <div className="flex items-center gap-2 text-edu-emerald font-bold text-xs mb-2">
                <Brain className="w-4 h-4" />
                <span>4. ADHD Focus Metric</span>
              </div>
              <p className="text-xs text-edu-600">
                Passive background logger tracking reaction time variance (σ), impulsive taps, and attention drift.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Educational Trust Footer */}
      <footer className="bg-white border-t border-edu-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-edu-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-edu-emerald" />
            <span>
              <strong>DPDP Act 2023 Compliant:</strong> Client-side RAM processing only. Zero student voice recordings or drawings are ever stored or uploaded.
            </span>
          </div>
          <div className="text-edu-600 font-medium">
            Team Dynamic Duo: <strong>Tanmay Patil</strong> &amp; <strong>Rajat Gupta</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
