# Design system

Direction: personal-brand landing page (solo-expert portfolio feel) on a restrained, premium SaaS base.
Near-black / off-white canvas, one **emerald "money green"** accent reserved for actions and highlights,
italic serif accent words inside bold sans headlines, pill buttons, generous radius, amber stars for ratings.
The proof (real screenshots) and the founder carry the page; decoration stays quiet.

Idea sources (analysed, not copied): amrafarooq.com for the founder-first structure, serif accent words,
"who it's for" grid and screenshot wall. Its countdown / "only N seats left" scarcity was deliberately left out.

Source of truth: [`app/globals.css`](../app/globals.css). Tokens are CSS variables exposed to Tailwind via `@theme inline`
(`bg-surface`, `text-muted`, `border-border`, …). Light and dark follow `prefers-color-scheme`.

## Color

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#f7f8f6` | `#060807` | page |
| `--surface` | `#ffffff` | `#0d1110` | cards, inputs |
| `--surface-2` | `#eef2ef` | `#131917` | muted panels |
| `--text` | `#0b1411` | `#f1f5f2` | body |
| `--muted` | `#4f5d57` | `#97a39d` | secondary text |
| `--primary` | `#047857` | `#34d399` | primary buttons, selection |
| `--primary-hover` | `#065f46` | `#6ee7b7` | hover |
| `--primary-fg` | `#ffffff` | `#022c1d` | text on primary |
| `--accent` | `#04704f` | `#6ee7b7` | accent text, serif accent words, icons |
| `--border` / `--border-strong` | `#e0e7e3` / `#c6d1cb` | `#1c2421` / `#2b3632` | dividers, cards |
| `--input` | `#808d86` | `#66746e` | form-control borders (≥3:1) |
| `--success` / `--success-bg` | `#15803d` / `#ecf8f0` | `#4ade80` / `#0f2418` | confirmations |
| `--danger` / `--danger-bg` | `#b42318` / `#fdf0ee` | `#ff8a80` / `#2a1311` | errors |
| `--ring` | `#047857` | `#34d399` | focus outline |
| `--star` | `#f59e0b` | `#fbbf24` | rating stars (decorative, always paired with the number) |

`npm run check:contrast` checks every pairing. All pass WCAG 2.1 AA in both modes: body text ≥ 4.5:1 (lowest: `success` on `success-bg`, light, 4.60:1) and UI ≥ 3:1 (lowest: `input` on `bg`, light, 3.25:1).

## Type

- Headings + body: **Geist** (one family, semibold headings with tight −0.035em tracking). Display accent: **Instrument Serif** italic, used only for 1–3 accent words per headline via `.accent-serif`. Both via `next/font` (self-hosted, no layout shift).
- Fluid scale with `clamp()` from 360px to 1280px: `--text-xs` 12–13px · `sm` 14–15 · `base` 16–17 · `lg` 18–20 · `xl` 20–24 · `2xl` 24–32 · `3xl` 30–42 · `4xl` 36–56 · `5xl` 40–68.
- Headings: tracking −0.025em, line-height 1.08, `text-wrap: balance`.

## Space, radius, shadow, motion

- Spacing: 4px base unit (Tailwind `--spacing: 0.25rem`), used on the 4/8 grid (`p-4` 16, `p-6` 24, `gap-2` 8 …).
- Radius: `sm` 8 · `md` 12 · `lg` 16 · `xl` 24.
- Shadow: `sm` hairline · `md` card · `lg` raised panel (darker in dark mode).
- Motion: 150 / 200 / 250 ms, `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out). All animation is disabled under `prefers-reduced-motion`.

## Components

| Component | File | Notes |
| --- | --- | --- |
| Button | `components/ui/button.tsx` | `primary` / `secondary` / `ghost`, `sm` / `md` / `lg`, `loading` (spinner + `aria-busy`), disabled |
| Card | `components/ui/card.tsx` | Card, CardHeader, CardTitle, CardContent |
| Badge | `components/ui/badge.tsx` | `neutral` / `accent` / `success` / `solid` |
| Input, Textarea, Select, Label, Field | `components/ui/field.tsx` | Field wires label, hint, error, `aria-invalid`, `aria-describedby`; Select is native (best on mobile) |
| Accordion | `components/ui/accordion.tsx` | Native `<details>`: zero JS, single-open via `name` |
| Modal (Dialog) | `components/ui/dialog.tsx` | Radix: focus trap, Esc, scroll lock; bottom sheet on mobile |
| Toast | `components/ui/toast.tsx` | `status` / `alert` live regions, auto-dismiss |
| Calendar day cell | `components/booking/calendar.tsx` | WAI-ARIA grid, roving tabindex, arrows / Home / End / PageUp / PageDown / Enter |
| Time-slot chip | `components/booking/datetime-step.tsx` | `aria-pressed`, grouped Morning / Afternoon / Evening |
| Proof wall | `components/site/proof-wall.tsx` | Tabs (reviews / DMs, arrow-key switching), masonry of real screenshots, "Show all" on mobile |
| Lightbox | `components/site/proof-lightbox.tsx` | Full-size screenshot viewer: focus trap, Esc, ←/→, counter; lazy-loaded |
