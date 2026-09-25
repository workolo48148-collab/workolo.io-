import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import { founder, hero, reviewSummary } from "@/lib/content";
import { CtaLink } from "./cta-link";
import { ProofStack } from "./proof-stack";
import { Stars } from "./proof-wall";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="hero-backdrop absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10 lg:pb-24 lg:pt-20">
        <div className="relative z-10">
          <p className="enter label-mono inline-flex items-center gap-2.5 text-muted" style={{ "--d": "0ms" } as React.CSSProperties}>
            <span className="live-dot size-2 rounded-full bg-[rgb(var(--glow))]" aria-hidden />
            {hero.eyebrow}
          </p>

          {/* The headline paints immediately (it's the LCP element); only the marker animates. */}
          <h1 id="hero-title" className="mt-6 text-5xl font-medium leading-[0.98] tracking-[-0.03em]">
            Land retainer clients as a busy <span className="marker accent-serif isolate">finance guru.</span>
          </h1>

          <p className="enter mt-7 max-w-xl text-lg leading-relaxed text-muted" style={{ "--d": "120ms" } as React.CSSProperties}>
            {hero.subhead}
          </p>

          <div className="enter mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ "--d": "220ms" } as React.CSSProperties}>
            <CtaLink location="hero_primary" size="lg" className="w-full sm:w-auto">
              {hero.primaryCta} <ArrowRight />
            </CtaLink>
            <CtaLink href="#how-it-works" location="hero_secondary" variant="secondary" size="lg" className="w-full sm:w-auto">
              {hero.secondaryCta} <ArrowDown />
            </CtaLink>
          </div>
          <p className="enter mt-3 text-sm text-muted sm:pl-2" style={{ "--d": "260ms" } as React.CSSProperties}>
            {hero.primaryMicro}
          </p>

          <div className="enter mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-border pt-6" style={{ "--d": "340ms" } as React.CSSProperties}>
            <div className="flex items-center gap-3">
              <Image src={founder.photo} alt="" width={44} height={44} priority className="size-11 rounded-full object-cover ring-2 ring-[rgb(var(--glow)/0.6)]" />
              <p className="text-sm leading-snug">
                <span className="font-semibold">{founder.name}, founder</span>
                <span className="block text-muted">5+ yrs finance &amp; trading · copywriter</span>
              </p>
            </div>
            <a href="#reviews" className="group flex items-center gap-3 rounded-lg text-sm">
              <span aria-hidden className="hidden h-9 w-px bg-border sm:block" />
              <span className="leading-snug">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Stars className="[&_svg]:size-3.5" /> {reviewSummary.rating}
                </span>
                <span className="text-muted underline-offset-2 group-hover:underline">from {reviewSummary.count} client reviews</span>
              </span>
            </a>
          </div>
        </div>

        <div className="enter" style={{ "--d": "180ms" } as React.CSSProperties}>
          <ProofStack />
        </div>
      </div>
    </section>
  );
}
