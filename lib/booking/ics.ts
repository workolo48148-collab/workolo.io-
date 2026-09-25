import type { Booking } from "./types";

type CalEvent = { title: string; description: string; start: string; end: string; location?: string; uid: string };

export function eventFor(booking: Booking, serviceName: string, email: string): CalEvent {
  return {
    uid: `${booking.id}@workolo.io`,
    title: `${serviceName} with Workolo`,
    description: [
      `Your ${serviceName.toLowerCase()} with Workolo.`,
      "",
      `Need a different time? Reschedule: ${booking.rescheduleUrl}`,
      ...(booking.cancelUrl ? [`Can't make it? Cancel: ${booking.cancelUrl}`] : []),
      `Booked with: ${email}`,
    ].join("\n"),
    start: booking.start,
    end: booking.end,
  };
}

const stamp = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

export function icsFile(e: CalEvent): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Workolo//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.uid}`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(e.start)}`,
    `DTEND:${stamp(e.end)}`,
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(e.description)}`,
    ...(e.location ? [`LOCATION:${esc(e.location)}`] : []),
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function googleCalendarUrl(e: CalEvent) {
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    details: e.description,
    dates: `${stamp(e.start)}/${stamp(e.end)}`,
  })}`;
}

export function outlookCalendarUrl(e: CalEvent) {
  return `https://outlook.live.com/calendar/0/action/compose?${new URLSearchParams({
    rru: "addevent",
    subject: e.title,
    body: e.description,
    startdt: e.start,
    enddt: e.end,
    path: "/calendar/action/compose",
  })}`;
}
