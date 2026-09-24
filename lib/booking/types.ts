export type Service = {
  id: string;
  name: string;
  durationMin: number;
  description: string;
};

/** A bookable start time. `start` is an ISO-8601 UTC instant. */
export type Slot = { start: string };

export type Booking = {
  id: string;
  serviceId: string;
  start: string;
  end: string;
  tz: string;
  name: string;
  email: string;
  /** Link the attendee can use to pick a new time. */
  rescheduleUrl: string;
  provider: string;
};

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "SERVICE_NOT_FOUND"
  | "SLOT_UNAVAILABLE"
  | "BOOKING_NOT_FOUND"
  | "RATE_LIMITED"
  | "UPSTREAM_ERROR"
  | "NOT_CONFIGURED"
  | "INTERNAL_ERROR";

export type ApiError = {
  error: { code: ErrorCode; message: string; fieldErrors?: Record<string, string[] | undefined> };
};
