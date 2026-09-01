import { describe, expect, it } from "vitest";
import { calculateMean } from "@/lib/statistics";
import {
  buildPopulation,
  DEFAULT_INPUTS,
  DEFAULT_TICKETS,
  drawWithoutReplacement,
  generateSimulation,
  validateConfiguration,
} from "@/lib/simulation";
import type { TicketInputs } from "@/types";

describe("population construction", () => {
  it("builds the configured number of tickets for every value", () => {
    expect(buildPopulation([{ value: 1, count: 2 }, { value: 3, count: 1 }, { value: 5, count: 2 }])).toEqual([1, 1, 3, 5, 5]);
  });

  it("keeps the default population at 17 tickets with a mean of 3", () => {
    const population = buildPopulation(DEFAULT_TICKETS);
    expect(population).toHaveLength(17);
    expect(calculateMean(population)).toBe(3);
  });
});

describe("sampling", () => {
  it("draws without replacement and honors injected random values", () => {
    const randomValues = [0.999, 0, 0];
    const result = drawWithoutReplacement([1, 2, 3, 4, 5], 3, () => randomValues.shift() ?? 0);
    expect(result).toEqual([5, 1, 2]);
    expect(new Set(result)).toHaveLength(3);
  });

  it("rebuilds the full pool between independent rounds", () => {
    const results = generateSimulation({ tickets: [{ value: 1, count: 1 }, { value: 5, count: 1 }], rounds: 2, sampleSize: 2 }, () => 0);
    expect(results.map((result) => result.results)).toEqual([[1, 5], [1, 5]]);
  });

  it("generates the configured rounds, sample sizes, and arithmetic means", () => {
    const results = generateSimulation({ tickets: DEFAULT_TICKETS, rounds: 7, sampleSize: 4 }, () => 0);
    expect(results).toHaveLength(7);
    expect(results.every((result) => result.results.length === 4)).toBe(true);
    for (const result of results) {
      expect(result.mean).toBe(calculateMean(result.results));
    }
  });
});

describe("configuration validation", () => {
  it("accepts the default configuration", () => {
    const validation = validateConfiguration(DEFAULT_INPUTS);
    expect(validation.errors).toEqual({ counts: {} });
    expect(validation.configuration?.rounds).toBe(5);
    expect(validation.configuration?.sampleSize).toBe(17);
  });

  it.each([
    [{ ...DEFAULT_INPUTS, rounds: "" }, "rounds"],
    [{ ...DEFAULT_INPUTS, rounds: "0" }, "rounds"],
    [{ ...DEFAULT_INPUTS, rounds: "1.5" }, "rounds"],
    [{ ...DEFAULT_INPUTS, sampleSize: "0" }, "sampleSize"],
    [{ ...DEFAULT_INPUTS, sampleSize: "18" }, "sampleSize"],
  ] satisfies Array<[TicketInputs, "rounds" | "sampleSize"]>)("rejects invalid numeric controls", (inputs, field) => {
    expect(validateConfiguration(inputs).errors[field]).toBeTruthy();
  });

  it("rejects empty, negative, non-integer, and extremely large ticket quantities", () => {
    const cases = ["", "-1", "1.5", "10001"];
    for (const count of cases) {
      const inputs: TicketInputs = { ...DEFAULT_INPUTS, counts: { ...DEFAULT_INPUTS.counts, 1: count } };
      expect(validateConfiguration(inputs).errors.counts[1]).toBeTruthy();
    }
  });

  it("rejects an empty population", () => {
    const inputs: TicketInputs = { ...DEFAULT_INPUTS, counts: { 1: "0", 2: "0", 3: "0", 4: "0", 5: "0" } };
    expect(validateConfiguration(inputs).errors.population).toBeTruthy();
  });

  it("rejects workloads large enough to freeze the browser", () => {
    expect(validateConfiguration({ ...DEFAULT_INPUTS, rounds: "5001" }).errors.rounds).toBeTruthy();
    const inputs: TicketInputs = {
      ...DEFAULT_INPUTS,
      counts: { 1: "10000", 2: "10000", 3: "10000", 4: "0", 5: "0" },
    };
    expect(validateConfiguration(inputs).errors.population).toBeTruthy();
  });
});
