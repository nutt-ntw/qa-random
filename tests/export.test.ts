import { describe, expect, it } from "vitest";
import { buildCsv, buildExportRows, buildTsv } from "@/lib/export";
import type { DrawResult } from "@/types";

const results: DrawResult[] = [{ round: 1, results: [1, 5, 2], mean: 8 / 3 }];

describe("export formats", () => {
  it("preserves one result per column plus mean and count", () => {
    expect(buildExportRows(results)).toEqual([
      ["ครั้งที่", "ผลที่ 1", "ผลที่ 2", "ผลที่ 3", "ค่าเฉลี่ย", "จำนวนใบ"],
      [1, 1, 5, 2, "2.6667", 3],
    ]);
  });

  it("includes a UTF-8 BOM in CSV and tab separators for Excel copy", () => {
    expect(buildCsv(results).startsWith("\uFEFFครั้งที่")).toBe(true);
    expect(buildTsv(results)).toContain("ครั้งที่\tผลที่ 1");
  });
});
