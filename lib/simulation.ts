import { calculateMean } from "@/lib/statistics";
import {
  TICKET_VALUES,
  type DrawResult,
  type SimulationConfiguration,
  type TicketInputs,
  type TicketQuantity,
  type TicketValue,
  type ValidationErrors,
  type ValidationResult,
} from "@/types";

export const DEFAULT_TICKETS: TicketQuantity[] = [
  { value: 1, count: 5 },
  { value: 2, count: 3 },
  { value: 3, count: 1 },
  { value: 4, count: 3 },
  { value: 5, count: 5 },
];

export const DEFAULT_ROUNDS = 5;
export const DEFAULT_SAMPLE_SIZE = 17;
export const MAX_ROUNDS = 5_000;
export const MAX_TICKETS_PER_VALUE = 10_000;
export const MAX_POPULATION_SIZE = 25_000;

export const DEFAULT_INPUTS: TicketInputs = {
  counts: { 1: "5", 2: "3", 3: "1", 4: "3", 5: "5" },
  rounds: String(DEFAULT_ROUNDS),
  sampleSize: String(DEFAULT_SAMPLE_SIZE),
};

function parseInteger(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

export function validateConfiguration(inputs: TicketInputs): ValidationResult {
  const errors: ValidationErrors = { counts: {} };
  const tickets: TicketQuantity[] = [];

  for (const value of TICKET_VALUES) {
    const input = inputs.counts[value];
    const parsed = parseInteger(input);

    if (input.trim() === "") {
      errors.counts[value] = `กรุณาระบุจำนวนฉลากเลข ${value}`;
      continue;
    }
    if (parsed === null) {
      errors.counts[value] = "จำนวนฉลากต้องเป็นจำนวนเต็ม";
      continue;
    }
    if (parsed < 0) {
      errors.counts[value] = "จำนวนฉลากต้องไม่ติดลบ";
      continue;
    }
    if (parsed > MAX_TICKETS_PER_VALUE) {
      errors.counts[value] = `กำหนดได้ไม่เกิน ${MAX_TICKETS_PER_VALUE.toLocaleString()} ใบ`;
      continue;
    }

    tickets.push({ value, count: parsed });
  }

  const populationSize = tickets.reduce((sum, ticket) => sum + ticket.count, 0);
  if (tickets.length === TICKET_VALUES.length && populationSize === 0) {
    errors.population = "ต้องมีฉลากอย่างน้อย 1 ใบในประชากร";
  } else if (populationSize > MAX_POPULATION_SIZE) {
    errors.population = `ประชากรรวมต้องไม่เกิน ${MAX_POPULATION_SIZE.toLocaleString()} ใบ เพื่อป้องกันหน้าเว็บค้าง`;
  }

  const rounds = parseInteger(inputs.rounds);
  if (inputs.rounds.trim() === "") {
    errors.rounds = "กรุณาระบุจำนวนรอบ";
  } else if (rounds === null) {
    errors.rounds = "จำนวนรอบต้องเป็นจำนวนเต็ม";
  } else if (rounds < 1) {
    errors.rounds = "จำนวนรอบต้องมากกว่า 0";
  } else if (rounds > MAX_ROUNDS) {
    errors.rounds = `ทดลองได้ไม่เกิน ${MAX_ROUNDS.toLocaleString()} รอบต่อครั้ง`;
  }

  const sampleSize = parseInteger(inputs.sampleSize);
  if (inputs.sampleSize.trim() === "") {
    errors.sampleSize = "กรุณาระบุจำนวนใบต่อรอบ";
  } else if (sampleSize === null) {
    errors.sampleSize = "จำนวนใบต่อรอบต้องเป็นจำนวนเต็ม";
  } else if (sampleSize < 1) {
    errors.sampleSize = "จำนวนใบต่อรอบต้องมากกว่า 0";
  } else if (populationSize > 0 && sampleSize > populationSize) {
    errors.sampleSize = `หยิบได้ไม่เกินประชากรทั้งหมด ${populationSize.toLocaleString()} ใบ`;
  }

  const hasErrors =
    Object.keys(errors.counts).length > 0 ||
    Boolean(errors.rounds || errors.sampleSize || errors.population);

  return {
    configuration:
      !hasErrors && rounds !== null && sampleSize !== null
        ? { tickets, rounds, sampleSize }
        : null,
    errors,
  };
}

export function buildPopulation(tickets: readonly TicketQuantity[]): TicketValue[] {
  return tickets.flatMap(({ value, count }) => Array<TicketValue>(count).fill(value));
}

export function drawWithoutReplacement(
  population: readonly TicketValue[],
  sampleSize: number,
  random: () => number = Math.random,
): TicketValue[] {
  if (!Number.isInteger(sampleSize) || sampleSize < 0 || sampleSize > population.length) {
    throw new RangeError("Sample size must be an integer within the population size.");
  }

  const available = [...population];
  const selected: TicketValue[] = [];

  for (let index = 0; index < sampleSize; index += 1) {
    const randomValue = Math.min(Math.max(random(), 0), 1 - Number.EPSILON);
    const randomIndex = Math.floor(randomValue * available.length);
    const [ticket] = available.splice(randomIndex, 1);
    selected.push(ticket);
  }

  return selected;
}

export function generateRound(
  population: readonly TicketValue[],
  sampleSize: number,
  round: number,
  random: () => number = Math.random,
): DrawResult {
  const results = drawWithoutReplacement(population, sampleSize, random);
  return { round, results, mean: calculateMean(results) };
}

export function generateSimulation(
  configuration: SimulationConfiguration,
  random: () => number = Math.random,
): DrawResult[] {
  const population = buildPopulation(configuration.tickets);
  return Array.from({ length: configuration.rounds }, (_, index) =>
    generateRound(population, configuration.sampleSize, index + 1, random),
  );
}
