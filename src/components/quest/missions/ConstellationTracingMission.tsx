"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PenTool, RotateCcw, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { KinematicEngine, StrokePoint, KinematicAnalysisResult } from "@/lib/canvas/kinematicEngine";

interface TracingTemplate {
  id: string;
  label: string;
  character: string;
  description: string;
  constellationName: string;
  guideDots: { x: number; y: number }[];
}

const TEMPLATES: TracingTemplate[] = [
  {
    id: "t1",
    label: "Letter 'b'",
    character: "b",
    description: "Start at the top star, trace down, then curve around to the right!",
    constellationName: "The Great Bear",
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
    description: "Start with the round circle on the left, then draw the tall line up and down!",
    constellationName: "The Little Dipper",
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

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Soft warm slate canvas background
    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Draw dashed guide lines
    const dots = currentTemplate.guideDots;
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 6]);

    ctx.beginPath();
    dots.forEach((dot, idx) => {
      const x = dot.x * canvas.width;
      const y = dot.y * canvas.height;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw guide star nodes
    dots.forEach((dot, idx) => {
      const x = dot.x * canvas.width;
      const y = dot.y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, idx === 0 ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? "#D97706" : "#4F46E5";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();
    });

    // 2. Draw user strokes with indigo ink
    strokes.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = "#4338CA";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      stroke.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
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

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const stroke = currentStrokeRef.current;
    if (stroke.length >= 2) {
      const p1 = stroke[stroke.length - 2];
      const p2 = stroke[stroke.length - 1];
      ctx.beginPath();
      ctx.strokeStyle = "#4338CA";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
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
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white border-2 border-edu-200 rounded-3xl shadow-card text-edu-900">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-edu-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-edu-skyLight text-edu-sky flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-edu-900 flex items-center gap-2">
              Mission 2: Constellation Tracing
              <span className="text-[10px] font-bold text-edu-sky bg-edu-skyLight px-2 py-0.5 rounded-full">
                Handwriting Motor Screener
              </span>
            </h3>
            <p className="text-xs text-edu-500">Connect the star dots with your finger or mouse.</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-edu-400">Letter</span>
          <div className="text-sm font-extrabold text-edu-amber">
            {templateIndex + 1} of {TEMPLATES.length}
          </div>
        </div>
      </div>

      {/* Target Letter & Instructions Banner */}
      <div className="p-3.5 mb-4 rounded-2xl bg-edu-50 border border-edu-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-edu-amber" />
          <span className="text-edu-700">
            Target: <strong className="text-edu-900 text-sm font-bold">{currentTemplate.label}</strong> ({currentTemplate.constellationName})
          </span>
        </div>
        <span className="text-edu-500 font-medium">{currentTemplate.description}</span>
      </div>

      {/* Interactive Tracing Canvas */}
      <div className="relative mx-auto w-full aspect-[4/3] max-w-lg rounded-2xl bg-edu-50 border-2 border-edu-200 shadow-inner flex items-center justify-center overflow-hidden touch-none">
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
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/95 border border-edu-200 text-xs text-edu-500 pointer-events-none flex items-center gap-1.5 shadow-sm">
            <PenTool className="w-3.5 h-3.5 text-edu-primary" />
            <span>Trace over the dotted star path</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-edu-100 mt-6">
        <div className="flex items-center gap-2 text-xs text-edu-500">
          <ShieldCheck className="w-4 h-4 text-edu-emerald" />
          <span>RAM-Only Kinematics: No drawings are saved or uploaded.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleClear}
            disabled={strokes.length === 0}
            className="px-4 py-2.5 rounded-xl border border-edu-200 text-xs font-bold text-edu-600 hover:text-edu-900 hover:bg-edu-50 disabled:opacity-40 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            onClick={handleSubmitTracing}
            disabled={strokes.length === 0}
            className="px-6 py-2.5 rounded-2xl bg-edu-primary hover:bg-edu-primaryHover text-white text-xs font-bold shadow-soft disabled:opacity-40 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Tracing &rarr;</span>
          </button>

          {onSkip && (
            <button
              onClick={onSkip}
              className="px-3 py-2 text-xs text-edu-400 hover:text-edu-600 transition-colors"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
