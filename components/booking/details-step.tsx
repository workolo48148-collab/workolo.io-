"use client";

import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { getUtm } from "@/lib/analytics";
import { ApiRequestError, bookingApi } from "@/lib/booking/client";
import { qualifying } from "@/lib/booking/config";
import { countries, guessCountry, toE164 } from "@/lib/booking/countries";
import { detailsSchema } from "@/lib/booking/schema";
import { useBooking } from "./booking-provider";

type Values = {
  name: string;
  email: string;
  country: string;
  phoneLocal: string;
  instagram: string;
  note: string;
  timeline: string;
  outcome: string;
  budget: string;
  smsConsent: boolean;
  termsAccepted: boolean;
  company: string;
};

type Errors = Partial<Record<keyof Values | "phone", string>>;

const FIELD_ORDER: (keyof Errors)[] = ["name", "email", "phone", "instagram", "note", "outcome", "budget", "termsAccepted"];

function toPayload(v: Values) {
  return {
    name: v.name,
    email: v.email,
    phone: toE164(v.country, v.phoneLocal),
    instagram: v.instagram,
    note: v.note,
    timeline: v.timeline as (typeof qualifying.timeline)[number] | "",
    outcome: v.outcome as (typeof qualifying.outcome)[number],
    budget: v.budget as (typeof qualifying.budget)[number],
    smsConsent: v.smsConsent,
    termsAccepted: v.termsAccepted as true,
  };
}

function validate(v: Values): Errors {
  const r = detailsSchema.safeParse(toPayload(v));
  if (r.success) return {};
  const out: Errors = {};
  for (const issue of r.error.issues) {
    const k = issue.path[0] as keyof Errors;
    if (!out[k]) out[k] = issue.message;
  }
  return out;
}

export function DetailsStep() {
  const b = useBooking();
  const { toast } = useToast();
  const [values, setValues] = React.useState<Values>(() => ({
    name: "",
    email: "",
    country: guessCountry(b.tz ?? "UTC"),
    phoneLocal: "",
    instagram: "",
    note: "",
    timeline: "",
    outcome: "",
    budget: "",
    smsConsent: false,
    termsAccepted: false,
    company: "",
  }));
  const [touched, setTouched] = React.useState<Partial<Record<keyof Errors, boolean>>>({});
  const [serverErrors, setServerErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const clientErrors = validate(values);
  const errorFor = (k: keyof Errors) => (touched[k] ? clientErrors[k] : undefined) ?? serverErrors[k];

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    setServerErrors((e) => ({ ...e, [k === "phoneLocal" || k === "country" ? "phone" : k]: undefined }));
  };
  const blur = (k: keyof Errors) => () => setTouched((t) => ({ ...t, [k]: true }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
    const errs = validate(values);
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#bk-${first}`)?.focus();
      return;
    }
    if (!b.service || !b.slot || !b.tz) {
      b.goTo("datetime");
      return;
    }

    setSubmitting(true);
    try {
      const { booking } = await bookingApi.book({
        ...toPayload(values),
        serviceId: b.service.id,
        start: b.slot,
        tz: b.tz,
        rescheduleId: b.rescheduleId ?? undefined,
        utm: getUtm(),
        company: values.company,
      } as Parameters<typeof bookingApi.book>[0]);
      b.complete(booking);
    } catch (err) {
      if (!(err instanceof ApiRequestError)) {
        toast({ tone: "error", title: "Couldn't book that time", body: "Please try again." });
      } else if (err.code === "SLOT_UNAVAILABLE") {
        toast({ tone: "error", title: "That time was just taken", body: "Pick another slot. Your details are saved." });
        b.refreshAvailability();
        b.goTo("datetime");
      } else if (err.code === "VALIDATION_ERROR" && err.fieldErrors) {
        const mapped: Errors = {};
        for (const [k, v] of Object.entries(err.fieldErrors)) if (v?.[0]) mapped[k as keyof Errors] = v[0];
        setServerErrors(mapped);
        const firstServer = FIELD_ORDER.find((k) => mapped[k]);
        if (firstServer) formRef.current?.querySelector<HTMLElement>(`#bk-${firstServer}`)?.focus();
        else toast({ tone: "error", title: "Please check your details", body: err.message });
      } else {
        toast({ tone: "error", title: "Couldn't book that time", body: err.message });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby="bk-privacy">
      <button
        type="button"
        onClick={() => b.goTo("datetime")}
        className="-ml-2 inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted hover:bg-surface-2 hover:text-text"
      >
        <ArrowLeft className="size-4" aria-hidden /> Change time
      </button>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="bk-company">Company</label>
        <input id="bk-company" tabIndex={-1} autoComplete="off" value={values.company} onChange={(e) => set("company", e.target.value)} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="bk-name" label="Full name" required error={errorFor("name")}>
          {(a) => <Input {...a} autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} onBlur={blur("name")} />}
        </Field>
        <Field id="bk-email" label="Email" required error={errorFor("email")}>
          {(a) => (
            <Input
              {...a}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              onBlur={blur("email")}
            />
          )}
        </Field>
      </div>

      <Field id="bk-phone" label="Phone" optional error={errorFor("phone")} hint="Only used to reach you about this call.">
        {(a) => (
          <div className="flex gap-2">
            <label htmlFor="bk-country" className="sr-only">
              Country code
            </label>
            <div className="w-32 shrink-0">
              <Select id="bk-country" value={values.country} onChange={(e) => set("country", e.target.value)} autoComplete="tel-country-code">
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} {c.dial}
                  </option>
                ))}
              </Select>
            </div>
            <Input
              {...a}
              required={false}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="Phone number"
              value={values.phoneLocal}
              onChange={(e) => set("phoneLocal", e.target.value)}
              onBlur={blur("phone")}
            />
          </div>
        )}
      </Field>

      <Field id="bk-instagram" label="Your Instagram handle (and any other socials)" required error={errorFor("instagram")}>
        {(a) => (
          <Input
            {...a}
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="@yourhandle or instagram.com/yourhandle"
            value={values.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            onBlur={blur("instagram")}
          />
        )}
      </Field>

      <Field id="bk-note" label="What do you teach or trade? Briefly describe your business" required error={errorFor("note")}>
        {(a) => (
          <Textarea
            {...a}
            rows={3}
            placeholder="e.g. prop firm funded-account coaching, swing trading education, retail investing courses…"
            value={values.note}
            onChange={(e) => set("note", e.target.value)}
            onBlur={blur("note")}
          />
        )}
      </Field>

      <Field id="bk-outcome" label="Best possible outcome of working together in the next 90 days?" required error={errorFor("outcome")}>
        {(a) => (
          <Select {...a} value={values.outcome} onChange={(e) => { set("outcome", e.target.value); setTouched((t) => ({ ...t, outcome: true })); }}>
            <option value="">Choose one</option>
            {qualifying.outcome.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        )}
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="bk-budget" label="If you found a proven way to land retainer clients, what would you invest monthly?" required error={errorFor("budget")}>
          {(a) => (
            <Select {...a} value={values.budget} onChange={(e) => { set("budget", e.target.value); setTouched((t) => ({ ...t, budget: true })); }}>
              <option value="">Choose a range</option>
              {qualifying.budget.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
          )}
        </Field>
        <Field id="bk-timeline" label="How soon are you looking to start?" optional className="sm:self-end">
          {(a) => (
            <Select {...a} value={values.timeline} onChange={(e) => set("timeline", e.target.value)}>
              <option value="">Choose one</option>
              {qualifying.timeline.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <div className="space-y-3 rounded-md bg-surface-2 p-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={values.smsConsent}
            onChange={(e) => set("smsConsent", e.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-[var(--primary)]"
          />
          <span>
            I consent to receive SMS notifications about this call. Message frequency may vary, message and data rates may apply, and
            I can unsubscribe at any time.
          </span>
        </label>
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              id="bk-termsAccepted"
              type="checkbox"
              checked={values.termsAccepted}
              aria-invalid={errorFor("termsAccepted") ? true : undefined}
              aria-describedby={errorFor("termsAccepted") ? "bk-terms-error" : undefined}
              onChange={(e) => {
                set("termsAccepted", e.target.checked);
                setTouched((t) => ({ ...t, termsAccepted: true }));
              }}
              className="mt-0.5 size-5 shrink-0 accent-[var(--primary)]"
            />
            <span>
              I agree to the{" "}
              <Link href="/privacy" target="_blank" className="font-medium text-accent underline underline-offset-2">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" target="_blank" className="font-medium text-accent underline underline-offset-2">
                Terms
              </Link>
              .<span aria-hidden className="text-accent"> *</span>
            </span>
          </label>
          {errorFor("termsAccepted") && (
            <p id="bk-terms-error" className="mt-1.5 pl-8 text-xs font-medium text-danger">
              {errorFor("termsAccepted")}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={submitting} loadingText="Booking your call…">
        {b.rescheduleId ? "Confirm new time" : "Confirm booking"}
      </Button>
      <p id="bk-privacy" className="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
        <Lock className="size-3.5" aria-hidden /> Your details are only used to prepare for and run this call.
      </p>
    </form>
  );
}
