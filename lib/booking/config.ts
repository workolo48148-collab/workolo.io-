import { envNumber, readEnv } from "../env";
import { isValidTimeZone } from "./tz";
import type { Service } from "./types";

const hostTz = readEnv(process.env.BOOKING_HOST_TZ);

/**
 * Schedule rules, taken from the live booking page (legacy/book-a-call.html):
 * a 30-minute "Discovery Meeting", no Sundays, and these start times.
 * The host zone is where those times are anchored; override with BOOKING_HOST_TZ.
 */
export const schedule = {
  hostTz: hostTz && isValidTimeZone(hostTz) ? hostTz : "Asia/Karachi",
  /** 0 = Sunday. The live site blocks Sundays. */
  workingDays: [1, 2, 3, 4, 5, 6],
  startTimes: ["18:30", "18:45", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00"],
  /** Earliest bookable slot, in hours from now. */
  minNoticeHours: envNumber(process.env.BOOKING_MIN_NOTICE_HOURS, 12, 0, 24 * 14),
  /** How far ahead people can book. */
  horizonDays: envNumber(process.env.BOOKING_HORIZON_DAYS, 45, 1, 365),
};

export const services: Service[] = [
  {
    id: "discovery",
    name: "Discovery Meeting",
    durationMin: 30,
    description: "A 30-minute call to see if the content system fits your business.",
  },
];

/** Qualifying questions, verbatim from the live booking form. */
export const qualifying = {
  timeline: [
    "Immediately (within the next 2 weeks)",
    "Within 60 days, still exploring",
    "No set timeline",
  ],
  outcome: [
    "I will land retainer clients",
    "I will get more DMs and leads",
    "I will grow my personal brand",
    "I will post consistently without doing it myself",
  ],
  budget: ["Under $1,299", "$1,299 – $1,499", "$1,500 – $2,499", "$2,500 – $5,000", "$5,000+"],
} as const;
