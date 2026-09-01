import type { DensityPoint, DrawResult, SummaryStatistics } from "@/types";

const DECIMAL_PLACES = 4;
const DENSITY_SAMPLE_COUNT = 180;
const X_AXIS_MINIMUM = 1;
const X_AXIS_MAXIMUM = 5;
const MINIMUM_BANDWIDTH = 0.1;
const MAXIMUM_BANDWIDTH = 0.55;

export function calculateMean(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculateStandardDeviation(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const average = calculateMean(values);
  const variance = calculateMean(values.map((value) => (value - average) ** 2));
  return Math.sqrt(variance);
}

export function formatStatistic(value: number): string {
  return value.toFixed(DECIMAL_PLACES).replace(/\.?0+$/, "");
}

export function summarizeResults(results: readonly DrawResult[]): SummaryStatistics {
  if (results.length === 0) {
    return {
      completedRounds: 0,
      overallMean: null,
      minimumMean: null,
      maximumMean: null,
      standardDeviation: null,
    };
  }

  const means = results.map((result) => result.mean);

  return {
    completedRounds: results.length,
    overallMean: calculateMean(means),
    minimumMean: Math.min(...means),
    maximumMean: Math.max(...means),
    standardDeviation: calculateStandardDeviation(means),
  };
}

export function buildDensity(values: readonly number[]): DensityPoint[] {
  if (values.length === 0) {
    return [];
  }

  const standardDeviation = calculateStandardDeviation(values);
  const bandwidth = Math.min(
    MAXIMUM_BANDWIDTH,
    Math.max(
      MINIMUM_BANDWIDTH,
      1.06 * standardDeviation * values.length ** -0.2,
    ),
  );

  return Array.from({ length: DENSITY_SAMPLE_COUNT }, (_, index) => {
    const x =
      X_AXIS_MINIMUM +
      (index / (DENSITY_SAMPLE_COUNT - 1)) *
        (X_AXIS_MAXIMUM - X_AXIS_MINIMUM);
    const density =
      values.reduce((sum, value) => {
        const distance = (x - value) / bandwidth;
        return sum + Math.exp(-0.5 * distance * distance);
      }, 0) /
      (values.length * bandwidth * Math.sqrt(2 * Math.PI));

    return { x, density };
  });
}
