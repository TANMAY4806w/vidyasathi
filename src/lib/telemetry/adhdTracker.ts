/**
 * Passive ADHD & Executive Attention Telemetry Tracker
 * Measures micro-interaction latency variance, impulsive clicks, and task-switching hesitations.
 * Operates passively without asking direct clinical questions to avoid intimidation.
 */

export interface AdhdInteractionMetrics {
  impulsiveRapidClickCount: number; // Taps <180ms apart
  reactionTimeVarianceMs: number; // Standard deviation of reaction latencies
  idleDwellOver5sCount: number; // Lapses in attention >5 seconds
  totalSessionDurationMs: number;
}

export class AdhdTelemetryTracker {
  private lastClickTime: number = 0;
  private impulsiveClicks: number = 0;
  private reactionTimes: number[] = [];
  private idleCount: number = 0;
  private sessionStartTime: number = performance.now();

  /**
   * Records a user interaction click to analyze inter-tap interval.
   */
  recordClick(): void {
    const now = performance.now();
    if (this.lastClickTime > 0) {
      const delta = now - this.lastClickTime;
      // Taps under 180ms suggest impulsive motor disinhibition or impatience
      if (delta < 180) {
        this.impulsiveClicks++;
      }
    }
    this.lastClickTime = now;
  }

  /**
   * Records a trial reaction time (time to respond to a visual/audio stimulus).
   */
  recordReactionTime(latencyMs: number): void {
    if (latencyMs > 0 && latencyMs < 30000) {
      this.reactionTimes.push(latencyMs);
      if (latencyMs > 5000) {
        this.idleCount++;
      }
    }
  }

  /**
   * Computes final ADHD attention stability metrics.
   */
  getMetrics(): AdhdInteractionMetrics {
    const totalSessionDurationMs = Math.round(performance.now() - this.sessionStartTime);

    let variance = 0;
    if (this.reactionTimes.length > 1) {
      const mean = this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length;
      const squaredDiffs = this.reactionTimes.map((t) => Math.pow(t - mean, 2));
      const varianceVal = squaredDiffs.reduce((a, b) => a + b, 0) / this.reactionTimes.length;
      variance = Math.round(Math.sqrt(varianceVal)); // Standard deviation in ms
    }

    return {
      impulsiveRapidClickCount: this.impulsiveClicks,
      reactionTimeVarianceMs: variance,
      idleDwellOver5sCount: this.idleCount,
      totalSessionDurationMs,
    };
  }
}
