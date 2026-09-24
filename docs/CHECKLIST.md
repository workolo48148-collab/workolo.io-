# Requirements checklist

✅ done and verified · ⚠️ done with a caveat · ❌ skipped (reason given)

## Step 1: Audit
- ✅ Content inventory, [MISSING] gaps marked, nothing invented: [`AUDIT.md`](AUDIT.md)
- ✅ Design critique, 10 areas scored 1–5
- ✅ Top 10 changes ranked by conversion impact

## Step 2: Design system
- ✅ Color tokens (bg, surface, text, muted, primary, primary-hover, accent, border, success, danger, plus input and ring), light + dark
- ✅ WCAG 2.1 AA for every pairing, enforced by `npm run check:contrast` (lowest: 4.60:1 text, 3.41:1 UI)
- ✅ One display font (Bricolage Grotesque) + one body font (Geist), fluid `clamp()` scale
- ✅ 4/8px spacing, radius, shadow and motion tokens (150/200/250 ms, ease-out)
- ✅ Button (primary/secondary/ghost, loading, disabled), Card, Badge, Input, Select, Accordion, Toast, Modal, calendar day cell, time-slot chip: [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md)
- ⚠️ "Real product UI screenshots": Workolo is a service with no product UI. The hero shows the **live booking widget** (real next-available times from the API) instead, plus the real founder photo. No stock illustrations.

## Step 3: Page structure
- ✅ Minimal sticky header: logo + "Book a call" only
- ✅ Hero: headline from the live site, one-line subhead, primary CTA → booking, secondary "See how it works", trust row (founder credentials only, because there are no real ratings, logos or client counts)
- ✅ Problem → solution: 3 pains, 3 outcomes (from the live FAQ answers)
- ✅ Services / features card grid
- ⚠️ How it works: **4** steps, not 3, because the real process has 4 (Research, Script, Film & edit, Upload). It ends in a "Book a call" band.
- ⚠️ Proof: section is built but **hidden until real content exists** (all 14 slots on the old site were placeholders). Add items to `testimonials` / `results` in `lib/content.ts`.
- ✅ Booking section · ✅ FAQ (price, time, results, "what happens on the call") · ⚠️ cancellation / minimum term answer **[MISSING]**, needs Workolo's actual terms
- ✅ Final CTA band + compact footer (email, privacy, terms). ⚠️ Socials **[MISSING]**, the footer shows them once added.
- ✅ Sticky mobile "Book now" bar after the hero scrolls out (hidden while the booking section is on screen)
- ➕ Added: pricing section (real content from the old site; answers the price objection). "50% OFF" strike-through hidden by default (`SHOW_COMPARE_PRICES`) because an unsubstantiated reference price is an FTC / Meta / Google ad-policy risk.

## Step 4: Booking system
- ✅ Flow: service → date → time → details → confirm. With one service (Discovery Meeting), the service step is skipped automatically; it appears when a second service is added.
- ✅ Month calendar: past + unavailable days disabled, today marked, keyboard navigable (arrows, Home/End, PageUp/PageDown, Enter). Verified in headless Chrome.
- ✅ Visitor time zone auto-detected and shown; searchable time-zone switcher (modal)
- ✅ Slots fetched per date, grouped Morning / Afternoon / Evening in the visitor's zone, skeleton loading, empty state with "Next available" jump
- ✅ Hero shortcut: pick one of the next 3 open times and jump straight to the details step
- ✅ Form: name, email, phone with country code (defaults from time zone, sent as E.164), short note ("What do you teach or trade?"), plus the live site's qualifying questions (Instagram, 90-day outcome, budget, timeline), SMS consent, terms. Inline validation on blur, focus moves to the first error.
- ✅ Confirmation: summary, Google / Outlook links, `.ics` download, reschedule link (+ copy). Reschedule flow tested: moves the booking, frees the old slot, rejects a mismatched email.
- ✅ `GET /api/services`, `GET /api/availability`, `POST /api/bookings`
- ✅ Adapters: mock (default, realistic fake availability), Cal.com, Google Calendar, n8n, selected by `BOOKING_ADAPTER`
- ✅ zod validation on the server (same schema powers client validation), clear error codes, rate limit, honeypot
- ✅ Double-booking prevention: exact, overlapping and off-schedule starts all return `409 SLOT_UNAVAILABLE` (tested). The UI toasts, refreshes availability and keeps the form data.
- ⚠️ Cal.com / Google / n8n adapters are written against their documented APIs but **not tested against live accounts** (no credentials here). Test each once before switching production to it.
- ⚠️ Mock bookings live in memory and are not shared across serverless instances. Use a real adapter in production.
- ✅ Tracking: `cta_click`, `booking_started`, `slot_selected`, `booking_completed` → dataLayer + GA4 + Meta Pixel (plus Meta standard `Lead` / `Schedule`), with UTM / click-id attribution. Verified in the browser.

## Step 5: Quality bar
- ✅ Next.js 16 App Router, TypeScript (strict), Tailwind v4, shadcn-style components (Radix Dialog + cva), Vercel-ready
- ✅ No horizontal scroll at 360 / 768 / 1280 / 1536px, light and dark (measured)
- ⚠️ **Lighthouse** (local production build, Lighthouse 12):
  - Desktop: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**
  - Mobile: Accessibility **100**, Best Practices **100**, SEO **100**, Performance **70–84**. The test PC was under heavy load (CPU benchmark swung 1137–1490 between runs). The limiting metric is simulated LCP (~3.4 s), which Lighthouse models as waiting on the ~140 KB React/Next framework JS. Done so far: zod → zod/mini (details chunk 397 KB → 70 KB), booking steps and modal lazy-loaded, JS-free FAQ, no blur/mask layers. **Measure on the Vercel deploy with PageSpeed Insights.** If it still isn't ≥ 90, the next step is rendering the hero booking card as a server component and hydrating it on interaction.
- ✅ Images via `next/image` (AVIF/WebP); display font preloaded via `next/font`
- ✅ Landmarks (header / main / footer / sections labelled), skip link, visible focus rings, labels on every input, `aria-live` for slot loading, errors and booking results, `prefers-reduced-motion` respected
- ✅ Title, meta description, canonical, Open Graph image (generated, includes the founder photo), Twitter card, JSON-LD (Organization + Service with the 3 offers), robots.txt, sitemap.xml

## Things only Workolo can provide
1. Real proof: client results, DM/lead screenshots, testimonials (and permission to use them)
2. The VSL embed URL
3. Cancellation / minimum-commitment terms (FAQ + Terms page)
4. Social profile URLs
5. Whether the "50% OFF" pricing is a real, time-bound discount
6. GA4 / Meta Pixel IDs and the booking backend credentials
7. Legal review of the Privacy and Terms pages (they describe exactly what the code does, but aren't legal advice)
8. The ad copy, so the hero headline can be matched per campaign
