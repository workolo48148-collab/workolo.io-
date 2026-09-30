import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Accordion built on native <details>/<summary>: keyboard and screen-reader
 * support come from the browser, and it ships zero JavaScript. Items sharing a
 * `name` behave as a single-open group in modern browsers.
 *
 * SIMPLE BOLD styling: each item is its own flat white card with a bold
 * question and a chevron that flips open. Sits on the blue FAQ section.
 */
export function Accordion({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-3 sm:space-y-4", className)} {...props} />;
}

export function AccordionItem({
  title,
  name,
  defaultOpen,
  children,
  className,
}: {
  title: React.ReactNode;
  name?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <details
      name={name}
      open={defaultOpen}
      className={cn("group overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-md", className)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left font-display text-lg font-extrabold tracking-tight text-neutral-900 sm:px-7 sm:text-xl [&::-webkit-details-marker]:hidden">
        {title}
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-900 transition-transform duration-200 group-open:rotate-180 group-open:bg-[#2563eb] group-open:text-white"
        >
          <ChevronDown className="size-5" />
        </span>
      </summary>
      <div className="px-5 pb-6 text-[0.95rem] leading-relaxed text-neutral-600 sm:px-7">{children}</div>
    </details>
  );
}
