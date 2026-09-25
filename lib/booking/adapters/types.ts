import type { BookingRequest } from "../schema";
import type { Booking, CancelInput, Service } from "../types";

/**
 * The contract every booking backend implements. The API routes only talk to
 * this interface, so switching BOOKING_ADAPTER never touches UI or routes.
 */
export interface BookingAdapter {
  readonly name: string;
  listServices(): Promise<Service[]>;
  /** Free start times for a service in [from, to). */
  getAvailableStarts(serviceId: string, from: Date, to: Date): Promise<Date[]>;
  /**
   * Create (or, with `rescheduleId`, move) a booking. Must throw
   * BookingError("SLOT_UNAVAILABLE") if the slot was taken in the meantime.
   */
  createBooking(input: BookingRequest): Promise<Booking>;
  /**
   * Cancel a booking. Must verify `email` matches the booking's attendee and
   * throw BOOKING_NOT_FOUND otherwise (never reveal which part was wrong), and
   * throw ALREADY_CANCELLED if it was cancelled before.
   */
  cancelBooking(id: string, input: CancelInput): Promise<{ id: string; start: string | null }>;
}

/** Case- and whitespace-insensitive email match. */
export const sameEmail = (a: string | undefined | null, b: string) => (a ?? "").trim().toLowerCase() === b.trim().toLowerCase();

export const NOT_FOUND_MESSAGE = "We couldn't find a booking with that link and email. Check the email you booked with, or email hello@workolo.io.";
