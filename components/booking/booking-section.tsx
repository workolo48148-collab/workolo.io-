"use client";

import { CalendarDays, Clock, Globe, Info } from "lucide-react";
import Image from "next/image";
import { founder } from "@/lib/content";
import { formatOffset, formatTime, formatDateKey } from "@/lib/booking/tz";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import * as React from "react";
import { useBooking, type Step } from "./booking-provider";
import { DateTimeStep } from "./datetime-step";

// Loaded on demand: the details form carries zod, the confirmation carries .ics helpers.
const StepFallback = () => <div className="skeleton h-96 rounded-lg" aria-hidden />;
const DetailsStep = dynamic(() => import("./details-step").then((m) => m.DetailsStep), { loading: StepFallback });
const ConfirmationStep = dynamic(() => import("./confirmation-step").then((m) => m.ConfirmationStep), { loading: StepFallback });
const CancelPanel = dynamic(() => import("./cancel-panel").then((m) => m.CancelPanel), { loading: StepFallback });

const STEPS: { id: Step; label: string }[] = [
  { id: "datetime", label: "Date & time" },
  { id: "details", label: "Your details" },
  { id: "done", label: "Confirmed" },
];

export function BookingWidget() {
  const b = useBooking();

  // Warm the next step's chunk once the page is idle so it's instant when needed.
  React.useEffect(() => {
    const warm = () => void import("./details-step");
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(warm, 2500);
    return () => clearTimeout(t);
  }, []);

  const steps = b.services && b.services.length > 1 ? [{ id: "service" as Step, label: "Meeting" }, ...STEPS] : STEPS;
  const currentIndex = steps.findIndex((s) => s.id === b.step);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-lg">
      <div className="grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        {/* Summary */}
        <aside className="border-b border-border bg-surface-2 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <Image src={founder.photo} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
            <div>
              <p className="text-sm text-muted">Hosted by</p>
              <p className="font-semibold">{founder.name}, Workolo</p>
            </div>
          </div>
          <h3 className="mt-4 text-lg font-semibold lg:mt-5 lg:text-xl">{b.service?.name ?? "Discovery Meeting"}</h3>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted lg:mt-3 lg:block lg:space-y-2">
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-accent" aria-hidden /> {b.service?.durationMin ?? 30} min
            </li>
            {b.slot && b.tz && (
              <li className="flex items-start gap-2 font-medium text-text">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>
                  {formatTime(b.slot, b.tz)}, {b.date && formatDateKey(b.date, { weekday: "short", month: "short", day: "numeric" })}
                </span>
              </li>
            )}
            {b.tz && (
              <li className="flex items-center gap-2">
                <Globe className="size-4 text-accent" aria-hidden /> {b.tz.replace(/_/g, " ")} ({formatOffset(b.tz)})
              </li>
            )}
          </ul>
          {b.service && <p className="mt-4 hidden text-sm text-muted lg:block">{b.service.description}</p>}
        </aside>

        {/* Steps */}
        <div className="min-w-0 p-5 sm:p-6 lg:p-8">
          {/* Opened from a cancel link: show only the cancel form */}
          {b.cancelId && b.step !== "done" ? (
            <CancelPanel
              bookingId={b.cancelId}
              onBack={b.closeCancel}
              onBookAgain={() => {
                b.closeCancel();
                b.startOver();
              }}
            />
          ) : (
          <>
          <ol className="mb-6 flex items-center gap-2 text-xs font-medium sm:text-sm" aria-label="Booking progress">
            {steps.map((s, i) => (
              <li key={s.id} className="flex items-center gap-2" aria-current={i === currentIndex ? "step" : undefined}>
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full border text-xs tabular-nums",
                    i < currentIndex && "border-transparent bg-success-bg text-success",
                    i === currentIndex && "border-transparent bg-primary text-primary-fg",
                    i > currentIndex && "border-border-strong text-muted",
                  )}
                >
                  {i + 1}
                </span>
                <span className={cn(i === currentIndex ? "text-text" : "text-muted", i !== currentIndex && "hidden sm:inline")}>{s.label}</span>
                {i < steps.length - 1 && <span aria-hidden className="mx-1 h-px w-4 bg-border-strong sm:w-8" />}
              </li>
            ))}
          </ol>

          {b.rescheduleId && b.step !== "done" && (
            <p className="mb-5 flex items-start gap-2 rounded-md border border-[rgb(var(--glow)/0.45)] bg-[rgb(var(--glow)/0.1)] p-3 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              You&apos;re rescheduling an existing booking. Pick a new time and confirm with the same email.
            </p>
          )}

          {b.servicesError ? (
            <p role="alert" className="text-danger">
              {/hello@workolo\.io/.test(b.servicesError) ? (
                b.servicesError
              ) : (
                <>
                  {b.servicesError} You can also email <a className="underline" href="mailto:hello@workolo.io">hello@workolo.io</a>.
                </>
              )}
            </p>
          ) : b.step === "service" ? (
            <ServiceStep />
          ) : b.step === "details" ? (
            <DetailsStep />
          ) : b.step === "done" && b.booking ? (
            <ConfirmationStep />
          ) : (
            <DateTimeStep />
          )}
          </>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceStep() {
  const b = useBooking();
  return (
    <div role="radiogroup" aria-label="Choose a meeting type" className="grid gap-3">
      {b.services?.map((s) => (
        <button
          key={s.id}
          type="button"
          role="radio"
          aria-checked={b.service?.id === s.id}
          onClick={() => b.chooseService(s.id)}
          className="rounded-lg border border-border-strong p-4 text-left transition-colors hover:border-ring hover:bg-[rgb(var(--glow)/0.08)]"
        >
          <span className="font-semibold">{s.name}</span>
          <span className="ml-2 text-sm text-muted">{s.durationMin} min</span>
          <span className="mt-1 block text-sm text-muted">{s.description}</span>
        </button>
      ))}
    </div>
  );
}
