import type { NextRequest } from "next/server";
import * as z from "zod/mini";
import { getAdapter } from "@/lib/booking/adapters";
import { BookingError, errorResponse } from "@/lib/booking/errors";
import { rateLimited } from "@/lib/booking/rate-limit";
import { bookingRequestSchema } from "@/lib/booking/schema";
import { readEnv, SITE_URL } from "@/lib/env";

/** POST /api/bookings { serviceId, start, tz, name, email, phone, note, …answers } */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(`book:${ip}`)) {
      throw new BookingError("RATE_LIMITED", "Too many attempts. Please wait a minute and try again.");
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      throw new BookingError("VALIDATION_ERROR", "Request body must be JSON.");
    }

    const parsed = bookingRequestSchema.safeParse(json);
    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors;
      // Field names only (never values), so rejections are diagnosable in the Vercel logs.
      console.warn("[booking] validation failed:", Object.keys(fieldErrors).join(", "));
      throw new BookingError("VALIDATION_ERROR", "Please check the highlighted fields.", fieldErrors);
    }

    // Honeypot filled: flag it, but still book. Autofill can fill hidden fields, and blocking a real
    // lead costs far more than cancelling the rare bot booking (rate limiting still applies).
    const { company, ...input } = parsed.data;
    if (company) {
      console.warn("[booking] honeypot field was filled; booking anyway and flagging it");
      input.utm = { ...(input.utm ?? {}), hp_flag: "1" };
    }

    const booking = await getAdapter().createBooking(input);
    const origin = readEnv(process.env.NEXT_PUBLIC_SITE_URL) ? SITE_URL : request.nextUrl.origin;
    const rescheduleUrl = booking.rescheduleUrl.startsWith("/") ? `${origin}${booking.rescheduleUrl}` : booking.rescheduleUrl;

    return Response.json({ booking: { ...booking, rescheduleUrl } }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return errorResponse(err);
  }
}
