import { Button } from "@/components/ui/Button";
import { CopyIcon, DownloadIcon, TableIcon } from "@/components/ui/Icons";
import { Panel } from "@/components/ui/Panel";
import { formatStatistic } from "@/lib/statistics";
import type { DrawResult } from "@/types";

interface ResultsHistoryProps {
  results: readonly DrawResult[];
  onCopy: () => void;
  onCsv: () => void;
  onExcel: () => void;
}

export function ResultsHistory({ results, onCopy, onCsv, onExcel }: ResultsHistoryProps) {
  const resultCount = results[0]?.results.length ?? 0;

  return (
    <Panel className="overflow-hidden" aria-labelledby="history-heading">
      <div className="flex flex-col gap-4 border-b border-white/8 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="section-kicker">04 · Inspect & export</p><div className="mt-2 flex items-center gap-3"><TableIcon className="size-5 text-cyan-300" /><h2 id="history-heading" className="text-xl font-bold text-white">ประวัติการสุ่ม</h2></div></div>
        <div className="flex flex-wrap gap-2">
          <Button icon={<CopyIcon className="size-4" />} onClick={onCopy} disabled={!results.length}>Copy for Excel</Button>
          <Button icon={<DownloadIcon className="size-4" />} onClick={onCsv} disabled={!results.length}>CSV</Button>
          <Button tone="success" icon={<DownloadIcon className="size-4" />} onClick={onExcel} disabled={!results.length}>Excel</Button>
        </div>
      </div>

      {results.length ? (
        <div className="max-h-[34rem] overflow-auto" tabIndex={0} aria-label="ตารางประวัติการสุ่ม เลื่อนได้ทั้งแนวตั้งและแนวนอน">
          <table className="w-full min-w-max border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-slate-900/95 text-xs uppercase tracking-[0.12em] text-slate-400 backdrop-blur-xl">
              <tr>
                <th scope="col" className="sticky left-0 bg-slate-900 px-5 py-4 text-left">ครั้งที่</th>
                {Array.from({ length: resultCount }, (_, index) => <th scope="col" key={index} className="px-5 py-4 text-center">ผลที่ {index + 1}</th>)}
                <th scope="col" className="px-5 py-4 text-center">ค่าเฉลี่ย</th>
                <th scope="col" className="px-5 py-4 text-center">จำนวนใบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {results.map((result) => (
                <tr key={result.round} className="transition hover:bg-white/[0.035]">
                  <th scope="row" className="sticky left-0 bg-[rgba(9,14,31,.96)] px-5 py-3.5 text-left font-semibold text-slate-200">{result.round}</th>
                  {result.results.map((ticket, index) => <td key={index} className="px-5 py-3.5 text-center text-slate-300"><span className="inline-grid size-8 place-items-center rounded-lg border border-white/8 bg-white/5 font-semibold">{ticket}</span></td>)}
                  <td className="px-5 py-3.5 text-center font-semibold text-violet-200">{formatStatistic(result.mean)}</td>
                  <td className="px-5 py-3.5 text-center text-slate-400">{result.results.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid min-h-44 place-items-center p-6 text-center"><div><TableIcon className="mx-auto size-8 text-slate-600" /><p className="mt-3 font-medium text-slate-300">ยังไม่มีประวัติการสุ่ม</p><p className="mt-1 text-sm text-slate-500">ข้อมูลแต่ละใบจะถูกแยกเป็นคนละคอลัมน์โดยอัตโนมัติ</p></div></div>
      )}
    </Panel>
  );
}
