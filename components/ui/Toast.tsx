"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon } from "@/components/ui/Icons";
import type { ToastMessage } from "@/types";

const toneStyles = {
  success: "bg-emerald-400/15 text-emerald-300",
  warning: "bg-orange-400/15 text-orange-300",
  info: "bg-cyan-400/15 text-cyan-300",
} as const;

export function Toast({ toast }: { toast: ToastMessage | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-5 z-50 flex justify-center" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="flex max-w-md items-center gap-3 rounded-2xl border border-white/15 bg-slate-900/95 px-4 py-3 text-sm text-slate-100 shadow-2xl backdrop-blur-xl"
          >
            <span className={`grid size-7 place-items-center rounded-full ${toneStyles[toast.tone]}`}><CheckIcon className="size-4" /></span>
            {toast.message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
