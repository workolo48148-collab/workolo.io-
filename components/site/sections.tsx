import { ArrowRight, BarChart3, Check, Film, LineChart, MessageCircle, PenLine, Search, Shield, Upload, Wallet, X } from "lucide-react";
import Image from "next/image";
import { audiences, founder, included, painPoints, plans, processSteps, reviewSummary, SHOW_COMPARE_PRICES } from "@/lib/content";
import { cn, formatUsd } from "@/lib/utils";
import { CtaLink } from "./cta-link";
import { ProofWall, Stars } from "./proof-wall";
import { SectionHeading } from "./section-heading";

const ICONS = {
  search: Search,
  pen: PenLine,
  film: Film,
  upload: Upload,
  message: MessageCircle,
  chart: BarChart3,
  trend: LineChart,
  wallet: Wallet,
  shield: Shield,
} as const;

export function Section({ id, className, children, labelledBy }: { id?: string; className?: string; children: React.ReactNode; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-20 sm:py-28", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function Audience() {
  return (
    <Section labelledBy="audience-title" className="border-t border-border">
      <SectionHeading
        id="audience-title"
        eyebrow="Who it's for"
        title={
          <>
            Built for <span className="accent-serif">finance experts</span> with a real offer
          </>
        }
        lead="If you already have solid expertise and something to sell, this is for you."
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((a) => {
          const Icon = ICONS[a.icon];
          return (
            <li key={a.title} className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-[rgb(var(--glow)/0.5)]">
              <span className="grid size-11 place-items-center rounded-xl bg-[rgb(var(--glow)/0.12)] text-accent">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted">{a.body}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function Proof() {
  return (
    <Section id="reviews" labelledBy="proof-title" className="bg-surface-2/50">
      <SectionHeading
        id="proof-title"
        eyebrow="Wall of proof"
        title={
          <>
            Rated <span className="accent-serif">{reviewSummary.rating}</span> by every client
          </>
        }
        lead="Real reviews from clients Salman has worked with, and real conversations from the DMs."
      />
      <p className="mt-6 flex items-center justify-center gap-2 text-sm">
        <Stars />
        <span className="font-semibold">{reviewSummary.rating}</span>
        <span className="text-muted">from {reviewSummary.count} client reviews</span>
      </p>
      <div className="mt-6">
        <ProofWall />
      </div>
    </Section>
  );
}

export function ProblemSolution() {
  return (
    <Section labelledBy="problem-title">
      <SectionHeading
        id="problem-title"
        eyebrow="Why most finance content stalls"
        title={
          <>
            Posting more isn&apos;t the fix. <span className="accent-serif">A system is.</span>
          </>
        }
      />
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {painPoints.map((p, i) => (
          <article key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex gap-3 p-6">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-danger-bg text-danger">
                <X className="size-3.5" aria-hidden />
              </span>
              <p className="text-muted">
                <span className="sr-only">Problem: </span>
                {p.pain}
              </p>
            </div>
            <div className="mt-auto flex gap-3 border-t border-border bg-[rgb(var(--glow)/0.06)] p-6">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-fg">
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
    <Section labelledBy="included-title" className="bg-surface-2/50">
      <SectionHeading
        id="included-title"
        eyebrow="What's included"
        title={
          <>
            Your content team, <span className="accent-serif">done for you</span> every month
          </>
        }
        lead="You bring the expertise. We turn it into content that gets seen, remembered, and acted on."
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {included.map((f) => {
          const Icon = ICONS[f.icon];
          return (
            <li key={f.title} className="rounded-2xl border border-border bg-surface p-6 sm:p-7">
              <span className="grid size-11 place-items-center rounded-xl bg-[rgb(var(--glow)/0.12)] text-accent">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-base font-semibold tracking-tight">{f.title}</h3>
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
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="how-title"
            align="left"
            eyebrow="How it works"
            title={
              <>
                Four steps. <span className="accent-serif">One</span> of them is yours.
              </>
            }
            lead="You film 1–2 days a month. We handle everything else."
          />
          <CtaLink location="how_it_works" className="mt-8 hidden lg:inline-flex">
            Book a call <ArrowRight />
          </CtaLink>
        </div>

        <ol className="relative space-y-4 before:absolute before:bottom-6 before:left-[1.4rem] before:top-6 before:w-px before:bg-border-strong">
          {processSteps.map((s, i) => {
            const yours = i === 2;
            return (
              <li key={s.title} className="relative flex gap-5">
                <span
                  className={cn(
                    "relative z-10 grid size-11 shrink-0 place-items-center rounded-full border text-sm font-semibold tabular-nums",
                    yours ? "border-transparent bg-primary text-primary-fg" : "border-border-strong bg-bg text-accent",
                  )}
                >
                  0{i + 1}
                </span>
                <div className={cn("flex-1 rounded-2xl border bg-surface p-5 sm:p-6", yours ? "border-[rgb(var(--glow)/0.55)]" : "border-border")}>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    {yours && <span className="rounded-full bg-[rgb(var(--glow)/0.14)] px-2 py-0.5 text-xs font-medium text-accent">Your part</span>}
                  </div>
                  <p className="mt-1.5 text-sm text-muted">{s.body}</p>
                </div>
              </li>
            );
          })}
          <li className="relative flex gap-5">
            <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-dashed border-border-strong bg-bg text-accent">
              <ArrowRight className="size-4" aria-hidden />
            </span>
            <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-dashed border-border-strong p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <p className="font-medium">It starts with a 30-minute discovery call.</p>
              <CtaLink location="how_it_works_timeline" size="sm" className="self-start sm:self-auto">
                Book a call
              </CtaLink>
            </div>
          </li>
        </ol>
      </div>
    </Section>
  );
}

export function Founder() {
  return (
    <Section id="about" labelledBy="founder-title" className="border-t border-border">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="relative mx-auto w-full max-w-sm lg:sticky lg:top-28">
          <div aria-hidden className="absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,rgb(var(--glow)/0.3),transparent)]" />
          <Image
            src={founder.photo}
            alt={founder.photoAlt}
            width={1080}
            height={1080}
            sizes="(min-width: 640px) 384px, 100vw"
            className="aspect-[4/5] w-full rounded-3xl border border-border object-cover shadow-lg"
          />
          {/* Stat chips over the photo */}
          <div className="absolute -left-3 top-6 rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg sm:-left-6">
            <p className="text-xs text-muted">{founder.facts[0].label}</p>
            <p className="font-semibold">{founder.facts[0].value}</p>
          </div>
          <div className="absolute -right-3 bottom-20 rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg sm:-right-6">
            <p className="flex items-center gap-1.5 font-semibold">
              <Stars className="[&_svg]:size-3.5" /> {reviewSummary.rating}
            </p>
            <p className="text-xs text-muted">{reviewSummary.count} client reviews</p>
          </div>
          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white">
            <p className="font-semibold">
              {founder.name} <span className="font-normal text-white/80">· Founder, Workolo</span>
            </p>
            <p className="text-sm text-white/80">{founder.facts[1].value}</p>
          </div>
        </div>

        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden /> Who you&apos;ll work with
          </p>
          <h2 id="founder-title" className="mt-5 text-4xl font-semibold">
            Hi, I&apos;m <span className="accent-serif">{founder.name}.</span>
          </h2>
          <p className="mt-5 text-xl font-medium leading-snug">{founder.heading}</p>
          <div className="mt-6 space-y-4 text-muted">
            {founder.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <blockquote className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <p className="font-serif text-2xl italic leading-snug text-text">&ldquo;{founder.close}&rdquo;</p>
            <footer className="mt-3 text-sm text-muted">— {founder.name}</footer>
          </blockquote>
        </div>
      </div>
    </Section>
  );
}

export function Pricing() {
  return (
    <Section id="pricing" labelledBy="pricing-title" className="bg-surface-2/50">
      <SectionHeading
        id="pricing-title"
        eyebrow="Packages"
        title={
          <>
            Content system <span className="accent-serif">packages</span>
          </>
        }
        lead="Done for you, every month. We'll recommend the right fit on the call."
      />
      <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.id}
            aria-labelledby={`plan-${p.id}`}
            className={cn(
              "relative flex flex-col rounded-3xl border bg-surface p-7",
              p.featured ? "border-primary shadow-[0_0_0_1px_var(--primary),0_24px_60px_-24px_rgb(var(--glow)/0.55)] lg:-my-3 lg:py-10" : "border-border",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 id={`plan-${p.id}`} className="text-xl font-semibold">
                {p.name}
              </h3>
              {p.featured && <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-fg">Best value</span>}
            </div>
            <p className="mt-1 text-sm font-medium text-muted">{p.volume}</p>
            <p className="mt-6 flex items-baseline gap-2">
              {SHOW_COMPARE_PRICES && <s className="text-lg text-muted">{formatUsd(p.compareAt)}</s>}
              <span className="text-5xl font-semibold tabular-nums tracking-tight">{formatUsd(p.price)}</span>
              <span className="text-sm text-muted">/ month</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 border-t border-border pt-6 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <CtaLink location={`pricing_${p.id}`} variant={p.featured ? "primary" : "secondary"} className="mt-8 w-full">
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
    <section aria-labelledby="final-title" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center shadow-md sm:px-12 sm:py-20">
        <div aria-hidden className="absolute inset-x-0 -top-28 mx-auto h-56 max-w-2xl rounded-full bg-[rgb(var(--glow)/0.3)] blur-3xl" />
        <h2 id="final-title" className="relative text-4xl font-semibold sm:text-5xl">
          Make your content <span className="accent-serif">contribute</span> to your business.
        </h2>
        <p className="relative mx-auto mt-5 max-w-xl text-lg text-muted">
          Book a 30-minute discovery call. We&apos;ll look at whether the content system fits your business.
        </p>
        <CtaLink location="final_band" size="lg" className="relative mt-9 w-full sm:w-auto">
          Book a call <ArrowRight />
        </CtaLink>
      </div>
    </section>
  );
}
