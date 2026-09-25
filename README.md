# Workolo — ad landing page + booking

A single-page landing site for paid traffic (Meta / Google / TikTok) whose only job is to get a
visitor to **book a 30-minute discovery call** in a built-in calendar.

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn-style components (Radix Dialog, cva)
- Booking API with swappable backends: **mock** (default), **Cal.com**, **Google Calendar**, **n8n**
- GA4 + Meta Pixel conversion events, UTM capture
- All copy comes from the live workolo.io site (snapshot in [`legacy/`](legacy/)). Nothing invented.

## Run it

```bash
npm install
cp .env.example .env.local   # optional, everything works on defaults
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
| Meeting length, working days, start times, form questions | [`lib/booking/config.ts`](lib/booking/config.ts) |
| Colors, type scale, radius, shadow, motion | [`app/globals.css`](app/globals.css) (tokens) |
| Social links | `site.socials` in `lib/content.ts` |

## Booking system

```
Browser ── lib/booking/client.ts ──▶  /api/services
                                      /api/availability
                                      /api/bookings
                                            │  zod validation, error codes, rate limit
                                            ▼
                                 lib/booking/adapters/index.ts  ◀── BOOKING_ADAPTER
                                  ├── mock.ts    in-memory, realistic fake availability
                                  ├── calcom.ts  Cal.com API v2
                                  ├── google.ts  Google Calendar (service account, freeBusy)
                                  └── n8n.ts     your n8n webhooks
```

### Endpoints

| Method & path | Returns |
| --- | --- |
| `GET /api/services` | `{ services: [{ id, name, durationMin, description }] }` |
| `GET /api/availability?serviceId=&tz=&date=YYYY-MM-DD` | `{ date, tz, slots: [{ start }], nextAvailable }`. `nextAvailable` is set when the day is empty |
| `GET /api/availability?serviceId=&tz=&month=YYYY-MM` | `{ month, tz, days: ["YYYY-MM-DD", …] }` (days with ≥1 slot, for the calendar) |
| `GET /api/availability?serviceId=&tz=&next=3` | `{ tz, slots }` (next N open slots, used by the hero card) |
| `POST /api/bookings` | `201 { booking: { id, start, end, tz, name, email, rescheduleUrl, cancelUrl, provider } }` |
| `POST /api/bookings/:id/cancel` | `{ cancelled: { id, start } }`. Body `{ email, reason? }`; the email must match the booking |

`POST /api/bookings` body: `{ serviceId, start, tz, name, email, phone?, note, instagram, outcome, budget, timeline?, smsConsent, termsAccepted, rescheduleId?, utm? }`.
`start` is an ISO instant; `phone` is E.164 (the form builds it from the country picker).

Errors are always `{ error: { code, message, fieldErrors? } }`:

| Code | HTTP | When |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400 | zod rejected the input (`fieldErrors` maps field → messages) |
| `SERVICE_NOT_FOUND` | 404 | unknown `serviceId` |
| `BOOKING_NOT_FOUND` | 404 | reschedule/cancel id unknown, or the email doesn't match (never says which) |
| `ALREADY_CANCELLED` | 409 | cancelling (or rescheduling) a booking that was already cancelled |
| `SLOT_UNAVAILABLE` | 409 | slot taken, overlapping, or not on the schedule (double-booking guard) |
| `RATE_LIMITED` | 429 | >5 booking attempts per IP per minute |
| `UPSTREAM_ERROR` | 502 | calendar provider failed or timed out (10 s) |
| `NOT_CONFIGURED` | 503 | production has no booking backend (see `/api/health`) |

### Switching the booking backend

Set that adapter's variables (see [`.env.example`](.env.example)), then **redeploy** (Vercel only reads env vars when it builds).

How the backend is chosen:
1. `BOOKING_ADAPTER`, if set
2. otherwise **Cal.com automatically** when `CALCOM_API_KEY` and `CALCOM_EVENT_TYPE_ID` are both set
3. otherwise the mock, **except in Vercel production**, where the site shows "email us" instead of a demo calendar that would silently lose real bookings

**Check what's live:** open `/api/health`. It shows the active backend, why it was chosen, which variables are present (true/false only, never values), and when the deployment was built.

- **`mock`** (default). Uses the real schedule rules from the old booking page (Mon–Sat, 6:30–9:00 PM Asia/Karachi, 30 min) and marks ~35% of slots and ~1 in 8 days as taken so every UI state shows up. Bookings live in memory: fine for previews, **not for production** (serverless instances don't share memory).
- **`calcom`**. Create a 30-min event type, copy its numeric id to `CALCOM_EVENT_TYPE_ID`, create an API key. Cal.com owns availability, confirmation emails and conflict checks. Add a "notes" booking question to receive the qualifying answers.
- **`google`**. Create a Google Cloud service account, share the calendar with it ("Make changes to events"), set the three `GOOGLE_*` vars. Slots come from `lib/booking/config.ts` minus busy time; bookings are inserted as events. A post-insert check backs out the later of two racing bookings. Service accounts can't email invites without domain-wide delegation, so the attendee's details go into the event description.
- **`n8n`**. `N8N_BOOKING_WEBHOOK_URL` receives `{ event, booking, answers, utm }`; reply `2xx { id?, rescheduleUrl? }` or `409` if the slot is gone. Cancellations arrive on the same webhook as `{ event: "booking.cancelled", booking: { id, email }, reason }`. Your workflow must check the email matches, then reply `2xx`, `404` (no match) or `409` (already cancelled). Optional `N8N_AVAILABILITY_WEBHOOK_URL` gets `?serviceId&from&to` and returns `{ busy: [{ start, end }] }`.

To add a backend, implement `BookingAdapter` in [`lib/booking/adapters/types.ts`](lib/booking/adapters/types.ts) and register it in `adapters/index.ts`.

## Tracking

Set `NEXT_PUBLIC_GA4_ID` and/or `NEXT_PUBLIC_META_PIXEL_ID`. Each event goes to `dataLayer` (GTM), `gtag` and `fbq`:

| Event | Fires when | Meta standard event |
| --- | --- | --- |
| `cta_click` | any "Book a call" button (`location` param says which) | |
| `booking_started` | first interaction with the booking flow (once per page view) | `Lead` |
| `slot_selected` | a time is picked (calendar or hero card) | |
| `booking_completed` | booking confirmed | `Schedule` |
| `booking_cancelled` | attendee cancels (`via`: `confirmation` or `link`) | |

**Cancelling:** the confirmation screen has a **Cancel booking** button. Every calendar invite (Google, Outlook, .ics) also carries a cancel link (`/?cancel=<id>#book`), which asks for the booking email before cancelling. With Cal.com, the slot is released and Cal.com emails the cancellation to host and attendee.

UTM / `gclid` / `fbclid` / `ttclid` params are captured on landing, attached to every event, and saved with the booking.
If you run EU traffic, add a consent banner (Consent Mode v2) before enabling the tags.

## Project layout

```
app/                 page, layout (fonts, metadata, JSON-LD, tags), API routes, OG image, icon, privacy, terms
components/ui/       Button, Card, Badge, Input/Select/Textarea/Field, Accordion, Dialog (Modal), Toast
components/booking/  provider, calendar, time slots, details form, confirmation, time-zone picker, hero slots card
components/site/     header, hero, sections, FAQ, footer, sticky mobile CTA
lib/                 content, analytics, booking (schema, schedule, tz, adapters)
docs/                audit, design system, requirements checklist
legacy/              the original workolo.io pages, for reference
```

See [`docs/AUDIT.md`](docs/AUDIT.md), [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) and [`docs/CHECKLIST.md`](docs/CHECKLIST.md).
