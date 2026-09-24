import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import { NextSlotsCard } from "@/components/booking/next-slots-card";
import { founder, hero, reviewSummary } from "@/lib/content";
import { CtaLink } from "./cta-link";
import { Stars } from "./proof-wall";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="hero-backdrop absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:pb-28 lg:pt-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted sm:text-sm">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="mt-6 text-[2.6rem] font-semibold leading-[1.02] sm:text-5xl lg:text-[4.1rem]">
            Land retainer clients as a busy <span className="accent-serif whitespace-nowrap pr-1">finance guru.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{hero.subhead}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink location="hero_primary" size="lg" className="w-full sm:w-auto">
              {hero.primaryCta} <ArrowRight />
            </CtaLink>
            <CtaLink href="#how-it-works" location="hero_secondary" variant="secondary" size="lg" className="w-full sm:w-auto">
              {hero.secondaryCta} <ArrowDown />
            </CtaLink>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-border pt-6">
            <div className="flex items-center gap-3">
              <Image src={founder.photo} alt="" width={44} height={44} priority className="size-11 rounded-full object-cover ring-2 ring-[rgb(var(--glow)/0.5)]" />
              <p className="text-sm leading-snug">
                <span className="font-semibold">{founder.name}, founder</span>
                <span className="block text-muted">5+ yrs finance &amp; trading · copywriter</span>
              </p>
            </div>
            <a href="#reviews" className="group flex items-center gap-3 rounded-lg text-sm">
              <span aria-hidden className="hidden h-8 w-px bg-border sm:block" />
              <span className="leading-snug">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Stars className="[&_svg]:size-3.5" /> {reviewSummary.rating}
                </span>
                <span className="text-muted underline-offset-2 group-hover:underline">from {reviewSummary.count} client reviews</span>
              </span>
            </a>
          </div>
        </div>

        <div className="lg:pl-4">
          <NextSlotsCard />
        </div>
      </div>
    </section>
  );
}
