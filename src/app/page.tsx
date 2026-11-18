import Link from "next/link";
import { Sparkles, Gamepad2, LayoutDashboard, Zap, ShieldCheck, HeartHandshake } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between p-6 sm:p-10 max-w-6xl mx-auto">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-nebula-purple to-nebula-cyan flex items-center justify-center shadow-lg shadow-nebula-purple/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              VidyaSathi <span className="text-nebula-cyan text-base font-normal font-sans">(विद्यासाथी)</span>
            </h1>
            <p className="text-xs text-slate-400">PRASUNEX INNOVATHON 2026 • Team Dynamic Duo</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Zero-Cost Edge Architecture
          </span>
        </div>
      </header>

      {/* Hero Content */}
      <section className="my-auto py-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 mb-6">
          <Zap className="w-3.5 h-3.5 text-star-gold" />
          <span>15-Minute Gamified SLD Early Screening & Automated Bilingual IEP</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight text-white mb-6">
          Early intervention for every child, <br />
          <span className="bg-gradient-to-r from-nebula-cyan via-nebula-purple to-pink-500 bg-clip-text text-transparent">
            without fear or financial barriers.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Screen for Dyslexia, Dysgraphia, Dyscalculia, and ADHD directly in the web browser using acoustic speech analysis and canvas kinematics at $0.00 cloud cost.
        </p>

        {/* Action Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto text-left">
          {/* Pathway 1: Child Quest */}
          <Link
            href="/quest"
            className="p-6 rounded-2xl bg-cosmic-900 border border-slate-800 hover:border-nebula-purple/50 transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-nebula-purple/20 border border-nebula-purple/30 flex items-center justify-center mb-4 text-nebula-purple group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Space Explorer Quest</h3>
              <p className="text-xs text-slate-400 mb-4">
                15-minute gamified missions tracking vocal latency, handwriting tremor, and subitizing reactions.
              </p>
            </div>
            <span className="text-xs font-semibold text-nebula-purple group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Start Student Quest &rarr;
            </span>
          </Link>

          {/* Pathway 2: Teacher Hub */}
          <Link
            href="/dashboard"
            className="p-6 rounded-2xl bg-cosmic-900 border border-slate-800 hover:border-nebula-cyan/50 transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-nebula-cyan/20 border border-nebula-cyan/30 flex items-center justify-center mb-4 text-nebula-cyan group-hover:scale-105 transition-transform">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Teacher & Clinical Hub</h3>
              <p className="text-xs text-slate-400 mb-4">
                Classroom risk rosters, NEP 2020 bilingual IEP generator, and PRASUNEX Education OS sync.
              </p>
            </div>
            <span className="text-xs font-semibold text-nebula-cyan group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Open Teacher Hub &rarr;
            </span>
          </Link>

          {/* Pathway 3: Jury Fast-Pass */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-cosmic-900 to-cosmic-850 border border-star-gold/40 hover:border-star-gold transition-all group flex flex-col justify-between shadow-lg shadow-star-gold/5">
            <div>
              <div className="w-12 h-12 rounded-xl bg-star-gold/20 border border-star-gold/30 flex items-center justify-center mb-4 text-star-gold group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-white">⚡ Jury Fast-Pass</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-star-gold text-cosmic-950">30 SEC</span>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Pre-calibrated profiles allowing hackathon judges to inspect complete screening & Gemini IEP in 30s.
              </p>
            </div>
            <span className="text-xs font-semibold text-star-gold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Launch Jury Mode &rarr;
            </span>
          </div>
        </div>
      </section>

      {/* Footer Badges */}
      <footer className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>DPDP Act 2023 Compliant: Zero audio/image uploads, 100% RAM-only edge telemetry.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">Team Dynamic Duo: Tanmay Patil & Rajat Gupta</span>
        </div>
      </footer>
    </main>
  );
}
