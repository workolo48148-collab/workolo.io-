"use client";

import { ArrowLeft, CalendarX2, Check } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { ApiRequestError, bookingApi } from "@/lib/booking/client";
import { formatLongDate, formatTime } from "@/lib/booking/tz";
import { useBooking } from "./booking-provider";

/**
 * Cancel a booking. Used on the confirmation screen (email already known) and
 * from the cancel link in calendar invites (visitor confirms their email).
 */
export function CancelPanel({
  bookingId,
  knownEmail,
  onBack,
  onBookAgain,
}: {
  bookingId: string;
  /** Pre-filled and hidden when the visitor has just booked in this session. */
  knownEmail?: string;
  onBack: () => void;
  onBookAgain: () => void;
}) {
  const b = useBooking();
  const [email, setEmail] = React.useState(knownEmail ?? "");
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<{ field?: "email" | "reason"; message: string } | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState<{ start: string | null } | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    headingRef.current?.focus();
  }, [done]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError({ field: "email", message: "Enter the email you booked with" });
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { cancelled } = await bookingApi.cancel(bookingId, { email: email.trim(), reason: reason.trim() || undefined });
      b.cancelled(bookingId);
      setDone({ start: cancelled.start });
    } catch (err) {
      if (err instanceof ApiRequestError && err.code === "ALREADY_CANCELLED") {
        setDone({ start: null });
      } else if (err instanceof ApiRequestError && err.fieldErrors) {
        const [field, msgs] = Object.entries(err.fieldErrors).find(([, v]) => v?.length) ?? [];
        setError({ field: field === "reason" ? "reason" : "email", message: msgs?.[0] ?? err.message });
      } else {
        setError({ message: err instanceof ApiRequestError ? err.message : "Couldn't cancel. Please try again or email hello@workolo.io." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg py-2 text-center" role="status" aria-live="polite">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-surface-2 text-muted">
          <Check className="size-7" strokeWidth={2.5} aria-hidden />
        </div>
        <h3 ref={headingRef} tabIndex={-1} className="mt-5 text-3xl outline-none">
          Your call is cancelled.
        </h3>
        <p className="mt-3 text-muted">
          {done.start && b.tz
            ? `${formatLongDate(done.start, b.tz)} at ${formatTime(done.start, b.tz)} is free again. Nothing more to do.`
            : "Nothing more to do."}
        </p>
        <Button size="lg" className="mt-8" onClick={onBookAgain}>
          Book a new time
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto max-w-lg space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="-ml-2 inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted hover:bg-surface-2 hover:text-text"
      >
        <ArrowLeft className="size-4" aria-hidden /> {knownEmail ? "Keep my booking" : "Back to booking"}
      </button>

      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-danger-bg text-danger">
          <CalendarX2 className="size-6" aria-hidden />
        </span>
        <div>
          <h3 ref={headingRef} tabIndex={-1} className="text-3xl outline-none">
            Cancel your call?
          </h3>
          <p className="mt-2 text-muted">
            Your slot will be released straight away. You can always book a new time.
          </p>
        </div>
      </div>

      {!knownEmail && (
        <Field id="cx-email" label="Email you booked with" required error={error?.field === "email" ? error.message : undefined}>
          {(a) => (
            <Input
              {...a}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
            />
          )}
        </Field>
      )}

      <Field id="cx-reason" label="Anything we should know?" optional error={error?.field === "reason" ? error.message : undefined}>
        {(a) => (
          <Textarea {...a} rows={2} placeholder="e.g. a clash came up. Totally fine." value={reason} onChange={(e) => setReason(e.target.value)} />
        )}
      </Field>

      {error && !error.field && (
        <p role="alert" className="rounded-md bg-danger-bg p-3 text-sm text-danger">
          {error.message}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <Button type="submit" size="lg" loading={submitting} loadingText="Cancelling…" className="w-full bg-danger text-bg shadow-none hover:bg-danger/90 sm:flex-1">
          Yes, cancel my call
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={onBack} className="w-full sm:flex-1">
          Keep it
        </Button>
      </div>
    </form>
  );
}
