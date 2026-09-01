"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getCountdownAnnouncement, getCountdownParts, MIDTERM_TARGET } from "@/lib/countdown";
import type { CountdownParts } from "@/types";

const units: Array<{ key: keyof Pick<CountdownParts, "days" | "hours" | "minutes" | "seconds">; label: string; accent: string; glow: string }> = [
  { key: "days", label: "วัน", accent: "text-violet-100", glow: "from-violet-400" },
  { key: "hours", label: "ชั่วโมง", accent: "text-indigo-100", glow: "from-indigo-400" },
  { key: "minutes", label: "นาที", accent: "text-cyan-100", glow: "from-cyan-400" },
  { key: "seconds", label: "วินาที", accent: "text-orange-100", glow: "from-orange-400" },
];

export function ExamCountdown() {
  const [parts, setParts] = useState<CountdownParts | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const update = () => setParts(getCountdownParts());
    update();
    const interval = window.setInterval(update, 1_000);
    return () => window.clearInterval(interval);
  }, []);

  if (!parts) {
    return <div className="h-56 animate-pulse rounded-3xl bg-white/5 sm:h-48" aria-label="กำลังโหลดเวลานับถอยหลัง" />;
  }

  if (parts.isComplete) {
    return <p className="mx-auto max-w-4xl rounded-3xl border border-cyan-300/20 bg-cyan-300/8 p-6 text-center text-lg font-semibold text-cyan-100">ถึงเวลาสอบ Midterm แล้ว ขอให้ทุกคนทำข้อสอบอย่างมั่นใจ</p>;
  }

  return (
    <section role="timer" aria-live="off" className="mx-auto max-w-4xl rounded-3xl border border-white/12 bg-slate-950/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.07)] backdrop-blur-md sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="relative grid size-10 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/8" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,.85)]" />
          </span>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan-200/80">Midterm countdown</p>
            <h3 className="mt-0.5 text-lg font-bold text-white">เหลือเวลาอีก</h3>
          </div>
        </div>
        <time dateTime={MIDTERM_TARGET} className="w-fit rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-semibold text-violet-100">
          3 ต.ค. 2026 · 09:00 น.
        </time>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" aria-hidden="true">
        {units.map(({ key, label, accent, glow }) => (
          <div key={key} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-3.5 text-center">
            <span className={`absolute inset-x-4 top-0 h-px bg-gradient-to-r ${glow} to-transparent opacity-80`} />
            <div className="h-10 overflow-hidden sm:h-11">
              <motion.strong
                key={parts[key]}
                initial={reducedMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.22, ease: "easeOut" }}
                className={`block text-3xl font-bold leading-10 tabular-nums sm:text-4xl sm:leading-11 ${accent}`}
              >
                {String(parts[key]).padStart(2, "0")}
              </motion.strong>
            </div>
            <span className="mt-1 block text-xs font-medium text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-sm font-medium text-violet-100/85">
        ก่อนถึงเวลาสอบ <strong className="text-white">Midterm</strong>
        <span className="mx-2 text-white/25" aria-hidden="true">·</span>
        <span className="text-xs text-slate-400">เวลาไทย (GMT+7)</span>
      </p>
      <span className="sr-only">{getCountdownAnnouncement(parts)}</span>
    </section>
  );
}
