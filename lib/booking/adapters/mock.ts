import { services } from "../config";
import { BookingError } from "../errors";
import { candidateStarts, overlaps } from "../schedule";
import { dateKeyInTz } from "../tz";
import { schedule } from "../config";
import type { Booking } from "../types";
import type { BookingAdapter } from "./types";

/**
 * In-memory adapter with realistic fake availability: the real schedule rules,
 * minus a deterministic ~35% of slots and ~1 in 8 fully booked days, so the
 * UI exercises partial days, empty days and the "next available" jump.
 *
 * Bookings live in process memory. That is fine for demos and previews; on
 * serverless each instance has its own memory, so use a real adapter in prod.
 */

type Stored = Booking & { durationMin: number };
const g = globalThis as unknown as { __workoloMockBookings?: Map<string, Stored> };
const store = (g.__workoloMockBookings ??= new Map<string, Stored>());

function hash01(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // murmur3 fmix32: FNV alone barely changes the high bits when only the last
  // character differs, which made runs of consecutive days all look "full".
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 0xffffffff;
}

function fakeTaken(start: Date): boolean {
  const day = dateKeyInTz(start, schedule.hostTz);
  if (hash01(`day:${day}`) < 0.125) return true;
  return hash01(`slot:${start.toISOString()}`) < 0.35;
}

function findService(id: string) {
  const s = services.find((x) => x.id === id);
  if (!s) throw new BookingError("SERVICE_NOT_FOUND", "That meeting type doesn't exist.");
  return s;
}

/** Synchronous so check-then-insert can't interleave with another request. */
function freeStarts(durationMin: number, from: Date, to: Date, ignoreId?: string): Date[] {
  const booked = [...store.values()].filter((b) => b.id !== ignoreId);
  return candidateStarts(from, to).filter(
    (s) => !fakeTaken(s) && !booked.some((b) => overlaps(s, durationMin, new Date(b.start), b.durationMin)),
  );
}

export const mockAdapter: BookingAdapter = {
  name: "mock",

  async listServices() {
    return services;
  },

  async getAvailableStarts(serviceId, from, to) {
    const svc = findService(serviceId);
    return freeStarts(svc.durationMin, from, to);
  },

  async createBooking(input) {
    const svc = findService(input.serviceId);
    const start = new Date(input.start);

    let previous: Stored | undefined;
    if (input.rescheduleId) {
      previous = store.get(input.rescheduleId);
      if (!previous || previous.email.toLowerCase() !== input.email.toLowerCase()) {
        throw new BookingError("BOOKING_NOT_FOUND", "We couldn't find the booking you're rescheduling. Please book a new time.");
      }
    }

    const window = [new Date(start.getTime() - 60000), new Date(start.getTime() + 60000)] as const;
    const ok = freeStarts(svc.durationMin, window[0], window[1], previous?.id).some((s) => s.getTime() === start.getTime());
    if (!ok) {
      throw new BookingError("SLOT_UNAVAILABLE", "Sorry, that time was just taken. Please pick another slot.");
    }

    const id = crypto.randomUUID();
    const booking: Stored = {
      id,
      serviceId: svc.id,
      start: start.toISOString(),
      end: new Date(start.getTime() + svc.durationMin * 60000).toISOString(),
      tz: input.tz,
      name: input.name,
      email: input.email,
      rescheduleUrl: `/?reschedule=${id}#book`,
      provider: "mock",
      durationMin: svc.durationMin,
    };
    store.set(id, booking);
    if (previous) store.delete(previous.id);

    console.info("[booking:mock] created", { id, start: booking.start, tz: input.tz, utm: input.utm });
    const { durationMin: _omit, ...pub } = booking;
    void _omit;
    return pub;
  },
};
