import { describe, expect, it } from "vitest";
import { getCountdownAnnouncement, getCountdownParts, MIDTERM_TARGET_MS } from "@/lib/countdown";

describe("exam countdown", () => {
  it("calculates separate units before the target", () => {
    const offset = ((1 * 24 + 2) * 60 * 60 + 3 * 60 + 4) * 1_000;
    const parts = getCountdownParts(MIDTERM_TARGET_MS - offset);
    expect(parts).toEqual({ days: 1, hours: 2, minutes: 3, seconds: 4, isComplete: false });
    expect(getCountdownAnnouncement(parts)).toContain("จะถึงเวลาสอบ Midterm");
  });

  it("returns zero and an exam-day message exactly at the target", () => {
    const parts = getCountdownParts(MIDTERM_TARGET_MS);
    expect(parts).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
    expect(getCountdownAnnouncement(parts)).toContain("ถึงเวลาสอบ Midterm แล้ว");
  });

  it("never returns negative values after the target", () => {
    expect(getCountdownParts(MIDTERM_TARGET_MS + 86_400_000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
  });
});
