"use client";

import { ArrowRight } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { CtaLink } from "./cta-link";

/** Mobile bottom bar: appears once the hero is off-screen, hides while the booking section is visible. */
export function StickyCta() {
  const [heroGone, setHeroGone] = React.useState(false);
  const [bookingVisible, setBookingVisible] = React.useState(false);

  React.useEffect(() => {
    const hero = document.getElementById("hero");
    const book = document.getElementById("book");
    if (!hero || !book) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroGone(!e.isIntersecting);
        if (e.target === book) setBookingVisible(e.isIntersecting);
      }
    });
    io.observe(hero);
    io.observe(book);
    return () => io.disconnect();
  }, []);

  const show = heroGone && !bookingVisible;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-lg transition-transform duration-250 ease-out md:hidden",
        show ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 text-sm leading-tight">
          <p className="font-semibold">Discovery call</p>
          <p className="text-muted">30 min · pick a time</p>
        </div>
        <CtaLink location="sticky_mobile" size="md" className="shrink-0">
          Book now <ArrowRight />
        </CtaLink>
      </div>
    </div>
  );
}
