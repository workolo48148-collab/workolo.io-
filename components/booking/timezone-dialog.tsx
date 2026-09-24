"use client";

import { Check, Search } from "lucide-react";
import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatOffset } from "@/lib/booking/tz";
import { cn } from "@/lib/utils";
import { prettyZone } from "./timezone-picker";

function allZones(): string[] {
  try {
    return (Intl as unknown as { supportedValuesOf(k: string): string[] }).supportedValuesOf("timeZone");
  } catch {
    return ["UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Dubai", "Asia/Karachi", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney"];
  }
}

export function TimezoneDialog({
  open,
  onOpenChange,
  tz,
  onChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  tz: string;
  onChange: (tz: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const zones = React.useMemo(() => {
    const now = new Date();
    return allZones().map((z) => ({ id: z, label: prettyZone(z), offset: formatOffset(z, now) }));
  }, []);
  const q = query.trim().toLowerCase();
  const filtered = q ? zones.filter((z) => z.label.toLowerCase().includes(q) || z.offset.toLowerCase().includes(q)) : zones;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setQuery("");
      }}
    >
      <DialogContent title="Choose your time zone" description="Times will be shown in the zone you pick.">
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city or GMT offset"
              aria-label="Search time zones"
              className="h-11 w-full rounded-md border border-input bg-surface pl-9 pr-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-[rgb(var(--glow)/0.35)]"
            />
          </div>
        </div>
        <ul aria-label="Time zones" className="min-h-0 flex-1 overflow-y-auto p-2">
          {filtered.slice(0, 200).map((z) => (
            <li key={z.id}>
              <button
                type="button"
                aria-current={z.id === tz || undefined}
                onClick={() => {
                  onChange(z.id);
                  onOpenChange(false);
                  setQuery("");
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm hover:bg-surface-2",
                  z.id === tz && "bg-surface-2 font-semibold",
                )}
              >
                <span className="truncate">{z.label}</span>
                <span className="flex shrink-0 items-center gap-2 text-xs tabular-nums text-muted">
                  {z.offset}
                  {z.id === tz && <Check className="size-4 text-accent" aria-hidden />}
                </span>
              </button>
            </li>
          ))}
          {!filtered.length && <li className="p-6 text-center text-sm text-muted">No time zones match “{query}”.</li>}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
