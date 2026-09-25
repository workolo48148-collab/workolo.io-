import { ArrowRight, BarChart3, Check, Film, LineChart, MessageCircle, PenLine, Search, Shield, Upload, Wallet } from "lucide-react";
import Image from "next/image";
import {
  audiences,
  founder,
  included,
  month,
  painPoints,
  plans,
  processSteps,
  reviewSummary,
  SHOW_COMPARE_PRICES,
} from "@/lib/content";
import { cn, formatUsd } from "@/lib/utils";
import { CtaLink } from "./cta-link";
import { ProofWall, Stars } from "./proof-wall";
import { SectionHeading } from "./section-heading";
import { Tilt } from "./tilt";

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

export function Section({
  id,
  className,
  children,
  labelledBy,
  lazy,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
  /** Let the browser skip rendering until it's near the viewport. */
  lazy?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-24 sm:py-32", lazy && "cv-auto", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

/* ----------------------------------------------------------------- 01 */
export function Audience() {
  return (
    <Section labelledBy="audience-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <SectionHeading
          id="audience-title"
          index="01"
          eyebrow="Who it's for"
          align="left"
          title={
            <>
              Built for experts with <span className="accent-serif">a real offer.</span>
            </>
          }
        />
        <p className="reveal max-w-xl text-lg leading-relaxed text-muted lg:pb-2">
          If you sell trading education, investing, wealth coaching or financial planning, and your offer already works, the missing piece
          isn&apos;t expertise. It&apos;s a content engine that shows how you think to the people ready to pay for it.
        </p>
      </div>
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((a, i) => {
          const Icon = ICONS[a.icon];
          return (
            <li key={a.title} className="reveal">
              <Tilt className="h-full rounded-[var(--radius-lg)] border border-border bg-surface p-7 hover:border-[rgb(var(--glow)/0.5)]">
                <div className="flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-xl bg-[rgb(var(--glow)/0.14)] text-accent">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="label-mono text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-8 text-2xl">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{a.body}</p>
              </Tilt>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/* ----------------------------------------------------------------- 02 */
export function Proof() {
  return (
    <Section id="reviews" labelledBy="proof-title" className="tone-flip relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 max-w-4xl rounded-full bg-[rgb(var(--glow)/0.14)] blur-3xl" />
      <div className="relative">
        <SectionHeading
          id="proof-title"
          index="02"
          eyebrow="Wall of proof"
          title={
            <>
              Rated <span className="accent-serif">{reviewSummary.rating}</span> by every client.
            </>
          }
          lead="Don't take the headline's word for it. Six client reviews and four real DMs, exactly as they arrived. Only identifying details are blacked out."
        />
        <p className="mt-7 flex items-center justify-center gap-2 text-sm">
          <Stars />
          <span className="font-semibold">{reviewSummary.rating}</span>
          <span className="text-muted">average · {reviewSummary.count} of {reviewSummary.count} reviews are five stars</span>
        </p>
        <div className="wall-3d mt-12">
          <ProofWall />
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- 03 */
export function ProblemSolution() {
  return (
    <Section labelledBy="problem-title" lazy>
      <SectionHeading
        id="problem-title"
        index="03"
        eyebrow="Sound familiar?"
        title={
          <>
            Posting more won&apos;t fix it. <span className="accent-serif">A system will.</span>
          </>
        }
      />
      <div className="mt-16 divide-y divide-border border-y border-border">
        {painPoints.map((p) => (
          <article key={p.tag} className="reveal grid gap-6 py-9 md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
            <p className="label-mono pt-1 text-accent">{p.tag}</p>
            <div>
              <p className="label-mono mb-2 text-muted">Now</p>
              <p className="text-xl leading-snug text-muted">{p.pain}</p>
            </div>
            <div>
              <p className="label-mono mb-2 text-accent">With Workolo</p>
              <p className="flex gap-3 text-xl leading-snug">
                <Check className="mt-1.5 size-5 shrink-0 text-accent" aria-hidden />
                <span>{p.outcome}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- 04 */
/** The signature visual: a month where only 1–2 days belong to the client. */
function MonthCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const yours = new Map(month.yourDays.map((d) => [d.day, d.label] as const));
  return (
    <figure className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-lg sm:p-7">
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span className="label-mono text-muted">An example month</span>
        <span className="flex flex-wrap items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-[rgb(var(--glow))]" aria-hidden /> Your filming days
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm border-2 border-[rgb(var(--glow))]" aria-hidden /> Strategy call
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm border border-border-strong bg-surface-2" aria-hidden /> Workolo at work
          </span>
        </span>
      </figcaption>
      <ol className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-2" aria-label="Example month: 2 filming days and 1 strategy call are yours; the rest is handled by Workolo">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <li key={`h${i}`} aria-hidden className="label-mono pb-1 text-center text-muted">
            {d}
          </li>
        ))}
        {days.map((d) => {
          const film = yours.get(d);
          const call = month.callDay.day === d;
          return (
            <li
              key={d}
              aria-label={film ? `Day ${d}: ${film}` : call ? `Day ${d}: ${month.callDay.label}` : undefined}
              aria-hidden={!film && !call ? true : undefined}
              className={cn(
                "relative flex aspect-square flex-col justify-between rounded-lg p-1.5 text-[0.7rem] sm:rounded-xl sm:p-2 sm:text-xs",
                film && "bg-[rgb(var(--glow))] font-semibold text-ink shadow-[0_10px_30px_-10px_rgb(var(--glow)/0.9)]",
                call && "border-2 border-[rgb(var(--glow))] font-semibold",
                !film && !call && "bg-surface-2 text-muted",
              )}
            >
              <span className="font-mono tabular-nums">{d}</span>
              {!film && !call && <span aria-hidden className="h-1 w-3/5 rounded-full bg-[rgb(var(--glow)/0.35)]" />}
              {film && <span className="hidden text-[0.62rem] leading-tight sm:block">You film</span>}
              {call && <span className="hidden text-[0.62rem] leading-tight sm:block">Call</span>}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

export function HowItWorks() {
  return (
    <Section id="how-it-works" labelledBy="how-title" className="border-t border-border" lazy>
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
        <div>
          <SectionHeading
            id="how-title"
            index="04"
            eyebrow="How it works"
            align="left"
            title={
              <>
                Your part: <span className="accent-serif whitespace-nowrap">1–2 days</span> a month.
              </>
            }
            lead="Plus a monthly strategy call and quick approvals, so everything stays in your voice. The other days, the system runs without you."
          />
          <ul className="mt-9 space-y-3">
            {month.weDo.map((w) => (
              <li key={w} className="flex items-center gap-3 text-lg">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[rgb(var(--glow)/0.16)] text-accent">
                  <Check className="size-3.5" aria-hidden />
                </span>
                {w}
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal">
          <MonthCalendar />
        </div>
      </div>

      <ol className="mt-20 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border md:grid-cols-4">
        {processSteps.map((s, i) => {
          const yours = i === 2;
          return (
            <li key={s.title} className={cn("reveal relative p-7", yours ? "bg-[rgb(var(--glow)/0.1)]" : "bg-surface")}>
              <p className="label-mono flex items-center justify-between text-muted">
                <span className="text-accent">Step 0{i + 1}</span>
                {yours && <span className="text-accent">Your part</span>}
              </p>
              <h3 className="mt-6 text-3xl">{s.title}</h3>
              {/* On the lime-tinted "your part" card, muted grey falls below 4.5:1, so use full text colour */}
              <p className={cn("mt-3 text-sm leading-relaxed", yours ? "text-text" : "text-muted")}>{s.body}</p>
            </li>
          );
        })}
      </ol>
      <div className="mt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
        <p className="text-muted">It all starts with one 30-minute conversation.</p>
        <CtaLink location="how_it_works" size="md">
          Book your discovery call <ArrowRight />
        </CtaLink>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- 05 */
export function Founder() {
  return (
    <Section id="about" labelledBy="founder-title" className="tone-flip" lazy>
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <Tilt max={4} className="mx-auto w-full max-w-sm rounded-[2rem]">
          <Image
            src={founder.photo}
            alt={founder.photoAlt}
            width={1080}
            height={1080}
            sizes="(min-width: 640px) 384px, 100vw"
            className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-lg"
          />
          <div className="absolute -left-4 top-8 rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg sm:-left-8">
            <p className="label-mono text-muted">{founder.facts[0].label}</p>
            <p className="mt-0.5 font-display text-2xl">{founder.facts[0].value}</p>
          </div>
          <div className="absolute -right-4 bottom-24 rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg sm:-right-8">
            <p className="flex items-center gap-1.5 font-semibold">
              <Stars className="[&_svg]:size-3.5" /> {reviewSummary.rating}
            </p>
            <p className="text-xs text-muted">{reviewSummary.count} client reviews</p>
          </div>
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/65 px-4 py-3 text-white">
            <p className="font-semibold">
              {founder.name} <span className="font-normal text-white/80">· Founder, Workolo</span>
            </p>
            <p className="text-sm text-white/80">{founder.facts[1].value}</p>
          </div>
        </Tilt>

        <div>
          <p className="label-mono flex items-center gap-3 text-muted">
            <span className="text-accent">05</span>
            <span aria-hidden className="h-px w-8 bg-border-strong" />
            Who you&apos;ll work with
          </p>
          <h2 id="founder-title" className="mt-5 text-4xl">
            Hi, I&apos;m <span className="accent-serif">{founder.name}.</span>
          </h2>
          <p className="mt-6 text-2xl leading-snug">{founder.heading}</p>
          <div className="mt-6 space-y-4 leading-relaxed text-muted">
            {founder.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <blockquote className="mt-10 border-l-2 border-[rgb(var(--glow))] pl-6">
            <p className="font-display text-3xl italic leading-tight">&ldquo;{founder.close}&rdquo;</p>
          </blockquote>
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- 06 */
export function Pricing() {
  return (
    <Section id="pricing" labelledBy="pricing-title" lazy>
      <SectionHeading
        id="pricing-title"
        index="06"
        eyebrow="Packages"
        title={
          <>
            Pick your <span className="accent-serif">pace.</span>
          </>
        }
        lead="Same system, different volume. Not sure which fits? That's exactly what the discovery call is for."
      />

      <div className="mt-16 grid items-stretch gap-5 lg:grid-cols-3">
        {plans.map((p) => (
          <Tilt
            key={p.id}
            max={4}
            className={cn(
              "flex flex-col rounded-[var(--radius-xl)] border p-8",
              p.featured
                ? "tone-flip border-transparent shadow-[0_40px_80px_-30px_rgb(var(--glow)/0.55)] lg:-my-4 lg:py-12"
                : "border-border bg-surface",
            )}
          >
            <article aria-labelledby={`plan-${p.id}`} className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <h3 id={`plan-${p.id}`} className="text-3xl">
                  {p.name}
                </h3>
                {p.featured && <span className="label-mono rounded-full bg-[rgb(var(--glow))] px-3 py-1 text-ink">Best value</span>}
              </div>
              <p className="label-mono mt-2 text-muted">{p.volume}</p>
              <p className="mt-8 flex flex-wrap items-baseline gap-x-2">
                {SHOW_COMPARE_PRICES && <s className="text-lg text-muted">{formatUsd(p.compareAt)}</s>}
                <span className="font-display text-[clamp(2.75rem,2rem+2.4vw,4rem)] leading-none tabular-nums tracking-tight">{formatUsd(p.price)}</span>
                <span className="whitespace-nowrap text-sm text-muted">/ month</span>
              </p>
              <ul className="mt-8 flex-1 space-y-3 border-t border-border pt-7 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <CtaLink location={`pricing_${p.id}`} variant={p.featured ? "primary" : "secondary"} className="mt-9 w-full">
                Talk about {p.name} <ArrowRight />
              </CtaLink>
            </article>
          </Tilt>
        ))}
      </div>

      <div className="mt-16 border-t border-border pt-10">
        <p className="label-mono text-center text-muted">In every plan</p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
          {included.map((f) => {
            const Icon = ICONS[f.icon];
            return (
              <li key={f.title} className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm" title={f.body}>
                <Icon className="size-4 text-accent" aria-hidden />
                {f.title}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- close */
export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="cv-auto px-4 py-24 sm:px-6 sm:py-32">
      <div className="tone-flip relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-14 sm:py-24">
        <div aria-hidden className="hero-backdrop absolute inset-0 opacity-80" />
        <div className="relative">
          <p className="label-mono text-muted">One call. Thirty minutes. A straight answer.</p>
          <h2 id="final-title" className="mx-auto mt-6 max-w-4xl text-5xl">
            Your expertise deserves <span className="accent-serif">an audience that buys.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-lg text-muted">
            We&apos;ll look at your account and your offer, and tell you honestly whether the content system fits your business.
          </p>
          <CtaLink location="final_band" size="lg" className="mt-10 w-full sm:w-auto">
            Book your discovery call <ArrowRight />
          </CtaLink>
          <p className="mt-5 flex items-center justify-center gap-2 text-sm text-muted">
            <Stars className="[&_svg]:size-3.5" /> {reviewSummary.rating} from {reviewSummary.count} client reviews
          </p>
        </div>
      </div>
    </section>
  );
}
