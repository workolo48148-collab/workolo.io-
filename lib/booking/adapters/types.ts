import type { BookingRequest } from "../schema";
import type { Booking, Service } from "../types";

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
}
