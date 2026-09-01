"use client";

import { motion, useReducedMotion } from "framer-motion";
import { formatStatistic } from "@/lib/statistics";
import { Panel } from "@/components/ui/Panel";
import type { DrawResult } from "@/types";

export function LatestResult({ result }: { result: DrawResult | null }) {
  const reducedMotion = useReducedMotion();

  return (
    <Panel className="p-5 sm:p-6" aria-labelledby="latest-result-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><p className="section-kicker">02 · Observe</p><h2 id="latest-result-heading" className="mt-2 text-xl font-bold text-white">ผลการสุ่มล่าสุด</h2></div>
        {result ? <span className="rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-xs font-semibold text-cyan-200">Round {result.round}</span> : null}
      </div>
      {result ? (
        <motion.div key={result.round} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="min-h-[25rem]">
          <div className="flex h-44 flex-wrap content-start items-start gap-2.5 overflow-y-auto pr-1">
            {result.results.map((ticket, index) => (
              <motion.span key={`${result.round}-${index}`} initial={reducedMotion ? false : { opacity: 0, scale: 0.72, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : Math.min(index * 0.035, 0.25), type: "spring", stiffness: 300, damping: 22 }} className="grid size-12 place-items-center rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-300/18 to-indigo-500/12 text-xl font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12)] sm:size-14">
                {ticket}
              </motion.span>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-violet-300/15 bg-violet-400/8 p-4"><span className="text-xs uppercase tracking-[0.16em] text-violet-200/70">Sample mean</span><strong className="mt-1 block text-3xl text-white">x̄ = {formatStatistic(result.mean)}</strong></div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4"><span className="text-xs uppercase tracking-[0.16em] text-slate-500">Tickets drawn</span><strong className="mt-2 block text-xl text-slate-100">{result.results.length.toLocaleString()} ใบ</strong></div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">ค่าเฉลี่ยนี้สรุปค่าของฉลากในตัวอย่างรอบที่ {result.round} และกลายเป็นหนึ่งจุดใน sampling distribution</p>
        </motion.div>
      ) : (
        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid min-h-[25rem] place-items-center rounded-2xl border border-dashed border-white/12 bg-white/[0.02] text-center">
          <div><div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-xl text-slate-400">x̄</div><p className="font-medium text-slate-300">ผลลัพธ์จะปรากฏที่นี่</p><p className="mt-1 text-sm text-slate-500">เริ่มการทดลองเพื่อดูฉลากและค่าเฉลี่ยรอบแรก</p></div>
        </motion.div>
      )}
    </Panel>
  );
}
