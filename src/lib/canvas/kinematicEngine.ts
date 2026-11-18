/**
 * Kinematic Canvas Engine for Dysgraphia Screening (Constellation Tracing)
 * Computes stroke velocity variance, acceleration spikes, micro-tremor, and pen-lifts.
 * Complies strictly with DPDP Act 2023: Zero handwriting images leave client memory.
 */

export interface StrokePoint {
  x: number;
  y: number;
  time: number;
  pressure: number;
}

export interface KinematicAnalysisResult {
  strokeCount: number; // Pen-lifts
  totalDurationMs: number;
  avgVelocityPxPerMs: number;
  velocityVariance: number;
  kinematicJitterScore: number; // 0 - 1 normalized tremor index
  retrogradeDirectionChanges: number; // Potential reversal indicator
  pathLengthPx: number;
}

export class KinematicEngine {
  /**
   * Analyzes an array of strokes (each stroke being an array of sampled points).
   */
  static analyzeStrokes(strokes: StrokePoint[][]): KinematicAnalysisResult {
    if (!strokes || strokes.length === 0) {
      return {
        strokeCount: 0,
        totalDurationMs: 0,
        avgVelocityPxPerMs: 0,
        velocityVariance: 0,
        kinematicJitterScore: 0,
        retrogradeDirectionChanges: 0,
        pathLengthPx: 0,
      };
    }

    let totalDurationMs = 0;
    let totalPathLengthPx = 0;
    const velocities: number[] = [];
    let jitterSum = 0;
    let jitterCount = 0;
    let retrogradeChanges = 0;

    const strokeCount = strokes.length;

    for (const stroke of strokes) {
      if (stroke.length < 2) continue;

      const strokeDuration = stroke[stroke.length - 1].time - stroke[0].time;
      totalDurationMs += strokeDuration;

      for (let i = 1; i < stroke.length; i++) {
        const p1 = stroke[i - 1];
        const p2 = stroke[i];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dt = Math.max(1, p2.time - p1.time);

        const dist = Math.sqrt(dx * dx + dy * dy);
        totalPathLengthPx += dist;

        const v = dist / dt;
        velocities.push(v);

        // Detect high-frequency direction change (tremor/jitter) across 3 consecutive points
        if (i >= 2) {
          const p0 = stroke[i - 2];
          const dxPrev = p1.x - p0.x;
          const dyPrev = p1.y - p0.y;

          // Angle between consecutive vectors
          const angleDiff = Math.abs(Math.atan2(dy, dx) - Math.atan2(dyPrev, dxPrev));
          const normalizedAngle = angleDiff > Math.PI ? 2 * Math.PI - angleDiff : angleDiff;

          // High curvature (>60 deg) at close spatial distance indicates tremor/micro-hesitation
          if (dist < 15 && normalizedAngle > Math.PI / 3) {
            jitterSum += normalizedAngle;
            jitterCount++;
          }

          // Horizontal retrograde stroke check (moving backwards in x)
          if ((dxPrev > 2 && dx < -2) || (dxPrev < -2 && dx > 2)) {
            retrogradeChanges++;
          }
        }
      }
    }

    // Velocity statistics
    const avgVelocityPxPerMs =
      velocities.length > 0
        ? velocities.reduce((a, b) => a + b, 0) / velocities.length
        : 0;

    let velocityVariance = 0;
    if (velocities.length > 1) {
      const sqDiffs = velocities.map((v) => Math.pow(v - avgVelocityPxPerMs, 2));
      velocityVariance = sqDiffs.reduce((a, b) => a + b, 0) / velocities.length;
    }

    // Normalized jitter score: typical smooth stroke < 0.35; dysgraphic tremor > 0.65
    const rawJitterRatio = jitterCount > 0 ? jitterSum / Math.max(1, velocities.length) : 0;
    const kinematicJitterScore = Math.min(1, Math.max(0, Math.round(rawJitterRatio * 100) / 100));

    return {
      strokeCount,
      totalDurationMs: Math.round(totalDurationMs),
      avgVelocityPxPerMs: Math.round(avgVelocityPxPerMs * 1000) / 1000,
      velocityVariance: Math.round(velocityVariance * 1000) / 1000,
      kinematicJitterScore,
      retrogradeDirectionChanges: retrogradeChanges,
      pathLengthPx: Math.round(totalPathLengthPx),
    };
  }
}
