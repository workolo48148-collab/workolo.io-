"use client";

import { ArrowRight, CalendarX2, RotateCw } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ApiRequestError, bookingApi } from "@/lib/booking/client";
import { schedule } from "@/lib/booking/config";
import { dateKeyInTz, formatDateKey, formatTime, hourInTz } from "@/lib/booking/tz";
import type { Slot } from "@/lib/booking/types";
import { cn } from "@/lib/utils";
import { useBooking } from "./booking-provider";
import { Calendar } from "./calendar";
import { TimezonePicker } from "./timezone-picker";

type DayState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; slots: Slot[]; nextAvailable: string | null }
  | { status: "error"; message: string };

/** A fetched result tagged with the request it answers; a key mismatch means "loading". */
type DayResult = { key: string; state: Exclude<DayState, { status: "idle" | "loading" }> };

const GROUPS = [
  { id: "morning", label: "Morning", test: (h: number) => h < 12 },
  { id: "afternoon", label: "Afternoon", test: (h: number) => h >= 12 && h < 17 },
  { id: "evening", label: "Evening", test: (h: number) => h >= 17 },
];

export function DateTimeStep() {
  const b = useBooking();
  const { tz, now, service, month, date, slot, availabilityVersion } = b;

  const [monthDays, setMonthDays] = React.useState<{ key: string; days: Set<string> } | null>(null);
  const [monthError, setMonthError] = React.useState<string | null>(null);
  const [dayResult, setDayResult] = React.useState<DayResult | null>(null);
  const autoPicked = React.useRef(false);

  const today = tz && now ? dateKeyInTz(new Date(now), tz) : "";
  const maxMonth = tz && now ? dateKeyInTz(new Date(now + schedule.horizonDays * 86400_000), tz).slice(0, 7) : "";
  const monthKey = service && tz && month ? `${service.id}|${tz}|${month}|${availabilityVersion}` : null;

  // Days with availability for the visible month.
  React.useEffect(() => {
    if (!monthKey || !service || !tz || !month) return;
    const ctrl = new AbortController();
    bookingApi
      .month(service.id, month, tz, ctrl.signal)
      .then((r) => {
        setMonthError(null);
        setMonthDays({ key: monthKey, days: new Set(r.days) });
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError") setMonthError(e.message);
      });
    return () => ctrl.abort();
  }, [monthKey, service, tz, month]);

  const monthLoading = !monthDays || monthDays.key !== monthKey;
  const available = React.useMemo(() => (monthLoading ? new Set<string>() : monthDays!.days), [monthLoading, monthDays]);

  // Pre-select the first open day so visitors see times without an extra tap.
  React.useEffect(() => {
    if (monthLoading || autoPicked.current || date) return;
    const first = [...available].sort()[0];
    if (first) {
      autoPicked.current = true;
      b.chooseDate(first, { silent: true });
    } else if (month && month < maxMonth) {
      const [y, m] = month.split("-").map(Number);
      b.setMonth(new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 7));
    }
  }, [monthLoading, available, date, month, maxMonth, b]);

  // Slots for the chosen day.
  const dayKey = service && tz && date ? `${service.id}|${tz}|${date}|${availabilityVersion}` : null;
  React.useEffect(() => {
    if (!dayKey || !service || !tz || !date) return;
    const ctrl = new AbortController();
    bookingApi
      .day(service.id, date, tz, ctrl.signal)
      .then((r) => setDayResult({ key: dayKey, state: { status: "ready", slots: r.slots, nextAvailable: r.nextAvailable } }))
      .catch((e: Error) => {
        if (e.name !== "AbortError")
          setDayResult({ key: dayKey, state: { status: "error", message: e instanceof ApiRequestError ? e.message : "Couldn't load times." } });
      });
    return () => ctrl.abort();
  }, [dayKey, service, tz, date]);

  const day: DayState = !dayKey ? { status: "idle" } : dayResult?.key === dayKey ? dayResult.state : { status: "loading" };

  if (!tz || !month || !now) return <DateTimeLoading />;

  const grouped =
    day.status === "ready"
      ? GROUPS.map((g) => ({ ...g, slots: day.slots.filter((s) => g.test(hourInTz(new Date(s.start), tz))) })).filter((g) => g.slots.length)
      : [];

  const liveMessage =
    day.status === "loading"
      ? `Loading times for ${date ? formatDateKey(date) : "the selected day"}…`
      : day.status === "ready"
        ? day.slots.length
          ? `${day.slots.length} times available on ${formatDateKey(date!)}.`
          : `No times left on ${formatDateKey(date!)}.${day.nextAvailable ? ` Next available: ${formatDateKey(day.nextAvailable)}.` : ""}`
        : day.status === "error"
          ? day.message
          : "";

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]">
      <div>
        <Calendar
          month={month}
          today={today}
          minMonth={today.slice(0, 7)}
          maxMonth={maxMonth}
          available={available}
          loading={monthLoading}
          selected={date}
          onSelect={b.chooseDate}
          onMonthChange={b.setMonth}
        />
        {monthError && (
          <p role="alert" className="mt-3 flex items-center gap-2 text-sm text-danger">
            {monthError}
            <button type="button" className="font-medium underline" onClick={b.refreshAvailability}>
              Retry
            </button>
          </p>
        )}
        <div className="mt-4 border-t border-border pt-3">
          <TimezonePicker tz={tz} onChange={b.setTz} />
        </div>
      </div>

      <div className="flex min-h-0 flex-col">
        <h4 className="mb-3 font-sans text-base font-semibold tracking-normal">
          {date ? formatDateKey(date, { weekday: "long", month: "short", day: "numeric" }) : "Pick a day"}
        </h4>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </p>

        {!date && <p className="text-sm text-muted">Choose a highlighted day to see open times.</p>}

        {day.status === "loading" && (
          <p className="text-sm text-muted" aria-hidden>
            Loading…
          </p>
        )}

        {day.status === "error" && (
          <div className="rounded-md border border-border bg-surface-2 p-4 text-sm">
            <p className="text-danger">{day.message}</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={b.refreshAvailability}>
              <RotateCw /> Try again
            </Button>
          </div>
        )}

        {day.status === "ready" && !day.slots.length && (
          <div className="rounded-md border border-dashed border-border-strong p-5 text-center">
            <CalendarX2 className="mx-auto size-6 text-muted" aria-hidden />
            <p className="mt-2 text-sm font-medium">No times left on this day</p>
            {day.nextAvailable ? (
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => {
                  b.setMonth(day.nextAvailable!.slice(0, 7));
                  b.chooseDate(day.nextAvailable!);
                }}
              >
                Next available: {formatDateKey(day.nextAvailable, { weekday: "short", month: "short", day: "numeric" })}
                <ArrowRight />
              </Button>
            ) : (
              <p className="mt-1 text-sm text-muted">We&apos;re fully booked right now. Email hello@workolo.io and we&apos;ll find a time.</p>
            )}
          </div>
        )}

        {day.status === "ready" && grouped.length > 0 && (
          <div className="-mr-2 max-h-[22rem] space-y-4 overflow-y-auto pr-2">
            {grouped.map((g) => (
              <fieldset key={g.id}>
                <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{g.label}</legend>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
                  {g.slots.map((s) => {
                    const active = s.start === slot;
                    return (
                      <button
                        key={s.start}
                        type="button"
                        aria-pressed={active}
                        onClick={() => b.chooseSlot(s.start)}
                        className={cn(
                          "h-11 rounded-full border text-sm font-semibold tabular-nums",
                          active
                            ? "border-primary bg-primary text-primary-fg shadow-sm"
                            : "border-border-strong bg-surface text-text hover:border-ring hover:bg-[rgb(var(--glow)/0.1)]",
                        )}
                      >
                        {formatTime(s.start, tz)}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        )}

        {slot && (
          <Button size="lg" className="mt-5 w-full" onClick={() => b.goTo("details")}>
            Continue with {formatTime(slot, tz)}
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}

function DateTimeLoading() {
  return <p className="py-10 text-center text-sm text-muted">Loading…</p>;
}
