# Design system

**Direction: "Private-bank editorial × trading terminal."** A *Financial Times* weekend magazine crossed with a
Bloomberg screen. Ink black and warm ivory, one **signal-lime** accent (a green candle on a chart), Bodoni
headlines with italic accent words, mono ticker labels, and one piece of real 3D. The proof (real screenshots),
the founder and the "1–2 days a month" promise carry the page. Decoration stays quiet so they don't have to compete.

Why this direction: the audience sells finance expertise. Editorial luxury signals "premium, considered,
trustworthy"; terminal details (ticker, mono labels, live dots) signal "this person lives in markets". The lime
accent reads as "up", and it's rare enough in the finance-coach niche that ads and page are instantly recognisable.

Source of truth: [`app/globals.css`](../app/globals.css). Tokens are CSS variables exposed to Tailwind via `@theme inline`
(`bg-surface`, `text-muted`, `border-border`, …). Light and dark follow `prefers-color-scheme`.

## Color

| Token | Light (ivory) | Dark (ink) | Use |
| --- | --- | --- | --- |
| `--bg` | `#f4f1e9` | `#0a0b0c` | page |
| `--surface` | `#fbf9f4` | `#111315` | cards, inputs |
| `--surface-2` | `#ebe6da` | `#171a1d` | muted panels |
| `--text` | `#0e0f10` | `#f2eee4` | body |
| `--muted` | `#55524a` | `#a39e92` | secondary text |
| `--primary` | `#0e0f10` | `#d7ff3a` | primary buttons, selection |
| `--primary-fg` | `#d7ff3a` | `#0a0b0c` | text on primary (lime-on-ink / ink-on-lime) |
| `--accent` | `#4a6900` | `#d7ff3a` | italic accent words, icons, links |
| `--border` / `--border-strong` | `#ddd6c7` / `#c4bba8` | `#23262a` / `#33373c` | dividers, cards |
| `--input` | `#8a8374` | `#6f737a` | form-control borders (≥3:1) |
| `--success` / `--danger` | `#3f6b00` / `#b42318` | `#a8e05f` / `#ff8a80` | confirmations / errors |
| `--star` | `#d98e04` | `#ffc53d` | rating stars (always paired with the number) |
| `--glow` | lime (RGB) | lime (RGB) | tints, marker, glows, live dots |

**`.tone-flip`** puts a section in the opposite tone (ivory inside dark mode, ink inside light mode). It's used for
the ticker, the proof wall, the founder feature, the featured plan and the final call to action, which gives the long
page an editorial rhythm.

`npm run check:contrast` checks every pairing in both modes; all pass WCAG 2.1 AA (lowest body pair 5.62:1,
lowest UI pair 3.33:1). Lighthouse's contrast audit covers tinted surfaces the token check can't.

## Type

| Role | Font | Where |
| --- | --- | --- |
| Display | **Bodoni Moda** (roman + italic) | headlines, prices, pull quotes, footer wordmark. Only used large, where its hairlines shine |
| Body | **Schibsted Grotesk** | everything readable |
| Label | **JetBrains Mono** | ticker, section numbers, small caps labels (`.label-mono`). Not preloaded |

- `.accent-serif`: italic Bodoni in the accent colour, for 1–3 words per headline.
- `.marker`: lime highlighter sweep under the hero accent. The headline itself never animates (it's the LCP element).
- Fluid scale with `clamp()` from 360px to 1440px, up to `--text-6xl` (51–120px).

## 3D and motion (performance budget first)

| Effect | How | Cost |
| --- | --- | --- |
| Hero proof stack | CSS `perspective` + `preserve-3d` layers at different `translateZ`; rig follows the pointer via `useTilt` (`components/site/tilt.tsx`) | one rAF per pointer frame, transform only |
| Tilt cards (audience, pricing, founder photo) | same hook, per element, with a pointer-following glare | transform + opacity |
| Review wall | tilts back 24° and flattens as it scrolls in (CSS `animation-timeline: view()`) | zero JS; static where unsupported |
| Section reveals | CSS scroll-driven fade-up | zero JS |
| Ticker | one CSS `translateX` loop, pauses on hover | compositor only |
| Grain | one static SVG noise tile, fixed, no blend modes | composited once |

Rules: no WebGL and no animation library. 3D engages only at ≥1024px with a fine pointer; phones get a flat
layout. Everything turns off under `prefers-reduced-motion`. Far-below-the-fold sections use
`content-visibility: auto`.

## Space, radius, shadow

- Spacing: 4px base unit; sections breathe at `py-24` / `sm:py-32`.
- Radius: `sm` 8 · `md` 12 · `lg` 18 · `xl` 28, plus `2rem`/`2.5rem` for the big feature panels.
- Shadow: `sm` hairline · `md` card · `lg` floating layer (much deeper in dark mode).

## Components

| Component | File | Notes |
| --- | --- | --- |
| Button | `components/ui/button.tsx` | `primary` (lime glow, lifts on hover) / `secondary` (outline) / `ghost`; `loading`, disabled |
| Section heading | `components/site/section-heading.tsx` | numbered mono kicker (`01 — WHO IT'S FOR`), Bodoni headline, lead |
| Tilt / useTilt | `components/site/tilt.tsx` | pointer tilt + glare; off for touch and reduced motion |
| Proof stack | `components/site/proof-stack.tsx` | hero 3D scene around the live booking card |
| Ticker | `components/site/ticker.tsx` | facts-only market tape |
| Month calendar | `components/site/sections.tsx` (`MonthCalendar`) | "your 1–2 days" visual; labelled for screen readers |
| Card, Badge, Field, Accordion, Dialog, Toast | `components/ui/*` | as before; restyled through tokens |
| Calendar day cell / time-slot chip | `components/booking/*` | WAI-ARIA grid, roving tabindex; `aria-pressed` chips |
| Proof wall + lightbox | `components/site/proof-wall.tsx`, `proof-lightbox.tsx` | all 10 screenshots visible; full-size viewer |
