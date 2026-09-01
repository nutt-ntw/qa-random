import type { DrawResult } from "@/types";
import { formatStatistic } from "@/lib/statistics";

type ExportCell = string | number;

export function buildExportRows(results: readonly DrawResult[]): ExportCell[][] {
  const resultCount = results[0]?.results.length ?? 0;
  const header: ExportCell[] = ["ครั้งที่"];

  for (let index = 1; index <= resultCount; index += 1) {
    header.push(`ผลที่ ${index}`);
  }
  header.push("ค่าเฉลี่ย", "จำนวนใบ");

  return [
    header,
    ...results.map((result) => [
      result.round,
      ...result.results,
      formatStatistic(result.mean),
      result.results.length,
    ]),
  ];
}

function escapeCsvCell(cell: ExportCell): string {
  const value = String(cell);
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function buildCsv(results: readonly DrawResult[]): string {
  return `\uFEFF${buildExportRows(results)
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\n")}\n`;
}

export function buildTsv(results: readonly DrawResult[]): string {
  return `${buildExportRows(results).map((row) => row.join("\t")).join("\n")}\n`;
}

export function createFileTimestamp(now = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  );
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadCsv(results: readonly DrawResult[]): void {
  downloadBlob(
    new Blob([buildCsv(results)], { type: "text/csv;charset=utf-8" }),
    `ผลการสุ่ม_${createFileTimestamp()}.csv`,
  );
}

export async function downloadExcel(results: readonly DrawResult[]): Promise<void> {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.aoa_to_sheet(buildExportRows(results));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ผลการสุ่ม");
  XLSX.writeFile(workbook, `ผลการสุ่ม_${createFileTimestamp()}.xlsx`);
}
