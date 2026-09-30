"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { captureUtm, track } from "@/lib/analytics";
import { booking } from "@/lib/content";

/** Site blue. Cal.com uses it for its buttons and selected dates. */
const BRAND_BLUE = "#2563eb";

type BookingContext = { open: () => void; prewarm: () => void };
const Ctx = React.createContext<BookingContext | null>(null);

/** Open (or pre-warm) the booking pop-up from any CTA. */
export function useBooking() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used within <BookingProvider>");
  return ctx;
}

/**
 * Holds the booking calendar in a pop-up dialog instead of inline on the page.
 *
 * The embed is rendered only while the dialog is open (rendering it hidden makes
 * Cal initialise at zero size). To still make the first open feel instant, we
 * warm Cal in the background — load its runtime and call `cal("preload")` for
 * this booking — when the browser goes idle or a visitor shows intent (hovers /
 * focuses a CTA). Opening then reuses the preloaded data instead of fetching it.
 */
export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  // Warm Cal's runtime + preload this booking (does not render the calendar).
  const [warm, setWarm] = React.useState(false);

  const prewarm = React.useCallback(() => setWarm(true), []);
  const openBooking = React.useCallback(() => {
    setWarm(true);
    setOpen(true);
  }, []);

  // Warm on idle so even a fast click finds the calendar prepared.
  React.useEffect(() => {
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setWarm(true), { timeout: 4000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setWarm(true), 2500);
    return () => window.clearTimeout(id);
  }, []);

  React.useEffect(() => {
    if (!warm) return;
    // Keep ad-click params (utm_*, gclid, fbclid…) for the analytics events below.
    captureUtm();

    let cancelled = false;
    getCalApi({ namespace: booking.namespace }).then((cal) => {
      if (cancelled) return;
      cal("ui", {
        theme: "dark",
        layout: "month_view",
        cssVarsPerTheme: { dark: { "cal-brand": BRAND_BLUE }, light: { "cal-brand": BRAND_BLUE } },
      });
      // Fetch the booking page + availability ahead of time so opening is instant.
      cal("preload", { calLink: booking.calLink });
      cal("on", { action: "linkReady", callback: () => track("booking_started", { provider: "calcom" }, { once: true }) });
      cal("on", { action: "bookingSuccessfulV2", callback: () => track("booking_completed", { provider: "calcom" }) });
    });
    return () => {
      cancelled = true;
    };
  }, [warm]);

  const value = React.useMemo(() => ({ open: openBooking, prewarm }), [openBooking, prewarm]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-[rise-in_.2s_ease-out]" />
          <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col overflow-y-auto outline-none sm:inset-x-0 sm:top-[3vh] sm:bottom-[3vh] sm:mx-auto sm:max-w-4xl">
            <div className="mx-auto flex min-h-full w-full flex-col overflow-hidden bg-surface sm:min-h-0 sm:rounded-[var(--radius-xl)] sm:border sm:border-border">
              <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-7">
                <div className="min-w-0">
                  <DialogPrimitive.Title className="truncate font-display text-xl font-extrabold tracking-tight">
                    Book Your Strategy Call
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-sm text-muted">
                    Pick a time — a free 30-minute discovery call.
                  </DialogPrimitive.Description>
                </div>
                <DialogPrimitive.Close
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-border-strong text-text hover:bg-surface-2"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </DialogPrimitive.Close>
              </div>
              <div className="min-h-0 flex-1 bg-bg">
                {open && (
                  <Cal
                    namespace={booking.namespace}
                    calLink={booking.calLink}
                    config={{ layout: "month_view", theme: "dark" }}
                    style={{ width: "100%", height: "100%", minHeight: 620, overflow: "auto" }}
                  />
                )}
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </Ctx.Provider>
  );
}
