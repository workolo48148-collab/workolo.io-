import type { NextRequest } from "next/server";
import * as z from "zod/mini";
import { getAdapter } from "@/lib/booking/adapters";
import { daysForMonth, nextSlots, slotsForDate } from "@/lib/booking/availability";
import { BookingError, errorResponse } from "@/lib/booking/errors";
import { availabilityQuerySchema } from "@/lib/booking/schema";

/**
 * GET /api/availability?serviceId=&tz=&date=YYYY-MM-DD  → slots for one day (+ nextAvailable when empty)
 * GET /api/availability?serviceId=&tz=&month=YYYY-MM    → days with at least one slot
 * GET /api/availability?serviceId=&tz=&next=3           → the next N slots
 */
export async function GET(request: NextRequest) {
  try {
    const parsed = availabilityQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
    if (!parsed.success) {
      const flat = z.flattenError(parsed.error);
      throw new BookingError("VALIDATION_ERROR", flat.formErrors[0] ?? "Invalid availability query.", flat.fieldErrors);
    }
    const q = parsed.data;
    const adapter = getAdapter();
    if (!(await adapter.listServices()).some((s) => s.id === q.serviceId)) {
      throw new BookingError("SERVICE_NOT_FOUND", "That meeting type doesn't exist.");
    }

    const body = q.date
      ? await slotsForDate(adapter, q.serviceId, q.date, q.tz)
      : q.month
        ? await daysForMonth(adapter, q.serviceId, q.month, q.tz)
        : await nextSlots(adapter, q.serviceId, q.next!, q.tz);

    return Response.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return errorResponse(err);
  }
}
