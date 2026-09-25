import type { NextRequest } from "next/server";
import * as z from "zod/mini";
import { getAdapter } from "@/lib/booking/adapters";
import { BookingError, errorResponse } from "@/lib/booking/errors";
import { rateLimited } from "@/lib/booking/rate-limit";
import { cancelRequestSchema } from "@/lib/booking/schema";

/**
 * POST /api/bookings/:id/cancel { email, reason? }
 * The booking id alone isn't enough: the email must match the booking.
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/bookings/[id]/cancel">) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(`cancel:${ip}`)) {
      throw new BookingError("RATE_LIMITED", "Too many attempts. Please wait a minute and try again.");
    }

    const { id } = await ctx.params;
    if (!id || id.length > 128) throw new BookingError("BOOKING_NOT_FOUND", "We couldn't find that booking.");

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      throw new BookingError("VALIDATION_ERROR", "Request body must be JSON.");
    }
    const parsed = cancelRequestSchema.safeParse(json);
    if (!parsed.success) {
      throw new BookingError("VALIDATION_ERROR", "Please check the highlighted fields.", z.flattenError(parsed.error).fieldErrors);
    }

    const result = await getAdapter().cancelBooking(id, parsed.data);
    return Response.json({ cancelled: result }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return errorResponse(err);
  }
}
