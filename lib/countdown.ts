import type { CountdownParts } from "@/types";

export const MIDTERM_TARGET = "2026-10-03T09:00:00+07:00";
export const MIDTERM_TARGET_MS = Date.parse(MIDTERM_TARGET);

export function getCountdownParts(now: Date | number = Date.now()): CountdownParts {
  const currentTime = typeof now === "number" ? now : now.getTime();
  const remainingMilliseconds = Math.max(0, MIDTERM_TARGET_MS - currentTime);
  const totalSeconds = Math.floor(remainingMilliseconds / 1_000);

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    isComplete: remainingMilliseconds === 0,
  };
}

export function getCountdownAnnouncement(parts: CountdownParts): string {
  if (parts.isComplete) {
    return "ถึงเวลาสอบ Midterm แล้ว ขอให้ทุกคนทำข้อสอบอย่างมั่นใจ";
  }

  return `รู้หรือไม่ อีก ${parts.days} วัน ${parts.hours} ชั่วโมง ${parts.minutes} นาที ${parts.seconds} วินาที จะถึงเวลาสอบ Midterm`;
}
