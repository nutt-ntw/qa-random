import { Button } from "@/components/ui/Button";
import { DiceIcon, ResetIcon } from "@/components/ui/Icons";
import { Panel } from "@/components/ui/Panel";
import { TicketPool } from "@/components/experiment/TicketPool";
import type { TicketInputs, TicketValue, ValidationErrors } from "@/types";

interface ExperimentControlsProps {
  inputs: TicketInputs;
  errors: ValidationErrors;
  populationSize: number;
  populationMean: number;
  isRunning: boolean;
  onCountChange: (value: TicketValue, count: string) => void;
  onFieldChange: (field: "rounds" | "sampleSize", value: string) => void;
  onStart: () => void;
  onReset: () => void;
}

export function ExperimentControls({ inputs, errors, populationSize, populationMean, isRunning, onCountChange, onFieldChange, onStart, onReset }: ExperimentControlsProps) {
  return (
    <Panel id="experiment-controls" className="relative overflow-hidden p-5 sm:p-7 lg:p-8" aria-labelledby="experiment-heading">
      <div className="panel-glow absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">01 · Configure</p>
            <h2 id="experiment-heading" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">ออกแบบประชากรและตัวอย่าง</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">แต่ละรอบจะหยิบแบบไม่คืนฉลาก จากนั้นสร้างประชากรใหม่ก่อนเริ่มรอบถัดไป</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="metric-pill"><span>POPULATION</span><strong>{populationSize.toLocaleString()}</strong></div>
            <div className="metric-pill"><span>POPULATION μ</span><strong>{populationSize ? populationMean.toFixed(2).replace(/\.00$/, "") : "—"}</strong></div>
          </div>
        </div>

        <TicketPool counts={inputs.counts} errors={errors.counts} disabled={isRunning} onChange={onCountChange} />
        {errors.population ? <p className="mt-3 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200" role="alert">{errors.population}</p> : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <NumberField id="rounds" label="จำนวนรอบ" hint="แนะนำ 50–100 รอบ" value={inputs.rounds} error={errors.rounds} disabled={isRunning} max={5000} onChange={(value) => onFieldChange("rounds", value)} />
          <NumberField id="sample-size" label="จำนวนใบต่อรอบ" hint={`สูงสุด ${populationSize.toLocaleString()} ใบ`} value={inputs.sampleSize} error={errors.sampleSize} disabled={isRunning} max={Math.max(populationSize, 1)} onChange={(value) => onFieldChange("sampleSize", value)} />
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button tone="primary" className="min-h-13 flex-1 text-base" icon={<DiceIcon className="size-5" />} onClick={onStart} disabled={isRunning}>
            {isRunning ? "กำลังสร้างการทดลอง…" : "เริ่มการทดลอง"}
          </Button>
          <Button tone="secondary" className="min-h-13 sm:min-w-36" icon={<ResetIcon className="size-5" />} onClick={onReset}>Reset</Button>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">เพื่อการเรียนรู้เท่านั้น · การสุ่มใช้ Math.random() และไม่ใช่ระบบจับรางวัลที่มีความปลอดภัยเชิงเข้ารหัส</p>
      </div>
    </Panel>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  hint: string;
  value: string;
  error?: string;
  disabled: boolean;
  max: number;
  onChange: (value: string) => void;
}

function NumberField({ id, label, hint, value, error, disabled, max, onChange }: NumberFieldProps) {
  const errorId = `${id}-error`;
  return (
    <label htmlFor={id} className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
      <span className="mb-2 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-200">{label}</span><span className="text-xs text-slate-500">{hint}</span></span>
      <input id={id} type="number" inputMode="numeric" min="1" max={max} step="1" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className="min-h-12 w-full rounded-xl border border-white/10 bg-slate-950/65 px-4 text-lg font-bold text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50" />
      {error ? <span id={errorId} className="mt-2 block text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
