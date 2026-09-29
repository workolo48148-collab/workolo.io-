"use client";

import { Globe } from "lucide-react";
import dynamic from "next/dynamic";
import * as React from "react";
import { formatOffset } from "@/lib/booking/tz";

// The modal (Radix Dialog + the full zone list) loads only when someone opens it.
const TimezoneDialog = dynamic(() => import("./timezone-dialog").then((m) => m.TimezoneDialog));

export const prettyZone = (tz: string) => tz.replace(/_/g, " ").replace(/\//g, " / ");

export function TimezonePicker({ tz, onChange }: { tz: string; onChange: (tz: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [requested, setRequested] = React.useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          setRequested(true);
          setOpen(true);
        }}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-sm text-muted hover:bg-surface-2 hover:text-text"
      >
        <Globe className="size-4 text-accent" aria-hidden />
        <span>
          <span className="sr-only">Time zone: </span>
          {prettyZone(tz)} <span className="text-muted/80">({formatOffset(tz)})</span>
        </span>
        <span className="font-medium text-accent underline underline-offset-2">Change</span>
      </button>
      {requested && <TimezoneDialog open={open} onOpenChange={setOpen} tz={tz} onChange={onChange} />}
    </>
  );
}
