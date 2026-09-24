# Audit of the original workolo.io (Step 1)

Audited September 24, 2026 at 375×812 (mobile) and desktop. The original pages are preserved in [`legacy/`](../legacy/).

## 1. Content inventory

| Item | Content |
| --- | --- |
| Brand | Workolo (workolo.io) |
| Page title | "Content Systems for Finance Gurus \| Workolo" |
| Headline | "Land retainer clients as a busy finance guru" |
| Subhead | "Done for you social media marketing service. A full content system." |
| Audience | Finance experts: trading education, investing, wealth coaching, financial planning; Instagram; new & established accounts |
| Process | 1 Research · 2 Script (a month at a time) · 3 Film (client) & edit (Workolo) · 4 Upload with CTAs to DMs & calendar |
| Client effort | A few hours, 1–2 days a month to film · monthly strategy/review call · quick approvals |
| Method | Find "outliers" (5× normal reach) and double down · track leads & calls, not vanity metrics · "months, not weeks" |
| Founder | Salman · 5+ years finance & trading · copywriter & strategist · bio + one photo (1080×1080) |
| Pricing | Silver 10 shorts $1,299/mo · Gold 15 shorts $1,499/mo ("Best value") · Diamond 30 shorts $2,499/mo, each shown "50% OFF" a crossed-out price ($2,598 / $2,998 / $4,998) |
| Plan features | All: onboarding/review calls, research, scripting, editing, uploading, monthly reports · Gold adds sales-focused IG stories · Diamond adds stories, priority weekday email support, bonus profile optimization checklist |
| FAQ | Works in my niche? · How much work for me? · Tried posting, why different? · Followers or clients? |
| Booking | "Discovery Meeting", 30 min, Mon–Sat, start times 6:30, 6:45, 7:45, 8:00, 8:15, 8:30, 8:45, 9:00 PM. Qualifying questions: IG handle/socials, business, timeline, 90-day outcome, monthly budget, email, phone, SMS consent, terms. **Not connected to a calendar; opens a pre-filled email.** |
| Contact | hello@workolo.io |
| Disclaimer | "We create marketing content. We don't give financial advice, and we don't promise trading or investment results." |
| **[MISSING]** | Client result screenshots (8 placeholder tiles) · lead/DM screenshots (6 placeholders) · VSL ("Add your VSL here") · testimonials · client count · ratings · logos · case studies · socials · privacy policy & terms (linked but dead) · cancellation / minimum term · guarantee · ad copy · OG image · analytics |

## 2. Design critique (1–5)

| Area | Score | Why |
| --- | --- | --- |
| Visual hierarchy | 3 | Strong H1, but every heading is all-caps 800 weight; 8 identical "Book a call" buttons compete |
| Above-the-fold clarity | 2 | Mobile fold is mostly an empty VSL box showing dev instructions; no proof or "who it's for" above the fold |
| CTA visibility | 3 | Big gold button but ~600px down on mobile, no sticky CTA, and it leaves the page |
| Typography | 2 | One font in 6 weights, all-caps headlines, 4-line mobile H1 |
| Spacing | 3 | Generous but uniform; ~9,800px mobile page, much of it placeholders |
| Color contrast | 4 | Body text passes (~18:1, muted ~7:1); disabled calendar days nearly invisible |
| Mobile layout | 3 | No horizontal scroll, stacks cleanly, but long and placeholder-heavy |
| Load speed | 3 | No JS, but the founder photo is base64-inlined (186KB uncacheable HTML) + 6 font weights |
| Trust signals | 1 | All 14 proof slots empty; no testimonials, socials, or privacy/terms; booking page says it "isn't wired to a live calendar yet" |
| Ad-to-page match | 3 | Tightly niched headline; ad copy unknown; no per-campaign variation |

Also: no `<main>`/`<header>` landmarks, no JSON-LD, no OG image, no GA4/Pixel.

## 3. Top 10 changes by expected conversion impact (all implemented unless noted)

1. On-page booking with real availability (no page hop, no mailto fallback) ✅
2. Remove every placeholder; proof sections render only with real content ✅
3. Mobile fold = headline + subhead + CTA + trust line ✅ (CTA bottom at 509px on a 360px phone, was ~660px)
4. Lead with real trust: founder, process transparency, effort split, disclaimer ✅
5. Sticky header CTA + sticky mobile "Book now" bar ✅
6. Conversion tracking (GA4 + Meta Pixel) with UTM capture ✅
7. Hide unsubstantiated "50% OFF" reference prices (FTC / ad-policy risk) ✅, reversible with one flag
8. Objection-handling FAQ: price, time, results ✅; cancellation **[MISSING]**, needs Workolo's terms
9. Sentence-case type, display + body pairing, one primary CTA per view ✅
10. Performance / SEO / legal: `next/image`, OG image, JSON-LD, landmarks, privacy & terms pages ✅
