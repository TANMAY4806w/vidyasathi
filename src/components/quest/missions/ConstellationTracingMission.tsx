"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PenTool, RotateCcw, CheckCircle2, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";
import { KinematicEngine, StrokePoint, KinematicAnalysisResult } from "@/lib/canvas/kinematicEngine";

interface TracingTemplate {
  id: string;
  label: string;
  character: string;
  description: string;
  constellationName: string;
  // Normalized guide points (0 to 1 scale) to draw guide dots
  guideDots: { x: number; y: number }[];
}

const TEMPLATES: TracingTemplate[] = [
  {
    id: "t1",
    label: "Letter 'b'",
    character: "b",
    description: "Start at the top star, draw down, then loop around to the right!",
    constellationName: "Orion's Belt",
    guideDots: [
      { x: 0.35, y: 0.2 },
      { x: 0.35, y: 0.4 },
      { x: 0.35, y: 0.6 },
      { x: 0.35, y: 0.8 },
      { x: 0.45, y: 0.8 },
      { x: 0.58, y: 0.7 },
      { x: 0.58, y: 0.5 },
      { x: 0.45, y: 0.4 },
      { x: 0.35, y: 0.4 },
    ],
  },
  {
    id: "t2",
    label: "Letter 'd'",
    character: "d",
    description: "Start with the round circle on the left, then draw the tall right line!",
    constellationName: "Cassiopeia",
    guideDots: [
      { x: 0.55, y: 0.4 },
      { x: 0.42, y: 0.4 },
      { x: 0.32, y: 0.5 },
      { x: 0.32, y: 0.7 },
      { x: 0.42, y: 0.8 },
      { x: 0.55, y: 0.8 },
      { x: 0.55, y: 0.6 },
      { x: 0.55, y: 0.2 },
    ],
  },
];

export interface Mission2Telemetry {
  templateResults: {
    templateId: string;
    character: string;
    strokeCount: number;
    avgVelocityPxPerMs: number;
    velocityVariance: number;
    kinematicJitterScore: number;
    retrogradeDirectionChanges: number;
  }[];
  avgKinematicJitterScore: number;
  avgVelocityVariance: number;
  totalPenLifts: number;
  reversalTendencyScore: number;
}

interface ConstellationTracingMissionProps {
  onComplete: (telemetry: Mission2Telemetry) => void;
  onSkip?: () => void;
}

export default function ConstellationTracingMission({
  onComplete,
  onSkip,
}: ConstellationTracingMissionProps) {
  const [templateIndex, setTemplateIndex] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokes, setStrokes] = useState<StrokePoint[][]>([]);
  const [results, setResults] = useState<{ templateId: string; character: string; analysis: KinematicAnalysisResult }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentStrokeRef = useRef<StrokePoint[]>([]);

  const currentTemplate = TEMPLATES[templateIndex];

  // Draw background guide dots and existing strokes
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw glowing constellation guide dots
    const dots = currentTemplate.guideDots;
    ctx.strokeStyle = "rgba(129, 140, 248, 0.25)"; // faint guide lines
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);

    ctx.beginPath();
    dots.forEach((dot, idx) => {
      const x = dot.x * canvas.width;
      const y = dot.y * canvas.height;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw glowing star nodes
    dots.forEach((dot, idx) => {
      const x = dot.x * canvas.width;
      const y = dot.y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, idx === 0 ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? "#FBBF24" : "rgba(56, 189, 248, 0.8)";
      ctx.shadowColor = idx === 0 ? "#FBBF24" : "#38BDF8";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 2. Draw user strokes
    strokes.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = "#38BDF8";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "#38BDF8";
      ctx.shadowBlur = 8;

      stroke.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }, [currentTemplate, strokes]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoint: StrokePoint = {
      x,
      y,
      time: performance.now(),
      pressure: e.pressure || 0.5,
    };

    currentStrokeRef.current = [newPoint];
    setIsDrawing(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoint: StrokePoint = {
      x,
      y,
      time: performance.now(),
      pressure: e.pressure || 0.5,
    };

    currentStrokeRef.current.push(newPoint);

    // Fast local redraw of current active segment
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const stroke = currentStrokeRef.current;
    if (stroke.length >= 2) {
      const p1 = stroke[stroke.length - 2];
      const p2 = stroke[stroke.length - 1];
      ctx.beginPath();
      ctx.strokeStyle = "#38BDF8";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.shadowColor = "#38BDF8";
      ctx.shadowBlur = 8;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
    }

    if (currentStrokeRef.current.length > 1) {
      setStrokes((prev) => [...prev, [...currentStrokeRef.current]]);
    }
    currentStrokeRef.current = [];
  };

  const handleClear = () => {
    setStrokes([]);
    currentStrokeRef.current = [];
    redrawCanvas();
  };

  const handleSubmitTracing = () => {
    if (strokes.length === 0) return;

    // Run kinematic analysis
    const analysis = KinematicEngine.analyzeStrokes(strokes);
    const updatedResults = [
      ...results,
      {
        templateId: currentTemplate.id,
        character: currentTemplate.character,
        analysis,
      },
    ];

    setResults(updatedResults);
    setStrokes([]);

    if (templateIndex < TEMPLATES.length - 1) {
      setTemplateIndex((prev) => prev + 1);
    } else {
      finalizeMission(updatedResults);
    }
  };

  const finalizeMission = (
    allResults: { templateId: string; character: string; analysis: KinematicAnalysisResult }[]
  ) => {
    const totalJitter = allResults.reduce((a, r) => a + r.analysis.kinematicJitterScore, 0);
    const totalVariance = allResults.reduce((a, r) => a + r.analysis.velocityVariance, 0);
    const totalPenLifts = allResults.reduce((a, r) => a + r.analysis.strokeCount, 0);
    const totalRetrograde = allResults.reduce((a, r) => a + r.analysis.retrogradeDirectionChanges, 0);

    const telemetry: Mission2Telemetry = {
      templateResults: allResults.map((r) => ({
        templateId: r.templateId,
        character: r.character,
        strokeCount: r.analysis.strokeCount,
        avgVelocityPxPerMs: r.analysis.avgVelocityPxPerMs,
        velocityVariance: r.analysis.velocityVariance,
        kinematicJitterScore: r.analysis.kinematicJitterScore,
        retrogradeDirectionChanges: r.analysis.retrogradeDirectionChanges,
      })),
      avgKinematicJitterScore: Math.round((totalJitter / allResults.length) * 100) / 100,
      avgVelocityVariance: Math.round((totalVariance / allResults.length) * 100) / 100,
      totalPenLifts,
      reversalTendencyScore: Math.min(100, totalRetrograde * 15),
    };

    onComplete(telemetry);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-cosmic-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-nebula-cyan/20 border border-nebula-cyan/40 flex items-center justify-center text-nebula-cyan font-bold">
            2
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Mission 2: Constellation Tracing
              <span className="text-xs font-normal text-nebula-cyan bg-nebula-cyan/10 px-2 py-0.5 rounded-full border border-nebula-cyan/20">
                Dysgraphia Screener
              </span>
            </h3>
            <p className="text-xs text-slate-400">Connect the glowing star dots to form the constellation letter!</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400">Letter</span>
          <div className="text-sm font-bold text-star-gold">
            {templateIndex + 1} / {TEMPLATES.length}
          </div>
        </div>
      </div>

      {/* Target Letter & Instructions Banner */}
      <div className="p-3 mb-4 rounded-xl bg-cosmic-850 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-star-gold" />
          <span className="text-slate-300">
            Target: <strong className="text-white text-sm">{currentTemplate.label}</strong> ({currentTemplate.constellationName})
          </span>
        </div>
        <span className="text-slate-400 italic">{currentTemplate.description}</span>
      </div>

      {/* Interactive Tracing Canvas */}
      <div className="relative mx-auto w-full aspect-[4/3] max-w-lg rounded-2xl bg-cosmic-950 border-2 border-slate-800 shadow-inner flex items-center justify-center overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={480}
          height={360}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-crosshair"
        />

        {strokes.length === 0 && !isDrawing && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-[11px] text-slate-400 pointer-events-none flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-nebula-cyan animate-pulse" />
            <span>Trace over the dotted star path</span>
          </div>
        )}
      </div>

      {/* Canvas Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800 mt-6">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>RAM-only Kinematics: No drawings are saved or uploaded.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleClear}
            disabled={strokes.length === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            onClick={handleSubmitTracing}
            disabled={strokes.length === 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-nebula-cyan to-nebula-purple text-white text-xs font-bold shadow-lg shadow-nebula-cyan/20 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Tracing &rarr;</span>
          </button>

          {onSkip && (
            <button
              onClick={onSkip}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
