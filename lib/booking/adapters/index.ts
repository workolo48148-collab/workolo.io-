import "server-only";
import { readEnv } from "@/lib/env";
import { BookingError } from "../errors";
import { calcomAdapter } from "./calcom";
import { googleAdapter } from "./google";
import { mockAdapter } from "./mock";
import { n8nAdapter } from "./n8n";
import type { BookingAdapter } from "./types";

const adapters: Record<string, BookingAdapter> = {
  mock: mockAdapter,
  calcom: calcomAdapter,
  google: googleAdapter,
  n8n: n8nAdapter,
};

export type AdapterResolution =
  | { adapter: BookingAdapter; source: "BOOKING_ADAPTER" | "auto:calcom" | "default:mock"; problem?: undefined }
  | { adapter: null; source: "none"; problem: string };

const isProduction = () => readEnv(process.env.VERCEL_ENV) === "production";

/**
 * Picks the booking backend:
 *  1. BOOKING_ADAPTER, if set (mock | calcom | google | n8n)
 *  2. Cal.com, if CALCOM_API_KEY and CALCOM_EVENT_TYPE_ID are both set
 *  3. the mock, except in Vercel production, where a fake calendar would
 *     silently swallow real bookings; there it resolves to "not configured"
 */
export function resolveAdapter(): AdapterResolution {
  const explicit = readEnv(process.env.BOOKING_ADAPTER)?.toLowerCase();
  if (explicit) {
    const adapter = adapters[explicit];
    if (adapter) return { adapter, source: "BOOKING_ADAPTER" };
    return { adapter: null, source: "none", problem: `BOOKING_ADAPTER is "${explicit}"; use one of: ${Object.keys(adapters).join(", ")}` };
  }
  if (readEnv(process.env.CALCOM_API_KEY) && readEnv(process.env.CALCOM_EVENT_TYPE_ID)) {
    return { adapter: calcomAdapter, source: "auto:calcom" };
  }
  if (isProduction()) {
    return { adapter: null, source: "none", problem: "No booking backend configured for production (set CALCOM_API_KEY + CALCOM_EVENT_TYPE_ID, or BOOKING_ADAPTER)" };
  }
  return { adapter: mockAdapter, source: "default:mock" };
}

export function getAdapter(): BookingAdapter {
  const r = resolveAdapter();
  if (!r.adapter) {
    console.error("[booking] not configured:", r.problem);
    throw new BookingError("NOT_CONFIGURED", "Online booking is temporarily unavailable. Email hello@workolo.io and we'll set up a time.");
  }
  return r.adapter;
}
