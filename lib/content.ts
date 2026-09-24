/**
 * Every word on the landing page lives here, and every claim is taken from the
 * live workolo.io site (see legacy/). Do not add numbers, results or
 * testimonials that aren't real. Proof sections render only when their arrays
 * below are non-empty.
 */

export const site = {
  name: "Workolo",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://workolo.io",
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
  eyebrow: "Done-for-you Instagram content for finance experts",
  headline: "Land retainer clients as a busy finance guru",
  subhead:
    "A full content system: we research, script, edit and post your short-form content every month. You film 1–2 days a month.",
  primaryCta: "Book a call",
  secondaryCta: "See how it works",
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
    pain: "You've posted consistently. A few posts hit, most flop, and you have no idea why.",
    outcome:
      "We research winning formats in your space, post to find outliers (anything that does 5× your normal reach), then double down on the winners on purpose.",
  },
  {
    pain: "You're already slammed. Scripting, editing and posting is a second job.",
    outcome:
      "You stay the expert: a few hours, 1–2 days a month, to film. We handle research, scripts, editing and uploading.",
  },
  {
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

/**
 * Proof. [MISSING] on the live site: every slot is a placeholder.
 * Add real items and the sections appear automatically; nothing ships empty.
 */
export const testimonials: { quote: string; name: string; role: string; avatar?: string }[] = [];
export const results: { src: string; alt: string; caption?: string; width: number; height: number }[] = [];
/** Paste a real VSL embed URL (YouTube/Vimeo/Wistia) to show the video block. */
export const vslEmbedUrl: string | null = null;
