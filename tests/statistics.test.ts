import { describe, expect, it } from "vitest";
import { buildDensity, calculateMean, calculateStandardDeviation, summarizeResults } from "@/lib/statistics";

describe("statistics", () => {
  it("calculates arithmetic and overall means", () => {
    expect(calculateMean([1, 2, 3, 4, 5])).toBe(3);
    const summary = summarizeResults([
      { round: 1, results: [1, 3], mean: 2 },
      { round: 2, results: [3, 5], mean: 4 },
    ]);
    expect(summary.overallMean).toBe(3);
    expect(summary.minimumMean).toBe(2);
    expect(summary.maximumMean).toBe(4);
  });

  it("calculates population standard deviation for sample means", () => {
    expect(calculateStandardDeviation([2, 4])).toBe(1);
    expect(summarizeResults([{ round: 1, results: [1], mean: 1 }]).standardDeviation).toBe(0);
  });

  it("builds a finite density curve on a fixed 1–5 domain", () => {
    const density = buildDensity([2, 3, 4]);
    expect(density[0].x).toBe(1);
    expect(density.at(-1)?.x).toBe(5);
    expect(density.every((point) => Number.isFinite(point.density) && point.density >= 0)).toBe(true);
  });
});
