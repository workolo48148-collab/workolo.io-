"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Slot-machine word roller: the words are stacked in a column that slides up one
 * slot at a time, so the current word rolls out of view as the next rolls in.
 *
 * Each slot is two lines tall on narrow screens (so a long role like "Personal
 * Finance Manager" can wrap without being clipped) and one line from `sm` up,
 * where every role fits. The slide distance tracks that height via --rw-row.
 *
 * The column is decorative (aria-hidden); `srLabel` gives assistive tech one
 * stable phrase instead of the whole list. Honors reduced motion.
 */
export function RotatingWord({
  words,
  interval = 2200,
  srLabel = "financial professional",
  className,
}: {
  words: string[];
  interval?: number;
  srLabel?: string;
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  React.useEffect(() => {
    if (words.length <= 1) return;
    const id = window.setInterval(() => setIndex((p) => (p + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className="block h-[var(--rw-row)] overflow-hidden [--rw-row:2.3em] sm:[--rw-row:1.2em]">
      <span className="sr-only">{srLabel}</span>
      <span
        aria-hidden
        className={cn("flex flex-col", !reduced && "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]")}
        style={{ transform: `translateY(calc(${index} * var(--rw-row) * -1))` }}
      >
        {words.map((w) => (
          <span key={w} className={cn("flex h-[var(--rw-row)] items-center justify-center text-center leading-[1.1]", className)}>
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
