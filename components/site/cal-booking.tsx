"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import * as React from "react";
import { captureUtm, track } from "@/lib/analytics";
import { booking } from "@/lib/content";

/** Site blue (--primary in app/globals.css). Cal.com uses it for its buttons and selected dates. */
const BRAND_BLUE = "#2563eb";

/** Cal.com inline booking calendar. Bookings go straight into the Cal.com account; no backend here. */
export function CalBooking() {
  React.useEffect(() => {
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
      cal("on", { action: "linkReady", callback: () => track("booking_started", { provider: "calcom" }, { once: true }) });
      cal("on", { action: "bookingSuccessfulV2", callback: () => track("booking_completed", { provider: "calcom" }) });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
      <Cal
        namespace={booking.namespace}
        calLink={booking.calLink}
        config={{ layout: "month_view", theme: "dark" }}
        style={{ width: "100%", minHeight: 650, overflow: "auto" }}
      />
    </div>
  );
}
