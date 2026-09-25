import { Plus } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Accordion built on native <details>/<summary>: keyboard and screen-reader
 * support come from the browser, and it ships zero JavaScript. Items sharing a
 * `name` behave as a single-open group in modern browsers.
 */
export function Accordion({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-t border-border", className)} {...props} />;
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
    <details name={name} open={defaultOpen} className={cn("group border-b border-border", className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md py-6 text-left text-lg font-semibold text-text transition-colors duration-150 hover:text-accent sm:text-xl [&::-webkit-details-marker]:hidden">
        {title}
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full border border-border-strong text-muted transition-[transform,background-color,color,border-color] duration-200 ease-out group-open:rotate-45 group-open:border-transparent group-open:bg-[rgb(var(--glow))] group-open:text-ink"
        >
          <Plus className="size-4" />
        </span>
      </summary>
      <div className="animate-fade-up pb-6 pr-2 text-muted sm:pr-12">{children}</div>
    </details>
  );
}
