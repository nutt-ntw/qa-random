export const TICKET_VALUES = [1, 2, 3, 4, 5] as const;

export type TicketValue = (typeof TICKET_VALUES)[number];

export interface TicketQuantity {
  value: TicketValue;
  count: number;
}

export interface TicketInputs {
  counts: Record<TicketValue, string>;
  rounds: string;
  sampleSize: string;
}

export interface SimulationConfiguration {
  tickets: TicketQuantity[];
  rounds: number;
  sampleSize: number;
}

export interface DrawResult {
  round: number;
  results: TicketValue[];
  mean: number;
}

export interface ValidationErrors {
  counts: Partial<Record<TicketValue, string>>;
  rounds?: string;
  sampleSize?: string;
  population?: string;
}

export interface ValidationResult {
  configuration: SimulationConfiguration | null;
  errors: ValidationErrors;
}

export interface SummaryStatistics {
  completedRounds: number;
  overallMean: number | null;
  minimumMean: number | null;
  maximumMean: number | null;
  standardDeviation: number | null;
}

export interface DensityPoint {
  x: number;
  density: number;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export type ToastTone = "success" | "warning" | "info";

export interface ToastMessage {
  id: number;
  message: string;
  tone: ToastTone;
}
