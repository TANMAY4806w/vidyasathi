import Link from "next/link";
import {
  Sparkles,
  Gamepad2,
  LayoutDashboard,
  Zap,
  ShieldCheck,
  ArrowRight,
  Mic,
  PenTool,
  Brain,
  Star,
  Activity,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col">

      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className="bg-canvas border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-canvas/95">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-soft shrink-0">
              <Star className="w-4.5 h-4.5 fill-white" strokeWidth={0} style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <div className="flex items-center gap-2 leading-none">
                <span className="text-[17px] font-bold tracking-tight text-ink">VidyaSathi</span>
                <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                  विद्यासाथी
                </span>
              </div>
              <p className="text-[11px] text-ink-3 font-medium mt-0.5">PRASUNEX INNOVATHON 2026 · Team Dynamic Duo</p>
            </div>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-success-700 bg-success-50 border border-success-500/20 px-3 py-1.5 rounded-full">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success-500"></span>
              </span>
              NEP 2020 · DPDP Act Compliant
            </span>
            <Link
              href="/demo"
              className="btn btn-sm bg-warn-500 text-white hover:bg-warn-700 font-bold shadow-soft"
            >
              <Zap className="w-3.5 h-3.5" />
              Jury Fast-Pass
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-8 py-14 sm:py-20">

        {/* Eyebrow pill */}
        <div className="flex justify-center mb-7 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-canvas border border-border shadow-xs text-[12px] font-semibold text-ink-2">
            <Activity className="w-3.5 h-3.5 text-brand-500" />
            Turnkey Inclusive Education Module · PRASUNEX Education OS
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto animate-fade-up-delay-1">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tightest text-ink leading-[1.1] mb-5">
            Every child learns{" "}
            <span className="relative inline-block">
              differently.
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 10" fill="none" aria-hidden>
                <path d="M2 7 Q75 2 150 7 Q225 12 298 5" stroke="#4353FF" strokeWidth="3" strokeLinecap="round" fill="none"/>
              </svg>
            </span>
            <br />
            <span className="text-brand-500">Understand them early.</span>
          </h1>
          <p className="text-base sm:text-lg text-ink-2 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
            A 15-minute gamified quest for Classes 1–8. Identifies signs of{" "}
            <strong className="text-ink font-semibold">Dyslexia, Dysgraphia, Dyscalculia, and ADHD</strong>{" "}
            directly in the browser — zero cloud cost.
          </p>

          {/* Metric strip */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-sm text-ink-3 font-medium mb-10">
            {[
              { icon: "⏱", label: "15-Min Quest" },
              { icon: "₹", label: "Zero Cloud Cost" },
              { icon: "🇮🇳", label: "Hindi · English IEP" },
            ].map((m) => (
              <span key={m.label} className="flex items-center gap-1.5">
                <span className="text-base">{m.icon}</span>
                {m.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── 3 Core Pathway Cards ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto animate-fade-up-delay-2">

          {/* Card 1 — Student Quest */}
          <Link
            href="/quest"
            className="group relative flex flex-col bg-canvas rounded-2xl border border-border shadow-card hover:shadow-elevated hover:border-brand-300 transition-all duration-200 ease-spring overflow-hidden"
          >
            {/* Top accent stripe */}
            <div className="h-1 w-full bg-brand-500" />
            <div className="p-6 sm:p-7 flex flex-col flex-1">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200 ease-spring">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-[15px] font-bold text-ink tracking-tight">Student Space Quest</h2>
                <span className="badge badge-brand">For Kids</span>
              </div>
              <p className="text-[13px] text-ink-2 leading-relaxed mb-6 flex-1">
                Interactive space missions: microphone speech reading, handwriting star tracing, and 400 ms flash comet counting.
              </p>
              <div className="flex items-center justify-between text-[12px] font-semibold text-brand-600 group-hover:translate-x-0.5 transition-transform">
                <span>Start 15-Min Screening Quest</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Card 2 — Teacher Hub */}
          <Link
            href="/dashboard"
            className="group relative flex flex-col bg-canvas rounded-2xl border border-border shadow-card hover:shadow-elevated hover:border-success-500/50 transition-all duration-200 ease-spring overflow-hidden"
          >
            <div className="h-1 w-full bg-success-500" />
            <div className="p-6 sm:p-7 flex flex-col flex-1">
              <div className="w-12 h-12 rounded-xl bg-success-50 text-success-500 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200 ease-spring">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-[15px] font-bold text-ink tracking-tight">Teacher Diagnostic Hub</h2>
                <span className="badge badge-success">Educators</span>
              </div>
              <p className="text-[13px] text-ink-2 leading-relaxed mb-6 flex-1">
                Class rosters, DSM-5 percentile gauges, printable NEP 2020 bilingual IEPs, and PRASUNEX ERP sync.
              </p>
              <div className="flex items-center justify-between text-[12px] font-semibold text-success-700 group-hover:translate-x-0.5 transition-transform">
                <span>Open Class Roster & IEPs</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Card 3 — Jury Fast-Pass */}
          <Link
            href="/demo"
            className="group relative flex flex-col bg-canvas rounded-2xl border border-warn-500/40 shadow-card hover:shadow-elevated hover:border-warn-500 transition-all duration-200 ease-spring overflow-hidden"
          >
            <div className="h-1 w-full bg-warn-500" />
            <div className="p-6 sm:p-7 flex flex-col flex-1">
              <div className="w-12 h-12 rounded-xl bg-warn-50 text-warn-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200 ease-spring">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-[15px] font-bold text-ink tracking-tight">⚡ Jury Fast-Pass</h2>
                <span className="badge badge-warn">30 SEC</span>
              </div>
              <p className="text-[13px] text-ink-2 leading-relaxed mb-6 flex-1">
                Pre-calibrated profiles letting hackathon judges verify scoring, Gemini IEP, and ERP webhook in 30 seconds.
              </p>
              <div className="flex items-center justify-between text-[12px] font-semibold text-warn-700 group-hover:translate-x-0.5 transition-transform">
                <span>Launch Evaluation Console</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* ── Screening Architecture Pillars ───────────────── */}
        <section className="mt-20 pt-14 border-t border-border animate-fade-up-delay-3">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink-3 mb-2">
              Multi-Modal Screening Engine
            </p>
            <h3 className="text-2xl font-bold text-ink tracking-tight">
              How VidyaSathi screens — without intimidation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <Mic className="w-5 h-5" />,
                color: "text-brand-500",
                bg: "bg-brand-50",
                label: "Dyslexia Screener",
                desc: "Web Audio API measures Vocal Onset Latency and phoneme pauses against visual word stimuli.",
              },
              {
                icon: <PenTool className="w-5 h-5" />,
                color: "text-sky-500",
                bg: "bg-sky-50",
                label: "Dysgraphia Screener",
                desc: "HTML5 PointerEvents track pencil tremor, micro-jitter, pen-lifts, and reversal curves.",
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                color: "text-warn-500",
                bg: "bg-warn-50",
                label: "Dyscalculia Screener",
                desc: "400 ms flash subitizing tests: rapid visual number sense vs. slow serial counting.",
              },
              {
                icon: <Brain className="w-5 h-5" />,
                color: "text-success-500",
                bg: "bg-success-50",
                label: "ADHD Focus Metric",
                desc: "Passive reaction-time variance (σ), impulsive tap detection, and attention drift logging.",
              },
            ].map((p, i) => (
              <div
                key={p.label}
                className="p-5 rounded-2xl bg-canvas border border-border shadow-xs hover:shadow-soft transition-shadow"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className={`w-9 h-9 rounded-lg ${p.bg} ${p.color} flex items-center justify-center mb-4`}>
                  {p.icon}
                </div>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${p.color} mb-1.5`}>
                  {i + 1}. {p.label}
                </p>
                <p className="text-[13px] text-ink-2 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Social proof strip ───────────────────────────── */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[
            { icon: <Users className="w-4 h-4" />, text: "Classes 1–8 · Ages 6–14" },
            { icon: <ShieldCheck className="w-4 h-4" />, text: "DPDP Act 2023 · RAM-only processing" },
            { icon: <Star className="w-4 h-4" />, text: "DSM-5 Standardized Scoring" },
          ].map((s) => (
            <div key={s.text} className="flex items-center gap-2 text-[12px] font-medium text-ink-3">
              <span className="text-brand-400">{s.icon}</span>
              {s.text}
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-canvas border-t border-border py-5">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-ink-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-success-500 shrink-0" />
            <span>
              <strong className="text-ink-2 font-semibold">DPDP Act 2023:</strong>{" "}
              Client-side RAM processing only. Zero recordings stored or uploaded.
            </span>
          </div>
          <span className="font-medium text-ink-2">
            Team Dynamic Duo — <strong>Tanmay Patil</strong> &amp; <strong>Rajat Gupta</strong>
          </span>
        </div>
      </footer>
    </div>
  );
}
