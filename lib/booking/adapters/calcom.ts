import { services } from "../config";
import { BookingError } from "../errors";
import type { Booking } from "../types";
import { answersSummary, requireEnv, upstream } from "./http";
import type { BookingAdapter } from "./types";

/**
 * Cal.com API v2. Cal.com owns availability and conflict checks.
 *   CALCOM_API_KEY        cal_live_…
 *   CALCOM_EVENT_TYPE_ID  numeric id of the "Discovery Meeting" event type
 *   CALCOM_API_URL        optional, defaults to https://api.cal.com/v2
 * Add a "notes" booking question to the event type to receive the answers.
 */

const base = () => process.env.CALCOM_API_URL || "https://api.cal.com/v2";
const headers = (version: string) => ({
  Authorization: `Bearer ${requireEnv("CALCOM_API_KEY")}`,
  "cal-api-version": version,
  "Content-Type": "application/json",
});

function eventTypeFor(serviceId: string): number {
  if (!services.some((s) => s.id === serviceId)) throw new BookingError("SERVICE_NOT_FOUND", "That meeting type doesn't exist.");
  return Number(requireEnv("CALCOM_EVENT_TYPE_ID"));
}

async function failFromCal(res: Response): Promise<never> {
  const text = await res.text().catch(() => "");
  if (res.status === 409 || /not available|no available|already has booking|booked/i.test(text)) {
    throw new BookingError("SLOT_UNAVAILABLE", "Sorry, that time was just taken. Please pick another slot.");
  }
  if (res.status === 404) throw new BookingError("BOOKING_NOT_FOUND", "We couldn't find that booking.");
  console.error("[booking:calcom]", res.status, text);
  throw new BookingError("UPSTREAM_ERROR", "Our calendar provider rejected the request. Please try again.");
}

export const calcomAdapter: BookingAdapter = {
  name: "calcom",

  async listServices() {
    return services;
  },

  async getAvailableStarts(serviceId, from, to) {
    const qs = new URLSearchParams({
      eventTypeId: String(eventTypeFor(serviceId)),
      start: from.toISOString(),
      end: to.toISOString(),
      timeZone: "UTC",
    });
    const res = await upstream(`${base()}/slots?${qs}`, { headers: headers("2024-09-04") });
    if (!res.ok) await failFromCal(res);
    const json = (await res.json()) as { data: Record<string, { start: string }[]> };
    return Object.values(json.data ?? {})
      .flat()
      .map((s) => new Date(s.start))
      .filter((d) => d >= from && d < to)
      .sort((a, b) => a.getTime() - b.getTime());
  },

  async createBooking(input) {
    const eventTypeId = eventTypeFor(input.serviceId);
    const start = new Date(input.start).toISOString();

    const res = input.rescheduleId
      ? await upstream(`${base()}/bookings/${encodeURIComponent(input.rescheduleId)}/reschedule`, {
          method: "POST",
          headers: headers("2024-08-13"),
          body: JSON.stringify({ start, reschedulingReason: "Rescheduled from workolo.io" }),
        })
      : await upstream(`${base()}/bookings`, {
          method: "POST",
          headers: headers("2024-08-13"),
          body: JSON.stringify({
            start,
            eventTypeId,
            attendee: {
              name: input.name,
              email: input.email,
              timeZone: input.tz,
              ...(input.phone ? { phoneNumber: input.phone } : {}),
            },
            bookingFieldsResponses: { notes: answersSummary(input) },
            metadata: Object.fromEntries(
              Object.entries({ source: "workolo.io", ...(input.utm ?? {}) }).slice(0, 20).map(([k, v]) => [k.slice(0, 40), v.slice(0, 500)]),
            ),
          }),
        });
    if (!res.ok) await failFromCal(res);

    const { data } = (await res.json()) as { data: { uid: string; start: string; end: string } };
    const booking: Booking = {
      id: data.uid,
      serviceId: input.serviceId,
      start: new Date(data.start).toISOString(),
      end: new Date(data.end).toISOString(),
      tz: input.tz,
      name: input.name,
      email: input.email,
      rescheduleUrl: `/?reschedule=${encodeURIComponent(data.uid)}#book`,
      provider: "calcom",
    };
    return booking;
  },
};
