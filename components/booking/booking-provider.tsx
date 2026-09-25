"use client";

import * as React from "react";
import { captureUtm, track } from "@/lib/analytics";
import { bookingApi } from "@/lib/booking/client";
import { dateKeyInTz } from "@/lib/booking/tz";
import type { Booking, Service } from "@/lib/booking/types";

export type Step = "service" | "datetime" | "details" | "done";

type BookingContext = {
  /** null until detected on the client (avoids a hydration mismatch). */
  tz: string | null;
  /** Page-load time (ms), captured once on the client; keeps render pure. */
  now: number | null;
  setTz: (tz: string) => void;
  services: Service[] | null;
  servicesError: string | null;
  service: Service | null;
  chooseService: (id: string) => void;
  month: string | null;
  setMonth: (m: string) => void;
  date: string | null;
  /** `silent` = programmatic pre-selection; doesn't count as the visitor starting a booking. */
  chooseDate: (d: string, opts?: { silent?: boolean }) => void;
  slot: string | null;
  chooseSlot: (iso: string, source?: string) => void;
  /** Hero shortcut: jump straight to the details step with a slot picked. */
  pickFromAnywhere: (iso: string, source: string) => void;
  step: Step;
  goTo: (s: Step) => void;
  booking: Booking | null;
  complete: (b: Booking) => void;
  rescheduleId: string | null;
  /** Booking id from a cancel link (?cancel=…); shows the cancel form instead of the calendar. */
  cancelId: string | null;
  closeCancel: () => void;
  /** Call after a successful cancellation (tracks it and frees the slot in the UI). */
  cancelled: (id: string) => void;
  startOver: () => void;
  /** Bumped whenever availability may be stale (e.g. SLOT_UNAVAILABLE). */
  availabilityVersion: number;
  refreshAvailability: () => void;
};

const Ctx = React.createContext<BookingContext | null>(null);

export function useBooking() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

export function scrollToBooking() {
  const el = document.getElementById("book");
  if (!el) return;
  el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [tz, setTzState] = React.useState<string | null>(null);
  const [now, setNow] = React.useState<number | null>(null);
  const [services, setServices] = React.useState<Service[] | null>(null);
  const [servicesError, setServicesError] = React.useState<string | null>(null);
  const [serviceId, setServiceId] = React.useState<string | null>(null);
  const [month, setMonth] = React.useState<string | null>(null);
  const [date, setDate] = React.useState<string | null>(null);
  const [slot, setSlot] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<Step>("datetime");
  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [rescheduleId, setRescheduleId] = React.useState<string | null>(null);
  const [cancelId, setCancelId] = React.useState<string | null>(null);
  const [availabilityVersion, setAvailabilityVersion] = React.useState(0);

  // Client-only initialisation: time zone, UTM capture, reschedule link.
  React.useEffect(() => {
    captureUtm();
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    /* eslint-disable react-hooks/set-state-in-effect -- reading browser-only values once after hydration */
    const t = Date.now();
    setNow(t);
    setTzState(detected);
    setMonth(dateKeyInTz(new Date(t), detected).slice(0, 7));
    const qs = new URLSearchParams(window.location.search);
    const r = qs.get("reschedule");
    if (r) setRescheduleId(r.slice(0, 128));
    const c = qs.get("cancel");
    if (c) setCancelId(c.slice(0, 128));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  React.useEffect(() => {
    const ctrl = new AbortController();
    bookingApi
      .services(ctrl.signal)
      .then(({ services }) => {
        setServices(services);
        if (services.length === 1) setServiceId(services[0].id);
        else setStep("service");
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError") setServicesError(e.message);
      });
    return () => ctrl.abort();
  }, []);

  const service = services?.find((s) => s.id === serviceId) ?? null;

  const started = React.useCallback((source: string) => {
    track("booking_started", { source }, { once: true });
  }, []);

  const value: BookingContext = {
    tz,
    now,
    setTz: (next) => {
      setTzState(next);
      setSlot(null);
    },
    services,
    servicesError,
    service,
    chooseService: (id) => {
      setServiceId(id);
      setSlot(null);
      setStep("datetime");
      started("service");
    },
    month,
    setMonth,
    date,
    chooseDate: (d, opts) => {
      setDate(d);
      setSlot(null);
      if (!opts?.silent) started("calendar");
    },
    slot,
    chooseSlot: (iso, source = "booking") => {
      setSlot(iso);
      started(source);
      track("slot_selected", { source, service: serviceId ?? undefined, slot_start: iso, tz: tz ?? undefined });
    },
    pickFromAnywhere: (iso, source) => {
      if (!tz) return;
      const d = dateKeyInTz(new Date(iso), tz);
      setMonth(d.slice(0, 7));
      setDate(d);
      setSlot(iso);
      setStep("details");
      started(source);
      track("slot_selected", { source, service: serviceId ?? undefined, slot_start: iso, tz });
      scrollToBooking();
    },
    step,
    goTo: setStep,
    booking,
    complete: (b) => {
      setBooking(b);
      setStep("done");
      setRescheduleId(null);
      track("booking_completed", { service: b.serviceId, slot_start: b.start, tz: b.tz, provider: b.provider });
    },
    rescheduleId,
    cancelId,
    closeCancel: () => {
      setCancelId(null);
      // Drop ?cancel= from the address bar so a refresh doesn't reopen the form.
      const url = new URL(window.location.href);
      url.searchParams.delete("cancel");
      window.history.replaceState(null, "", url);
    },
    cancelled: (id) => {
      track("booking_cancelled", { service: serviceId ?? undefined, via: cancelId === id ? "link" : "confirmation" });
      setAvailabilityVersion((v) => v + 1);
      // Done with the link: clean the address bar so a refresh doesn't reopen the form.
      if (cancelId === id) {
        const url = new URL(window.location.href);
        url.searchParams.delete("cancel");
        window.history.replaceState(null, "", url);
      }
    },
    startOver: () => {
      setBooking(null);
      setSlot(null);
      setStep(services && services.length > 1 ? "service" : "datetime");
    },
    availabilityVersion,
    refreshAvailability: () => setAvailabilityVersion((v) => v + 1),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
