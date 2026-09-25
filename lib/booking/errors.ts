import type { ApiError, ErrorCode } from "./types";

const STATUS: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  SERVICE_NOT_FOUND: 404,
  BOOKING_NOT_FOUND: 404,
  SLOT_UNAVAILABLE: 409,
  ALREADY_CANCELLED: 409,
  RATE_LIMITED: 429,
  UPSTREAM_ERROR: 502,
  NOT_CONFIGURED: 503,
  INTERNAL_ERROR: 500,
};

export class BookingError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public fieldErrors?: Record<string, string[] | undefined>,
  ) {
    super(message);
  }
}

export function errorResponse(err: unknown): Response {
  const e =
    err instanceof BookingError
      ? err
      : new BookingError("INTERNAL_ERROR", "Something went wrong on our side. Please try again, or email hello@workolo.io.");
  if (!(err instanceof BookingError)) console.error("[booking]", err);
  const body: ApiError = { error: { code: e.code, message: e.message, ...(e.fieldErrors ? { fieldErrors: e.fieldErrors } : {}) } };
  return Response.json(body, { status: STATUS[e.code], headers: { "Cache-Control": "no-store" } });
}
