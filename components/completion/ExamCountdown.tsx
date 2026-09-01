"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getCountdownAnnouncement, getCountdownParts } from "@/lib/countdown";
import type { CountdownParts } from "@/types";

const units: Array<{ key: keyof Pick<CountdownParts, "days" | "hours" | "minutes" | "seconds">; label: string }> = [
  { key: "days", label: "วัน" },
  { key: "hours", label: "ชั่วโมง" },
  { key: "minutes", label: "นาที" },
  { key: "seconds", label: "วินาที" },
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
    return <div className="h-24 animate-pulse rounded-2xl bg-white/5" aria-label="กำลังโหลดเวลานับถอยหลัง" />;
  }

  if (parts.isComplete) {
    return <p className="rounded-2xl border border-cyan-300/20 bg-cyan-300/8 p-5 text-center text-lg font-semibold text-cyan-100">ถึงเวลาสอบ Midterm แล้ว ขอให้ทุกคนทำข้อสอบอย่างมั่นใจ</p>;
  }

  return (
    <div role="timer" aria-live="off">
      <p className="mb-4 text-center text-sm text-violet-100">รู้หรือไม่ อีก… จะถึงเวลาสอบ Midterm</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-hidden="true">
        {units.map(({ key, label }) => (
          <div key={key} className="rounded-2xl border border-white/10 bg-slate-950/25 px-3 py-4 text-center backdrop-blur-sm">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.strong key={parts[key]} initial={reducedMotion ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: 6 }} className="block text-2xl font-bold tabular-nums text-white sm:text-3xl">{String(parts[key]).padStart(2, "0")}</motion.strong>
            </AnimatePresence>
            <span className="mt-1 block text-xs text-slate-300">{label}</span>
          </div>
        ))}
      </div>
      <span className="sr-only">{getCountdownAnnouncement(parts)}</span>
    </div>
  );
}
