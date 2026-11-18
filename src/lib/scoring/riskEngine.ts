/**
 * DSM-5 Composite Risk Scoring Engine
 * Normalizes multi-modal game telemetry into 0-100 percentile scores based on
 * normative Indian elementary school benchmarks (Classes 1-8).
 */

export type RiskTier = "LOW_RISK" | "MODERATE_WATCHLIST" | "HIGH_ATTENTION_REQUIRED";

export interface DomainScore {
  percentile: number; // 0 - 100
  riskTier: RiskTier;
  primaryIndicator: string;
}

export interface ScreeningRiskProfile {
  status: "success";
  calculatedAt: string;
  assessmentId: string;
  indices: {
    dyslexia: DomainScore;
    dysgraphia: DomainScore;
    dyscalculia: DomainScore;
    adhd: DomainScore;
  };
  overallRiskSummary: {
    highestRiskDomain: "dyslexia" | "dysgraphia" | "dyscalculia" | "adhd" | "none";
    recommendClinicalEvaluation: boolean;
    iepEligible: boolean;
    compositeRiskLevel: RiskTier;
  };
}

export interface RawScreeningTelemetry {
  dyslexia: {
    avgVocalOnsetLatencyMs: number;
    pauseCountOver250ms: number;
    phonemeAccuracyPercent: number;
    stimulusCount?: number;
  };
  dysgraphia: {
    avgKinematicJitterScore: number;
    strokeVelocityVariance: number;
    reversalCount?: number;
    penLiftsPerLetter: number;
  };
  dyscalculia: {
    subitizingAvgLatencyMs: number;
    subitizingAccuracyPercent: number;
    magnitudeComparisonErrorRate: number;
  };
  adhd: {
    impulsiveRapidClickCount: number;
    reactionTimeVarianceMs: number;
    idleDwellOver5sCount: number;
  };
}

function calculateTier(percentile: number): RiskTier {
  if (percentile > 75) return "HIGH_ATTENTION_REQUIRED";
  if (percentile >= 40) return "MODERATE_WATCHLIST";
  return "LOW_RISK";
}

export class RiskEngine {
  static evaluate(telemetry: RawScreeningTelemetry, assessmentId?: string): ScreeningRiskProfile {
    // 1. Dyslexia Scoring
    // Normative VOL: ~450ms. >1200ms is 80th+ percentile.
    const volRaw = telemetry.dyslexia.avgVocalOnsetLatencyMs || 500;
    const volScore = Math.min(100, Math.max(0, ((volRaw - 400) / 1000) * 80 + 20));
    const pauseScore = Math.min(100, (telemetry.dyslexia.pauseCountOver250ms || 0) * 12);
    const accuracyDeficit = Math.max(0, 100 - (telemetry.dyslexia.phonemeAccuracyPercent || 85));
    const dyslexiaPercentile = Math.round(
      Math.min(99, Math.max(5, volScore * 0.5 + pauseScore * 0.3 + accuracyDeficit * 0.2))
    );

    let dyslexiaIndicator = "Typical phonological decoding speed";
    if (dyslexiaPercentile > 75) {
      dyslexiaIndicator = "Elevated vocal onset latency and frequent mid-word hesitations";
    } else if (dyslexiaPercentile >= 40) {
      dyslexiaIndicator = "Mild phonetic decoding latency observed";
    }

    // 2. Dysgraphia Scoring
    // Normative Jitter: <0.30. >0.65 is high tremor. Pen-lifts >4 per letter indicates dyspraxia.
    const jitterRaw = telemetry.dysgraphia.avgKinematicJitterScore || 0.2;
    const jitterScore = Math.min(100, (jitterRaw / 0.8) * 85);
    const penLiftScore = Math.min(100, (telemetry.dysgraphia.penLiftsPerLetter || 1) * 16);
    const dysgraphiaPercentile = Math.round(
      Math.min(99, Math.max(5, jitterScore * 0.65 + penLiftScore * 0.35))
    );

    let dysgraphiaIndicator = "Smooth kinematic stroke flow and intact letter formation";
    if (dysgraphiaPercentile > 75) {
      dysgraphiaIndicator = "High kinematic stroke jitter and frequent unnatural pen interruptions";
    } else if (dysgraphiaPercentile >= 40) {
      dysgraphiaIndicator = "Moderate pencil tremor and slight baseline instability";
    }

    // 3. Dyscalculia Scoring
    // Normative Subitizing: ~800-1100ms. >1700ms or <60% accuracy indicates core deficit.
    const subLatency = telemetry.dyscalculia.subitizingAvgLatencyMs || 900;
    const subLatencyScore = Math.min(100, Math.max(0, ((subLatency - 700) / 1200) * 80 + 20));
    const subAccuracyDeficit = Math.max(0, 100 - (telemetry.dyscalculia.subitizingAccuracyPercent || 85));
    const magScore = (telemetry.dyscalculia.magnitudeComparisonErrorRate || 0) * 50;
    const dyscalculiaPercentile = Math.round(
      Math.min(99, Math.max(5, subLatencyScore * 0.5 + subAccuracyDeficit * 0.35 + magScore * 0.15))
    );

    let dyscalculiaIndicator = "Normal instantaneous subitizing and magnitude comparison";
    if (dyscalculiaPercentile > 75) {
      dyscalculiaIndicator = "Severe subitizing delay with reliance on slow serial counting";
    } else if (dyscalculiaPercentile >= 40) {
      dyscalculiaIndicator = "Slight difficulty with rapid visual number sense";
    }

    // 4. ADHD Executive Attention Scoring
    // Variance >400ms or rapid impulsive taps >5 indicates motor disinhibition
    const rtVariance = telemetry.adhd.reactionTimeVarianceMs || 150;
    const varianceScore = Math.min(100, (rtVariance / 500) * 80);
    const clickScore = Math.min(100, (telemetry.adhd.impulsiveRapidClickCount || 0) * 15);
    const idleScore = Math.min(100, (telemetry.adhd.idleDwellOver5sCount || 0) * 20);
    const adhdPercentile = Math.round(
      Math.min(99, Math.max(5, varianceScore * 0.5 + clickScore * 0.3 + idleScore * 0.2))
    );

    let adhdIndicator = "Sustained attention and stable reaction timing";
    if (adhdPercentile > 75) {
      adhdIndicator = "High reaction time variability and impulsive motor tapping bursts";
    } else if (adhdPercentile >= 40) {
      adhdIndicator = "Occasional attention drifting between tasks";
    }

    // Overall Risk Evaluation
    const maxPercentile = Math.max(
      dyslexiaPercentile,
      dysgraphiaPercentile,
      dyscalculiaPercentile,
      adhdPercentile
    );

    let highestRiskDomain: "dyslexia" | "dysgraphia" | "dyscalculia" | "adhd" | "none" = "none";
    if (maxPercentile === dyslexiaPercentile && dyslexiaPercentile >= 40) highestRiskDomain = "dyslexia";
    else if (maxPercentile === dysgraphiaPercentile && dysgraphiaPercentile >= 40) highestRiskDomain = "dysgraphia";
    else if (maxPercentile === dyscalculiaPercentile && dyscalculiaPercentile >= 40) highestRiskDomain = "dyscalculia";
    else if (maxPercentile === adhdPercentile && adhdPercentile >= 40) highestRiskDomain = "adhd";

    return {
      status: "success",
      calculatedAt: new Date().toISOString(),
      assessmentId: assessmentId || `asmt_${Math.random().toString(36).substring(2, 10)}`,
      indices: {
        dyslexia: {
          percentile: dyslexiaPercentile,
          riskTier: calculateTier(dyslexiaPercentile),
          primaryIndicator: dyslexiaIndicator,
        },
        dysgraphia: {
          percentile: dysgraphiaPercentile,
          riskTier: calculateTier(dysgraphiaPercentile),
          primaryIndicator: dysgraphiaIndicator,
        },
        dyscalculia: {
          percentile: dyscalculiaPercentile,
          riskTier: calculateTier(dyscalculiaPercentile),
          primaryIndicator: dyscalculiaIndicator,
        },
        adhd: {
          percentile: adhdPercentile,
          riskTier: calculateTier(adhdPercentile),
          primaryIndicator: adhdIndicator,
        },
      },
      overallRiskSummary: {
        highestRiskDomain,
        recommendClinicalEvaluation: maxPercentile > 75,
        iepEligible: maxPercentile >= 40,
        compositeRiskLevel: calculateTier(maxPercentile),
      },
    };
  }
}
