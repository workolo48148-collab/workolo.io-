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
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md py-5 text-left text-base font-semibold text-text transition-colors duration-150 hover:text-accent sm:text-lg [&::-webkit-details-marker]:hidden">
        {title}
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-muted transition-transform duration-200 ease-out group-open:rotate-45"
        >
          <Plus className="size-4" />
        </span>
      </summary>
      <div className="animate-fade-up pb-6 pr-2 text-muted sm:pr-12">{children}</div>
    </details>
  );
}
