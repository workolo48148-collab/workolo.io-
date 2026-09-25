import { services } from "../config";
import { BookingError } from "../errors";
import { candidateStarts, overlaps } from "../schedule";
import type { Booking } from "../types";
import { requireEnv, upstream } from "./http";
import { NOT_FOUND_MESSAGE, type BookingAdapter } from "./types";

/**
 * n8n webhooks.
 *   N8N_BOOKING_WEBHOOK_URL       required. Receives POST { event, booking, answers, utm }.
 *                                 Reply 2xx with { id?, rescheduleUrl? }, or 409 if the slot is taken.
 *   N8N_AVAILABILITY_WEBHOOK_URL  optional. Receives GET ?serviceId&from&to (ISO).
 *                                 Reply { busy: [{ start, end }] }; those ranges are removed from the schedule.
 *   N8N_WEBHOOK_SECRET            optional. Sent as the x-workolo-secret header on both calls.
 * Double-booking protection depends on your workflow: check the calendar and
 * return 409 when a slot is gone.
 */

const secretHeader = (): Record<string, string> =>
  process.env.N8N_WEBHOOK_SECRET ? { "x-workolo-secret": process.env.N8N_WEBHOOK_SECRET } : {};

function service(id: string) {
  const s = services.find((x) => x.id === id);
  if (!s) throw new BookingError("SERVICE_NOT_FOUND", "That meeting type doesn't exist.");
  return s;
}

export const n8nAdapter: BookingAdapter = {
  name: "n8n",

  async listServices() {
    return services;
  },

  async getAvailableStarts(serviceId, from, to) {
    const svc = service(serviceId);
    const candidates = candidateStarts(from, to);
    const url = process.env.N8N_AVAILABILITY_WEBHOOK_URL;
    if (!url || !candidates.length) return candidates;

    const qs = new URLSearchParams({ serviceId, from: from.toISOString(), to: to.toISOString() });
    const res = await upstream(`${url}?${qs}`, { headers: secretHeader() });
    if (!res.ok) throw new BookingError("UPSTREAM_ERROR", "Couldn't load availability. Please try again.");
    const { busy = [] } = (await res.json()) as { busy?: { start: string; end: string }[] };
    return candidates.filter(
      (s) =>
        !busy.some((b) => overlaps(s, svc.durationMin, new Date(b.start), (new Date(b.end).getTime() - new Date(b.start).getTime()) / 60000)),
    );
  },

  async createBooking(input) {
    const svc = service(input.serviceId);
    const start = new Date(input.start);
    const available = await this.getAvailableStarts(svc.id, new Date(start.getTime() - 60000), new Date(start.getTime() + 60000));
    if (!available.some((s) => s.getTime() === start.getTime())) {
      throw new BookingError("SLOT_UNAVAILABLE", "Sorry, that time was just taken. Please pick another slot.");
    }

    const id = crypto.randomUUID();
    const booking: Booking = {
      id,
      serviceId: svc.id,
      start: start.toISOString(),
      end: new Date(start.getTime() + svc.durationMin * 60000).toISOString(),
      tz: input.tz,
      name: input.name,
      email: input.email,
      rescheduleUrl: `/?reschedule=${id}#book`,
      provider: "n8n",
    };

    const res = await upstream(requireEnv("N8N_BOOKING_WEBHOOK_URL"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...secretHeader() },
      body: JSON.stringify({
        event: input.rescheduleId ? "booking.rescheduled" : "booking.created",
        rescheduleOf: input.rescheduleId ?? null,
        booking: { ...booking, phone: input.phone || null, serviceName: svc.name },
        answers: {
          instagram: input.instagram,
          note: input.note,
          timeline: input.timeline || null,
          outcome: input.outcome,
          budget: input.budget,
          smsConsent: input.smsConsent,
        },
        utm: input.utm ?? {},
      }),
    });
    if (res.status === 409) throw new BookingError("SLOT_UNAVAILABLE", "Sorry, that time was just taken. Please pick another slot.");
    if (!res.ok) throw new BookingError("UPSTREAM_ERROR", "We couldn't confirm the booking. Please try again.");

    const reply = (await res.json().catch(() => ({}))) as { id?: string; rescheduleUrl?: string };
    return {
      ...booking,
      id: reply.id ?? booking.id,
      rescheduleUrl: reply.rescheduleUrl ?? `/?reschedule=${reply.id ?? booking.id}#book`,
    };
  },

  /**
   * Sends { event: "booking.cancelled", booking: { id, email }, reason }. Your workflow must
   * check the email matches the booking and reply 404 if not, 409 if already cancelled.
   */
  async cancelBooking(id, { email, reason }) {
    const res = await upstream(requireEnv("N8N_BOOKING_WEBHOOK_URL"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...secretHeader() },
      body: JSON.stringify({ event: "booking.cancelled", booking: { id, email }, reason: reason ?? null }),
    });
    if (res.status === 404) throw new BookingError("BOOKING_NOT_FOUND", NOT_FOUND_MESSAGE);
    if (res.status === 409) throw new BookingError("ALREADY_CANCELLED", "This booking was already cancelled.");
    if (!res.ok) throw new BookingError("UPSTREAM_ERROR", "We couldn't cancel the booking. Please try again or email hello@workolo.io.");
    const reply = (await res.json().catch(() => ({}))) as { start?: string };
    return { id, start: reply.start ?? null };
  },
};
