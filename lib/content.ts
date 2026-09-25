/**
 * Every word on the landing page lives here, and every claim is taken from the
 * live workolo.io site (see legacy/) or from screenshots Workolo supplied.
 * Do not add numbers, results or testimonials that aren't real.
 */

import { SITE_URL } from "./env";

export const site = {
  name: "Workolo",
  url: SITE_URL,
  email: "hello@workolo.io",
  title: "Content Systems for Finance Gurus | Workolo",
  description:
    "Land retainer clients as a busy finance guru. Done-for-you Instagram content system: we research, script, edit and upload your content every month. Book a 30-minute discovery call.",
  disclaimer:
    "We create marketing content. We don't give financial advice, and we don't promise trading or investment results.",
  /** [MISSING] Add real profile URLs to show them in the footer. */
  socials: [] as { label: string; href: string }[],
} as const;

export const hero = {
  eyebrow: "Done-for-you Instagram for finance experts",
  headline: "Land retainer clients as a busy finance guru",
  subhead:
    "You bring the expertise and 1–2 filming days a month. We research, script, edit and post the rest: content built to turn followers into booked calls, not just views.",
  primaryCta: "Book your discovery call",
  primaryMicro: "30 min · pick a time that suits you",
  secondaryCta: "See how it works",
};

/** Scrolling ticker. Every line is a fact from the live site or the review screenshots. */
export const ticker = [
  "5.0★ from every client review",
  "You film 1–2 days a month",
  "10 · 15 · 30 shorts a month",
  "Research → Script → Edit → Post",
  "Built for trading, investing & wealth educators",
  "We track leads and calls, not vanity metrics",
  "Posts carry CTAs to your DMs and your calendar",
  "30-minute discovery calls, Mon–Sat",
];

/** "Your month" visual: what a month looks like for the client vs. for Workolo (from the live FAQ). */
export const month = {
  yourDays: [
    { day: 9, label: "Filming day" },
    { day: 10, label: "Filming day" },
  ],
  callDay: { day: 2, label: "Monthly strategy call" },
  weDo: ["Research the winning formats", "Script the whole month", "Edit every video", "Post with CTAs to DMs & calendar", "Report on leads and calls"],
};

export const founder = {
  name: "Salman",
  role: "Founder",
  photo: "/images/salman.jpg",
  photoAlt: "Salman, founder of Workolo, speaking into a microphone at an event",
  facts: [
    { label: "Finance & trading", value: "5+ years" },
    { label: "Background", value: "Copywriter & strategist" },
  ],
  heading: "I don't just manage your social media. I build content that works.",
  bio: [
    "I've spent 5+ years in the finance and trading world, while also working as a copywriter focused on creating content that gets people to pay attention, trust you, and take action.",
    "That experience taught me something important: good content isn't about posting every day. It's about knowing what your audience wants to hear and turning that into content that creates business results.",
    "I understand the finance audience, the questions they have, the objections they have before buying, and the kind of content that can turn a stranger into a warm lead.",
    "I research your audience, competitors, offers, and positioning, then turn those insights into a content strategy built around attention, authority, trust, and conversion.",
  ],
  close:
    "My goal isn't to make your Instagram look busy. It's to make your content contribute to your business.",
};

/** Problem → solution pairs, taken from the live FAQ answers. */
export const painPoints = [
  {
    tag: "Guesswork",
    pain: "You've posted consistently. A few posts hit, most flop, and you have no idea why.",
    outcome:
      "We research the winning formats in your space, post to find outliers (anything that does 5× your normal reach), then double down on the winners on purpose.",
  },
  {
    tag: "Time",
    pain: "You're already slammed. Scripting, editing and posting has become a second job.",
    outcome: "You stay the expert: a few hours, 1–2 days a month, to film. Research, scripts, editing and posting are on us.",
  },
  {
    tag: "Revenue",
    pain: "Views and followers that never turn into paying clients.",
    outcome:
      "Content built to attract buyers, with calls to action that send people to your DMs and your calendar. We track leads and calls, not vanity metrics.",
  },
];

export const included = [
  { icon: "search", title: "Research", body: "We study the top finance creators and best-performing content in your niche on Instagram." },
  { icon: "pen", title: "Scripting", body: "A full month of short-form scripts, plus direction on what to film and how to batch it." },
  { icon: "film", title: "Editing", body: "You film the scripts. We edit every video." },
  { icon: "upload", title: "Uploading", body: "We post to your Instagram with calls to action that send people to your DMs and calendar." },
  { icon: "message", title: "Sales-focused stories", body: "Instagram stories built to move followers toward a conversation. Gold & Diamond." },
  { icon: "chart", title: "Reporting & review calls", body: "Onboarding and monthly strategy/review calls, plus a monthly report." },
] as const;

export const processSteps = [
  { title: "Research", body: "We find and study the top finance creators and best-performing content in your niche on Instagram." },
  { title: "Script", body: "Using the research and what we know about you and your business, we script your content for the whole month." },
  { title: "Film & edit", body: "You film the scripts. We edit the videos." },
  { title: "Upload", body: "We post on your Instagram, with calls to action that send people to your DMs and your calendar." },
];

export type Plan = {
  id: "silver" | "gold" | "diamond";
  name: string;
  volume: string;
  price: number;
  /** Strike-through price from the live site. Hidden unless SHOW_COMPARE_PRICES is true. */
  compareAt: number;
  featured?: boolean;
  features: string[];
};

/**
 * The live site shows each plan at "50% OFF" a crossed-out price. Unsubstantiated
 * reference prices are a Meta/Google ad-policy and FTC risk, so they're hidden
 * by default. Flip this only if the discount is real and time-bound.
 */
export const SHOW_COMPARE_PRICES = false;

export const plans: Plan[] = [
  {
    id: "silver",
    name: "Silver",
    volume: "10 shorts / month",
    price: 1299,
    compareAt: 2598,
    features: ["Onboarding / review calls", "Research", "Scripting", "Editing", "Uploading", "Monthly reports"],
  },
  {
    id: "gold",
    name: "Gold",
    volume: "15 shorts / month",
    price: 1499,
    compareAt: 2998,
    featured: true,
    features: [
      "Onboarding / review calls",
      "Research",
      "Scripting",
      "Editing",
      "Uploading",
      "Sales-focused Instagram stories",
      "Monthly reports",
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    volume: "30 shorts / month",
    price: 2499,
    compareAt: 4998,
    features: [
      "Onboarding / review calls",
      "Research",
      "Scripting",
      "Editing",
      "Uploading",
      "Sales-focused Instagram stories",
      "Priority weekday email support",
      "Monthly reports",
      "Bonus: profile optimization checklist",
    ],
  },
];

export type FaqItem = { q: string; a: (string | { list: string[]; ordered?: boolean; title?: string })[] };

export const faqs: FaqItem[] = [
  {
    q: "Does this actually work in my niche?",
    a: [
      "Finance is a trust game. People follow you for the edge, but they only pay you when they believe you. So the system is built around one thing: content that shows how you think and turns that into conversations with buyers.",
      "If you already have a solid offer and real expertise (trading education, investing, wealth coaching, financial planning), this will work for you too.",
    ],
  },
  {
    q: "What does it cost?",
    a: [
      "Packages start at $1,299/month for Silver (10 shorts), $1,499/month for Gold (15 shorts) and $2,499/month for Diamond (30 shorts). On the discovery call we'll tell you which one fits, or whether it's a fit at all.",
    ],
  },
  {
    q: "How much work is this for me? I'm already slammed.",
    a: [
      "You stay the expert. We become your content team.",
      { title: "Your part", list: ["A few hours, 1–2 days a month, to film", "A monthly strategy and review call", "Quick approvals so everything stays in your voice"] },
      {
        title: "Our part",
        list: [
          "Research: we study the best-performing finance content on Instagram.",
          "Scripting: a full month of short-form content, plus direction on what to film and how to batch it.",
          "Editing & uploading: we edit, post, and send you basic reporting.",
        ],
      },
    ],
  },
  {
    q: "I've already tried posting and it didn't work. Why would this be different?",
    a: [
      "Social media is just a different beast. Most finance creators have posted consistently, seen a few posts hit and most flop, and have no idea why.",
      {
        title: "What we do",
        ordered: true,
        list: [
          "Research winning formats in your space and see what already works on your account.",
          "Post to find outliers (anything that does 5× your normal reach).",
          "Double down on the winners on purpose: same angles, same topics, new variations.",
        ],
      },
    ],
  },
  {
    q: "Is this about followers or actual retainer clients?",
    a: [
      "Clients. Unless it turns into revenue, it doesn't matter. So we create content that attracts buyers, use calls to action that send people to your DMs, free resources and calendar, and track milestones around leads and calls, not vanity metrics.",
    ],
  },
  {
    q: "How long until I see results?",
    a: [
      "Building an audience that buys takes time to test, find your outliers, and scale what works. That's why we work in months, not weeks. We don't promise trading or investment results, and we don't give financial advice.",
    ],
  },
  {
    q: "What happens on the discovery call?",
    a: [
      "It's a 30-minute call to see if the content system fits your business. We'll look at your account, your offer and your goals, and tell you honestly whether we can help.",
    ],
  },
  // [MISSING] Add a cancellation / minimum-commitment answer once the terms are decided.
];

/** Who the service is for, from the live FAQ ("trading education, investing, wealth coaching, financial planning"). */
export const audiences = [
  { icon: "chart", title: "Trading educators", body: "You teach trading and want students who already trust how you think." },
  { icon: "trend", title: "Investing creators", body: "You break down markets and want your content to bring in paying clients." },
  { icon: "wallet", title: "Wealth coaches", body: "You coach people on money and want conversations with serious buyers." },
  { icon: "shield", title: "Financial planners", body: "You have real expertise and want to be seen as the obvious choice." },
] as const;

export type Screenshot = { src: string; alt: string; width: number; height: number; title: string };

/**
 * Real review screenshots supplied by Workolo (identifying details redacted by
 * Workolo). Alt text transcribes each one so screen readers and search engines
 * get the full review.
 */
export const reviews: Screenshot[] = [
  {
    src: "/proof/reviews/web3-community-builder.jpg",
    width: 1280,
    height: 708,
    title: "Community Builder",
    alt: 'Client review, 5.0 stars, May 30 to June 20, 2025, project "Community Builder": "Working with Salman has been nothing short of exceptional. He\'s multifaceted, deeply knowledgeable, and brings a strategic, no-fluff approach to Web3 community building."',
  },
  {
    src: "/proof/reviews/facebook-ads-expert.jpg",
    width: 1280,
    height: 902,
    title: "Facebook ads expert",
    alt: 'Client review, 5.0 stars, March 4 to 6, 2024, project "Facebook ads expert": "Salman is a great asset to assist us with our Facebook and Instagram ads. He is reliable, knowledgeable and always makes himself available to assist as needed. Would recommend him." Endorsed by client: Reliable.',
  },
  {
    src: "/proof/reviews/social-media-manager.jpg",
    width: 1280,
    height: 946,
    title: "Social Media Manager",
    alt: 'Client review, 5.0 stars, February 25 to March 10, 2025, project "Social Media Manager": "His work was done with a high degree of thoughtfulness. He communicated frequently and was always timely. Highly suggested." Endorsed by client: Committed to Quality, Clear Communicator, Reliable.',
  },
  {
    src: "/proof/reviews/community-manager.jpg",
    width: 1280,
    height: 810,
    title: "Community Manager",
    alt: 'Client review, 5.0 stars, April 10, 2024 to February 27, 2025, project "Experienced Community Manager": "Absolutely brilliant, multifaceted, and incredibly knowledgable. Thank you for your time, Salman :)" Endorsed by client: Committed to Quality.',
  },
  {
    src: "/proof/reviews/social-media-marketer.jpg",
    width: 1280,
    height: 1018,
    title: "Social media marketer and manager",
    alt: 'Client review, 5.0 stars, April 30 to June 14, 2024, project "Social media marketer and manager": "We had good time working together in the period of this contract and I will certainly hire him again for a new job, if the need arise." Endorsed by client: Collaborative.',
  },
  {
    src: "/proof/reviews/facebook-ads-leads.jpg",
    width: 1280,
    height: 582,
    title: "Leads from Facebook advertising",
    alt: 'Client review, 5.0 stars, March 9 to 18, 2024, project "Leads from Facebook advertising": "He has a lot of patience with difficulties."',
  },
];

/** Real Instagram DM screenshots supplied by Workolo (names redacted by Workolo). */
export const dms: Screenshot[] = [
  {
    src: "/proof/dms/call-request.jpg",
    width: 1280,
    height: 592,
    title: "Asking for a call",
    alt: 'Instagram DM: "hey for sure", then "I\'d also like to schedule a call with you to see if we allign". Reply: "What time is best for you?"',
  },
  {
    src: "/proof/dms/youtube-creator-goals.jpg",
    width: 1280,
    height: 900,
    title: "Creator sharing their goals",
    alt: 'Instagram DM from a creator: "I run a YouTube channel where I create nutrition, health and wellness content for an Indian/Hinglish-speaking audience. My main goal right now is to grow the channel and get monetized as soon as possible, while building it consistently for the long term…"',
  },
  {
    src: "/proof/dms/pricing-question-2.jpg",
    width: 1280,
    height: 994,
    title: "Pricing question",
    alt: 'Instagram DM: "What\'s your pricing?" Reply: "Before talking about pricing, we\'d like to understand your business, target audience, and goals. Share your website/Instagram or tell us your main goal in one line, and we\'ll take it from there."',
  },
  {
    src: "/proof/dms/pricing-question-1.jpg",
    width: 1280,
    height: 504,
    title: "Pricing question",
    alt: 'Instagram DM: "What\'s your pricing?" Reply: "Before talking about pricing, we\'d like to understand your business, target audience, and goals."',
  },
];

/** Derived from the screenshots above: every review is 5.0. */
export const reviewSummary = { rating: "5.0", count: reviews.length };
/** Paste a real VSL embed URL (YouTube/Vimeo/Wistia) to show the video block. */
export const vslEmbedUrl: string | null = null;
