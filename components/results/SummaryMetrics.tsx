"use client";

import { motion, useReducedMotion } from "framer-motion";
import { formatStatistic } from "@/lib/statistics";
import type { SummaryStatistics } from "@/types";

export function SummaryMetrics({ summary }: { summary: SummaryStatistics }) {
  const reducedMotion = useReducedMotion();
  const items = [
    { label: "Completed rounds", value: summary.completedRounds.toLocaleString(), accent: "text-cyan-200" },
    { label: "Overall mean", value: nullableValue(summary.overallMean), accent: "text-violet-200" },
    { label: "Minimum mean", value: nullableValue(summary.minimumMean), accent: "text-blue-200" },
    { label: "Maximum mean", value: nullableValue(summary.maximumMean), accent: "text-fuchsia-200" },
    { label: "Std. deviation", value: nullableValue(summary.standardDeviation), accent: "text-orange-200" },
  ];

  return (
    <section aria-labelledby="summary-heading">
      <div className="mb-4 flex items-center justify-between"><div><p className="section-kicker">Live statistics</p><h2 id="summary-heading" className="sr-only">สถิติสรุป</h2></div><p className="text-xs text-slate-500">Population SD of sample means</p></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {items.map((item, index) => (
          <motion.div key={item.label} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className={`rounded-2xl border border-white/8 bg-white/[0.035] p-4 ${index === 4 ? "col-span-2 lg:col-span-1" : ""}`}>
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</span>
            <strong className={`mt-2 block text-2xl font-bold tabular-nums ${item.accent}`}>{item.value}</strong>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function nullableValue(value: number | null): string {
  return value === null ? "—" : formatStatistic(value);
}
