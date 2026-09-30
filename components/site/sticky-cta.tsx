"use client";

import { Star } from "lucide-react";
import * as React from "react";
import { ctaLabel, reviewSummary } from "@/lib/content";
import { cn } from "@/lib/utils";
import { CtaLink } from "./cta-link";

/** Mobile bottom bar: appears once the hero scrolls off-screen. Booking now lives in a
    pop-up, so there's no inline calendar to hide behind. Shows and hides instantly. */
export function StickyCta() {
  const [heroGone, setHeroGone] = React.useState(false);

  React.useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroGone(!e.isIntersecting);
      }
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-border-strong bg-surface/95 px-4 py-3 shadow-lg backdrop-blur md:hidden",
        "mb-[env(safe-area-inset-bottom)]",
        !heroGone && "hidden",
      )}
      aria-hidden={!heroGone}
      inert={!heroGone}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 text-sm leading-tight">
          <p className="font-display font-bold">30-min discovery call</p>
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
