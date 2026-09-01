"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SimulationProgressProps {
  current: number;
  total: number;
  isRunning: boolean;
}

export function SimulationProgress({ current, total, isRunning }: SimulationProgressProps) {
  const reducedMotion = useReducedMotion();
  const percentage = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4" aria-live="polite">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-slate-200">{isRunning ? "กำลังจำลองการสุ่ม" : current > 0 ? "การทดลองล่าสุด" : "พร้อมเริ่มการทดลอง"}</span>
        <span className="font-mono text-cyan-200">Round {current.toLocaleString()} of {total.toLocaleString()}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/7" role="progressbar" aria-valuemin={0} aria-valuemax={total || 1} aria-valuenow={current} aria-label="ความคืบหน้าการสุ่ม">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-400 to-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.45)]" initial={false} animate={{ width: `${percentage}%` }} transition={reducedMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }} />
      </div>
    </div>
  );
}
