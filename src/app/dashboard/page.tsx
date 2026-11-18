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
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-edu-rose border border-rose-200">
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
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-edu-emerald border border-emerald-200">
            Typical Range
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-edu-50 text-edu-900 p-4 sm:p-8 flex flex-col justify-between max-w-7xl mx-auto selection:bg-edu-primaryLight selection:text-edu-primary">
      {/* Top Bar */}
      <header className="bg-white border border-edu-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-edu-50 border border-edu-200 hover:bg-edu-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-edu-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-edu-900 flex items-center gap-2">
              Teacher &amp; Clinical Diagnostic Hub
              <span className="text-xs font-semibold text-edu-primary bg-edu-primaryLight px-2.5 py-0.5 rounded-full border border-edu-primary/20">
                PRASUNEX Education OS
              </span>
            </h1>
            <p className="text-xs text-edu-500 font-medium">Class 3–5 Elementary Cohort • Delhi Demonstration Unit</p>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-edu-50 border border-edu-200">
            <span className="text-edu-500">Screened: </span>
            <strong className="text-edu-900 font-bold">4 Students</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-edu-rose font-bold">
            <span>High: 1</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">
            <span>Watch: 2</span>
          </div>
        </div>
      </header>

      {/* Main Grid: Roster + Drill-down */}
      <main className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Roster (7 Cols) */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-edu-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-edu-primary" />
              Classroom Screening Roster
            </h2>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              {["ALL", "HIGH_ATTENTION_REQUIRED", "MODERATE_WATCHLIST", "LOW_RISK"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterTier(tier)}
                  className={`px-3 py-1 rounded-xl font-medium transition-colors ${
                    filterTier === tier
                      ? "bg-edu-primary text-white font-bold shadow-soft"
                      : "bg-white border border-edu-200 text-edu-600 hover:bg-edu-50"
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
                      ? "bg-white border-edu-primary shadow-elevated"
                      : "bg-white border-edu-200 hover:border-edu-300 shadow-soft"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-edu-900">{student.name}</h3>
                      <span className="text-xs text-edu-500">• Class {student.grade} (Age {student.age})</span>
                      {getTierBadge(student.compositeTier)}
                    </div>
                    <p className="text-xs text-edu-600">
                      Primary Indicator: <strong className="text-edu-900 font-semibold">{student.highestRisk}</strong>
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
                          ? "bg-edu-emeraldLight text-edu-emerald border border-edu-emerald/30"
                          : "bg-edu-50 hover:bg-edu-100 text-edu-700 border border-edu-200"
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingId === student.id ? "animate-spin text-edu-primary" : ""}`} />
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
          <section className="lg:col-span-5 p-6 rounded-3xl bg-white border-2 border-edu-200 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-edu-100">
              <div>
                <span className="text-[10px] text-edu-500 uppercase tracking-wider font-bold">Diagnostic Profile</span>
                <h3 className="text-lg font-bold text-edu-900">{selectedStudent.name}</h3>
              </div>
              {getTierBadge(selectedStudent.compositeTier)}
            </div>

            {/* Percentile Gauges */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-edu-700 uppercase tracking-wider">DSM-5 Standardized Percentiles:</h4>

              {/* Dyslexia Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-edu-600 font-medium">Dyslexia (Speech Vocal Latency)</span>
                  <strong className="text-edu-900 font-mono">{selectedStudent.indices.dyslexia}th %ile</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-edu-100 overflow-hidden">
                  <div
                    style={{ width: `${selectedStudent.indices.dyslexia}%` }}
                    className={`h-full ${selectedStudent.indices.dyslexia > 75 ? "bg-edu-rose" : selectedStudent.indices.dyslexia >= 40 ? "bg-edu-amber" : "bg-edu-emerald"}`}
                  />
                </div>
              </div>

              {/* Dysgraphia Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-edu-600 font-medium">Dysgraphia (Canvas Kinematic Jitter)</span>
                  <strong className="text-edu-900 font-mono">{selectedStudent.indices.dysgraphia}th %ile</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-edu-100 overflow-hidden">
                  <div
                    style={{ width: `${selectedStudent.indices.dysgraphia}%` }}
                    className={`h-full ${selectedStudent.indices.dysgraphia > 75 ? "bg-edu-rose" : selectedStudent.indices.dysgraphia >= 40 ? "bg-edu-amber" : "bg-edu-emerald"}`}
                  />
                </div>
              </div>

              {/* Dyscalculia Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-edu-600 font-medium">Dyscalculia (400ms Subitizing Delay)</span>
                  <strong className="text-edu-900 font-mono">{selectedStudent.indices.dyscalculia}th %ile</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-edu-100 overflow-hidden">
                  <div
                    style={{ width: `${selectedStudent.indices.dyscalculia}%` }}
                    className={`h-full ${selectedStudent.indices.dyscalculia > 75 ? "bg-edu-rose" : selectedStudent.indices.dyscalculia >= 40 ? "bg-edu-amber" : "bg-edu-emerald"}`}
                  />
                </div>
              </div>

              {/* ADHD Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-edu-600 font-medium">ADHD (Reaction Time Variance σ)</span>
                  <strong className="text-edu-900 font-mono">{selectedStudent.indices.adhd}th %ile</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-edu-100 overflow-hidden">
                  <div
                    style={{ width: `${selectedStudent.indices.adhd}%` }}
                    className={`h-full ${selectedStudent.indices.adhd > 75 ? "bg-edu-rose" : selectedStudent.indices.adhd >= 40 ? "bg-edu-amber" : "bg-edu-emerald"}`}
                  />
                </div>
              </div>
            </div>

            {/* IEP Action Card */}
            <div className="p-4 rounded-2xl bg-edu-50 border border-edu-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-edu-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-edu-primary" />
                  Gemini 1.5 Flash Bilingual IEP
                </span>
                <span className="text-[10px] text-edu-emerald font-bold bg-white px-2 py-0.5 rounded-full border border-edu-emerald/30">
                  NEP 2020
                </span>
              </div>
              <p className="text-xs text-edu-600">
                Actionable bilingual accommodations, 4-week structured exercises, and review timeline ready for teacher download.
              </p>
              <button
                onClick={() => setShowIepModal(true)}
                className="w-full py-2.5 rounded-2xl bg-edu-primary hover:bg-edu-primaryHover text-white text-xs font-bold transition-all shadow-soft flex items-center justify-center gap-2"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-white border border-edu-200 rounded-3xl shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-edu-100">
              <div>
                <span className="text-xs font-bold text-edu-primary uppercase tracking-wider">
                  NEP 2020 Inclusive Education Document
                </span>
                <h3 className="text-xl font-bold text-edu-900 mt-0.5">
                  Individualized Education Program: {selectedStudent.name}
                </h3>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-edu-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setIepLanguage("en")}
                    className={`px-3 py-1 rounded-lg transition-colors ${iepLanguage === "en" ? "bg-white text-edu-primary shadow-soft" : "text-edu-600"}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setIepLanguage("hi")}
                    className={`px-3 py-1 rounded-lg transition-colors ${iepLanguage === "hi" ? "bg-white text-edu-primary shadow-soft" : "text-edu-600"}`}
                  >
                    हिंदी
                  </button>
                </div>

                <button
                  onClick={() => setShowIepModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-edu-100 hover:bg-edu-200 text-xs font-bold text-edu-700"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Parent Summary */}
            <div className="p-4 rounded-2xl bg-edu-50 border border-edu-200">
              <h4 className="text-xs font-bold text-edu-primary uppercase tracking-wider mb-2">
                {iepLanguage === "en" ? "Parent Summary & Strengths" : "माता-पिता के लिए विवरण एवं क्षमताएं"}
              </h4>
              <p className="text-xs sm:text-sm text-edu-800 leading-relaxed font-medium">
                {iepLanguage === "en"
                  ? `${selectedStudent.name} demonstrates creative thinking and high visual engagement. Current screening indicates mild-to-moderate needs in phonological decoding and motor stability. With targeted daily reinforcement, rapid academic confidence is expected.`
                  : `${selectedStudent.name} में बहुत अच्छी सीखने की क्षमता और जिज्ञासा है। वर्तमान जांच के अनुसार, पढ़ने की गति और लिखावट के अभ्यास में थोड़ा अतिरिक्त समय और प्रोत्साहन देने की आवश्यकता है। घर और स्कूल के सहयोग से छात्र आसानी से प्रगति करेगा।`}
              </p>
            </div>

            {/* Classroom Accommodations (Zero Cost) */}
            <div>
              <h4 className="text-xs font-bold text-edu-900 uppercase tracking-wider mb-3">
                Teacher Classroom Accommodations (100% Zero-Cost)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-edu-50 border border-edu-200">
                  <strong className="text-edu-primary block mb-1">Reading &amp; Font Support:</strong>
                  <span className="text-edu-700">Use sans-serif fonts with 1.5x line spacing on off-white paper.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-edu-50 border border-edu-200">
                  <strong className="text-edu-primary block mb-1">Examination Flexibility:</strong>
                  <span className="text-edu-700">Grant 15 minutes extra time per hour and allow oral answer checks.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-edu-50 border border-edu-200">
                  <strong className="text-edu-primary block mb-1">Classroom Seating:</strong>
                  <span className="text-edu-700">Position in front rows near teacher to minimize visual distractions.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-edu-50 border border-edu-200">
                  <strong className="text-edu-primary block mb-1">Writing &amp; Motor Support:</strong>
                  <span className="text-edu-700">Allow ergonomic pencil grips and reduce repetitive blackboard copying.</span>
                </div>
              </div>
            </div>

            {/* Print / Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-edu-100">
              <span className="text-xs text-edu-500 font-medium">
                PRASUNEX Education OS • Student Profile Document
              </span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-edu-primary hover:bg-edu-primaryHover text-white text-xs font-bold flex items-center gap-2 shadow-soft"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="pt-6 border-t border-edu-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-edu-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-edu-emerald" />
          <span>DPDP Act 2023 Compliant • Native Integration with PRASUNEX Education OS</span>
        </div>
        <Link href="/quest" className="text-edu-primary font-bold hover:underline">
          Launch New Student Quest Assessment &rarr;
        </Link>
      </footer>
    </div>
  );
}
