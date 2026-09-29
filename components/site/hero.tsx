import { ArrowRight } from "lucide-react";
import { ctaLabel, hero, vslEmbedUrl } from "@/lib/content";
import { CtaLink } from "./cta-link";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-20 pt-14 text-center sm:px-6 sm:pt-20 lg:pb-28 lg:pt-24">
        <h1 id="hero-title" className="text-5xl font-medium leading-[0.98] tracking-[-0.03em]">
          {hero.headline}
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">{hero.subhead}</p>

        {vslEmbedUrl && (
          <div className="mt-10 aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface">
            <iframe
              src={vslEmbedUrl}
              title="Workolo video"
              allow="encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="size-full"
            />
          </div>
        )}

        <CtaLink location="hero_primary" size="lg" className="mt-10 w-full sm:w-auto">
          {ctaLabel} <ArrowRight />
        </CtaLink>
      </div>
    </section>
  );
}
