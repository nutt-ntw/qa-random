import { TICKET_VALUES, type TicketInputs, type TicketValue, type ValidationErrors } from "@/types";

interface TicketPoolProps {
  counts: TicketInputs["counts"];
  errors: ValidationErrors["counts"];
  disabled: boolean;
  onChange: (value: TicketValue, count: string) => void;
}

const ticketColors: Record<TicketValue, string> = {
  1: "from-cyan-400/25 to-blue-500/10 text-cyan-100 ring-cyan-300/30",
  2: "from-blue-400/25 to-indigo-500/10 text-blue-100 ring-blue-300/30",
  3: "from-indigo-400/25 to-violet-500/10 text-indigo-100 ring-indigo-300/30",
  4: "from-violet-400/25 to-fuchsia-500/10 text-violet-100 ring-violet-300/30",
  5: "from-fuchsia-400/25 to-rose-500/10 text-fuchsia-100 ring-fuchsia-300/30",
};

export function TicketPool({ counts, errors, disabled, onChange }: TicketPoolProps) {
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-4 text-sm font-semibold text-slate-200">จำนวนฉลากในประชากร</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {TICKET_VALUES.map((value) => {
          const errorId = `ticket-${value}-error`;
          return (
            <label key={value} className={`group relative rounded-2xl bg-gradient-to-br p-3 ring-1 transition focus-within:ring-2 ${ticketColors[value]}`}>
              <span className="mb-3 flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-xl border border-white/15 bg-slate-950/55 text-lg font-bold">{value}</span>
                <span className="text-xs font-bold tracking-[0.08em] text-slate-300">กระดาษเลข {value}</span>
              </span>
              <span className="sr-only">จำนวนฉลากเลข {value}</span>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="10000"
                step="1"
                value={counts[value]}
                onChange={(event) => onChange(value, event.target.value)}
                aria-invalid={Boolean(errors[value])}
                aria-describedby={errors[value] ? errorId : undefined}
                className="min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/65 px-3 text-center text-lg font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors[value] ? <span id={errorId} className="mt-2 block text-xs leading-5 text-rose-300">{errors[value]}</span> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
