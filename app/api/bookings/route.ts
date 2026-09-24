import type { NextRequest } from "next/server";
import * as z from "zod/mini";
import { getAdapter } from "@/lib/booking/adapters";
import { BookingError, errorResponse } from "@/lib/booking/errors";
import { rateLimited } from "@/lib/booking/rate-limit";
import { bookingRequestSchema } from "@/lib/booking/schema";

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
      throw new BookingError("VALIDATION_ERROR", "Please check the highlighted fields.", z.flattenError(parsed.error).fieldErrors);
    }

    const booking = await getAdapter().createBooking(parsed.data);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const rescheduleUrl = booking.rescheduleUrl.startsWith("/") ? `${origin}${booking.rescheduleUrl}` : booking.rescheduleUrl;

    return Response.json({ booking: { ...booking, rescheduleUrl } }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return errorResponse(err);
  }
}
