# Design system

Direction: restrained, premium SaaS (Linear / Cal.com / Vercel). It keeps the brand's warm near-black and signal
gold from the live site. Gold is reserved for the primary action and small accents; everything else is
neutral surfaces, crisp 1px borders and one soft glow behind the hero.

Source of truth: [`app/globals.css`](../app/globals.css). Tokens are CSS variables exposed to Tailwind via `@theme inline`
(`bg-surface`, `text-muted`, `border-border`, …). Light and dark follow `prefers-color-scheme`.

## Color

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#fbfaf7` | `#0b0a09` | page |
| `--surface` | `#ffffff` | `#141210` | cards, inputs |
| `--surface-2` | `#f4f1ea` | `#1b1916` | muted panels |
| `--text` | `#17140f` | `#f5f1e8` | body |
| `--muted` | `#5e574b` | `#a69e8c` | secondary text |
| `--primary` | `#f5b942` | `#f5b942` | primary buttons, selection |
| `--primary-hover` | `#e8a92a` | `#ffc95c` | hover |
| `--primary-fg` | `#17120a` | `#17120a` | text on primary |
| `--accent` | `#8a5b00` | `#ffd98a` | accent text / icons |
| `--border` / `--border-strong` | `#e6e0d4` / `#cfc6b4` | `#2a2620` / `#40392f` | dividers, cards |
| `--input` | `#8f8777` | `#736b5d` | form-control borders (≥3:1) |
| `--success` / `--success-bg` | `#15803d` / `#ecf8f0` | `#4ade80` / `#0f2418` | confirmations |
| `--danger` / `--danger-bg` | `#b42318` / `#fdf0ee` | `#ff8a80` / `#2a1311` | errors |
| `--ring` | `#b07400` | `#f5b942` | focus outline |

`npm run check:contrast` checks every pairing. All pass WCAG 2.1 AA in both modes: body text ≥ 4.5:1 (lowest: `success` on `success-bg`, light, 4.60:1) and UI ≥ 3:1 (lowest: `input` on `bg`, light, 3.41:1).

## Type

- Display: **Bricolage Grotesque** 500/600/700 (headings, prices). Body: **Geist**. Both via `next/font` (self-hosted, no layout shift).
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
