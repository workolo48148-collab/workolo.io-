"use client";

import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { booking } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useBooking } from "./booking-modal";

/** Public Cal.com link — the fallback target when JavaScript is off (and what crawlers follow). */
const BOOKING_URL = `https://cal.com/${booking.calLink}`;

/**
 * Primary call-to-action. Renders a real anchor to the Cal.com booking page
 * (so it works without JS and is crawlable), but with JS it opens the in-page
 * booking pop-up instead of leaving the site.
 */
export function CtaLink({
  location,
  variant,
  size,
  className,
  children,
}: VariantProps<typeof buttonVariants> & { location: string; className?: string; children: React.ReactNode }) {
  const { open } = useBooking();
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        // With JS: keep them on the page and open the calendar pop-up.
        e.preventDefault();
        track("cta_click", { location, target: "#book" });
        open();
      }}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </a>
  );
}
