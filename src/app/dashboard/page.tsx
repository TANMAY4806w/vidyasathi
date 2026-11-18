"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  AlertTriangle,
  CheckCircle2,
  FileText,
  RefreshCw,
  Sparkles,
  Share2,
  Printer,
  ShieldCheck,
  Send,
  Zap,
} from "lucide-react";

interface StudentRecord {
  id: string;
  name: string;
  grade: number;
  age: number;
  screenedAt: string;
  highestRisk: string;
  compositeTier: "HIGH_ATTENTION_REQUIRED" | "MODERATE_WATCHLIST" | "LOW_RISK";
  indices: {
    dyslexia: number;
    dysgraphia: number;
    dyscalculia: number;
    adhd: number;
  };
  syncedRecordRef?: string;
}

const INITIAL_ROSTER: StudentRecord[] = [
  {
    id: "stu_aarav",
    name: "Aarav Sharma",
    grade: 3,
    age: 8,
    screenedAt: "18 Nov 2026, 10:15 AM",
    highestRisk: "Dyslexia & Dysgraphia",
    compositeTier: "HIGH_ATTENTION_REQUIRED",
    indices: { dyslexia: 84, dysgraphia: 76, dyscalculia: 38, adhd: 62 },
  },
  {
    id: "stu_diya",
    name: "Diya Patel",
    grade: 5,
    age: 10,
    screenedAt: "18 Nov 2026, 11:30 AM",
    highestRisk: "Dyscalculia",
    compositeTier: "MODERATE_WATCHLIST",
    indices: { dyslexia: 32, dysgraphia: 28, dyscalculia: 72, adhd: 45 },
  },
  {
    id: "stu_priya",
    name: "Priya Singh",
    grade: 4,
    age: 9,
    screenedAt: "18 Nov 2026, 01:45 PM",
    highestRisk: "ADHD Focus Stability",
    compositeTier: "MODERATE_WATCHLIST",
    indices: { dyslexia: 38, dysgraphia: 40, dyscalculia: 35, adhd: 68 },
  },
  {
    id: "stu_rohan",
    name: "Rohan Verma",
    grade: 2,
    age: 7,
    screenedAt: "18 Nov 2026, 03:00 PM",
    highestRisk: "None (Typical Development)",
    compositeTier: "LOW_RISK",
    indices: { dyslexia: 24, dysgraphia: 20, dyscalculia: 28, adhd: 30 },
  },
];

export default function DashboardPage() {
  const [filterTier, setFilterTier] = useState<string>("ALL");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(INITIAL_ROSTER[0]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<{ [id: string]: string }>({});
  const [showIepModal, setShowIepModal] = useState<boolean>(false);
  const [iepLanguage, setIepLanguage] = useState<"en" | "hi">("en");

  const filteredRoster = INITIAL_ROSTER.filter((s) => {
    if (filterTier === "ALL") return true;
    return s.compositeTier === filterTier;
  });

  const handleSyncPrasunex = async (student: StudentRecord) => {
    setSyncingId(student.id);
    try {
      const res = await fetch("/api/v1/integrations/prasunex/telemetry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-prasunex-signature": "sha256_mock_valid_signature",
        },
        body: JSON.stringify({
          schoolId: "SCH_PRASUNEX_DELHI_042",
          studentId: student.id,
          dsm5RiskProfile: {
            dyslexiaPercentile: student.indices.dyslexia,
            dysgraphiaPercentile: student.indices.dysgraphia,
            dyscalculiaPercentile: student.indices.dyscalculia,
            adhdPercentile: student.indices.adhd,
          },
          iepGenerated: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSyncStatus((prev) => ({
          ...prev,
          [student.id]: data.recordRef,
        }));
      }
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setSyncingId(null);
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "HIGH_ATTENTION_REQUIRED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            High Attention
          </span>
        );
      case "MODERATE_WATCHLIST":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Watchlist
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Typical Range
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-950 text-slate-100 p-4 sm:p-8 flex flex-col justify-between max-w-7xl mx-auto">
      {/* Top Bar */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Teacher & Clinical Diagnostic Hub
              <span className="text-xs font-normal text-nebula-cyan bg-nebula-cyan/10 px-2.5 py-0.5 rounded-full border border-nebula-cyan/20">
                PRASUNEX Partner OS
              </span>
            </h1>
            <p className="text-xs text-slate-400">Class 3–5 Elementary Screening Cohort • Delhi Demonstration Unit</p>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-cosmic-900 border border-slate-800">
            <span className="text-slate-400">Total Screened: </span>
            <strong className="text-white">4</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <span>High Attention: </span>
            <strong>1</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <span>Watchlist: </span>
            <strong>2</strong>
          </div>
        </div>
      </header>

      {/* Main Grid: Roster + Drill-down */}
      <main className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Roster (7 Cols) */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-nebula-cyan" />
              Classroom Screening Roster
            </h2>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-[11px]">
              {["ALL", "HIGH_ATTENTION_REQUIRED", "MODERATE_WATCHLIST", "LOW_RISK"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterTier(tier)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterTier === tier
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tier === "ALL" ? "All" : tier === "HIGH_ATTENTION_REQUIRED" ? "High" : tier === "MODERATE_WATCHLIST" ? "Watch" : "Typical"}
                </button>
              ))}
            </div>
          </div>

          {/* Roster Cards */}
          <div className="space-y-3">
            {filteredRoster.map((student) => {
              const isSelected = selectedStudent?.id === student.id;
              const ref = syncStatus[student.id];

              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-cosmic-850 border-nebula-cyan shadow-lg shadow-nebula-cyan/5"
                      : "bg-cosmic-900 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white">{student.name}</h3>
                      <span className="text-xs text-slate-400">• Class {student.grade} (Age {student.age})</span>
                      {getTierBadge(student.compositeTier)}
                    </div>
                    <p className="text-xs text-slate-400">
                      Primary Indicator: <strong className="text-slate-200">{student.highestRisk}</strong>
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      Screened: {student.screenedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* PRASUNEX Sync Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSyncPrasunex(student);
                      }}
                      disabled={syncingId === student.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        ref
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingId === student.id ? "animate-spin text-nebula-cyan" : ""}`} />
                      <span>{ref ? `Synced: ${ref}` : "Sync ERP"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Diagnostic Inspection & IEP Action Plan (5 Cols) */}
        {selectedStudent && (
          <section className="lg:col-span-5 p-6 rounded-3xl bg-cosmic-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Diagnostic Profile</span>
                <h3 className="text-lg font-bold text-white">{selectedStudent.name}</h3>
              </div>
              {getTierBadge(selectedStudent.compositeTier)}
            </div>

            {/* Percentile Gauges */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300">DSM-5 Standardized Percentiles:</h4>

              {/* Dyslexia Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Dyslexia (Speech Acoustic VOL)</span>
                  <strong className="text-white font-mono">{selectedStudent.indices.dyslexia}th %ile</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${selectedStudent.indices.dyslexia}%` }}
                    className={`h-full ${selectedStudent.indices.dyslexia > 75 ? "bg-rose-500" : selectedStudent.indices.dyslexia >= 40 ? "bg-amber-400" : "bg-emerald-400"}`}
                  />
                </div>
              </div>

              {/* Dysgraphia Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Dysgraphia (Canvas Kinematic Jitter)</span>
                  <strong className="text-white font-mono">{selectedStudent.indices.dysgraphia}th %ile</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${selectedStudent.indices.dysgraphia}%` }}
                    className={`h-full ${selectedStudent.indices.dysgraphia > 75 ? "bg-rose-500" : selectedStudent.indices.dysgraphia >= 40 ? "bg-amber-400" : "bg-emerald-400"}`}
                  />
                </div>
              </div>

              {/* Dyscalculia Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Dyscalculia (400ms Subitizing Delay)</span>
                  <strong className="text-white font-mono">{selectedStudent.indices.dyscalculia}th %ile</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${selectedStudent.indices.dyscalculia}%` }}
                    className={`h-full ${selectedStudent.indices.dyscalculia > 75 ? "bg-rose-500" : selectedStudent.indices.dyscalculia >= 40 ? "bg-amber-400" : "bg-emerald-400"}`}
                  />
                </div>
              </div>

              {/* ADHD Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">ADHD (Reaction Time Variance σ)</span>
                  <strong className="text-white font-mono">{selectedStudent.indices.adhd}th %ile</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${selectedStudent.indices.adhd}%` }}
                    className={`h-full ${selectedStudent.indices.adhd > 75 ? "bg-rose-500" : selectedStudent.indices.adhd >= 40 ? "bg-amber-400" : "bg-emerald-400"}`}
                  />
                </div>
              </div>
            </div>

            {/* IEP Action Card */}
            <div className="p-4 rounded-2xl bg-cosmic-950 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-star-gold" />
                  Gemini 1.5 Flash IEP Plan
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">NEP 2020 Validated</span>
              </div>
              <p className="text-xs text-slate-400">
                Actionable bilingual accommodations, 4-week structured exercises, and review timeline ready for download.
              </p>
              <button
                onClick={() => setShowIepModal(true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-nebula-purple to-nebula-cyan text-white text-xs font-bold hover:opacity-95 transition-all shadow-lg shadow-nebula-purple/20 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>View Full IEP Report Card</span>
              </button>
            </div>
          </section>
        )}
      </main>

      {/* IEP Modal */}
      {showIepModal && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-cosmic-900 border border-slate-700 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-nebula-cyan uppercase tracking-wider">
                  NEP 2020 Inclusive Education Document
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Individualized Education Program: {selectedStudent.name}
                </h3>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-cosmic-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setIepLanguage("en")}
                    className={`px-3 py-1 rounded-lg transition-colors ${iepLanguage === "en" ? "bg-nebula-purple text-white font-bold" : "text-slate-400"}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setIepLanguage("hi")}
                    className={`px-3 py-1 rounded-lg transition-colors ${iepLanguage === "hi" ? "bg-nebula-purple text-white font-bold" : "text-slate-400"}`}
                  >
                    हिंदी
                  </button>
                </div>

                <button
                  onClick={() => setShowIepModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Parent Summary */}
            <div className="p-4 rounded-2xl bg-cosmic-950 border border-slate-800">
              <h4 className="text-xs font-bold text-star-gold uppercase tracking-wider mb-2">
                {iepLanguage === "en" ? "Parent Summary & Strengths" : "माता-पिता के लिए विवरण"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {iepLanguage === "en"
                  ? `${selectedStudent.name} demonstrates creative thinking and high visual engagement. The screening indicates mild-to-moderate needs in phonological decoding and motor stability. With targeted daily reinforcement, rapid academic confidence is expected.`
                  : `${selectedStudent.name} में बहुत अच्छी सीखने की क्षमता और जिज्ञासा है। वर्तमान जांच के अनुसार, पढ़ने की गति और लिखावट के अभ्यास में थोड़ा अतिरिक्त समय और प्रोत्साहन देने की आवश्यकता है। घर और स्कूल के सहयोग से छात्र आसानी से प्रगति करेगा।`}
              </p>
            </div>

            {/* Classroom Accommodations (Zero Cost) */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Teacher Classroom Accommodations (100% Zero-Cost)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-cosmic-950 border border-slate-800">
                  <strong className="text-nebula-cyan block mb-1">Reading & Font Support:</strong>
                  <span className="text-slate-400">Use sans-serif fonts with 1.5x line spacing on off-white paper.</span>
                </div>
                <div className="p-3 rounded-xl bg-cosmic-950 border border-slate-800">
                  <strong className="text-nebula-cyan block mb-1">Examination Flexibility:</strong>
                  <span className="text-slate-400">Grant 15 minutes extra time per hour and allow oral answer checks.</span>
                </div>
                <div className="p-3 rounded-xl bg-cosmic-950 border border-slate-800">
                  <strong className="text-nebula-cyan block mb-1">Classroom Seating:</strong>
                  <span className="text-slate-400">Position in front rows near teacher to minimize visual distractions.</span>
                </div>
                <div className="p-3 rounded-xl bg-cosmic-950 border border-slate-800">
                  <strong className="text-nebula-cyan block mb-1">Writing & Motor Support:</strong>
                  <span className="text-slate-400">Allow ergonomic pencil grips and reduce repetitive blackboard copying.</span>
                </div>
              </div>
            </div>

            {/* Print / Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500">
                PRASUNEX Education OS • Student Profile Document
              </span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>DPDP Act 2023 Compliant • Native Integration with PRASUNEX Education OS</span>
        </div>
        <Link href="/quest" className="text-nebula-cyan hover:underline">
          Launch New Space Quest Assessment &rarr;
        </Link>
      </footer>
    </div>
  );
}
