import "server-only";
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

/** Selected with BOOKING_ADAPTER = mock | calcom | google | n8n (default: mock). */
export function getAdapter(): BookingAdapter {
  const key = (process.env.BOOKING_ADAPTER || "mock").toLowerCase();
  const adapter = adapters[key];
  if (!adapter) throw new Error(`Unknown BOOKING_ADAPTER "${key}". Use one of: ${Object.keys(adapters).join(", ")}`);
  return adapter;
}
