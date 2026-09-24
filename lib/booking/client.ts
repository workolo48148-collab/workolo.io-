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

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiRequestError("UPSTREAM_ERROR", "You seem to be offline. Check your connection and try again.");
  }
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
