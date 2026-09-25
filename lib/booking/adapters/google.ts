import { createSign } from "node:crypto";
import { services } from "../config";
import { BookingError } from "../errors";
import { candidateStarts, overlaps } from "../schedule";
import type { Booking } from "../types";
import { answersSummary, requireEnv, upstream } from "./http";
import { NOT_FOUND_MESSAGE, sameEmail, type BookingAdapter } from "./types";

/**
 * Google Calendar via a service account (no SDK dependency).
 *   GOOGLE_CALENDAR_ID            calendar to check and write to
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL  xxx@project.iam.gserviceaccount.com
 *   GOOGLE_PRIVATE_KEY            the service account's PEM key (\n escaped is fine)
 * Share the calendar with the service account ("Make changes to events").
 * Slots come from the schedule rules in lib/booking/config.ts minus busy time.
 * Service accounts can't send invites without domain-wide delegation, so the
 * attendee's details go in the event description instead.
 */

const API = "https://www.googleapis.com/calendar/v3";
let cachedToken: { value: string; exp: number } | null = null;

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.exp > Date.now() + 60_000) return cachedToken.value;
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const key = requireEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key).toString("base64url");

  const res = await upstream("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  if (!res.ok) throw new BookingError("UPSTREAM_ERROR", "Couldn't authenticate with Google Calendar.");
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: json.access_token, exp: Date.now() + json.expires_in * 1000 };
  return json.access_token;
}

async function gcal(path: string, init: RequestInit = {}) {
  const res = await upstream(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json", ...init.headers },
  });
  if (res.status === 404) throw new BookingError("BOOKING_NOT_FOUND", "We couldn't find that booking.");
  if (!res.ok) {
    console.error("[booking:google]", path, res.status, await res.text().catch(() => ""));
    throw new BookingError("UPSTREAM_ERROR", "Google Calendar rejected the request. Please try again.");
  }
  return res.status === 204 ? null : res.json();
}

const calendarPath = () => `/calendars/${encodeURIComponent(requireEnv("GOOGLE_CALENDAR_ID"))}`;

async function busy(from: Date, to: Date): Promise<{ start: Date; end: Date }[]> {
  const json = (await gcal("/freeBusy", {
    method: "POST",
    body: JSON.stringify({ timeMin: from.toISOString(), timeMax: to.toISOString(), items: [{ id: requireEnv("GOOGLE_CALENDAR_ID") }] }),
  })) as { calendars: Record<string, { busy: { start: string; end: string }[] }> };
  return Object.values(json.calendars ?? {})
    .flatMap((c) => c.busy)
    .map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));
}

function service(id: string) {
  const s = services.find((x) => x.id === id);
  if (!s) throw new BookingError("SERVICE_NOT_FOUND", "That meeting type doesn't exist.");
  return s;
}

function isFree(start: Date, durationMin: number, busyList: { start: Date; end: Date }[], ignore?: { start: Date; end: Date }) {
  return !busyList.some(
    (b) =>
      !(ignore && b.start.getTime() === ignore.start.getTime() && b.end.getTime() === ignore.end.getTime()) &&
      overlaps(start, durationMin, b.start, (b.end.getTime() - b.start.getTime()) / 60000),
  );
}

type GEvent = { id: string; created: string; start: { dateTime: string }; end: { dateTime: string }; extendedProperties?: { private?: Record<string, string> } };

export const googleAdapter: BookingAdapter = {
  name: "google",

  async listServices() {
    return services;
  },

  async getAvailableStarts(serviceId, from, to) {
    const svc = service(serviceId);
    const candidates = candidateStarts(from, to);
    if (!candidates.length) return [];
    const busyList = await busy(from, to);
    return candidates.filter((s) => isFree(s, svc.durationMin, busyList));
  },

  async createBooking(input) {
    const svc = service(input.serviceId);
    const start = new Date(input.start);
    const end = new Date(start.getTime() + svc.durationMin * 60000);

    if (!candidateStarts(new Date(start.getTime() - 60000), new Date(start.getTime() + 60000)).some((s) => s.getTime() === start.getTime())) {
      throw new BookingError("SLOT_UNAVAILABLE", "That time isn't bookable. Please pick another slot.");
    }

    let previous: GEvent | null = null;
    if (input.rescheduleId) {
      previous = (await gcal(`${calendarPath()}/events/${encodeURIComponent(input.rescheduleId)}`)) as GEvent;
      if (previous.extendedProperties?.private?.email?.toLowerCase() !== input.email.toLowerCase()) {
        throw new BookingError("BOOKING_NOT_FOUND", "We couldn't find the booking you're rescheduling.");
      }
    }
    const ignore = previous ? { start: new Date(previous.start.dateTime), end: new Date(previous.end.dateTime) } : undefined;
    if (!isFree(start, svc.durationMin, await busy(start, end), ignore)) {
      throw new BookingError("SLOT_UNAVAILABLE", "Sorry, that time was just taken. Please pick another slot.");
    }

    const body = {
      summary: `${svc.name} — ${input.name}`,
      description: `${input.name} <${input.email}>\n\n${answersSummary(input)}\n\nUTM: ${JSON.stringify(input.utm ?? {})}`,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      extendedProperties: { private: { workolo: "1", email: input.email } },
    };
    const event = (await gcal(previous ? `${calendarPath()}/events/${previous.id}` : `${calendarPath()}/events`, {
      method: previous ? "PATCH" : "POST",
      body: JSON.stringify(body),
    })) as GEvent;

    // Optimistic double-booking guard: if two requests raced past freeBusy,
    // the later-created event backs out.
    const list = (await gcal(
      `${calendarPath()}/events?${new URLSearchParams({
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: "true",
        privateExtendedProperty: "workolo=1",
      })}`,
    )) as { items: GEvent[] };
    const clash = (list.items ?? [])
      .filter((e) => e.id !== event.id && overlaps(start, svc.durationMin, new Date(e.start.dateTime), (new Date(e.end.dateTime).getTime() - new Date(e.start.dateTime).getTime()) / 60000))
      .some((e) => e.created < event.created || (e.created === event.created && e.id < event.id));
    if (clash && !previous) {
      await gcal(`${calendarPath()}/events/${event.id}`, { method: "DELETE" });
      throw new BookingError("SLOT_UNAVAILABLE", "Sorry, that time was just taken. Please pick another slot.");
    }

    const booking: Booking = {
      id: event.id,
      serviceId: svc.id,
      start: start.toISOString(),
      end: end.toISOString(),
      tz: input.tz,
      name: input.name,
      email: input.email,
      rescheduleUrl: `/?reschedule=${encodeURIComponent(event.id)}#book`,
      provider: "google",
    };
    return booking;
  },

  async cancelBooking(id, { email }) {
    const ev = (await gcal(`${calendarPath()}/events/${encodeURIComponent(id)}`)) as GEvent & { status?: string };
    if (!sameEmail(ev.extendedProperties?.private?.email, email)) throw new BookingError("BOOKING_NOT_FOUND", NOT_FOUND_MESSAGE);
    if (ev.status === "cancelled") throw new BookingError("ALREADY_CANCELLED", "This booking was already cancelled.");
    await gcal(`${calendarPath()}/events/${encodeURIComponent(id)}`, { method: "DELETE" });
    return { id, start: ev.start?.dateTime ? new Date(ev.start.dateTime).toISOString() : null };
  },
};
