import { ArrowDown, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { NextSlotsCard } from "@/components/booking/next-slots-card";
import { founder, hero } from "@/lib/content";
import { CtaLink } from "./cta-link";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="hero-backdrop absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:pb-24 lg:pt-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted sm:text-sm">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="mt-5 text-[2.5rem] font-semibold leading-[1.02] sm:text-5xl">
            Land retainer clients <span className="text-muted">as a busy</span> <span className="whitespace-nowrap">finance guru.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">{hero.subhead}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <CtaLink location="hero_primary" size="lg" className="w-full sm:w-auto">
              {hero.primaryCta} <ArrowRight />
            </CtaLink>
            <CtaLink href="#how-it-works" location="hero_secondary" variant="secondary" size="lg" className="w-full sm:w-auto">
              {hero.secondaryCta} <ArrowDown />
            </CtaLink>
          </div>

          <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
            <Image
              src={founder.photo}
              alt=""
              width={40}
              height={40}
              priority
              className="size-10 rounded-full object-cover ring-2 ring-surface"
            />
            <p className="text-sm leading-snug text-muted">
              <span className="font-semibold text-text">Built by {founder.name}</span>: 5+ years in finance &amp; trading, copywriter &amp; strategist.
            </p>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {["New & established accounts", "You film, we do the rest", "30-min discovery call"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="size-4 text-success" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:pl-4">
          <NextSlotsCard />
        </div>
      </div>
    </section>
  );
}
