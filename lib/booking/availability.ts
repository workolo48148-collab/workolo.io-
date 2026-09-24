import "server-only";
import type { BookingAdapter } from "./adapters/types";
import { schedule } from "./config";
import { dateKeyInTz, dayRangeUtc, daysInMonth } from "./tz";

/** How far ahead "next available day" looks. */
const LOOKAHEAD_DAYS = () => schedule.horizonDays + 1;

export async function slotsForDate(adapter: BookingAdapter, serviceId: string, date: string, tz: string) {
  const [from, to] = dayRangeUtc(date, tz);
  const starts = await adapter.getAvailableStarts(serviceId, from, to);
  let nextAvailable: string | null = null;
  if (!starts.length) {
    const after = await adapter.getAvailableStarts(serviceId, to, new Date(to.getTime() + LOOKAHEAD_DAYS() * 86400_000));
    nextAvailable = after.length ? dateKeyInTz(after[0], tz) : null;
  }
  return { date, tz, slots: starts.map((d) => ({ start: d.toISOString() })), nextAvailable };
}

export async function daysForMonth(adapter: BookingAdapter, serviceId: string, month: string, tz: string) {
  const keys = daysInMonth(month);
  const [from] = dayRangeUtc(keys[0], tz);
  const [, to] = dayRangeUtc(keys[keys.length - 1], tz);
  const starts = await adapter.getAvailableStarts(serviceId, from, to);
  const days = [...new Set(starts.map((d) => dateKeyInTz(d, tz)))].filter((k) => k.startsWith(month)).sort();
  return { month, tz, days };
}

export async function nextSlots(adapter: BookingAdapter, serviceId: string, count: number, tz: string) {
  const now = new Date();
  const starts = await adapter.getAvailableStarts(serviceId, now, new Date(now.getTime() + LOOKAHEAD_DAYS() * 86400_000));
  return { tz, slots: starts.slice(0, count).map((d) => ({ start: d.toISOString() })) };
}
