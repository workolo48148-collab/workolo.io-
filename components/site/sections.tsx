import { ArrowRight, BarChart3, Check, Film, MessageCircle, PenLine, Search, Upload } from "lucide-react";
import Image from "next/image";
import { audienceIntro, audiences, ctaLabel, founder, included, plans, processSteps, reviewSummary, SHOW_COMPARE_PRICES } from "@/lib/content";
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

/* ----------------------------------------------------------------- who is this for */
export function Audience() {
  return (
    <Section id="who" labelledBy="audience-title">
      <SectionHeading id="audience-title" title="WHO IS THIS FOR?" lead={audienceIntro} />
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {audiences.map((a) => (
          <li key={a.title} className="h-full rounded-[var(--radius-lg)] border border-border bg-surface p-6">
            <h3 className="text-xl">{a.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{a.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ----------------------------------------------------------------- wall of proof */
export function Proof() {
  return (
    <Section id="reviews" labelledBy="proof-title" className="tone-flip">
      <SectionHeading id="proof-title" title="Wall of proof" />
      <div className="mt-12">
        <ProofWall />
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- how we work together */
export function HowItWorks() {
  return (
    <Section id="how-it-works" labelledBy="how-title" className="border-t border-border" lazy>
      <SectionHeading id="how-title" title="HOW WE WORK TOGETHER" />

      <ol className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border md:grid-cols-4">
        {processSteps.map((s, i) => {
          const yours = i === 2;
          return (
            <li key={s.title} className={cn("relative p-7", yours ? "bg-[rgb(var(--glow)/0.1)]" : "bg-surface")}>
              <p className="label-mono flex items-center justify-between text-muted">
                <span className="text-accent">Step 0{i + 1}</span>
                {yours && <span className="text-accent">Your part</span>}
              </p>
              <h3 className="mt-6 text-3xl">{s.title}</h3>
              {/* On the blue-tinted "your part" card, use full text colour for contrast */}
              <p className={cn("mt-3 text-sm leading-relaxed", yours ? "text-text" : "text-muted")}>{s.body}</p>
            </li>
          );
        })}
      </ol>
      <div className="mt-10 flex justify-center">
        <CtaLink location="how_it_works" size="lg" className="w-full sm:w-auto">
          {ctaLabel} <ArrowRight />
        </CtaLink>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- about me */
export function Founder() {
  return (
    <Section id="about" labelledBy="founder-title" className="tone-flip" lazy>
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="relative mx-auto w-full max-w-sm rounded-[2rem]">
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
        </div>

        <div>
          <p className="label-mono text-muted">Who you&apos;ll work with</p>
          <h2 id="founder-title" className="mt-5 text-4xl">
            Hi, I&apos;m <span className="accent-serif">{founder.name}.</span>
          </h2>
          <p className="mt-6 text-2xl leading-snug">{founder.heading}</p>
          <div className="mt-6 space-y-4 leading-relaxed text-muted">
            {founder.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <blockquote className="mt-10 border-l-2 border-accent pl-6">
            <p className="font-display text-3xl italic leading-tight">&ldquo;{founder.close}&rdquo;</p>
          </blockquote>
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- pricing */
export function Pricing() {
  return (
    <Section id="pricing" labelledBy="pricing-title" className="border-t border-border" lazy>
      <SectionHeading
        id="pricing-title"
        title="Content Strategy Management Packages"
        lead="Same system, different volume. Not sure which fits? That's exactly what the discovery call is for."
      />

      <div className="mt-16 grid items-stretch gap-5 lg:grid-cols-3">
        {plans.map((p) => (
          <div key={p.id} className="flex flex-col rounded-[var(--radius-xl)] border border-border bg-surface p-8">
            <article aria-labelledby={`plan-${p.id}`} className="flex h-full flex-col">
              <h3 id={`plan-${p.id}`} className="text-3xl">
                {p.name}
              </h3>
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
              <CtaLink location={`pricing_${p.id}`} className="mt-9 w-full">
                {ctaLabel} <ArrowRight />
              </CtaLink>
            </article>
          </div>
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
