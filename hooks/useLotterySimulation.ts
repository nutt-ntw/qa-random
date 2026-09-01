"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { QUOTES } from "@/data/quotes";
import { summarizeResults } from "@/lib/statistics";
import { buildPopulation, DEFAULT_INPUTS, generateRound, validateConfiguration } from "@/lib/simulation";
import { TICKET_VALUES, type DrawResult, type TicketInputs, type TicketValue, type ValidationErrors } from "@/types";

const EMPTY_ERRORS: ValidationErrors = { counts: {} };
const TARGET_RENDER_UPDATES = 24;

export function useLotterySimulation() {
  const [inputs, setInputs] = useState<TicketInputs>(DEFAULT_INPUTS);
  const [errors, setErrors] = useState<ValidationErrors>(EMPTY_ERRORS);
  const [results, setResults] = useState<DrawResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(Number(DEFAULT_INPUTS.rounds));
  const [completionQuote, setCompletionQuote] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const runningRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  const parsedTickets = useMemo(() => TICKET_VALUES.map((value) => {
    const count = Number(inputs.counts[value]);
    return { value, count: Number.isInteger(count) && count >= 0 ? count : 0 };
  }), [inputs.counts]);

  const populationSize = useMemo(() => parsedTickets.reduce((sum, ticket) => sum + ticket.count, 0), [parsedTickets]);
  const populationMean = useMemo(() => populationSize ? parsedTickets.reduce((sum, ticket) => sum + ticket.value * ticket.count, 0) / populationSize : 0, [parsedTickets, populationSize]);
  const summary = useMemo(() => summarizeResults(results), [results]);
  const latestResult = results.at(-1) ?? null;

  const cancelCurrentRun = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    runningRef.current = false;
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    cancelCurrentRun();
    setResults([]);
    setCurrentRound(0);
    setTotalRounds(Number(inputs.rounds) || 0);
    setCompletionQuote(null);
    setErrors(EMPTY_ERRORS);
  }, [cancelCurrentRun, inputs.rounds]);

  const prepareAnotherExperiment = useCallback(() => {
    reset();
    document.getElementById("experiment-controls")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [reducedMotion, reset]);

  const setCount = useCallback((value: TicketValue, count: string) => {
    setInputs((current) => ({ ...current, counts: { ...current.counts, [value]: count } }));
    setErrors(EMPTY_ERRORS);
  }, []);

  const setField = useCallback((field: "rounds" | "sampleSize", value: string) => {
    setInputs((current) => ({ ...current, [field]: value }));
    setErrors(EMPTY_ERRORS);
  }, []);

  const start = useCallback(async () => {
    if (runningRef.current) return;

    const validation = validateConfiguration(inputs);
    setErrors(validation.errors);
    if (!validation.configuration) return;

    const configuration = validation.configuration;
    const controller = new AbortController();
    abortControllerRef.current?.abort();
    abortControllerRef.current = controller;
    runningRef.current = true;
    setIsRunning(true);
    setResults([]);
    setCurrentRound(0);
    setTotalRounds(configuration.rounds);
    setCompletionQuote(null);

    const population = buildPopulation(configuration.tickets);
    const generated: DrawResult[] = [];
    const batchSize = Math.max(1, Math.ceil(configuration.rounds / TARGET_RENDER_UPDATES));

    for (let index = 0; index < configuration.rounds; index += 1) {
      if (controller.signal.aborted) return;

      generated.push(generateRound(population, configuration.sampleSize, index + 1));
      const shouldRender = index === 0 || index === configuration.rounds - 1 || (index + 1) % batchSize === 0;

      if (shouldRender) {
        setResults([...generated]);
        setCurrentRound(index + 1);

        const shouldContinue = index === 0 && configuration.rounds > 1 && !reducedMotion
          ? await waitFor(320, controller.signal)
          : await nextFrame(controller.signal);
        if (!shouldContinue) return;
      }
    }

    runningRef.current = false;
    abortControllerRef.current = null;
    setIsRunning(false);
    setCompletionQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, [inputs, reducedMotion]);

  return {
    inputs,
    errors,
    results,
    latestResult,
    summary,
    populationSize,
    populationMean,
    isRunning,
    currentRound,
    totalRounds,
    completionQuote,
    setCount,
    setField,
    start,
    reset,
    prepareAnotherExperiment,
  };
}

function waitFor(milliseconds: number, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      signal.removeEventListener("abort", handleAbort);
      resolve(true);
    }, milliseconds);
    const handleAbort = () => {
      window.clearTimeout(timeout);
      signal.removeEventListener("abort", handleAbort);
      resolve(false);
    };
    signal.addEventListener("abort", handleAbort, { once: true });
  });
}

function nextFrame(signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    const frame = window.requestAnimationFrame(() => {
      signal.removeEventListener("abort", handleAbort);
      resolve(true);
    });
    const handleAbort = () => {
      window.cancelAnimationFrame(frame);
      signal.removeEventListener("abort", handleAbort);
      resolve(false);
    };
    signal.addEventListener("abort", handleAbort, { once: true });
  });
}
