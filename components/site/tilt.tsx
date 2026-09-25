"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Pointer-driven 3D tilt. Writes --rx / --ry (degrees), --mx / --my (glare
 * position) and --glare on the element; CSS does the transform. One rAF per
 * frame, transform-only, so it never triggers layout. Off for touch pointers
 * and prefers-reduced-motion.
 */
export function useTilt<T extends HTMLElement>(max = 6, opts: { base?: [number, number]; target?: "self" | "window" } = {}) {
  const ref = React.useRef<T>(null);
  const [baseX, baseY] = opts.base ?? [0, 0];
  const target = opts.target ?? "self";

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    let frame = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      // Normalised -0.5..0.5 relative to the element (or the viewport for page-wide rigs)
      const nx = target === "window" ? px / window.innerWidth - 0.5 : (px - r.left) / r.width - 0.5;
      const ny = target === "window" ? py / window.innerHeight - 0.5 : (py - r.top) / r.height - 0.5;
      el.style.setProperty("--ry", String(baseY + nx * max * 2));
      el.style.setProperty("--rx", String(baseX - ny * max * 2));
      el.style.setProperty("--mx", `${(nx + 0.5) * 100}%`);
      el.style.setProperty("--my", `${(ny + 0.5) * 100}%`);
      el.style.setProperty("--glare", "1");
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      el.style.setProperty("--rx", String(baseX));
      el.style.setProperty("--ry", String(baseY));
      el.style.setProperty("--glare", "0");
    };

    const src: HTMLElement | Window = target === "window" ? window : el;
    src.addEventListener("pointermove", onMove as EventListener, { passive: true });
    if (target === "self") el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      src.removeEventListener("pointermove", onMove as EventListener);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max, baseX, baseY, target]);

  return ref;
}

/** A card that tilts toward the pointer with a soft glare. */
export function Tilt({ className, max = 5, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { max?: number }) {
  const ref = useTilt<HTMLDivElement>(max);
  return (
    <div ref={ref} className={cn("tilt relative", className)} {...props}>
      {children}
    </div>
  );
}
