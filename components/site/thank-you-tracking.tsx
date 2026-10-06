"use client";

import * as React from "react";
import { track } from "@/lib/analytics";

/**
 * Fires the booking conversion when Cal.com redirects a confirmed booking here.
 * Waits for the Meta Pixel to finish loading so the Lead/Schedule event isn't
 * dropped on the fresh page load. Renders nothing.
 */
export function ThankYouTracking() {
  React.useEffect(() => {
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      const w = window as typeof window & { fbq?: unknown };
      if (w.fbq || tries > 20) {
        window.clearInterval(id);
        track("booking_completed", { provider: "calcom", source: "thank_you" });
      }
    }, 300);
    return () => window.clearInterval(id);
  }, []);

  return null;
}
