"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Rotating word: shows ONE complete role at a time and fades/slides the next in.
 *
 * Only the active word is in the visual flow (the column/clip approach let two
 * words overlap), so the text is always shown in full. Height is reserved — two
 * lines on narrow screens so a long role like "Personal Finance Manager" can
 * wrap without clipping or shifting the layout, one line from `sm` up. The slide
 * is gated by `motion-safe`, so reduced-motion users get an instant swap.
 */
export function RotatingWord({
  words,
  interval = 2400,
  srLabel = "financial professional",
  className,
}: {
  words: string[];
  interval?: number;
  srLabel?: string;
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (words.length <= 1) return;
    const id = window.setInterval(() => setIndex((p) => (p + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className={cn("flex min-h-[2.3em] items-center justify-center text-center lg:min-h-[1.2em]", className)}>
      <span className="sr-only">{srLabel}</span>
      <span key={index} aria-hidden className="block motion-safe:animate-[word-in_0.45s_cubic-bezier(0.22,1,0.36,1)]">
        {words[index]}
      </span>
    </span>
  );
}
