"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, Sparkles, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck } from "lucide-react";
import { WebAudioSpeechEngine, SpeechAnalysisResult } from "@/lib/audio/webAudioEngine";

interface StimulusItem {
  id: string;
  word: string;
  hindi: string;
  phonemes: string;
  icon: string;
}

const STIMULI: StimulusItem[] = [
  { id: "s1", word: "BAT", hindi: "बैट", phonemes: "/b/ /æ/ /t/", icon: "🦇" },
  { id: "s2", word: "SUN", hindi: "सूरज", phonemes: "/s/ /ʌ/ /n/", icon: "☀️" },
  { id: "s3", word: "STAR", hindi: "तारा", phonemes: "/s/ /t/ /ɑː/ /r/", icon: "⭐" },
];

export interface Mission1Telemetry {
  stimulusResults: {
    stimulusId: string;
    word: string;
    vocalOnsetLatencyMs: number;
    pauseCountOver250ms: number;
    phonemeAccuracyPercent: number;
  }[];
  avgVocalOnsetLatencyMs: number;
  avgPhonemeAccuracy: number;
  totalPauses: number;
  micUsed: boolean;
}

interface StarEchoesMissionProps {
  onComplete: (telemetry: Mission1Telemetry) => void;
  onSkip?: () => void;
}

export default function StarEchoesMission({ onComplete, onSkip }: StarEchoesMissionProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState<boolean>(false);
  const [results, setResults] = useState<SpeechAnalysisResult[]>([]);
  const [liveDb, setLiveDb] = useState<number>(-100);
  const [stimulusRenderTime, setStimulusRenderTime] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<WebAudioSpeechEngine | null>(null);

  const currentStimulus = STIMULI[currentIndex];

  useEffect(() => {
    engineRef.current = new WebAudioSpeechEngine();
    return () => {
      engineRef.current?.cleanup();
    };
  }, []);

  // Set stimulus render timestamp whenever current card changes
  useEffect(() => {
    setStimulusRenderTime(performance.now());
    setIsListening(false);
  }, [currentIndex]);

  const drawVisualizer = useCallback((frequencyData: Uint8Array, currentDb: number) => {
    setLiveDb(Math.round(currentDb));
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / frequencyData.length) * 2.5;
    let x = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      const barHeight = (frequencyData[i] / 255) * canvas.height;

      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, "#818CF8"); // nebula purple
      gradient.addColorStop(1, "#38BDF8"); // cyan accent

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
      x += barWidth;
    }
  }, []);

  const handleStartRecording = async () => {
    if (!engineRef.current) return;
    setMicPermissionDenied(false);

    const started = await engineRef.current.start(stimulusRenderTime, drawVisualizer);
    if (started) {
      setIsListening(true);
    } else {
      setMicPermissionDenied(true);
      setIsListening(false);
    }
  };

  const handleStopRecording = () => {
    if (!engineRef.current || !isListening) return;

    const analysis = engineRef.current.stop(currentStimulus.word);
    setIsListening(false);
    setLiveDb(-100);

    const updated = [...results, analysis];
    setResults(updated);

    // Advance to next stimulus or complete mission
    if (currentIndex < STIMULI.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finalizeMission(updated, true);
    }
  };

  // Graceful fallback for environments with no mic or permission denied
  const handleFallbackTapping = (estimatedLatencyMs: number) => {
    const syntheticResult: SpeechAnalysisResult = {
      vocalOnsetLatencyMs: estimatedLatencyMs,
      pauseCountOver250ms: 1,
      totalDurationMs: estimatedLatencyMs + 500,
      peakDecibels: -20,
      speechDetected: true,
      phonemeAccuracyPercent: 88,
    };

    const updated = [...results, syntheticResult];
    setResults(updated);

    if (currentIndex < STIMULI.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finalizeMission(updated, false);
    }
  };

  const finalizeMission = (allResults: SpeechAnalysisResult[], micUsed: boolean) => {
    const totalLatency = allResults.reduce((acc, r) => acc + r.vocalOnsetLatencyMs, 0);
    const totalAccuracy = allResults.reduce((acc, r) => acc + r.phonemeAccuracyPercent, 0);
    const totalPauses = allResults.reduce((acc, r) => acc + r.pauseCountOver250ms, 0);

    const telemetry: Mission1Telemetry = {
      stimulusResults: allResults.map((r, i) => ({
        stimulusId: STIMULI[i]?.id || `s${i + 1}`,
        word: STIMULI[i]?.word || "UNKNOWN",
        vocalOnsetLatencyMs: r.vocalOnsetLatencyMs,
        pauseCountOver250ms: r.pauseCountOver250ms,
        phonemeAccuracyPercent: r.phonemeAccuracyPercent,
      })),
      avgVocalOnsetLatencyMs: Math.round(totalLatency / allResults.length),
      avgPhonemeAccuracy: Math.round(totalAccuracy / allResults.length),
      totalPauses,
      micUsed,
    };

    onComplete(telemetry);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-cosmic-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Top Mission Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-nebula-purple/20 border border-nebula-purple/40 flex items-center justify-center text-nebula-purple font-bold">
            1
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Mission 1: Star Echoes
              <span className="text-xs font-normal text-nebula-cyan bg-nebula-cyan/10 px-2 py-0.5 rounded-full border border-nebula-cyan/20">
                Dyslexia Screener
              </span>
            </h3>
            <p className="text-xs text-slate-400">Read the star word aloud when ready. Listen for the echo!</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400">Card</span>
          <div className="text-sm font-bold text-star-gold">
            {currentIndex + 1} / {STIMULI.length}
          </div>
        </div>
      </div>

      {/* Main Stimulus Space Card */}
      <div className="p-8 my-4 rounded-2xl bg-gradient-to-b from-cosmic-850 to-cosmic-950 border border-slate-700/80 text-center relative shadow-inner">
        <div className="text-5xl mb-3 animate-bounce">{currentStimulus.icon}</div>

        <div className="space-y-1 mb-4">
          <h2 className="text-4xl sm:text-5xl font-black tracking-widest text-white drop-shadow-md">
            {currentStimulus.word}
          </h2>
          <p className="text-lg text-nebula-cyan font-medium">{currentStimulus.hindi}</p>
          <p className="text-xs text-slate-400 font-mono tracking-wider">{currentStimulus.phonemes}</p>
        </div>

        {/* Real-time Frequency Waveform Visualizer */}
        <div className="w-full max-w-md mx-auto h-16 bg-cosmic-950/80 rounded-xl border border-slate-800 flex items-center justify-center p-1 relative overflow-hidden">
          {isListening ? (
            <canvas ref={canvasRef} width={280} height={56} className="w-full h-full" />
          ) : (
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <span>Tap microphone to start speech detection</span>
            </div>
          )}

          {isListening && (
            <div className="absolute top-2 right-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-cosmic-950/90 px-2 py-0.5 rounded border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {liveDb > -38 ? "VOICE ONSET" : "LISTENING"}
            </div>
          )}
        </div>
      </div>

      {/* Mic Permission Warning / Graceful Fallback */}
      {micPermissionDenied && (
        <div className="p-4 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left">
          <div className="flex items-start gap-3">
            <MicOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-amber-300">Microphone Access Denied or Unavailable</h4>
              <p className="text-xs text-slate-400 mt-1">
                No problem! You can continue using the **Visual Phoneme Tap** fallback below.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleFallbackTapping(450)}
                  className="px-3 py-1.5 rounded-lg bg-nebula-purple text-white text-xs font-medium hover:bg-nebula-purple/90"
                >
                  Quick Word Recognition (Normal VOL)
                </button>
                <button
                  onClick={() => handleFallbackTapping(1400)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Hesitant Reading (Delayed VOL)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>DPDP Act 2023: Audio is processed in RAM only and never saved.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {!isListening ? (
            <button
              onClick={handleStartRecording}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-nebula-purple to-nebula-cyan text-white text-sm font-bold shadow-lg shadow-nebula-purple/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Tap to Read Word</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Done Speaking! Next &rarr;</span>
            </button>
          )}

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
