"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Award, Shield, CheckCircle, Activity, PenTool } from "lucide-react";
import StarEchoesMission, { Mission1Telemetry } from "@/components/quest/missions/StarEchoesMission";
import ConstellationTracingMission, { Mission2Telemetry } from "@/components/quest/missions/ConstellationTracingMission";

type QuestStep = "MISSION_1" | "MISSION_2" | "COMPLETED";

export default function QuestPage() {
  const [currentStep, setCurrentStep] = useState<QuestStep>("MISSION_1");
  const [mission1Data, setMission1Data] = useState<Mission1Telemetry | null>(null);
  const [mission2Data, setMission2Data] = useState<Mission2Telemetry | null>(null);

  const handleMission1Complete = (telemetry: Mission1Telemetry) => {
    setMission1Data(telemetry);
    setCurrentStep("MISSION_2");
  };

  const handleMission2Complete = (telemetry: Mission2Telemetry) => {
    setMission2Data(telemetry);
    setCurrentStep("COMPLETED");
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
          {/* Mission 1 Indicator */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              currentStep === "MISSION_1"
                ? "bg-nebula-purple/20 border border-nebula-purple/40 text-nebula-purple"
                : mission1Data
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "text-slate-500"
            }`}
          >
            {mission1Data ? <CheckCircle className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Mission 1: Speech</span>
          </div>

          <span className="text-slate-700">•</span>

          {/* Mission 2 Indicator */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              currentStep === "MISSION_2"
                ? "bg-nebula-cyan/20 border border-nebula-cyan/40 text-nebula-cyan"
                : mission2Data
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "text-slate-500"
            }`}
          >
            {mission2Data ? <CheckCircle className="w-3.5 h-3.5" /> : <PenTool className="w-3.5 h-3.5" />}
            <span>Mission 2: Tracing</span>
          </div>

          <span className="text-slate-700">•</span>
          <span className="text-xs text-slate-600">Mission 3: Subitizing</span>
        </div>

        <div className="text-xs text-slate-400">
          Student ID: <span className="font-mono text-slate-200">ASTRO-042</span>
        </div>
      </header>

      {/* Main Quest Arena */}
      <main className="my-auto py-8">
        {currentStep === "MISSION_1" && (
          <StarEchoesMission onComplete={handleMission1Complete} />
        )}

        {currentStep === "MISSION_2" && (
          <ConstellationTracingMission
            onComplete={handleMission2Complete}
            onSkip={() => setCurrentStep("COMPLETED")}
          />
        )}

        {currentStep === "COMPLETED" && mission1Data && mission2Data && (
          /* Multi-Modal Telemetry Summary Card */
          <div className="w-full max-w-3xl mx-auto p-8 bg-cosmic-900 border border-emerald-500/40 rounded-3xl shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Multimodal Missions 1 & 2 Completed! ⭐</h2>
              <p className="text-sm text-slate-400 mt-1">
                Both speech acoustic biomarkers and kinematic handwriting vectors captured in browser memory.
              </p>
            </div>

            {/* Metric Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {/* Mission 1 (Dyslexia) Readout */}
              <div className="p-5 rounded-2xl bg-cosmic-950 border border-nebula-purple/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-nebula-purple flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Speech Acoustics (Dyslexia)
                  </h4>
                  <span className="text-[10px] text-slate-400">Web Audio API</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Vocal Onset Latency:</span>
                    <strong className="text-white font-mono">{mission1Data.avgVocalOnsetLatencyMs} ms</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mid-Word Pauses (&gt;250ms):</span>
                    <strong className="text-white font-mono">{mission1Data.totalPauses}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phonemic Accuracy:</span>
                    <strong className="text-emerald-400 font-mono">{mission1Data.avgPhonemeAccuracy}%</strong>
                  </div>
                </div>
              </div>

              {/* Mission 2 (Dysgraphia) Readout */}
              <div className="p-5 rounded-2xl bg-cosmic-950 border border-nebula-cyan/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-nebula-cyan flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5" />
                    Kinematic Canvas (Dysgraphia)
                  </h4>
                  <span className="text-[10px] text-slate-400">HTML5 PointerEvents</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kinematic Jitter (Tremor):</span>
                    <strong className="text-white font-mono">{mission2Data.avgKinematicJitterScore} / 1.0</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pen-Lifts / Stroke Count:</span>
                    <strong className="text-white font-mono">{mission2Data.totalPenLifts}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reversal Tendency Index:</span>
                    <strong className="text-star-gold font-mono">{mission2Data.reversalTendencyScore}%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps CTA */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setCurrentStep("MISSION_1");
                  setMission1Data(null);
                  setMission2Data(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Restart Screening
              </button>
              <button
                onClick={() => alert("Mission 3 (Comet Collector - Dyscalculia Subitizing) is the next engineering piece!")}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-nebula-cyan to-nebula-purple text-white text-xs font-bold shadow-lg shadow-nebula-cyan/30 hover:opacity-95 transition-all"
              >
                Proceed to Mission 3 &rarr;
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Safety Compliance Footer */}
      <footer className="py-4 border-t border-slate-800/80 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Shield className="w-3.5 h-3.5 text-emerald-400" />
        <span>DPDP Act 2023: Audio and handwriting processed purely in RAM. Zero raw media is saved.</span>
      </footer>
    </div>
  );
}
