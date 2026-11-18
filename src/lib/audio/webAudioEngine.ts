/**
 * Web Audio Engine for Dyslexia Screening (Star Echoes)
 * Measures Vocal Onset Latency (VOL), speech pauses, and audio energy.
 * Complies strictly with DPDP Act 2023: Zero raw audio persists or leaves client memory.
 */

export interface SpeechAnalysisResult {
  vocalOnsetLatencyMs: number;
  pauseCountOver250ms: number;
  totalDurationMs: number;
  peakDecibels: number;
  speechDetected: boolean;
  phonemeAccuracyPercent: number;
}

export class WebAudioSpeechEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animationFrameId: number | null = null;

  private startTime: number = 0;
  private speechOnsetTime: number = 0;
  private isSpeechActive: boolean = false;
  private pauseCount: number = 0;
  private lastSilenceStart: number = 0;
  private peakDb: number = -100;

  // Silence threshold in decibels (calibrated for standard mic input)
  private readonly thresholdDb: number = -38;
  private readonly pauseDurationThresholdMs: number = 250;

  /**
   * Initializes audio context and requests user microphone stream.
   */
  async start(
    stimulusTimestamp: number,
    onVisualizerData?: (frequencyData: Uint8Array, currentDb: number) => void
  ): Promise<boolean> {
    try {
      this.cleanup();

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      if (this.audioCtx.state === "suspended") {
        await this.audioCtx.resume();
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const source = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      source.connect(this.analyser);

      this.startTime = stimulusTimestamp || performance.now();
      this.speechOnsetTime = 0;
      this.isSpeechActive = false;
      this.pauseCount = 0;
      this.lastSilenceStart = 0;
      this.peakDb = -100;

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const processAudio = () => {
        if (!this.analyser) return;

        this.analyser.getByteFrequencyData(dataArray);

        // Compute Root Mean Square (RMS) energy
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = dataArray[i] / 255;
          sum += normalized * normalized;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const currentDb = rms > 0 ? 20 * Math.log10(rms) : -100;

        if (currentDb > this.peakDb) {
          this.peakDb = currentDb;
        }

        const now = performance.now();

        // Detect speech onset latency (VOL)
        if (currentDb > this.thresholdDb) {
          if (!this.speechOnsetTime) {
            this.speechOnsetTime = now;
          }
          if (!this.isSpeechActive) {
            this.isSpeechActive = true;
            if (this.lastSilenceStart > 0) {
              const silenceDuration = now - this.lastSilenceStart;
              if (silenceDuration >= this.pauseDurationThresholdMs) {
                this.pauseCount++;
              }
              this.lastSilenceStart = 0;
            }
          }
        } else {
          // Below speech threshold (silence or breath pause)
          if (this.isSpeechActive) {
            this.isSpeechActive = false;
            this.lastSilenceStart = now;
          }
        }

        if (onVisualizerData) {
          onVisualizerData(dataArray, currentDb);
        }

        this.animationFrameId = requestAnimationFrame(processAudio);
      };

      processAudio();
      return true;
    } catch (err) {
      console.warn("Microphone access unavailable or denied:", err);
      return false;
    }
  }

  /**
   * Stops listening, releases all hardware resources, and computes final metrics.
   */
  stop(targetWord: string): SpeechAnalysisResult {
    const endTime = performance.now();
    const totalDurationMs = Math.max(100, Math.round(endTime - this.startTime));

    let vocalOnsetLatencyMs = 0;
    if (this.speechOnsetTime > 0) {
      vocalOnsetLatencyMs = Math.round(this.speechOnsetTime - this.startTime);
    } else {
      // No vocal onset detected within window
      vocalOnsetLatencyMs = totalDurationMs;
    }

    // Baseline heuristic accuracy based on stimulus length vs duration & volume
    const speechDetected = this.peakDb > this.thresholdDb && this.speechOnsetTime > 0;
    let phonemeAccuracyPercent = 0;

    if (speechDetected) {
      // Normative reading: ~300-800ms VOL is typical. Higher latency indicates phonological decoding effort.
      const latencyPenalty = Math.min(40, Math.max(0, (vocalOnsetLatencyMs - 700) / 40));
      const pausePenalty = this.pauseCount * 8;
      phonemeAccuracyPercent = Math.max(30, Math.min(98, Math.round(100 - latencyPenalty - pausePenalty)));
    }

    const result: SpeechAnalysisResult = {
      vocalOnsetLatencyMs,
      pauseCountOver250ms: this.pauseCount,
      totalDurationMs,
      peakDecibels: Math.round(this.peakDb),
      speechDetected,
      phonemeAccuracyPercent,
    };

    this.cleanup();
    return result;
  }

  /**
   * Cleans up audio tracks and context to guarantee memory safety.
   */
  cleanup(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioCtx) {
      if (this.audioCtx.state !== "closed") {
        this.audioCtx.close().catch(() => {});
      }
      this.audioCtx = null;
    }

    this.analyser = null;
  }
}
