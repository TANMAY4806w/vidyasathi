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
  BookOpen,
} from "lucide-react";
import StarEchoesMission, { Mission1Telemetry } from "@/components/quest/missions/StarEchoesMission";
import ConstellationTracingMission, { Mission2Telemetry } from "@/components/quest/missions/ConstellationTracingMission";
import CometCollectorMission, { Mission3Telemetry } from "@/components/quest/missions/CometCollectorMission";
import { AdhdTelemetryTracker, AdhdInteractionMetrics } from "@/lib/telemetry/adhdTracker";

type QuestStep = "MISSION_1" | "MISSION_2" | "MISSION_3" | "COMPLETED";

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

    const finalAdhd = adhdTrackerRef.current
      ? adhdTrackerRef.current.getMetrics()
      : {
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
      className="min-h-screen bg-edu-50 text-edu-900 p-4 sm:p-8 flex flex-col justify-between max-w-5xl mx-auto selection:bg-edu-primaryLight selection:text-edu-primary"
    >
      {/* Top Header */}
      <header className="bg-white border border-edu-200 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-soft">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-edu-600 hover:text-edu-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Hub</span>
        </Link>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 text-xs font-bold">
          {/* Mission 1 */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              currentStep === "MISSION_1"
                ? "bg-edu-primaryLight text-edu-primary border border-edu-primary/30"
                : mission1Data
                ? "bg-edu-emeraldLight text-edu-emerald border border-edu-emerald/30"
                : "text-edu-400"
            }`}
          >
            {mission1Data ? <CheckCircle className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>1. Speech</span>
          </div>

          <span className="text-edu-300">•</span>

          {/* Mission 2 */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              currentStep === "MISSION_2"
                ? "bg-edu-skyLight text-edu-sky border border-edu-sky/30"
                : mission2Data
                ? "bg-edu-emeraldLight text-edu-emerald border border-edu-emerald/30"
                : "text-edu-400"
            }`}
          >
            {mission2Data ? <CheckCircle className="w-3.5 h-3.5" /> : <PenTool className="w-3.5 h-3.5" />}
            <span>2. Tracing</span>
          </div>

          <span className="text-edu-300">•</span>

          {/* Mission 3 */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              currentStep === "MISSION_3"
                ? "bg-edu-amberLight text-amber-800 border border-edu-amber/30"
                : mission3Data
                ? "bg-edu-emeraldLight text-edu-emerald border border-edu-emerald/30"
                : "text-edu-400"
            }`}
          >
            {mission3Data ? <CheckCircle className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
            <span>3. Subitizing</span>
          </div>
        </div>

        <div className="text-xs text-edu-500 font-medium">
          Student ID: <span className="font-bold text-edu-900">ASTRO-042</span>
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
          <div className="w-full max-w-4xl mx-auto p-8 sm:p-10 bg-white border-2 border-edu-200 rounded-3xl shadow-card text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-edu-emeraldLight text-edu-emerald flex items-center justify-center mx-auto shadow-soft animate-bounce">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-edu-900">
                Full Space Quest Completed! ⭐
              </h2>
              <p className="text-sm text-edu-600 mt-1">
                All 4 multi-modal behavioral vectors successfully captured on device.
              </p>
            </div>

            {/* 4-Vector Telemetry Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {/* Vector 1: Dyslexia */}
              <div className="p-4 rounded-2xl bg-edu-50 border border-edu-primary/20">
                <div className="flex items-center gap-1.5 mb-2 text-edu-primary text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1. Dyslexia</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-edu-500 font-medium">Vocal Latency:</div>
                  <div className="text-xl font-black text-edu-900 font-mono">
                    {mission1Data.avgVocalOnsetLatencyMs} ms
                  </div>
                  <div className="text-[11px] text-edu-500">
                    Pauses: {mission1Data.totalPauses} | Acc: {mission1Data.avgPhonemeAccuracy}%
                  </div>
                </div>
              </div>

              {/* Vector 2: Dysgraphia */}
              <div className="p-4 rounded-2xl bg-edu-50 border border-edu-sky/20">
                <div className="flex items-center gap-1.5 mb-2 text-edu-sky text-xs font-bold">
                  <PenTool className="w-3.5 h-3.5" />
                  <span>2. Dysgraphia</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-edu-500 font-medium">Kinematic Jitter:</div>
                  <div className="text-xl font-black text-edu-900 font-mono">
                    {mission2Data.avgKinematicJitterScore} / 1.0
                  </div>
                  <div className="text-[11px] text-edu-500">
                    Pen-Lifts: {mission2Data.totalPenLifts} | Rev: {mission2Data.reversalTendencyScore}%
                  </div>
                </div>
              </div>

              {/* Vector 3: Dyscalculia */}
              <div className="p-4 rounded-2xl bg-edu-50 border border-edu-amber/30">
                <div className="flex items-center gap-1.5 mb-2 text-amber-700 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>3. Dyscalculia</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-edu-500 font-medium">Subitizing Latency:</div>
                  <div className="text-xl font-black text-edu-900 font-mono">
                    {mission3Data.subitizingAvgLatencyMs} ms
                  </div>
                  <div className="text-[11px] text-edu-500">
                    Accuracy: {mission3Data.subitizingAccuracyPercent}% | 400ms flash
                  </div>
                </div>
              </div>

              {/* Vector 4: ADHD */}
              <div className="p-4 rounded-2xl bg-edu-50 border border-edu-rose/20">
                <div className="flex items-center gap-1.5 mb-2 text-edu-rose text-xs font-bold">
                  <Brain className="w-3.5 h-3.5" />
                  <span>4. ADHD Focus</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-edu-500 font-medium">Latency Variance (σ):</div>
                  <div className="text-xl font-black text-edu-900 font-mono">
                    {adhdData.reactionTimeVarianceMs} ms
                  </div>
                  <div className="text-[11px] text-edu-500">
                    Rapid Taps: {adhdData.impulsiveRapidClickCount} | Idle: {adhdData.idleDwellOver5sCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-edu-100">
              <button
                onClick={() => {
                  setCurrentStep("MISSION_1");
                  setMission1Data(null);
                  setMission2Data(null);
                  setMission3Data(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-edu-300 text-xs font-bold text-edu-700 hover:bg-edu-50 transition-colors"
              >
                Replay Quest
              </button>

              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-2xl bg-edu-primary hover:bg-edu-primaryHover text-white text-xs font-bold shadow-soft transition-all flex items-center gap-2"
              >
                <span>View Classroom Diagnostics &amp; IEP</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Safety Compliance Footer */}
      <footer className="py-4 border-t border-edu-200 text-center text-xs text-edu-500 flex items-center justify-center gap-2">
        <Shield className="w-4 h-4 text-edu-emerald" />
        <span>DPDP Act 2023: Audio and handwriting processed purely in RAM. Zero raw media is saved.</span>
      </footer>
    </div>
  );
}
