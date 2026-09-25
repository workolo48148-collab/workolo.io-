import * as z from "zod/mini";
import { qualifying } from "./config";
import { isValidTimeZone } from "./tz";

/**
 * Shared by the client form (inline validation) and POST /api/bookings.
 * Uses zod/mini (tree-shakable) so the browser bundle stays small.
 */

const text = (min: number, minMsg: string, max: number, maxMsg: string) =>
  z.string().check(z.trim(), z.minLength(min, minMsg), z.maxLength(max, maxMsg));

const optionalEmpty = <T extends z.ZodMiniType>(schema: T) => z.optional(z.union([schema, z.literal("")]));

export const detailsSchema = z.object({
  name: text(2, "Please enter your full name", 80, "That's a bit long, 80 characters max"),
  email: z.pipe(z.string().check(z.trim(), z.maxLength(254)), z.email("Enter a valid email, like you@example.com")),
  /** E.164, e.g. +14155550123. Optional, as on the live form. */
  phone: optionalEmpty(z.string().check(z.trim(), z.regex(/^\+[1-9]\d{6,14}$/, "Enter a valid number for the selected country"))),
  instagram: text(2, "Add your Instagram handle or profile link", 300, "Please keep it under 300 characters"),
  /** "What do you teach or trade?" — the short note. */
  note: text(10, "A sentence or two helps us prep for the call", 1000, "Please keep it under 1,000 characters"),
  timeline: optionalEmpty(z.enum(qualifying.timeline)),
  outcome: z.enum(qualifying.outcome, "Choose the outcome that matters most"),
  budget: z.enum(qualifying.budget, "Choose a range"),
  smsConsent: z._default(z.boolean(), false),
  termsAccepted: z.literal(true, "Please accept the Privacy Policy and Terms to continue"),
});

export type Details = z.infer<typeof detailsSchema>;

export const bookingRequestSchema = z.extend(detailsSchema, {
  serviceId: z.string().check(z.minLength(1), z.maxLength(64)),
  start: z.iso.datetime({ offset: true, error: "Pick a time slot" }),
  tz: z.string().check(z.refine(isValidTimeZone, "Unknown time zone")),
  /** Booking id being moved to a new time. */
  rescheduleId: z.optional(z.string().check(z.maxLength(128))),
  utm: z.optional(z.record(z.string().check(z.maxLength(40)), z.string().check(z.maxLength(200)))),
  /**
   * Honeypot. Never a validation error: browser autofill can fill hidden fields,
   * and a real lead must not be blocked. The API route flags it instead.
   */
  company: z.optional(z.string().check(z.maxLength(500))),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;

/** POST /api/bookings/:id/cancel. The email must match the booking (checked by the adapter). */
export const cancelRequestSchema = z.object({
  email: z.pipe(z.string().check(z.trim(), z.maxLength(254)), z.email("Enter the email you booked with")),
  reason: z.optional(z.string().check(z.trim(), z.maxLength(500, "Please keep it under 500 characters"))),
});

export const availabilityQuerySchema = z
  .object({
    serviceId: z.string().check(z.minLength(1), z.maxLength(64)),
    tz: z.string().check(z.refine(isValidTimeZone, "Unknown time zone")),
    date: z.optional(z.string().check(z.regex(/^\d{4}-\d{2}-\d{2}$/))),
    month: z.optional(z.string().check(z.regex(/^\d{4}-\d{2}$/))),
    next: z.optional(z.coerce.number().check(z.int(), z.gte(1), z.lte(10))),
  })
  .check(
    z.refine((q) => [q.date, q.month, q.next].filter((v) => v !== undefined).length === 1, "Pass exactly one of date, month or next"),
  );
