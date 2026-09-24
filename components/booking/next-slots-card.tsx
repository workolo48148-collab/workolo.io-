"use client";

import { ArrowRight, CalendarClock } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { track } from "@/lib/analytics";
import { bookingApi } from "@/lib/booking/client";
import { formatDateKey, formatOffset, formatTime, dateKeyInTz } from "@/lib/booking/tz";
import type { Slot } from "@/lib/booking/types";
import { founder } from "@/lib/content";
import { scrollToBooking, useBooking } from "./booking-provider";

/**
 * Hero card showing the real next open times from /api/availability. Picking
 * one jumps straight to the details step, which removes two taps from the funnel.
 */
export function NextSlotsCard() {
  const b = useBooking();
  const [slots, setSlots] = React.useState<Slot[] | null>(null);
  const [failed, setFailed] = React.useState(false);
  const { tz, service } = b;

  React.useEffect(() => {
    if (!tz || !service) return;
    const ctrl = new AbortController();
    bookingApi
      .next(service.id, 3, tz, ctrl.signal)
      .then((r) => setSlots(r.slots))
      .catch((e: Error) => e.name !== "AbortError" && setFailed(true));
    return () => ctrl.abort();
  }, [tz, service, b.availabilityVersion]);

  return (
    <div className="relative rounded-xl border border-border bg-surface p-5 shadow-lg sm:p-6">
      <div className="flex items-center gap-3">
        <Image src={founder.photo} alt="" width={48} height={48} className="size-12 rounded-full object-cover ring-2 ring-[rgb(var(--glow)/0.5)]" />
        <div className="min-w-0">
          <p className="font-semibold">{service?.name ?? "Discovery Meeting"} with {founder.name}</p>
          <p className="text-sm text-muted">{service?.durationMin ?? 30} min · see if the system fits your business</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-medium">
          <CalendarClock className="size-4 text-accent" aria-hidden /> Next available
        </p>
        {tz && <p className="text-xs text-muted">{formatOffset(tz)}</p>}
      </div>

      <div className="mt-3 grid gap-2" aria-live="polite" aria-busy={!slots && !failed}>
        {!slots && !failed &&
          Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton h-12 rounded-md" aria-hidden />)}
        {slots?.map((s) => (
          <button
            key={s.start}
            type="button"
            onClick={() => b.pickFromAnywhere(s.start, "hero_card")}
            className="group flex h-12 items-center justify-between rounded-md border border-border-strong bg-surface px-4 text-left text-sm transition-[border-color,background-color] duration-150 ease-out hover:border-ring hover:bg-[rgb(var(--glow)/0.1)]"
          >
            <span>
              <span className="font-semibold">{formatDateKey(dateKeyInTz(new Date(s.start), tz!), { weekday: "short", month: "short", day: "numeric" })}</span>
              <span className="text-muted"> · {formatTime(s.start, tz!)}</span>
            </span>
            <ArrowRight className="size-4 text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
          </button>
        ))}
        {slots && !slots.length && <p className="text-sm text-muted">Fully booked right now. Check the calendar below for new openings.</p>}
        {failed && <p className="text-sm text-muted">Times are loading slowly. Open the calendar below.</p>}
      </div>

      <button
        type="button"
        onClick={() => {
          track("cta_click", { location: "hero_card" });
          scrollToBooking();
        }}
        className="mt-3 w-full rounded-md py-2 text-sm font-medium text-accent underline-offset-2 hover:underline"
      >
        See all times
      </button>
    </div>
  );
}
