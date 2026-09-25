import type { BookingRequest } from "./schema";
import type { ApiError, Booking, ErrorCode, Service, Slot } from "./types";

/** Typed browser client for the booking API. */

export class ApiRequestError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public fieldErrors?: Record<string, string[] | undefined>,
  ) {
    super(message);
  }
}

const NETWORK_MESSAGE = "We couldn't reach the calendar. Check your connection and try again.";
/** Pauses between retries of a failed read (mobile connections drop requests briefly). */
const RETRY_DELAYS_MS = [700, 2000];

function sleep(ms: number, signal?: AbortSignal | null) {
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

/**
 * GETs are retried on network failures and gateway errors (502/504). Bookings
 * (POST) are never retried automatically, so a slow network can't double-submit.
 */
async function fetchWithRetry(url: string, init?: RequestInit): Promise<Response> {
  const retries = (init?.method ?? "GET").toUpperCase() === "GET" ? RETRY_DELAYS_MS : [];
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, init);
      if ((res.status === 502 || res.status === 504) && attempt < retries.length) {
        await sleep(retries[attempt], init?.signal);
        continue;
      }
      return res;
    } catch (err) {
      if ((err as Error).name === "AbortError") throw err;
      if (attempt >= retries.length) throw new ApiRequestError("UPSTREAM_ERROR", NETWORK_MESSAGE);
      await sleep(retries[attempt], init?.signal);
    }
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetchWithRetry(url, init);
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const e = (json as ApiError | null)?.error;
    throw new ApiRequestError(e?.code ?? "INTERNAL_ERROR", e?.message ?? "Something went wrong. Please try again.", e?.fieldErrors);
  }
  return json as T;
}

export const bookingApi = {
  services: (signal?: AbortSignal) => request<{ services: Service[] }>("/api/services", { signal }),

  month: (serviceId: string, month: string, tz: string, signal?: AbortSignal) =>
    request<{ month: string; days: string[] }>(`/api/availability?${new URLSearchParams({ serviceId, month, tz })}`, { signal }),

  day: (serviceId: string, date: string, tz: string, signal?: AbortSignal) =>
    request<{ date: string; slots: Slot[]; nextAvailable: string | null }>(
      `/api/availability?${new URLSearchParams({ serviceId, date, tz })}`,
      { signal },
    ),

  next: (serviceId: string, count: number, tz: string, signal?: AbortSignal) =>
    request<{ slots: Slot[] }>(`/api/availability?${new URLSearchParams({ serviceId, next: String(count), tz })}`, { signal }),

  book: (body: BookingRequest) =>
    request<{ booking: Booking }>("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};
