import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight", className)}>
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <rect width="32" height="32" rx="8" fill="var(--primary)" />
        <path
          d="M7.5 10.5l3.2 11h.2l3-8.4h.2l3 8.4h.2l3.2-11"
          fill="none"
          stroke="var(--primary-fg)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24.5" cy="21" r="1.8" fill="var(--primary-fg)" />
      </svg>
      Workolo
    </span>
  );
}
