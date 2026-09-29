# Workolo — ad landing page + Cal.com booking

A single-page landing site for paid traffic (Meta / Google / TikTok) whose only job is to get a
visitor to **book a 30-minute discovery call** in the embedded Cal.com calendar.

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn-style components (Radix Dialog, cva)
- Bookings via the Cal.com inline embed (`@calcom/embed-react`): no backend, no API key
- GA4 + Meta Pixel conversion events, UTM capture
- All copy comes from the live workolo.io site (snapshot in [`legacy/`](legacy/)). Nothing invented.

## Run it

```bash
npm install
cp .env.example .env.local   # optional: only site URL and tracking ids
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build && npm start` | Production build / server |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm run check:contrast` | Verifies every color-token pairing against WCAG 2.1 AA |

Deploy: push to GitHub → import in Vercel → set env vars → done.

## Where to edit things

| You want to change… | Edit |
| --- | --- |
| Any text, prices, FAQ, founder bio | [`lib/content.ts`](lib/content.ts) |
| Add or remove review / DM screenshots | drop the image in `public/proof/…`, add an entry to `reviews` or `dms` in `lib/content.ts` (width, height, title, alt text) |
| Add the VSL | `vslEmbedUrl` in `lib/content.ts` |
| Show the "50% OFF" strike-through prices | `SHOW_COMPARE_PRICES` in `lib/content.ts` (off by default, see audit) |
| Which Cal.com event people book | `booking.calLink` in `lib/content.ts`; length, hours, form questions live in Cal.com |
| Colors, type scale, radius, shadow, motion | [`app/globals.css`](app/globals.css) (tokens) |
| Social links | `site.socials` in `lib/content.ts` |

## Booking

The calendar is the official **Cal.com inline embed** ([`components/site/cal-booking.tsx`](components/site/cal-booking.tsx)).
There is no booking backend, API key or env var: visitors book straight into the Cal.com event set in
`booking.calLink` in [`lib/content.ts`](lib/content.ts). Availability, the booking form and its questions,
confirmation / reminder emails, reschedule and cancel links are all managed in Cal.com.

`/api/health` shows which deployment is live (environment, commit, build time).
## Tracking

Set `NEXT_PUBLIC_GA4_ID` and/or `NEXT_PUBLIC_META_PIXEL_ID`. Each event goes to `dataLayer` (GTM), `gtag` and `fbq`:

| Event | Fires when | Meta standard event |
| --- | --- | --- |
| `cta_click` | any "I'm Ready To Start" button (`location` param says which) | |
| `booking_started` | the Cal.com calendar has loaded (`linkReady`, once per page view) | `Lead` |
| `booking_completed` | Cal.com confirms a booking (`bookingSuccessfulV2`) | `Schedule` |

UTM / `gclid` / `fbclid` / `ttclid` params are captured on landing and attached to every event.
If you run EU traffic, add a consent banner (Consent Mode v2) before enabling the tags.

## Project layout

```
app/                 page, layout (fonts, metadata, JSON-LD, tags), /api/health, OG image, icon, privacy, terms
components/ui/       Button, Card, Badge, Accordion
components/site/     header, hero, sections, FAQ, Cal.com booking embed, footer, sticky mobile CTA
lib/                 content, analytics, env
docs/                audit, design system, requirements checklist
legacy/              the original workolo.io pages, for reference
```

See [`docs/AUDIT.md`](docs/AUDIT.md), [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) and [`docs/CHECKLIST.md`](docs/CHECKLIST.md).
