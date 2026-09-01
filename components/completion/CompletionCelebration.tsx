"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowIcon, ShareIcon, SparkIcon } from "@/components/ui/Icons";
import { ExamCountdown } from "@/components/completion/ExamCountdown";

interface CompletionCelebrationProps {
  quote: string;
  rounds: number;
  onRunAgain: () => void;
  onShare: () => void;
}

const particles = Array.from({ length: 18 }, (_, index) => ({
  left: `${6 + ((index * 31) % 88)}%`,
  delay: (index % 6) * 0.08,
  color: ["#22d3ee", "#818cf8", "#c084fc", "#fb923c"][index % 4],
}));

export function CompletionCelebration({ quote, rounds, onRunAgain, onShare }: CompletionCelebrationProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="completion-panel relative overflow-hidden rounded-[2rem] border border-violet-300/20 p-5 shadow-[0_26px_90px_rgba(79,70,229,.3)] sm:p-8" aria-labelledby="completion-heading">
      {!reducedMotion ? <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">{particles.map((particle, index) => <motion.i key={index} className="absolute top-[-10%] size-1.5 rounded-full" style={{ left: particle.left, background: particle.color }} animate={{ y: [0, 380], rotate: [0, 240], opacity: [0, 1, 0] }} transition={{ duration: 2.6, delay: particle.delay, ease: "easeOut" }} />)}</div> : null}
      <div className="relative z-10">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200"><SparkIcon className="size-7" /></div>
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-violet-200">Experiment complete</p>
        <h2 id="completion-heading" className="mt-2 text-center text-2xl font-bold text-white sm:text-3xl">สำเร็จ — ครบ {rounds.toLocaleString()} รอบแล้ว</h2>
        <blockquote className="mx-auto my-6 max-w-3xl rounded-2xl border border-white/12 bg-white/8 px-5 py-5 text-center text-base font-semibold leading-8 text-white backdrop-blur-md sm:text-lg">“{quote}”</blockquote>
        <ExamCountdown />
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button tone="primary" icon={<ArrowIcon className="size-4" />} onClick={onRunAgain}>เริ่มสุ่มใหม่</Button>
          <Button icon={<ShareIcon className="size-4" />} onClick={onShare}>คัดลอก / แชร์สรุป</Button>
        </div>
      </div>
    </motion.section>
  );
}
