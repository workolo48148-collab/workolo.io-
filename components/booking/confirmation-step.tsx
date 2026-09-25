"use client";

import { CalendarPlus, CalendarX2, Check, Copy, Download, RefreshCcw } from "lucide-react";
import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { eventFor, googleCalendarUrl, icsFile, outlookCalendarUrl } from "@/lib/booking/ics";
import { formatLongDate, formatOffset, formatTime } from "@/lib/booking/tz";
import { cn } from "@/lib/utils";
import { useBooking } from "./booking-provider";
import { CancelPanel } from "./cancel-panel";

export function ConfirmationStep() {
  const b = useBooking();
  const { toast } = useToast();
  const [cancelling, setCancelling] = React.useState(false);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const booking = b.booking!;
  const tz = booking.tz;
  const serviceName = b.service?.name ?? "Discovery Meeting";
  const ev = eventFor(booking, serviceName, booking.email);

  React.useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function downloadIcs() {
    const url = URL.createObjectURL(new Blob([icsFile(ev)], { type: "text/calendar;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "workolo-discovery-call.ics" });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copyReschedule() {
    try {
      await navigator.clipboard.writeText(booking.rescheduleUrl);
      toast({ tone: "success", title: "Reschedule link copied" });
    } catch {
      toast({ tone: "error", title: "Couldn't copy", body: booking.rescheduleUrl });
    }
  }

  const calBtn = cn(buttonVariants({ variant: "secondary", size: "md" }), "w-full justify-start");

  if (cancelling) {
    return <CancelPanel bookingId={booking.id} knownEmail={booking.email} onBack={() => setCancelling(false)} onBookAgain={b.startOver} />;
  }

  return (
    <div className="mx-auto max-w-lg py-2 text-center" role="status" aria-live="polite">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-success-bg text-success">
        <Check className="size-7" strokeWidth={2.5} aria-hidden />
      </div>
      <h3 ref={headingRef} tabIndex={-1} className="mt-5 text-2xl font-semibold outline-none sm:text-3xl">
        You&apos;re booked, {booking.name.split(" ")[0]}.
      </h3>
      <p className="mt-2 text-muted">Add it to your calendar so it doesn&apos;t get buried.</p>

      <dl className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface-2 text-left text-sm">
        {[
          ["What", `${serviceName} · ${Math.round((+new Date(booking.end) - +new Date(booking.start)) / 60000)} min`],
          ["When", `${formatLongDate(booking.start, tz)}, ${formatTime(booking.start, tz)} – ${formatTime(booking.end, tz)}`],
          ["Time zone", `${tz.replace(/_/g, " ")} (${formatOffset(tz, new Date(booking.start))})`],
          ["Booked for", booking.email],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-4 px-4 py-3">
            <dt className="w-24 shrink-0 text-muted">{k}</dt>
            <dd className="min-w-0 break-words font-medium">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        <a className={calBtn} href={googleCalendarUrl(ev)} target="_blank" rel="noopener noreferrer">
          <CalendarPlus aria-hidden /> Google
        </a>
        <a className={calBtn} href={outlookCalendarUrl(ev)} target="_blank" rel="noopener noreferrer">
          <CalendarPlus aria-hidden /> Outlook
        </a>
        <button type="button" className={calBtn} onClick={downloadIcs}>
          <Download aria-hidden /> Apple / .ics
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted sm:flex-row sm:justify-center">
        <span>Need a different time?</span>
        <span className="flex items-center gap-1">
          <a href={booking.rescheduleUrl} className="inline-flex min-h-9 items-center gap-1.5 font-medium text-accent underline underline-offset-2">
            <RefreshCcw className="size-3.5" aria-hidden /> Reschedule
          </a>
          <button type="button" onClick={copyReschedule} className="grid size-9 place-items-center rounded-md hover:bg-surface-2" aria-label="Copy reschedule link">
            <Copy className="size-4" aria-hidden />
          </button>
        </span>
        <span aria-hidden className="hidden text-border-strong sm:inline">
          ·
        </span>
        <button
          type="button"
          onClick={() => setCancelling(true)}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-1 font-medium text-muted underline underline-offset-2 hover:text-danger"
        >
          <CalendarX2 className="size-3.5" aria-hidden /> Cancel booking
        </button>
      </div>
      {booking.cancelUrl && (
        <p className="mt-2 text-xs text-muted">The cancel and reschedule links are also in your calendar invite.</p>
      )}
    </div>
  );
}
