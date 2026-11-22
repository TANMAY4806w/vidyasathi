"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Award, Shield, CheckCircle, Activity, PenTool, Zap, Brain, ArrowRight } from "lucide-react";
import StarEchoesMission, { Mission1Telemetry } from "@/components/quest/missions/StarEchoesMission";
import ConstellationTracingMission, { Mission2Telemetry } from "@/components/quest/missions/ConstellationTracingMission";
import CometCollectorMission, { Mission3Telemetry } from "@/components/quest/missions/CometCollectorMission";
import { AdhdTelemetryTracker, AdhdInteractionMetrics } from "@/lib/telemetry/adhdTracker";

type QuestStep = "MISSION_1" | "MISSION_2" | "MISSION_3" | "COMPLETED";

export interface FullSessionTelemetry {
  student: {
    anonymousId: string;
    grade: number;
    age: number;
    language: string;
  };
  telemetry: {
    dyslexia: {
      avgVocalOnsetLatencyMs: number;
      pauseCountOver250ms: number;
      phonemeAccuracyPercent: number;
      stimulusCount: number;
    };
    dysgraphia: {
      avgKinematicJitterScore: number;
      strokeVelocityVariance: number;
      reversalCount: number;
      penLiftsPerLetter: number;
    };
    dyscalculia: {
      subitizingAvgLatencyMs: number;
      subitizingAccuracyPercent: number;
      magnitudeComparisonErrorRate: number;
    };
    adhd: {
      impulsiveRapidClickCount: number;
      reactionTimeVarianceMs: number;
      idleDwellOver5sCount: number;
    };
  };
}

export default function QuestPage() {
  const [currentStep, setCurrentStep] = useState<QuestStep>("MISSION_1");
  const [mission1Data, setMission1Data] = useState<Mission1Telemetry | null>(null);
  const [mission2Data, setMission2Data] = useState<Mission2Telemetry | null>(null);
  const [mission3Data, setMission3Data] = useState<Mission3Telemetry | null>(null);
  const [adhdData, setAdhdData] = useState<AdhdInteractionMetrics | null>(null);

  const adhdTrackerRef = useRef<AdhdTelemetryTracker | null>(null);

  useEffect(() => {
    adhdTrackerRef.current = new AdhdTelemetryTracker();
  }, []);

  const handleRecordClick = () => {
    adhdTrackerRef.current?.recordClick();
  };

  const handleRecordLatency = (latencyMs: number) => {
    adhdTrackerRef.current?.recordReactionTime(latencyMs);
  };

  const handleMission1Complete = (telemetry: Mission1Telemetry) => {
    setMission1Data(telemetry);
    handleRecordLatency(telemetry.avgVocalOnsetLatencyMs);
    setCurrentStep("MISSION_2");
  };

  const handleMission2Complete = (telemetry: Mission2Telemetry) => {
    setMission2Data(telemetry);
    setCurrentStep("MISSION_3");
  };

  const handleMission3Complete = (telemetry: Mission3Telemetry) => {
    setMission3Data(telemetry);
    handleRecordLatency(telemetry.subitizingAvgLatencyMs);

    const finalAdhd = adhdTrackerRef.current ? adhdTrackerRef.current.getMetrics() : {
      impulsiveRapidClickCount: 1,
      reactionTimeVarianceMs: 240,
      idleDwellOver5sCount: 0,
      totalSessionDurationMs: 65000,
    };
    setAdhdData(finalAdhd);
    setCurrentStep("COMPLETED");
  };

  return (
    <div
      onClick={handleRecordClick}
      className="min-h-screen bg-cosmic-950 text-slate-100 p-4 sm:p-8 flex flex-col justify-between max-w-5xl mx-auto selection:bg-nebula-purple selection:text-white"
    >
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
          {/* Mission 1 */}
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
            <span>1. Speech</span>
          </div>

          <span className="text-slate-700">•</span>

          {/* Mission 2 */}
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
            <span>2. Tracing</span>
          </div>

          <span className="text-slate-700">•</span>

          {/* Mission 3 */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              currentStep === "MISSION_3"
                ? "bg-star-gold/20 border border-star-gold/40 text-star-gold"
                : mission3Data
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "text-slate-500"
            }`}
          >
            {mission3Data ? <CheckCircle className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
            <span>3. Subitizing</span>
          </div>
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
            onSkip={() => setCurrentStep("MISSION_3")}
          />
        )}

        {currentStep === "MISSION_3" && (
          <CometCollectorMission
            onComplete={handleMission3Complete}
            onRecordClick={handleRecordClick}
            onRecordLatency={handleRecordLatency}
          />
        )}

        {currentStep === "COMPLETED" && mission1Data && mission2Data && mission3Data && adhdData && (
          /* Comprehensive 4-Vector Telemetry Summary Card */
          <div className="w-full max-w-4xl mx-auto p-8 bg-cosmic-900 border border-emerald-500/40 rounded-3xl shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Full Space Quest Completed! ⭐</h2>
              <p className="text-sm text-slate-400 mt-1">
                All 4 multi-modal behavioral vectors successfully captured on device.
              </p>
            </div>

            {/* 4-Vector Telemetry Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {/* Vector 1: Dyslexia */}
              <div className="p-4 rounded-2xl bg-cosmic-950 border border-nebula-purple/30">
                <div className="flex items-center gap-1.5 mb-2 text-nebula-purple text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1. Dyslexia</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-[11px] text-slate-400">Vocal Onset Latency:</div>
                  <div className="text-lg font-bold text-white font-mono">{mission1Data.avgVocalOnsetLatencyMs} ms</div>
                  <div className="text-[10px] text-slate-500">Pauses: {mission1Data.totalPauses} | Acc: {mission1Data.avgPhonemeAccuracy}%</div>
                </div>
              </div>

              {/* Vector 2: Dysgraphia */}
              <div className="p-4 rounded-2xl bg-cosmic-950 border border-nebula-cyan/30">
                <div className="flex items-center gap-1.5 mb-2 text-nebula-cyan text-xs font-bold">
                  <PenTool className="w-3.5 h-3.5" />
                  <span>2. Dysgraphia</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-[11px] text-slate-400">Kinematic Jitter:</div>
                  <div className="text-lg font-bold text-white font-mono">{mission2Data.avgKinematicJitterScore} / 1.0</div>
                  <div className="text-[10px] text-slate-500">Pen-Lifts: {mission2Data.totalPenLifts} | Rev: {mission2Data.reversalTendencyScore}%</div>
                </div>
              </div>

              {/* Vector 3: Dyscalculia */}
              <div className="p-4 rounded-2xl bg-cosmic-950 border border-star-gold/30">
                <div className="flex items-center gap-1.5 mb-2 text-star-gold text-xs font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>3. Dyscalculia</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-[11px] text-slate-400">Subitizing Latency:</div>
                  <div className="text-lg font-bold text-white font-mono">{mission3Data.subitizingAvgLatencyMs} ms</div>
                  <div className="text-[10px] text-slate-500">Accuracy: {mission3Data.subitizingAccuracyPercent}% | 400ms flash</div>
                </div>
              </div>

              {/* Vector 4: ADHD */}
              <div className="p-4 rounded-2xl bg-cosmic-950 border border-rose-500/30">
                <div className="flex items-center gap-1.5 mb-2 text-rose-400 text-xs font-bold">
                  <Brain className="w-3.5 h-3.5" />
                  <span>4. ADHD Focus</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-[11px] text-slate-400">Latency Variance (σ):</div>
                  <div className="text-lg font-bold text-white font-mono">{adhdData.reactionTimeVarianceMs} ms</div>
                  <div className="text-[10px] text-slate-500">Rapid Clicks: {adhdData.impulsiveRapidClickCount} | Idle: {adhdData.idleDwellOver5sCount}</div>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setCurrentStep("MISSION_1");
                  setMission1Data(null);
                  setMission2Data(null);
                  setMission3Data(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Replay Full Quest
              </button>

              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-nebula-cyan text-cosmic-950 text-xs font-black shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center gap-2"
              >
                <span>Generate DSM-5 Risk Score & IEP</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Safety Compliance Footer */}
      <footer className="py-4 border-t border-slate-800/80 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Shield className="w-3.5 h-3.5 text-emerald-400" />
        <span>DPDP Act 2023: Zero personal voice recordings or handwriting images leave client memory.</span>
      </footer>
    </div>
  );
}
