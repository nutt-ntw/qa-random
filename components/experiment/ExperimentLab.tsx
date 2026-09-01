"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CompletionCelebration } from "@/components/completion/CompletionCelebration";
import { SamplingDistributionChart } from "@/components/chart/SamplingDistributionChart";
import { ExperimentControls } from "@/components/experiment/ExperimentControls";
import { SimulationProgress } from "@/components/experiment/SimulationProgress";
import { LatestResult } from "@/components/results/LatestResult";
import { ResultsHistory } from "@/components/results/ResultsHistory";
import { SummaryMetrics } from "@/components/results/SummaryMetrics";
import { Toast } from "@/components/ui/Toast";
import { buildTsv, downloadCsv, downloadExcel } from "@/lib/export";
import { formatStatistic } from "@/lib/statistics";
import { useLotterySimulation } from "@/hooks/useLotterySimulation";
import type { ToastMessage, ToastTone } from "@/types";

export function ExperimentLab() {
  const simulation = useLotterySimulation();
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
  }, []);

  const notify = useCallback((message: string, tone: ToastTone = "success") => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast({ id: Date.now(), message, tone });
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3_200);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!simulation.results.length) return;
    const text = buildTsv(simulation.results);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    notify("คัดลอกข้อมูลแบบแยกคอลัมน์แล้ว พร้อมวางใน Excel");
  }, [notify, simulation.results]);

  const handleCsv = useCallback(() => {
    if (!simulation.results.length) return;
    downloadCsv(simulation.results);
    notify("สร้างไฟล์ CSV ภาษาไทยเรียบร้อยแล้ว");
  }, [notify, simulation.results]);

  const handleExcel = useCallback(async () => {
    if (!simulation.results.length) return;
    try {
      await downloadExcel(simulation.results);
      notify("สร้างไฟล์ Excel เรียบร้อยแล้ว");
    } catch {
      notify("ไม่สามารถสร้างไฟล์ Excel ได้ กรุณาลองอีกครั้ง", "warning");
    }
  }, [notify, simulation.results]);

  const handleShare = useCallback(async () => {
    const summary = simulation.summary;
    if (!summary.completedRounds || summary.overallMean === null) return;
    const text = `QA Random: ${summary.completedRounds} รอบ · ค่าเฉลี่ยรวม ${formatStatistic(summary.overallMean)} · ช่วง ${formatStatistic(summary.minimumMean ?? 0)}–${formatStatistic(summary.maximumMean ?? 0)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "QA Random — Experiment summary", text });
        notify("แชร์สรุปการทดลองแล้ว");
      } else {
        await navigator.clipboard.writeText(text);
        notify("คัดลอกสรุปการทดลองแล้ว");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      notify("ไม่สามารถแชร์ได้ กรุณาลองคัดลอกอีกครั้ง", "warning");
    }
  }, [notify, simulation.summary]);

  return (
    <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 pb-20 sm:px-6 lg:space-y-8 lg:px-8">
      <ExperimentControls
        inputs={simulation.inputs}
        errors={simulation.errors}
        populationSize={simulation.populationSize}
        populationMean={simulation.populationMean}
        isRunning={simulation.isRunning}
        onCountChange={simulation.setCount}
        onFieldChange={simulation.setField}
        onStart={() => void simulation.start()}
        onReset={simulation.reset}
      />

      <SimulationProgress current={simulation.currentRound} total={simulation.totalRounds} isRunning={simulation.isRunning} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)] lg:items-start">
        <LatestResult result={simulation.latestResult} />
        <SummaryMetrics summary={simulation.summary} />
      </div>

      <SamplingDistributionChart results={simulation.results} />
      <ResultsHistory results={simulation.results} onCopy={() => void handleCopy()} onCsv={handleCsv} onExcel={() => void handleExcel()} />

      {simulation.completionQuote ? (
        <CompletionCelebration quote={simulation.completionQuote} rounds={simulation.totalRounds} onRunAgain={() => void simulation.start()} onShare={() => void handleShare()} />
      ) : null}

      <Toast toast={toast} />
    </main>
  );
}
