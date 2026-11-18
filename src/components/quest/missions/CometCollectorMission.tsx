"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Zap, Timer, ShieldCheck } from "lucide-react";

interface SubitizingTrial {
  id: string;
  count: number;
  positions: { top: number; left: number }[];
}

const SUBITIZING_TRIALS: SubitizingTrial[] = [
  {
    id: "trial-1",
    count: 3,
    positions: [
      { top: 30, left: 25 },
      { top: 55, left: 50 },
      { top: 35, left: 75 },
    ],
  },
  {
    id: "trial-2",
    count: 5,
    positions: [
      { top: 25, left: 20 },
      { top: 30, left: 70 },
      { top: 50, left: 45 },
      { top: 70, left: 25 },
      { top: 70, left: 65 },
    ],
  },
  {
    id: "trial-3",
    count: 4,
    positions: [
      { top: 25, left: 30 },
      { top: 25, left: 65 },
      { top: 65, left: 30 },
      { top: 65, left: 65 },
    ],
  },
];

export interface Mission3Telemetry {
  subitizingAvgLatencyMs: number;
  subitizingAccuracyPercent: number;
  magnitudeComparisonErrorRate: number;
  totalTrials: number;
}

interface CometCollectorMissionProps {
  onComplete: (telemetry: Mission3Telemetry) => void;
  onRecordLatency?: (latencyMs: number) => void;
  onRecordClick?: () => void;
}

export default function CometCollectorMission({
  onComplete,
  onRecordLatency,
  onRecordClick,
}: CometCollectorMissionProps) {
  const [phase, setPhase] = useState<"READY" | "FLASH" | "INPUT" | "MAGNITUDE">("READY");
  const [trialIndex, setTrialIndex] = useState<number>(0);
  const [trialResults, setTrialResults] = useState<{ count: number; selected: number; latencyMs: number }[]>([]);
  const [flashStartTime, setFlashStartTime] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrial = SUBITIZING_TRIALS[trialIndex];

  const startFlash = () => {
    onRecordClick?.();
    setPhase("FLASH");
    const start = performance.now();
    setFlashStartTime(start);

    // Canonical subitizing flash: 400ms
    timerRef.current = setTimeout(() => {
      setPhase("INPUT");
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSelectNumber = (selected: number) => {
    onRecordClick?.();
    const latency = Math.round(performance.now() - flashStartTime);
    onRecordLatency?.(latency);

    const updated = [
      ...trialResults,
      {
        count: currentTrial.count,
        selected,
        latencyMs: latency,
      },
    ];
    setTrialResults(updated);

    if (trialIndex < SUBITIZING_TRIALS.length - 1) {
      setTrialIndex((prev) => prev + 1);
      setPhase("READY");
    } else {
      setPhase("MAGNITUDE");
    }
  };

  const handleMagnitudeAnswer = (pickedLarger: boolean) => {
    onRecordClick?.();
    const isError = !pickedLarger;

    const totalLatency = trialResults.reduce((acc, t) => acc + t.latencyMs, 0);
    const correctSubitizing = trialResults.filter((t) => t.count === t.selected).length;

    const telemetry: Mission3Telemetry = {
      subitizingAvgLatencyMs: Math.round(totalLatency / trialResults.length),
      subitizingAccuracyPercent: Math.round((correctSubitizing / trialResults.length) * 100),
      magnitudeComparisonErrorRate: isError ? 1.0 : 0.0,
      totalTrials: trialResults.length + 1,
    };

    onComplete(telemetry);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white border-2 border-edu-200 rounded-3xl shadow-card text-edu-900">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-edu-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-edu-amberLight text-edu-amber flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-edu-900 flex items-center gap-2">
              Mission 3: Comet Collector
              <span className="text-[10px] font-bold text-amber-800 bg-edu-amberLight px-2 py-0.5 rounded-full">
                Number Sense Screener
              </span>
            </h3>
            <p className="text-xs text-edu-500">
              {phase === "MAGNITUDE"
                ? "Which spaceship is carrying MORE star crystals?"
                : "Watch the cosmic flash for 400ms and count the comets!"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-edu-400">Stage</span>
          <div className="text-sm font-extrabold text-edu-amber">
            {phase === "MAGNITUDE" ? "Final Comparison" : `${trialIndex + 1} of ${SUBITIZING_TRIALS.length}`}
          </div>
        </div>
      </div>

      {/* Main Flash Area */}
      {phase !== "MAGNITUDE" ? (
        <div className="space-y-6">
          <div className="relative mx-auto w-full aspect-[16/9] max-w-lg rounded-2xl bg-edu-50 border-2 border-edu-200 shadow-inner flex items-center justify-center overflow-hidden">
            {phase === "READY" && (
              <div className="text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-edu-amberLight text-edu-amber flex items-center justify-center mx-auto shadow-sm">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="text-base font-bold text-edu-900">Comets Incoming!</h4>
                <p className="text-xs text-edu-600 max-w-xs mx-auto">
                  They will appear for less than a second. Keep your eyes on the screen!
                </p>
                <button
                  onClick={startFlash}
                  className="px-6 py-2.5 rounded-2xl bg-edu-amber hover:bg-amber-400 text-edu-900 text-xs font-bold shadow-soft transition-all"
                >
                  ⚡ Start Cosmic Flash
                </button>
              </div>
            )}

            {phase === "FLASH" && (
              <div className="relative w-full h-full">
                {currentTrial.positions.map((pos, idx) => (
                  <div
                    key={idx}
                    style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                    className="absolute text-4xl animate-bounce"
                  >
                    ⭐
                  </div>
                ))}
              </div>
            )}

            {phase === "INPUT" && (
              <div className="text-center space-y-2">
                <Timer className="w-6 h-6 text-edu-primary mx-auto animate-spin" />
                <h4 className="text-sm font-bold text-edu-900">How many stars did you spot?</h4>
                <p className="text-xs text-edu-500">Tap your answer below:</p>
              </div>
            )}
          </div>

          {/* Number Selector Buttons */}
          <div className="grid grid-cols-6 gap-2.5 max-w-lg mx-auto">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => handleSelectNumber(num)}
                disabled={phase !== "INPUT"}
                className="py-3.5 rounded-2xl bg-white border-2 border-edu-200 hover:border-edu-primary text-xl font-black text-edu-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-soft active:scale-95"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Stage 2: Magnitude Comparison Trial */
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-sm font-bold text-edu-900">
              Which fleet has <span className="text-edu-primary font-black uppercase">MORE</span> energy crystals?
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            {/* Left: 3 Crystals */}
            <button
              onClick={() => handleMagnitudeAnswer(false)}
              className="p-6 rounded-2xl bg-white border-2 border-edu-200 hover:border-edu-rose transition-all flex flex-col items-center justify-center gap-3 group active:scale-95 shadow-soft"
            >
              <div className="text-3xl">🚀</div>
              <div className="flex gap-1 text-xl">💎 💎 💎</div>
              <span className="text-xs font-bold text-edu-600 group-hover:text-edu-900">Fleet Alpha (3)</span>
            </button>

            {/* Right: 7 Crystals (Correct) */}
            <button
              onClick={() => handleMagnitudeAnswer(true)}
              className="p-6 rounded-2xl bg-white border-2 border-edu-200 hover:border-edu-emerald transition-all flex flex-col items-center justify-center gap-3 group active:scale-95 shadow-soft"
            >
              <div className="text-3xl">🛸</div>
              <div className="flex flex-wrap justify-center gap-1 text-xl max-w-[120px]">
                💎 💎 💎 💎 💎 💎 💎
              </div>
              <span className="text-xs font-bold text-edu-600 group-hover:text-edu-900">Fleet Omega (7)</span>
            </button>
          </div>
        </div>
      )}

      {/* Safety Footer */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-edu-100 mt-6 text-xs text-edu-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-edu-emerald" />
          <span>Calculates canonical 400ms Subitizing Reaction Time (SRT).</span>
        </div>
        <span className="font-semibold text-edu-400">Mission 3 of 3</span>
      </div>
    </div>
  );
}
