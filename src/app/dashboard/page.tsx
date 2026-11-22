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
  Printer,
  ShieldCheck,
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
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-danger-500 border border-rose-200">
            High Attention
          </span>
        );
      case "MODERATE_WATCHLIST":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Watchlist
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-success-700 border border-emerald-200">
            Typical Range
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface text-ink p-4 sm:p-8 flex flex-col justify-between max-w-7xl mx-auto print:p-0 print:m-0 print:max-w-none">
      {/* Top Bar (Sticky Navbar) */}
      <header className="sticky top-3 z-50 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md transition-all print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-surface border border-border hover:bg-edu-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-ink-2" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-ink flex items-center gap-2">
              Teacher &amp; Clinical Diagnostic Hub
              <span className="text-xs font-semibold text-brand-500 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-300/20">
                PRASUNEX Education OS
              </span>
            </h1>
            <p className="text-xs text-ink-3 font-medium">Class 3–5 Elementary Cohort • Delhi Demonstration Unit</p>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-surface border border-border">
            <span className="text-ink-3">Screened: </span>
            <strong className="text-ink font-bold">4 Students</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-danger-500 font-bold">
            <span>High: 1</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">
            <span>Watch: 2</span>
          </div>
        </div>
      </header>

      {/* Main Grid: Roster + Drill-down */}
      <main className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
        {/* Left Column: Student Roster (7 Cols) */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-500" />
              Classroom Screening Roster
            </h2>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              {["ALL", "HIGH_ATTENTION_REQUIRED", "MODERATE_WATCHLIST", "LOW_RISK"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterTier(tier)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    filterTier === tier
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
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
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-white border-brand-300 shadow-elevated"
                      : "bg-white border-border hover:border-border-strong shadow-card"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-ink">{student.name}</h3>
                      <span className="text-xs text-ink-3">• Class {student.grade} (Age {student.age})</span>
                      {getTierBadge(student.compositeTier)}
                    </div>
                    <p className="text-xs text-ink-2">
                      Primary Indicator: <strong className="text-ink font-semibold">{student.highestRisk}</strong>
                    </p>
                    <span className="text-[11px] text-edu-400 font-medium mt-1 block">
                      Screened: {student.screenedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSyncPrasunex(student);
                      }}
                      disabled={syncingId === student.id}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        ref
                          ? "bg-success-50 text-success-700 border border-success-500/30"
                          : "bg-surface hover:bg-edu-100 text-ink-2 border border-border"
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingId === student.id ? "animate-spin text-brand-500" : ""}`} />
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
          <section className="lg:col-span-5 p-6 rounded-3xl bg-white border-2 border-border shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-[10px] text-ink-3 uppercase tracking-wider font-bold">Diagnostic Profile</span>
                <h3 className="text-lg font-bold text-ink">{selectedStudent.name}</h3>
              </div>
              {getTierBadge(selectedStudent.compositeTier)}
            </div>

            {/* Percentile Gauges */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">DSM-5 Standardized Percentiles:</h4>

              {/* Dyslexia Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">Dyslexia (Speech Vocal Latency)</span>
                  <strong className="text-slate-900 font-mono font-bold">{selectedStudent.indices.dyslexia}th %ile</strong>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                  <div
                    style={{ width: `${selectedStudent.indices.dyslexia}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${selectedStudent.indices.dyslexia > 75 ? "bg-rose-500" : selectedStudent.indices.dyslexia >= 40 ? "bg-amber-400" : "bg-emerald-500"}`}
                  />
                </div>
              </div>

              {/* Dysgraphia Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">Dysgraphia (Canvas Kinematic Jitter)</span>
                  <strong className="text-slate-900 font-mono font-bold">{selectedStudent.indices.dysgraphia}th %ile</strong>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                  <div
                    style={{ width: `${selectedStudent.indices.dysgraphia}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${selectedStudent.indices.dysgraphia > 75 ? "bg-rose-500" : selectedStudent.indices.dysgraphia >= 40 ? "bg-amber-400" : "bg-emerald-500"}`}
                  />
                </div>
              </div>

              {/* Dyscalculia Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">Dyscalculia (400ms Subitizing Delay)</span>
                  <strong className="text-slate-900 font-mono font-bold">{selectedStudent.indices.dyscalculia}th %ile</strong>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                  <div
                    style={{ width: `${selectedStudent.indices.dyscalculia}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${selectedStudent.indices.dyscalculia > 75 ? "bg-rose-500" : selectedStudent.indices.dyscalculia >= 40 ? "bg-amber-400" : "bg-emerald-500"}`}
                  />
                </div>
              </div>

              {/* ADHD Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">ADHD (Reaction Time Variance σ)</span>
                  <strong className="text-slate-900 font-mono font-bold">{selectedStudent.indices.adhd}th %ile</strong>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                  <div
                    style={{ width: `${selectedStudent.indices.adhd}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${selectedStudent.indices.adhd > 75 ? "bg-rose-500" : selectedStudent.indices.adhd >= 40 ? "bg-amber-400" : "bg-emerald-500"}`}
                  />
                </div>
              </div>
            </div>

            {/* IEP Action Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Gemini 1.5 Flash Bilingual IEP
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                  NEP 2020
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Actionable bilingual accommodations, 4-week structured exercises, and review timeline ready for teacher download.
              </p>
              <button
                onClick={() => setShowIepModal(true)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:m-0 print:static print:inset-auto print:bg-white print:backdrop-blur-none">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-white border border-border rounded-3xl shadow-card space-y-5 print:border print:border-slate-300 print:rounded-2xl print:p-6 print:space-y-3.5 print:shadow-none print:max-h-none print:overflow-visible print:w-full print:max-w-none print-page-fit">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
                    NEP 2020 Inclusive Education Document
                  </span>
                  <span className="hidden print:inline-block text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300 font-semibold">
                    PRASUNEX Education OS
                  </span>
                </div>
                <h3 className="text-xl font-bold text-ink mt-0.5">
                  Individualized Education Program: {selectedStudent.name}
                </h3>
              </div>

              {/* Language Switcher & Close (Hidden in Print) */}
              <div className="flex items-center gap-2 print:hidden">
                <div className="flex items-center bg-edu-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setIepLanguage("en")}
                    className={`px-3 py-1 rounded-lg transition-colors ${iepLanguage === "en" ? "bg-white text-brand-500 shadow-card" : "text-ink-2"}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setIepLanguage("hi")}
                    className={`px-3 py-1 rounded-lg transition-colors ${iepLanguage === "hi" ? "bg-white text-brand-500 shadow-card" : "text-ink-2"}`}
                  >
                    हिंदी
                  </button>
                </div>

                <button
                  onClick={() => setShowIepModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-edu-100 hover:bg-edu-200 text-xs font-bold text-ink-2 cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Student Metadata Row (Visible on screen and print) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2 px-3.5 bg-surface border border-border rounded-xl text-xs print:bg-slate-50 print:border-slate-300">
              <div>
                <span className="text-[10px] text-ink-3 uppercase font-bold block">Student</span>
                <strong className="text-ink font-bold">{selectedStudent.name}</strong>
              </div>
              <div>
                <span className="text-[10px] text-ink-3 uppercase font-bold block">Class &amp; Age</span>
                <span className="text-ink-2 font-medium">Class {selectedStudent.grade} ({selectedStudent.age} yrs)</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-3 uppercase font-bold block">Screened Need</span>
                <span className="text-brand-500 font-bold">{selectedStudent.highestRisk}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-3 uppercase font-bold block">Date</span>
                <span className="text-ink-2">{selectedStudent.screenedAt}</span>
              </div>
            </div>

            {/* Parent Summary */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-border print:bg-white print:border-slate-300">
              <h4 className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-1.5">
                {iepLanguage === "en" ? "Parent Summary & Strengths" : "माता-पिता के लिए विवरण एवं क्षमताएं"}
              </h4>
              <p className="text-xs sm:text-[13px] text-edu-800 leading-relaxed font-medium">
                {iepLanguage === "en"
                  ? `${selectedStudent.name} demonstrates creative thinking and high visual engagement. Current screening indicates mild-to-moderate needs in phonological decoding and motor stability. With targeted daily reinforcement, rapid academic confidence is expected.`
                  : `${selectedStudent.name} में बहुत अच्छी सीखने की क्षमता और जिज्ञासा है। वर्तमान जांच के अनुसार, पढ़ने की गति और लिखावट के अभ्यास में थोड़ा अतिरिक्त समय और प्रोत्साहन देने की आवश्यकता है। घर और स्कूल के सहयोग से छात्र आसानी से प्रगति करेगा।`}
              </p>
            </div>

            {/* Classroom Accommodations (Zero Cost) */}
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2.5">
                Teacher Classroom Accommodations (100% Zero-Cost)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-surface border border-border print:bg-white print:border-slate-300">
                  <strong className="text-brand-500 block mb-1">Reading &amp; Font Support:</strong>
                  <span className="text-ink-2">Use sans-serif fonts with 1.5x line spacing on off-white paper.</span>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-border print:bg-white print:border-slate-300">
                  <strong className="text-brand-500 block mb-1">Examination Flexibility:</strong>
                  <span className="text-ink-2">Grant 15 minutes extra time per hour and allow oral answer checks.</span>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-border print:bg-white print:border-slate-300">
                  <strong className="text-brand-500 block mb-1">Classroom Seating:</strong>
                  <span className="text-ink-2">Position in front rows near teacher to minimize visual distractions.</span>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-border print:bg-white print:border-slate-300">
                  <strong className="text-brand-500 block mb-1">Writing &amp; Motor Support:</strong>
                  <span className="text-ink-2">Allow ergonomic pencil grips and reduce repetitive blackboard copying.</span>
                </div>
              </div>
            </div>

            {/* Print-only institutional sign-off row */}
            <div className="hidden print:grid grid-cols-2 gap-4 pt-3 border-t border-slate-300 text-[11px] text-slate-600">
              <div>
                <p className="font-semibold text-slate-800">Special Educator Signature: _________________________</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Complies with NEP 2020 §6 &amp; RPwD Act 2016 Guidelines</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">School Seal / Authorization</p>
                <p className="text-[10px] text-slate-400 mt-0.5">DPDP Act 2023 RAM-Only Screening Verified</p>
              </div>
            </div>

            {/* Print / Action Buttons (Hidden during actual print) */}
            <div className="flex items-center justify-between pt-3 border-t border-border print:hidden">
              <span className="text-xs text-ink-3 font-medium">
                PRASUNEX Education OS • Student Profile Document
              </span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-2 shadow-card cursor-pointer transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-3 print:hidden">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-success-700" />
          <span>DPDP Act 2023 Compliant • Native Integration with PRASUNEX Education OS</span>
        </div>
        <Link href="/quest" className="text-brand-500 font-bold hover:underline">
          Launch New Student Quest Assessment &rarr;
        </Link>
      </footer>
    </div>
  );
}

