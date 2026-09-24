import { schedule } from "./config";
import { addDays, dateKeyInTz, weekdayOf, zonedTimeToUtc } from "./tz";

/**
 * Every start time the schedule rules allow in [from, to), before removing
 * anything already booked. Shared by the adapters that don't own availability
 * themselves (mock, Google Calendar, n8n).
 */
export function candidateStarts(from: Date, to: Date, now = new Date()): Date[] {
  const earliest = new Date(Math.max(from.getTime(), now.getTime() + schedule.minNoticeHours * 3600_000));
  const latest = new Date(Math.min(to.getTime(), now.getTime() + schedule.horizonDays * 86400_000));
  if (earliest >= latest) return [];

  const out: Date[] = [];
  let key = addDays(dateKeyInTz(earliest, schedule.hostTz), -1);
  const lastKey = addDays(dateKeyInTz(latest, schedule.hostTz), 1);
  while (key <= lastKey) {
    if (schedule.workingDays.includes(weekdayOf(key))) {
      for (const t of schedule.startTimes) {
        const start = zonedTimeToUtc(key, t, schedule.hostTz);
        if (start >= earliest && start < latest) out.push(start);
      }
    }
    key = addDays(key, 1);
  }
  return out.sort((a, b) => a.getTime() - b.getTime());
}

export function overlaps(aStart: Date, aMin: number, bStart: Date, bMin: number): boolean {
  const aEnd = aStart.getTime() + aMin * 60000;
  const bEnd = bStart.getTime() + bMin * 60000;
  return aStart.getTime() < bEnd && bStart.getTime() < aEnd;
}
