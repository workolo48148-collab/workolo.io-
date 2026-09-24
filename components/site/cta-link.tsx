"use client";

import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Anchor-styled button that tracks cta_click. Works without JS (plain #hash link). */
export function CtaLink({
  href = "#book",
  location,
  variant,
  size,
  className,
  children,
}: VariantProps<typeof buttonVariants> & { href?: string; location: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} onClick={() => track("cta_click", { location, target: href })} className={cn(buttonVariants({ variant, size }), className)}>
      {children}
    </a>
  );
}
