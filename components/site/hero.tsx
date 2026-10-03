import { ArrowRight, Star } from "lucide-react";
import { ctaLabel, hero, reviewSummary, vslEmbedUrl } from "@/lib/content";
import { CtaLink } from "./cta-link";
import { RotatingWord } from "./rotating-word";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Soft brand glow behind the headline — the one atmospheric touch on the flat black hero. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-4xl rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28 lg:pb-28 lg:pt-32">
        {/* Fixed prefix, then a rotating role. Uses the full width on phones so
            the long line wraps tighter (fewer lines), and balances to two lines
            from tablet up. Sized by clamp so it never overflows any screen. */}
        <h1
          id="hero-title"
          className="rise-in text-balance text-[clamp(1.55rem,5vw,2.6rem)] font-black uppercase leading-[1.08] tracking-[-0.02em] sm:max-w-3xl sm:leading-[1.04] lg:max-w-5xl"
          style={{ animationDelay: "0ms" }}
        >
          <span className="block">{hero.headlinePrefix}</span>
          <span className="mt-2 block text-primary">
            <RotatingWord words={hero.roles} />
          </span>
        </h1>

        <p className="rise-in mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl" style={{ animationDelay: "120ms" }}>
          {hero.subhead}
        </p>

        {vslEmbedUrl && (
          <div
            className="rise-in mx-auto mt-10 aspect-video w-full max-w-3xl overflow-hidden rounded-[var(--radius-lg)] border-2 border-border-strong bg-surface shadow-lg"
            style={{ animationDelay: "160ms" }}
          >
            <iframe
              src={vslEmbedUrl}
              title="Workolo video"
              allow="encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="size-full"
            />
          </div>
        )}

        <div className="rise-in mt-10 flex flex-col items-center gap-5" style={{ animationDelay: "180ms" }}>
          <CtaLink location="hero_primary" size="lg" className="w-full sm:w-auto">
            {ctaLabel} <ArrowRight />
          </CtaLink>
          <p className="flex items-center gap-2 text-sm text-muted">
            <span className="inline-flex gap-0.5 text-star" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </span>
            {reviewSummary.rating} · {reviewSummary.count} client reviews
          </p>
        </div>
      </div>
    </section>
  );
}
