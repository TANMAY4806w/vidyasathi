"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Award,
  Shield,
  CheckCircle,
  PenTool,
  Zap,
  Brain,
  ArrowRight,
  Mic,
} from "lucide-react";
import StarEchoesMission, { Mission1Telemetry } from "@/components/quest/missions/StarEchoesMission";
import ConstellationTracingMission, { Mission2Telemetry } from "@/components/quest/missions/ConstellationTracingMission";
import CometCollectorMission, { Mission3Telemetry } from "@/components/quest/missions/CometCollectorMission";
import { AdhdTelemetryTracker, AdhdInteractionMetrics } from "@/lib/telemetry/adhdTracker";

type QuestStep = "MISSION_1" | "MISSION_2" | "MISSION_3" | "COMPLETED";

const STEPS = [
  { key: "MISSION_1", label: "Speech",     icon: Mic,      color: "brand"   },
  { key: "MISSION_2", label: "Tracing",    icon: PenTool,  color: "sky"     },
  { key: "MISSION_3", label: "Subitizing", icon: Zap,      color: "warn"    },
] as const;

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

  const handleRecordClick = () => { adhdTrackerRef.current?.recordClick(); };
  const handleRecordLatency = (latencyMs: number) => { adhdTrackerRef.current?.recordReactionTime(latencyMs); };

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
    const finalAdhd = adhdTrackerRef.current
      ? adhdTrackerRef.current.getMetrics()
      : { impulsiveRapidClickCount: 1, reactionTimeVarianceMs: 240, idleDwellOver5sCount: 0, totalSessionDurationMs: 65000 };
    setAdhdData(finalAdhd);
    setCurrentStep("COMPLETED");
  };

  const stepIndex = currentStep === "MISSION_1" ? 0 : currentStep === "MISSION_2" ? 1 : currentStep === "MISSION_3" ? 2 : 3;

  return (
    <div
      onClick={handleRecordClick}
      className="min-h-screen bg-surface text-ink flex flex-col max-w-5xl mx-auto px-4 sm:px-6 py-5 gap-6"
    >
      {/* ── Quest Header ───────────────────────────────────── */}
      <header className="bg-canvas border border-border rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft animate-fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-3 hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit to Hub
        </Link>

        {/* Step Progress */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((step, i) => {
            const done = (step.key === "MISSION_1" && mission1Data) || (step.key === "MISSION_2" && mission2Data) || (step.key === "MISSION_3" && mission3Data);
            const active = i === stepIndex;
            const Icon = done ? CheckCircle : step.icon;

            return (
              <React.Fragment key={step.key}>
                <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                  done    ? "bg-success-50 text-success-700 border border-success-500/30"
                  : active ? "bg-brand-50 text-brand-600 border border-brand-300 shadow-xs"
                  :          "text-ink-3 border border-transparent"
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {step.label}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-px ${i < stepIndex ? "bg-success-500" : "bg-border"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="text-[12px] text-ink-3 font-medium tabular-nums">
          Student ID: <span className="font-bold text-ink">ASTRO-042</span>
        </div>
      </header>

      {/* ── Mission Arena ──────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center py-4 animate-fade-in">
        {currentStep === "MISSION_1" && <StarEchoesMission onComplete={handleMission1Complete} />}
        {currentStep === "MISSION_2" && (
          <ConstellationTracingMission onComplete={handleMission2Complete} onSkip={() => setCurrentStep("MISSION_3")} />
        )}
        {currentStep === "MISSION_3" && (
          <CometCollectorMission onComplete={handleMission3Complete} onRecordClick={handleRecordClick} onRecordLatency={handleRecordLatency} />
        )}

        {/* ── Completion Card ─────────────────────────────── */}
        {currentStep === "COMPLETED" && mission1Data && mission2Data && mission3Data && adhdData && (
          <div className="w-full max-w-4xl bg-canvas border border-border rounded-3xl shadow-card p-8 sm:p-10 text-center space-y-8 animate-scale-in">
            {/* Trophy */}
            <div className="w-16 h-16 rounded-2xl bg-success-50 text-success-500 flex items-center justify-center mx-auto shadow-success-glow animate-bounce-once">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                Space Quest Complete! ⭐
              </h2>
              <p className="text-[13px] text-ink-2 mt-2">
                All 4 multi-modal behavioral vectors captured on-device.
              </p>
            </div>

            {/* 4-Vector Telemetry Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {[
                { label: "Dyslexia", icon: <Sparkles className="w-4 h-4" />, color: "text-brand-500 bg-brand-50 border-brand-200",
                  metric: `${mission1Data.avgVocalOnsetLatencyMs} ms`, sub: `Pauses: ${mission1Data.totalPauses} · Acc: ${mission1Data.avgPhonemeAccuracy}%` },
                { label: "Dysgraphia", icon: <PenTool className="w-4 h-4" />, color: "text-sky-500 bg-sky-50 border-sky-200",
                  metric: `${mission2Data.avgKinematicJitterScore} / 1.0`, sub: `Pen-Lifts: ${mission2Data.totalPenLifts} · Rev: ${mission2Data.reversalTendencyScore}%` },
                { label: "Dyscalculia", icon: <Zap className="w-4 h-4" />, color: "text-warn-500 bg-warn-50 border-warn-200",
                  metric: `${mission3Data.subitizingAvgLatencyMs} ms`, sub: `Accuracy: ${mission3Data.subitizingAccuracyPercent}% · 400ms flash` },
                { label: "ADHD Focus", icon: <Brain className="w-4 h-4" />, color: "text-danger-500 bg-danger-50 border-danger-200",
                  metric: `${adhdData.reactionTimeVarianceMs} ms`, sub: `Rapid Taps: ${adhdData.impulsiveRapidClickCount} · Idle: ${adhdData.idleDwellOver5sCount}` },
              ].map((v) => (
                <div key={v.label} className={`p-4 rounded-2xl border ${v.color}`}>
                  <div className={`flex items-center gap-1.5 mb-3 font-semibold text-[12px] ${v.color.split(" ")[0]}`}>
                    {v.icon}
                    {v.label}
                  </div>
                  <div className="text-xl font-extrabold text-ink font-mono tabular-nums">{v.metric}</div>
                  <div className="text-[11px] text-ink-3 mt-1">{v.sub}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => { setCurrentStep("MISSION_1"); setMission1Data(null); setMission2Data(null); setMission3Data(null); }}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                Replay Quest
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                <span>View IEP &amp; Diagnostics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* ── Safety Footer ──────────────────────────────────── */}
      <footer className="py-3 border-t border-border text-center text-[12px] text-ink-3 flex items-center justify-center gap-2">
        <Shield className="w-3.5 h-3.5 text-success-500" />
        DPDP Act 2023: Audio & handwriting processed in RAM only. Zero raw media saved.
      </footer>
    </div>
  );
}

