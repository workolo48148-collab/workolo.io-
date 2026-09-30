import { ArrowRight, Star } from "lucide-react";
import { ctaLabel, hero, reviewSummary, vslEmbedUrl } from "@/lib/content";
import { CtaLink } from "./cta-link";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Soft brand glow behind the headline — the one atmospheric touch on the flat black hero. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-4xl rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24 lg:pb-28 lg:pt-28">
        <p className="label-mono rise-in mb-6 inline-flex items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-accent" style={{ animationDelay: "0ms" }}>
          Done-for-you content · Finance experts
        </p>

        {/* Two lines from tablet up (each line never wraps); phones let each line wrap on its own. */}
        <h1
          id="hero-title"
          className="rise-in text-[clamp(2.6rem,7vw_-_0.2rem,5.25rem)] font-black uppercase leading-[0.95] tracking-[-0.035em]"
          style={{ animationDelay: "60ms" }}
        >
          {hero.headline.lines.map((line, i) => {
            const [before, after] = line.split(hero.headline.highlight);
            return (
              <span key={line} className="block sm:whitespace-nowrap">
                {i > 0 && " "}
                {after === undefined ? (
                  line
                ) : (
                  <>
                    {before}
                    <span className="text-primary">{hero.headline.highlight}</span>
                    {after}
                  </>
                )}
              </span>
            );
          })}
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
              allowFullScreen
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
