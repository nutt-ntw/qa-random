"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChartIcon } from "@/components/ui/Icons";
import { Panel } from "@/components/ui/Panel";
import { buildDensity, formatStatistic, summarizeResults } from "@/lib/statistics";
import type { DrawResult } from "@/types";

interface RenderedPoint {
  x: number;
  y: number;
  round: number;
  mean: number;
  radius: number;
}

interface TooltipState {
  left: number;
  top: number;
  round: number;
  mean: number;
}

const X_MIN = 1;
const X_MAX = 5;

export function SamplingDistributionChart({ results }: { results: readonly DrawResult[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const renderedPointsRef = useRef<RenderedPoint[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const reducedMotion = useReducedMotion();
  const summary = useMemo(() => summarizeResults(results), [results]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateSize = () => {
      const width = Math.floor(wrapper.getBoundingClientRect().width);
      const height = width < 640 ? Math.max(300, Math.round(width * 0.78)) : 430;
      setSize((current) => current.width === width && current.height === height ? current : { width, height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0 || size.height === 0) return;

    renderedPointsRef.current = drawChart(canvas, size.width, size.height, results);
  }, [results, size]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper || renderedPointsRef.current.length === 0) return;

    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = size.width / canvasRect.width;
    const scaleY = size.height / canvasRect.height;
    const x = (event.clientX - canvasRect.left) * scaleX;
    const y = (event.clientY - canvasRect.top) * scaleY;
    let closest: RenderedPoint | null = null;
    let distance = Number.POSITIVE_INFINITY;

    for (const point of renderedPointsRef.current) {
      const nextDistance = Math.hypot(point.x - x, point.y - y);
      if (nextDistance < distance) {
        distance = nextDistance;
        closest = point;
      }
    }

    if (!closest || distance > Math.max(12, closest.radius + 5)) {
      setTooltip(null);
      return;
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const tooltipWidth = 156;
    const tooltipHeight = 62;
    const desiredLeft = event.clientX - wrapperRect.left + 12;
    const desiredTop = event.clientY - wrapperRect.top - tooltipHeight - 10;

    setTooltip({
      left: Math.min(Math.max(8, desiredLeft), wrapperRect.width - tooltipWidth - 8),
      top: Math.min(Math.max(8, desiredTop), wrapperRect.height - tooltipHeight - 8),
      round: closest.round,
      mean: closest.mean,
    });
  }, [size]);

  return (
    <Panel className="overflow-hidden p-4 sm:p-6" aria-labelledby="distribution-heading">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="section-kicker">03 · Visualize</p><div className="mt-2 flex items-center gap-3"><ChartIcon className="size-6 text-cyan-300" /><h2 id="distribution-heading" className="text-xl font-bold text-white sm:text-2xl">Sampling Distribution ของค่าเฉลี่ย</h2></div></div>
        <div className="rounded-full border border-violet-300/15 bg-violet-400/8 px-4 py-2 text-sm font-semibold text-violet-100">
          {results.length ? `${results.length.toLocaleString()} รอบ · x̄ ${formatStatistic(summary.overallMean ?? 0)}` : "รอข้อมูลการทดลอง"}
        </div>
      </div>

      <motion.div initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="chart-shell relative overflow-hidden rounded-2xl border border-white/8 bg-slate-950/55" ref={wrapperRef}>
        <div className="pointer-events-none absolute left-4 top-3 z-10 flex flex-wrap gap-3 text-[0.68rem] text-slate-400 sm:left-auto sm:right-5 sm:top-4 sm:text-xs" aria-hidden="true">
          <span className="inline-flex items-center gap-2"><i className="size-2.5 rounded-full bg-orange-400 ring-2 ring-orange-200/30" />ค่าเฉลี่ย/รอบ</span>
          <span className="inline-flex items-center gap-2"><i className="w-6 border-t-2 border-blue-400" />Density</span>
          <span className="inline-flex items-center gap-2"><i className="h-4 border-l-2 border-dashed border-violet-400" />Overall mean</span>
        </div>

        {results.length ? (
          <canvas
            ref={canvasRef}
            data-point-count={results.length}
            width={size.width}
            height={size.height}
            style={{ width: size.width ? `${size.width}px` : "100%", height: size.height ? `${size.height}px` : "300px" }}
            className="block max-w-full touch-none"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setTooltip(null)}
            aria-label={`กราฟ sampling distribution จาก ${results.length} รอบ ค่าเฉลี่ยรวม ${formatStatistic(summary.overallMean ?? 0)} แกน X ตั้งแต่ 1 ถึง 5 ข้อมูลตัวเลขทั้งหมดอยู่ในตารางประวัติด้านล่าง`}
            aria-describedby="chart-accessible-description"
          />
        ) : (
          <div className="grid min-h-[300px] place-items-center p-8 text-center sm:min-h-[430px]">
            <div><div className="empty-chart mx-auto mb-5"><span /><span /><span /><span /><span /></div><p className="font-semibold text-slate-300">กราฟกำลังรอค่าเฉลี่ยจากการสุ่ม</p><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">ทุกค่าเฉลี่ยจะกลายเป็นจุดสีส้ม ส่วนเส้นสีน้ำเงินช่วยให้เห็นรูปทรงโดยประมาณของการกระจาย</p></div>
          </div>
        )}

        {tooltip ? (
          <div role="tooltip" className="pointer-events-none absolute z-20 w-[156px] rounded-xl border border-white/12 bg-slate-900/95 px-3 py-2.5 text-sm shadow-2xl backdrop-blur-xl" style={{ left: tooltip.left, top: tooltip.top }}>
            <strong className="block text-white">ครั้งที่ {tooltip.round}</strong>
            <span className="mt-0.5 block text-cyan-200">ค่าเฉลี่ย {formatStatistic(tooltip.mean)}</span>
          </div>
        ) : null}
      </motion.div>

      <p id="chart-accessible-description" className="mt-4 rounded-xl border-l-2 border-cyan-400/70 bg-cyan-300/[0.035] px-4 py-3 text-sm leading-6 text-slate-400">
        จุดสีส้มคือค่าเฉลี่ยจริงของแต่ละรอบ เส้น Density เป็น kernel density estimate เพื่อช่วยมองรูปทรง ไม่ใช่ความน่าจะเป็นที่พิสูจน์แล้ว ข้อมูลทุกจุดอ่านได้จากตารางประวัติ
      </p>
    </Panel>
  );
}

function drawChart(canvas: HTMLCanvasElement, width: number, height: number, results: readonly DrawResult[]): RenderedPoint[] {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const context = canvas.getContext("2d");
  if (!context) return [];
  const fontFamily = getComputedStyle(canvas).fontFamily || "sans-serif";

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  const mobile = width < 640;
  const padding = mobile ? { top: 62, right: 16, bottom: 52, left: 46 } : { top: 68, right: 28, bottom: 58, left: 58 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const baseline = padding.top + chartHeight;
  const curveHeight = chartHeight * 0.78;
  const means = results.map((result) => result.mean);
  const density = buildDensity(means);
  const maximumDensity = Math.max(...density.map((point) => point.density), 1);
  const overallMean = summarizeResults(results).overallMean ?? 0;
  const toX = (value: number) => padding.left + ((value - X_MIN) / (X_MAX - X_MIN)) * chartWidth;
  const toY = (value: number) => baseline - (value / maximumDensity) * curveHeight;

  context.lineWidth = 1;
  for (let step = 0; step <= 4; step += 1) {
    const y = baseline - (step / 4) * curveHeight;
    context.strokeStyle = step === 0 ? "rgba(148,163,184,.6)" : "rgba(96,165,250,.12)";
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
  }

  const gradient = context.createLinearGradient(0, padding.top, 0, baseline);
  gradient.addColorStop(0, "rgba(59,130,246,.38)");
  gradient.addColorStop(0.72, "rgba(99,102,241,.13)");
  gradient.addColorStop(1, "rgba(34,211,238,.015)");
  context.beginPath();
  context.moveTo(toX(density[0].x), baseline);
  density.forEach((point) => context.lineTo(toX(point.x), toY(point.density)));
  context.lineTo(toX(density[density.length - 1].x), baseline);
  context.closePath();
  context.fillStyle = gradient;
  context.fill();

  context.save();
  context.strokeStyle = "#60a5fa";
  context.lineWidth = mobile ? 2.5 : 3.5;
  context.lineJoin = "round";
  context.shadowColor = "rgba(59,130,246,.45)";
  context.shadowBlur = 12;
  context.beginPath();
  density.forEach((point, index) => index ? context.lineTo(toX(point.x), toY(point.density)) : context.moveTo(toX(point.x), toY(point.density)));
  context.stroke();
  context.restore();

  const meanX = toX(overallMean);
  context.save();
  context.setLineDash([6, 6]);
  context.strokeStyle = "#a78bfa";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(meanX, padding.top + 4);
  context.lineTo(meanX, baseline);
  context.stroke();
  context.restore();
  context.fillStyle = "#c4b5fd";
  context.font = `700 ${mobile ? 11 : 12}px ${fontFamily}`;
  context.textAlign = "center";
  context.fillText(`x̄ = ${formatStatistic(overallMean)}`, meanX, padding.top - 10);

  const renderedPoints = layoutPoints(results, toX, padding.left, width - padding.right, baseline, curveHeight, mobile);
  for (const point of renderedPoints) {
    context.beginPath();
    context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    context.fillStyle = "#fb923c";
    context.fill();
    context.strokeStyle = "rgba(255,255,255,.92)";
    context.lineWidth = Math.max(0.8, point.radius * 0.35);
    context.stroke();
  }

  context.fillStyle = "#94a3b8";
  context.font = `600 ${mobile ? 11 : 12}px ${fontFamily}`;
  context.textAlign = "center";
  for (let tick = X_MIN; tick <= X_MAX; tick += 1) {
    context.fillText(String(tick), toX(tick), baseline + 24);
  }
  context.fillStyle = "#64748b";
  context.fillText("ค่าเฉลี่ยต่อรอบ", padding.left + chartWidth / 2, height - 13);
  context.save();
  context.translate(mobile ? 12 : 16, padding.top + chartHeight / 2);
  context.rotate(-Math.PI / 2);
  context.fillText("ความหนาแน่นโดยประมาณ", 0, 0);
  context.restore();

  return renderedPoints;
}

function layoutPoints(results: readonly DrawResult[], toX: (value: number) => number, left: number, right: number, baseline: number, curveHeight: number, mobile: boolean): RenderedPoint[] {
  const groups = new Map<string, DrawResult[]>();
  results.forEach((result) => {
    const key = result.mean.toFixed(4);
    groups.set(key, [...(groups.get(key) ?? []), result]);
  });

  const pointGap = mobile ? 6.5 : 8;
  const stackHeight = Math.max(54, curveHeight * 0.62);
  const maximumRows = Math.max(8, Math.floor(stackHeight / pointGap));
  const rendered: RenderedPoint[] = [];

  for (const group of groups.values()) {
    const mean = group[0].mean;
    const columns = Math.ceil(group.length / maximumRows);
    const maximumGroupWidth = Math.min(52, Math.max(0, (right - left) / Math.max(groups.size, 5) * 0.72));
    const columnGap = columns > 1 ? Math.min(pointGap, maximumGroupWidth / (columns - 1)) : 0;
    const radius = Math.max(1.25, Math.min(mobile ? 3.4 : 4.2, pointGap * 0.43, columnGap ? columnGap * 0.43 : 4.2));
    const halfWidth = ((columns - 1) * columnGap) / 2;
    const centerX = Math.min(right - halfWidth - radius, Math.max(left + halfWidth + radius, toX(mean)));

    group.forEach((result, index) => {
      const column = Math.floor(index / maximumRows);
      const row = index % maximumRows;
      rendered.push({
        x: centerX + (column - (columns - 1) / 2) * columnGap,
        y: baseline - 8 - row * pointGap,
        round: result.round,
        mean: result.mean,
        radius,
      });
    });
  }

  return rendered;
}
