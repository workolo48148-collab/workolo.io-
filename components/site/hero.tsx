import { ArrowRight } from "lucide-react";
import { ctaLabel, hero, vslEmbedUrl } from "@/lib/content";
import { CtaLink } from "./cta-link";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-14 text-center sm:px-6 sm:pt-20 lg:pb-28 lg:pt-24">
        {/* Two lines from tablet up (each line never wraps); phones let each line wrap on its own. */}
        <h1 id="hero-title" className="text-[clamp(2.4rem,6.2vw_-_0.2rem,4.5rem)] font-medium leading-[1.02] tracking-[-0.03em]">
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
