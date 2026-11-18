"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Award, Shield, CheckCircle, Activity } from "lucide-react";
import StarEchoesMission, { Mission1Telemetry } from "@/components/quest/missions/StarEchoesMission";

export default function QuestPage() {
  const [mission1Data, setMission1Data] = useState<Mission1Telemetry | null>(null);

  const handleMission1Complete = (telemetry: Mission1Telemetry) => {
    setMission1Data(telemetry);
  };

  return (
    <div className="min-h-screen bg-cosmic-950 text-slate-100 p-4 sm:p-8 flex flex-col justify-between max-w-5xl mx-auto">
      {/* Navigation & Progress Header */}
      <header className="flex items-center justify-between py-4 border-b border-slate-800">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Hub</span>
        </Link>

        {/* Quest Step Indicators */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-nebula-purple/20 border border-nebula-purple/40 text-nebula-purple text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mission 1: Star Echoes</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-500">Mission 2: Constellation Tracing</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-500">Mission 3: Comet Collector</span>
        </div>

        <div className="text-xs text-slate-400">
          Student ID: <span className="font-mono text-slate-200">ASTRO-042</span>
        </div>
      </header>

      {/* Main Quest Arena */}
      <main className="my-auto py-8">
        {!mission1Data ? (
          <StarEchoesMission onComplete={handleMission1Complete} />
        ) : (
          /* Mission 1 Completion Telemetry Card */
          <div className="w-full max-w-2xl mx-auto p-8 bg-cosmic-900 border border-emerald-500/40 rounded-3xl shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Mission 1 Completed! ⭐</h2>
              <p className="text-sm text-slate-400 mt-1">
                Star Echoes acoustic telemetry captured in browser RAM.
              </p>
            </div>

            {/* Metric Readout Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-cosmic-950 border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400">Avg Vocal Latency</span>
                <div className="text-xl font-extrabold text-nebula-cyan mt-1">
                  {mission1Data.avgVocalOnsetLatencyMs} ms
                </div>
                <span className="text-[10px] text-slate-500">Normative: 300-800ms</span>
              </div>

              <div className="p-4 rounded-xl bg-cosmic-950 border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400">Mid-Word Pauses</span>
                <div className="text-xl font-extrabold text-star-gold mt-1">
                  {mission1Data.totalPauses} pauses
                </div>
                <span className="text-[10px] text-slate-500">&gt;250ms hesitation</span>
              </div>

              <div className="p-4 rounded-xl bg-cosmic-950 border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400">Phonemic Score</span>
                <div className="text-xl font-extrabold text-emerald-400 mt-1">
                  {mission1Data.avgPhonemeAccuracy}%
                </div>
                <span className="text-[10px] text-slate-500">
                  {mission1Data.micUsed ? "Mic Live Input" : "Touch Fallback"}
                </span>
              </div>
            </div>

            {/* Stimulus breakdown list */}
            <div className="p-4 rounded-xl bg-cosmic-950 border border-slate-800 text-left">
              <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-nebula-cyan" />
                Individual Card Biomarker Log:
              </h4>
              <div className="space-y-1.5 font-mono text-xs text-slate-400">
                {mission1Data.stimulusResults.map((s) => (
                  <div key={s.stimulusId} className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-200">Word &quot;{s.word}&quot;</span>
                    <span>VOL: <strong className="text-white">{s.vocalOnsetLatencyMs}ms</strong></span>
                    <span>Pauses: <strong className="text-white">{s.pauseCountOver250ms}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Mission Button */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setMission1Data(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Replay Mission 1
              </button>
              <button
                onClick={() => alert("Mission 2 (Constellation Tracing) is the next engineering piece!")}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-nebula-purple to-nebula-cyan text-white text-xs font-bold shadow-lg shadow-nebula-purple/30 hover:opacity-95 transition-all"
              >
                Proceed to Mission 2 &rarr;
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Safety Compliance Footer */}
      <footer className="py-4 border-t border-slate-800/80 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Shield className="w-3.5 h-3.5 text-emerald-400" />
        <span>Client-side audio signal processing only. No voice recordings leave this device.</span>
      </footer>
    </div>
  );
}
