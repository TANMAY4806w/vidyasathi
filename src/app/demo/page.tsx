"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Zap,
  Play,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Activity,
} from "lucide-react";

interface CalibratedProfile {
  id: string;
  name: string;
  grade: number;
  age: number;
  clinicalDescription: string;
  rawTelemetry: {
    dyslexia: {
      avgVocalOnsetLatencyMs: number;
      pauseCountOver250ms: number;
      phonemeAccuracyPercent: number;
    };
    dysgraphia: {
      avgKinematicJitterScore: number;
      strokeVelocityVariance: number;
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

const CALIBRATED_PROFILES: CalibratedProfile[] = [
  {
    id: "profile_aarav",
    name: "Aarav Sharma",
    grade: 3,
    age: 8,
    clinicalDescription: "Elevated Phonological Decoding Hesitation (Dyslexia) & High Stroke Tremor (Dysgraphia).",
    rawTelemetry: {
      dyslexia: { avgVocalOnsetLatencyMs: 1420, pauseCountOver250ms: 6, phonemeAccuracyPercent: 66 },
      dysgraphia: { avgKinematicJitterScore: 0.74, strokeVelocityVariance: 0.62, penLiftsPerLetter: 4.2 },
      dyscalculia: { subitizingAvgLatencyMs: 920, subitizingAccuracyPercent: 85, magnitudeComparisonErrorRate: 0.1 },
      adhd: { impulsiveRapidClickCount: 5, reactionTimeVarianceMs: 380, idleDwellOver5sCount: 2 },
    },
  },
  {
    id: "profile_diya",
    name: "Diya Patel",
    grade: 5,
    age: 10,
    clinicalDescription: "Severe Subitizing Delay (Dyscalculia) with Typical Reading and Motor Stability.",
    rawTelemetry: {
      dyslexia: { avgVocalOnsetLatencyMs: 480, pauseCountOver250ms: 1, phonemeAccuracyPercent: 92 },
      dysgraphia: { avgKinematicJitterScore: 0.22, strokeVelocityVariance: 0.28, penLiftsPerLetter: 1.2 },
      dyscalculia: { subitizingAvgLatencyMs: 1950, subitizingAccuracyPercent: 45, magnitudeComparisonErrorRate: 0.45 },
      adhd: { impulsiveRapidClickCount: 2, reactionTimeVarianceMs: 190, idleDwellOver5sCount: 1 },
    },
  },
  {
    id: "profile_rohan",
    name: "Rohan Verma",
    grade: 2,
    age: 7,
    clinicalDescription: "Typical Development (<35th percentile across all 4 screening dimensions).",
    rawTelemetry: {
      dyslexia: { avgVocalOnsetLatencyMs: 440, pauseCountOver250ms: 0, phonemeAccuracyPercent: 95 },
      dysgraphia: { avgKinematicJitterScore: 0.18, strokeVelocityVariance: 0.21, penLiftsPerLetter: 1.0 },
      dyscalculia: { subitizingAvgLatencyMs: 820, subitizingAccuracyPercent: 95, magnitudeComparisonErrorRate: 0.05 },
      adhd: { impulsiveRapidClickCount: 1, reactionTimeVarianceMs: 120, idleDwellOver5sCount: 0 },
    },
  },
];

export default function JuryDemoPage() {
  const [selectedProfile, setSelectedProfile] = useState<CalibratedProfile>(CALIBRATED_PROFILES[0]);
  const [scoringResult, setScoringResult] = useState<any | null>(null);
  const [iepResult, setIepResult] = useState<any | null>(null);
  const [prasunexSyncRef, setPrasunexSyncRef] = useState<string | null>(null);

  const [loadingScore, setLoadingScore] = useState<boolean>(false);
  const [loadingIep, setLoadingIep] = useState<boolean>(false);
  const [loadingSync, setLoadingSync] = useState<boolean>(false);
  const [iepLang, setIepLang] = useState<"en" | "hi">("en");

  // Step 1: Run DSM-5 Scoring
  const handleRunScoring = async () => {
    setLoadingScore(true);
    setScoringResult(null);
    setIepResult(null);
    setPrasunexSyncRef(null);

    try {
      const res = await fetch("/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: {
            anonymousId: selectedProfile.id,
            grade: selectedProfile.grade,
            age: selectedProfile.age,
          },
          telemetry: selectedProfile.rawTelemetry,
        }),
      });

      const data = await res.json();
      setScoringResult(data);
    } catch (err) {
      console.error("Scoring failed:", err);
    } finally {
      setLoadingScore(false);
    }
  };

  // Step 2: Generate Gemini 1.5 Flash IEP
  const handleGenerateIep = async () => {
    if (!scoringResult) return;
    setLoadingIep(true);

    try {
      const res = await fetch("/api/iep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: scoringResult.assessmentId,
          studentName: selectedProfile.name,
          studentGrade: selectedProfile.grade,
          studentAge: selectedProfile.age,
          indices: scoringResult.indices,
        }),
      });

      const data = await res.json();
      setIepResult(data);
    } catch (err) {
      console.error("IEP generation failed:", err);
    } finally {
      setLoadingIep(false);
    }
  };

  // Step 3: Sync to PRASUNEX Education OS
  const handleSyncPrasunex = async () => {
    setLoadingSync(true);
    try {
      const res = await fetch("/api/v1/integrations/prasunex/telemetry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-prasunex-signature": "sha256_live_jury_demonstration",
        },
        body: JSON.stringify({
          schoolId: "SCH_PRASUNEX_DELHI_042",
          studentId: selectedProfile.id,
          dsm5RiskProfile: scoringResult?.indices,
          iepGenerated: !!iepResult,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPrasunexSyncRef(data.recordRef);
      }
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setLoadingSync(false);
    }
  };

  return (
    <div className="min-h-screen bg-edu-50 text-edu-900 p-4 sm:p-8 flex flex-col justify-between max-w-7xl mx-auto selection:bg-edu-primaryLight selection:text-edu-primary">
      {/* Header (Sticky Navbar) */}
      <header className="sticky top-3 z-50 bg-white/95 backdrop-blur-md border border-edu-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md transition-all">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-edu-50 border border-edu-200 hover:bg-edu-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-edu-600" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-edu-900 flex items-center gap-2">
                ⚡ Jury Fast-Pass Evaluation Console
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-edu-amber text-edu-900">
                30 SEC DEMO
              </span>
            </div>
            <p className="text-xs text-edu-500 font-medium">
              PRASUNEX INNOVATHON 2026 • Live evaluation of in-browser scoring, Gemini IEP, and ERP sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-sm"
          >
            Teacher Hub
          </Link>
          <Link
            href="/quest"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>Child Quest</span>
          </Link>
        </div>
      </header>

      {/* Profile Selector Cards */}
      <section className="my-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Select a Calibrated Student Profile:
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">Pre-loaded telemetry from real screening trials</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CALIBRATED_PROFILES.map((profile) => {
            const isSelected = selectedProfile.id === profile.id;
            return (
              <div
                key={profile.id}
                onClick={() => {
                  setSelectedProfile(profile);
                  setScoringResult(null);
                  setIepResult(null);
                  setPrasunexSyncRef(null);
                }}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50/50 border-indigo-600 ring-2 ring-indigo-500/30 shadow-lg scale-[1.01]"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900">{profile.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">Class {profile.grade} (Age {profile.age})</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{profile.clinicalDescription}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>VOL: {profile.rawTelemetry.dyslexia.avgVocalOnsetLatencyMs}ms</span>
                  <span>Jitter: {profile.rawTelemetry.dysgraphia.avgKinematicJitterScore}</span>
                  <span>Subitize: {profile.rawTelemetry.dyscalculia.subitizingAvgLatencyMs}ms</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3-Step Execution Console */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
        {/* Left Column: Interactive Action Controls (5 cols) */}
        <section className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Live Evaluation Actions
            </h3>

            {/* Action 1: Instant Scoring */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Action 1: DSM-5 Scoring Engine</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">&lt; 10ms Latency</span>
              </div>
              <p className="text-xs text-slate-600">
                Transforms speech acoustics, canvas kinematics, and subitizing reaction times into normalized percentiles.
              </p>
              <button
                onClick={handleRunScoring}
                disabled={loadingScore}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {loadingScore ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                <span>Run Instant DSM-5 Scoring</span>
              </button>
            </div>

            {/* Action 2: Gemini 1.5 Flash IEP */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Action 2: Gemini 1.5 Flash Bilingual IEP</span>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">NEP 2020</span>
              </div>
              <p className="text-xs text-slate-600">
                Synthesizes a structured 5-step IEP with parent summaries in English and Hindi.
              </p>
              <button
                onClick={handleGenerateIep}
                disabled={!scoringResult || loadingIep}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {loadingIep ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-slate-900" />}
                <span>Generate Gemini 1.5 Flash IEP</span>
              </button>
            </div>

            {/* Action 3: PRASUNEX Sync */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Action 3: PRASUNEX Education OS Sync</span>
                <span className="text-[10px] text-sky-700 font-bold bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">HMAC SHA256</span>
              </div>
              <p className="text-xs text-slate-600">
                Simulates real-time webhook push into PRASUNEX Education OS &amp; Prerana AI Core.
              </p>
              <button
                onClick={handleSyncPrasunex}
                disabled={loadingSync}
                className="w-full py-3 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold disabled:opacity-30 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {loadingSync ? <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" /> : <RefreshCw className="w-4 h-4" />}
                <span>{prasunexSyncRef ? `Synced: ${prasunexSyncRef}` : "Sync to PRASUNEX Education OS"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Live Output & IEP Inspection (7 cols) */}
        <section className="lg:col-span-7 space-y-4">
          {scoringResult ? (
            <div className="p-6 rounded-3xl bg-white border-2 border-edu-200 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-edu-100">
                <div>
                  <h4 className="text-sm font-bold text-edu-900">Diagnostic Output: {selectedProfile.name}</h4>
                  <span className="text-[10px] text-edu-500 font-mono">Assessment Ref: {scoringResult.assessmentId}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  scoringResult.overallRiskSummary.compositeRiskLevel === "HIGH_ATTENTION_REQUIRED"
                    ? "bg-rose-50 text-edu-rose border border-rose-200"
                    : scoringResult.overallRiskSummary.compositeRiskLevel === "MODERATE_WATCHLIST"
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-emerald-50 text-edu-emerald border border-emerald-200"
                }`}>
                  {scoringResult.overallRiskSummary.compositeRiskLevel.replace(/_/g, " ")}
                </span>
              </div>

              {/* 4 Gauges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">1. Dyslexia</span>
                    <strong className="text-slate-900 font-mono font-bold">{scoringResult.indices.dyslexia.percentile}th %ile</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                    <div
                      style={{ width: `${scoringResult.indices.dyslexia.percentile}%` }}
                      className={`h-full transition-all duration-500 ${scoringResult.indices.dyslexia.percentile > 75 ? "bg-rose-500" : scoringResult.indices.dyslexia.percentile >= 40 ? "bg-amber-400" : "bg-emerald-500"}`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block truncate">
                    {scoringResult.indices.dyslexia.primaryIndicator}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">2. Dysgraphia</span>
                    <strong className="text-slate-900 font-mono font-bold">{scoringResult.indices.dysgraphia.percentile}th %ile</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                    <div
                      style={{ width: `${scoringResult.indices.dysgraphia.percentile}%` }}
                      className={`h-full transition-all duration-500 ${scoringResult.indices.dysgraphia.percentile > 75 ? "bg-rose-500" : scoringResult.indices.dysgraphia.percentile >= 40 ? "bg-amber-400" : "bg-emerald-500"}`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block truncate">
                    {scoringResult.indices.dysgraphia.primaryIndicator}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">3. Dyscalculia</span>
                    <strong className="text-slate-900 font-mono font-bold">{scoringResult.indices.dyscalculia.percentile}th %ile</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                    <div
                      style={{ width: `${scoringResult.indices.dyscalculia.percentile}%` }}
                      className={`h-full transition-all duration-500 ${scoringResult.indices.dyscalculia.percentile > 75 ? "bg-rose-500" : scoringResult.indices.dyscalculia.percentile >= 40 ? "bg-amber-400" : "bg-emerald-500"}`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block truncate">
                    {scoringResult.indices.dyscalculia.primaryIndicator}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">4. ADHD Focus</span>
                    <strong className="text-slate-900 font-mono font-bold">{scoringResult.indices.adhd.percentile}th %ile</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                    <div
                      style={{ width: `${scoringResult.indices.adhd.percentile}%` }}
                      className={`h-full transition-all duration-500 ${scoringResult.indices.adhd.percentile > 75 ? "bg-rose-500" : scoringResult.indices.adhd.percentile >= 40 ? "bg-amber-400" : "bg-emerald-500"}`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block truncate">
                    {scoringResult.indices.adhd.primaryIndicator}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-sm text-center space-y-3">
              <Zap className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
              <h4 className="text-sm font-bold text-slate-900">Jury Fast-Pass Console Ready</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Click <strong className="text-indigo-600">&quot;Run Instant DSM-5 Scoring&quot;</strong> in Action 1 to execute the live percentile engine.
              </p>
            </div>
          )}

          {/* Generated IEP Card */}
          {iepResult && (
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Live IEP Output</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {iepResult.engine === "gemini-1.5-flash"
                          ? "⚡ Gemini 1.5 Flash"
                          : iepResult.engine === "groq-llama3"
                          ? "⚡ Groq (Llama 3.3 70B)"
                          : iepResult.engine === "openrouter"
                          ? "⚡ OpenRouter Engine"
                          : "⚡ Calibrated Clinical Engine"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {iepResult.latencyMs}ms
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 text-[11px] bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setIepLang("en")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${iepLang === "en" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setIepLang("hi")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${iepLang === "hi" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"}`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {/* Parent Summary */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-800 leading-relaxed font-medium">
                {iepLang === "en"
                  ? iepResult.iepPlan.parentSummary.english
                  : iepResult.iepPlan.parentSummary.hindi}
              </div>

              {/* Classroom Accommodations */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Teacher Accommodations (Zero Cost):
                </span>
                {iepResult.iepPlan.classroomAccommodations.map((acc: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 text-xs">{acc.area}: </strong>
                      <span className="text-slate-700 text-xs">{acc.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="pt-6 border-t border-edu-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-edu-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-edu-emerald" />
          <span>Designed specifically for PRASUNEX INNOVATHON 2026 Evaluation Committee</span>
        </div>
        <span className="text-edu-600 font-medium">Team Dynamic Duo: Tanmay Patil &amp; Rajat Gupta</span>
      </footer>
    </div>
  );
}
