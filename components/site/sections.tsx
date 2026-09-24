import { ArrowRight, BarChart3, Check, Film, MessageCircle, PenLine, Search, Upload, X } from "lucide-react";
import Image from "next/image";
import { founder, included, painPoints, plans, processSteps, results, SHOW_COMPARE_PRICES, testimonials } from "@/lib/content";
import { cn, formatUsd } from "@/lib/utils";
import { CtaLink } from "./cta-link";
import { SectionHeading } from "./section-heading";

const ICONS = { search: Search, pen: PenLine, film: Film, upload: Upload, message: MessageCircle, chart: BarChart3 } as const;

export function Section({ id, className, children, labelledBy }: { id?: string; className?: string; children: React.ReactNode; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function ProblemSolution() {
  return (
    <Section labelledBy="problem-title" className="border-t border-border">
      <SectionHeading id="problem-title" eyebrow="Why most finance content stalls" title="Posting more isn't the fix. A system is." />
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {painPoints.map((p, i) => (
          <article key={i} className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
            <div className="flex gap-3 p-5 sm:p-6">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-danger-bg text-danger">
                <X className="size-3.5" aria-hidden />
              </span>
              <p className="text-muted">
                <span className="sr-only">Problem: </span>
                {p.pain}
              </p>
            </div>
            <div className="mt-auto flex gap-3 border-t border-border bg-surface-2 p-5 sm:p-6">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success-bg text-success">
                <Check className="size-3.5" aria-hidden />
              </span>
              <p className="font-medium">
                <span className="sr-only">With Workolo: </span>
                {p.outcome}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Included() {
  return (
    <Section labelledBy="included-title" className="bg-surface-2/60">
      <SectionHeading
        id="included-title"
        eyebrow="What's included"
        title="Your content team, done for you every month"
        lead="You bring the expertise. We turn it into content that gets seen, remembered, and acted on."
      />
      <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {included.map((f) => {
          const Icon = ICONS[f.icon];
          return (
            <li key={f.title} className="bg-surface p-6 sm:p-7">
              <span className="grid size-10 place-items-center rounded-md border border-border bg-surface-2 text-accent">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-sans text-base font-semibold tracking-normal">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{f.body}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function HowItWorks() {
  return (
    <Section id="how-it-works" labelledBy="how-title">
      <SectionHeading id="how-title" eyebrow="How it works" title="Four steps. One of them is yours." lead="You film 1–2 days a month. We handle everything else." />
      <ol className="relative mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((s, i) => (
          <li key={s.title} className={cn("rounded-lg border bg-surface p-6 shadow-sm", i === 2 ? "border-[rgb(var(--glow)/0.55)]" : "border-border")}>
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold tabular-nums text-accent">0{i + 1}</span>
              {i === 2 && (
                <span className="rounded-full bg-[rgb(var(--glow)/0.14)] px-2 py-0.5 text-xs font-medium text-accent">Your part</span>
              )}
            </div>
            <h3 className="mt-3 font-sans text-lg font-semibold tracking-normal">{s.title}</h3>
            <p className="mt-2 text-sm text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-border bg-surface-2 p-5 text-center sm:flex-row sm:p-6 sm:text-left">
        <p className="font-medium">
          It starts with a <span className="text-accent">30-minute discovery call</span> to see if the system fits your business.
        </p>
        <CtaLink location="how_it_works" className="w-full sm:w-auto">
          Book a call <ArrowRight />
        </CtaLink>
      </div>
    </Section>
  );
}

/** Renders only when real proof exists in lib/content.ts. */
export function Proof() {
  if (!testimonials.length && !results.length) return null;
  return (
    <Section labelledBy="proof-title" className="bg-surface-2/60">
      <SectionHeading id="proof-title" eyebrow="Results" title="Client results" lead="We work with new & established accounts." />
      {results.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {results.map((r) => (
            <figure key={r.src} className="overflow-hidden rounded-lg border border-border bg-surface">
              <Image src={r.src} alt={r.alt} width={r.width} height={r.height} sizes="(min-width: 768px) 25vw, 50vw" className="h-auto w-full" />
              {r.caption && <figcaption className="p-3 text-xs text-muted">{r.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
      {testimonials.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-lg border border-border bg-surface p-6">
              <blockquote className="text-pretty">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold">{t.name}</span> <span className="text-muted">· {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </Section>
  );
}

export function Founder() {
  return (
    <Section labelledBy="founder-title" className="border-t border-border">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="relative mx-auto w-full max-w-sm lg:sticky lg:top-24">
          <Image
            src={founder.photo}
            alt={founder.photoAlt}
            width={1080}
            height={1080}
            sizes="(min-width: 1024px) 384px, (min-width: 640px) 384px, 100vw"
            className="aspect-square w-full rounded-xl border border-border object-cover shadow-md"
          />
          <dl className="mt-4 grid grid-cols-2 gap-3">
            {founder.facts.map((f) => (
              <div key={f.label} className="rounded-lg border border-border bg-surface p-3.5">
                <dt className="text-xs text-muted">{f.label}</dt>
                <dd className="mt-0.5 font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-accent">Who you&apos;ll work with</p>
          <h2 id="founder-title" className="mt-3 text-3xl font-semibold">
            Hi, I&apos;m {founder.name}.
          </h2>
          <p className="mt-4 font-display text-xl font-medium leading-snug">{founder.heading}</p>
          <div className="mt-6 space-y-4 text-muted">
            {founder.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="mt-6 border-l-2 border-primary pl-4 font-medium">{founder.close}</p>
        </div>
      </div>
    </Section>
  );
}

export function Pricing() {
  return (
    <Section id="pricing" labelledBy="pricing-title" className="bg-surface-2/60">
      <SectionHeading id="pricing-title" eyebrow="Packages" title="Content system packages" lead="Done for you, every month. We'll recommend the right fit on the call." />
      <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.id}
            aria-labelledby={`plan-${p.id}`}
            className={cn(
              "relative flex flex-col rounded-xl border bg-surface p-6 shadow-sm sm:p-7",
              p.featured ? "border-primary shadow-[0_0_0_1px_var(--primary),var(--shadow-lg)]" : "border-border",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 id={`plan-${p.id}`} className="text-xl font-semibold">
                {p.name}
              </h3>
              {p.featured && <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-fg">Best value</span>}
            </div>
            <p className="mt-1 text-sm font-medium text-muted">{p.volume}</p>
            <p className="mt-6 flex items-baseline gap-2">
              {SHOW_COMPARE_PRICES && <s className="text-lg text-muted">{formatUsd(p.compareAt)}</s>}
              <span className="font-display text-4xl font-semibold tabular-nums tracking-tight">{formatUsd(p.price)}</span>
              <span className="text-sm text-muted">/ month</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 border-t border-border pt-6 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <CtaLink location={`pricing_${p.id}`} variant={p.featured ? "primary" : "secondary"} className="mt-7 w-full">
              Book a call
            </CtaLink>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-xl border border-border bg-surface px-6 py-12 text-center shadow-md sm:px-12 sm:py-16">
        <div aria-hidden className="absolute inset-x-0 -top-24 mx-auto h-48 max-w-xl rounded-full bg-[rgb(var(--glow)/0.25)] blur-3xl" />
        <h2 id="final-title" className="relative text-3xl font-semibold sm:text-4xl">
          Make your content contribute to your business.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-muted">
          Book a 30-minute discovery call. We&apos;ll look at whether the content system fits your business.
        </p>
        <CtaLink location="final_band" size="lg" className="relative mt-8 w-full sm:w-auto">
          Book a call <ArrowRight />
        </CtaLink>
      </div>
    </section>
  );
}
