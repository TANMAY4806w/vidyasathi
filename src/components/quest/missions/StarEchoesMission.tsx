"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { WebAudioSpeechEngine, SpeechAnalysisResult } from "@/lib/audio/webAudioEngine";

interface StimulusItem {
  id: string;
  word: string;
  hindi: string;
  phonemes: string;
  icon: string;
  hint: string;
}

const STIMULI: StimulusItem[] = [
  { id: "s1", word: "BAT", hindi: "बैट", phonemes: "/b/ /æ/ /t/", icon: "🦇", hint: "Like a cricket bat or a flying bat!" },
  { id: "s2", word: "SUN", hindi: "सूरज", phonemes: "/s/ /ʌ/ /n/", icon: "☀️", hint: "The bright star that lights up our day!" },
  { id: "s3", word: "STAR", hindi: "तारा", phonemes: "/s/ /t/ /ɑː/ /r/", icon: "⭐", hint: "Twinkling high in the night sky!" },
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
      ctx.fillStyle = currentDb > -38 ? "#4F46E5" : "#94A3B8";
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

    if (currentIndex < STIMULI.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finalizeMission(updated, true);
    }
  };

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
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white border-2 border-edu-200 rounded-3xl shadow-card text-edu-900">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-edu-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-edu-primaryLight text-edu-primary flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-edu-900 flex items-center gap-2">
              Mission 1: Star Echoes
              <span className="text-[10px] font-bold text-edu-primary bg-edu-primaryLight px-2 py-0.5 rounded-full">
                Reading Voice Screener
              </span>
            </h3>
            <p className="text-xs text-edu-500">Read the star word aloud into your microphone.</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-edu-400">Card</span>
          <div className="text-sm font-extrabold text-edu-amber">
            {currentIndex + 1} of {STIMULI.length}
          </div>
        </div>
      </div>

      {/* Main Stimulus Card */}
      <div className="p-8 my-4 rounded-2xl bg-edu-50 border-2 border-edu-200 text-center relative">
        <div className="text-5xl mb-3">{currentStimulus.icon}</div>

        <div className="space-y-1 mb-4">
          <h2 className="text-4xl sm:text-5xl font-black tracking-widest text-edu-900">
            {currentStimulus.word}
          </h2>
          <p className="text-xl font-bold text-edu-primary">{currentStimulus.hindi}</p>
          <p className="text-xs text-edu-500 font-mono tracking-wider">{currentStimulus.phonemes}</p>
        </div>

        <p className="text-xs text-edu-600 mb-4 font-medium">{currentStimulus.hint}</p>

        {/* Real-time Frequency Waveform Visualizer */}
        <div className="w-full max-w-md mx-auto h-16 bg-white rounded-xl border border-edu-200 flex items-center justify-center p-1 relative overflow-hidden shadow-inner">
          {isListening ? (
            <canvas ref={canvasRef} width={280} height={56} className="w-full h-full" />
          ) : (
            <div className="text-xs text-edu-400 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-edu-primary" />
              <span>Tap the microphone button when you are ready to read</span>
            </div>
          )}

          {isListening && (
            <div className="absolute top-2 right-2 text-[10px] font-bold text-edu-emerald flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-edu-emerald/30">
              <span className="w-2 h-2 rounded-full bg-edu-emerald animate-ping" />
              {liveDb > -38 ? "VOICE DETECTED" : "LISTENING..."}
            </div>
          )}
        </div>
      </div>

      {/* Mic Permission Fallback */}
      {micPermissionDenied && (
        <div className="p-4 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-left">
          <div className="flex items-start gap-3">
            <MicOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">Microphone Access Needed</h4>
              <p className="text-xs text-amber-800 mt-1">
                If your device does not have a microphone or permission was blocked, you can use the touch buttons below to continue:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleFallbackTapping(450)}
                  className="px-3.5 py-1.5 rounded-xl bg-edu-primary text-white text-xs font-bold hover:bg-edu-primaryHover transition-colors"
                >
                  Fluent Reading (Typical VOL)
                </button>
                <button
                  onClick={() => handleFallbackTapping(1400)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-edu-300 text-edu-700 text-xs font-bold hover:bg-edu-100 transition-colors"
                >
                  Hesitant Reading (Delayed VOL)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>RAM-Only Audio: Voice is analyzed live and never saved.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {!isListening ? (
            <button
              onClick={handleStartRecording}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Tap to Read Word</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Done Reading! Next &rarr;</span>
            </button>
          )}

          {onSkip && (
            <button
              onClick={onSkip}
              className="px-3 py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
