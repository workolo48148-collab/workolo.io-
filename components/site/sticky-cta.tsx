"use client";

import { Star } from "lucide-react";
import * as React from "react";
import { ctaLabel, reviewSummary } from "@/lib/content";
import { cn } from "@/lib/utils";
import { CtaLink } from "./cta-link";

/** Mobile bottom bar: shows once the hero is off-screen, hides while the booking section is visible. Shows and hides instantly. */
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
        "fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-lg md:hidden",
        "mb-[env(safe-area-inset-bottom)]",
        !show && "hidden",
      )}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 text-sm leading-tight">
          <p className="font-semibold">30-min discovery call</p>
          <p className="mt-0.5 flex items-center gap-1 text-muted">
            <Star className="size-3 fill-current text-star" aria-hidden /> {reviewSummary.rating} · {reviewSummary.count} client reviews
          </p>
        </div>
        <CtaLink location="sticky_mobile" size="md" className="shrink-0 px-5">
          {ctaLabel}
        </CtaLink>
      </div>
    </div>
  );
}
