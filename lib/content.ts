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

/** The label on every call-to-action button. Every CTA goes to the calendar (#book). */
export const ctaLabel = "I'm Ready To Start";

/** Cal.com inline embed: bookings go straight into Salman's Cal.com event (cal.com/build-with-salman, 30 min). */
export const booking = {
  calLink: "build-with-salman/30min",
  namespace: "strategy-call",
};

export const hero = {
  /** Headline reads "<prefix> <rotating role>"; `roles` cycle in the brand blue. */
  headlinePrefix: "Land Retainer Clients & Build Your Personal Brand on Social Media as a Busy",
  roles: ["Financial Coach", "Day Trader", "Real Estate Agent", "Wealth Manager", "Personal Finance Manager"],
  subhead:
    "Done-For-You content system built for busy financial professionals who want to grow their authority, attract qualified leads, and turn social media into a client acquisition channel.",
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

export const included = [
  { icon: "search", title: "Research", body: "We study the top finance creators and best-performing content in your niche on Instagram." },
  { icon: "pen", title: "Scripting", body: "A full month of short-form scripts, plus direction on what to film and how to batch it." },
  { icon: "film", title: "Editing", body: "You film the scripts. We edit every video." },
  { icon: "upload", title: "Uploading", body: "We post to your Instagram with calls to action that send people to your DMs and calendar." },
  { icon: "message", title: "Sales-focused stories", body: "Instagram stories built to move followers toward a conversation." },
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
  features: string[];
};

/** Package details from the client's pricing table, word for word. */
const planFeatures = (stories: number) => [
  "Onboarding/Review Calls",
  "Research",
  "Scripting",
  "Editing",
  "Uploading",
  `${stories} Sales Focused Instagram Stories`,
  "24/7 Weekday Email Support",
  "Monthly Reports",
  "BONUS: Optimize Your Profile Checklist",
];

export const plans: Plan[] = [
  { id: "silver", name: "Silver", volume: "10 shorts/month", price: 1495, features: planFeatures(7) },
  { id: "gold", name: "Gold", volume: "20 shorts/month", price: 2495, features: planFeatures(10) },
  { id: "diamond", name: "Diamond", volume: "30 shorts/month", price: 2995, features: planFeatures(15) },
];
export type FaqItem = { q: string; a: (string | { list: string[]; ordered?: boolean; title?: string })[] };

/** FAQ copy from the client brief, word for word. */
export const faqs: FaqItem[] = [
  {
    q: "Does this actually work for finance professionals?",
    a: [
      "Yes. The same content system can be adapted to financial advisors, wealth managers, mortgage brokers, CPAs, insurance advisors, and other finance experts.",
      "The strategy is simple:",
      "We study what is already working in your market, find the topics your ideal clients care about, and turn your expertise into content that builds trust and creates opportunities for conversations.",
      {
        title: "We focus on:",
        list: [
          "Your ideal clients and their biggest questions",
          "Content formats already performing in your niche",
          "Your own expertise, stories, opinions, and experience",
          "Topics that can attract the type of clients you actually want",
          "CTAs that move people toward DMs, calls, or your offer",
        ],
      },
      "You don't need to become a full-time creator. You just need to be the expert. We build the content system around you.",
    ],
  },
  {
    q: "How much work is this for me? I'm already slammed.",
    a: [
      "You stay focused on running your finance business. We become your content team.",
      {
        title: "Your responsibilities:",
        list: [
          "A few focused hours to film each month",
          "One monthly strategy/review call",
          "Quick approvals when needed",
          "Share your expertise, ideas, and feedback",
        ],
      },
      {
        title: "Our responsibilities:",
        list: [
          "Research your niche, audience, and competitors",
          "Find topics and formats that are already working",
          "Create your monthly content strategy",
          "Write your scripts and filming directions",
          "Tell you what to film and how to batch it efficiently",
          "Edit and prepare your content",
          "Publish your content",
          "Create sales-focused stories and CTAs",
          "Review performance and improve the strategy",
        ],
      },
      "You send us the raw videos. We handle the rest.",
    ],
  },
  {
    q: "I've already tried posting on social media and it didn't work. What's different?",
    a: [
      "Posting more isn't the strategy.",
      {
        title: "Many finance professionals have already tried:",
        list: [
          "Posting whenever they have time",
          "Sharing generic financial tips",
          "Reposting news and market updates",
          "Making a few videos and then stopping",
          "Posting without knowing what actually worked",
        ],
      },
      "Our approach is different.",
      {
        title: "We use a simple process:",
        ordered: true,
        list: [
          "Research: We study your audience, niche, competitors, and content that is already getting attention.",
          "Test: We create different topics, hooks, angles, and formats to see what your audience responds to.",
          "Find the outliers: When a piece of content performs much better than normal, we study why.",
          "Double down: We create new variations around the topics, angles, and formats that are working.",
        ],
      },
      "You don't need to guess what to post every week. We build the system around what your audience is actually responding to.",
    ],
  },
  {
    q: "Is this about followers, or will it help me generate clients?",
    a: [
      "The goal is not to collect followers just for the sake of it.",
      "Your content should help the right people:",
      "See you → Trust you → Follow you → Start a conversation → Become a lead → Become a client",
      {
        title: "That's why we create a mix of:",
        list: [
          "Educational content",
          "Authority content",
          "Personal stories",
          "Client-focused content",
          "Problem-aware content",
          "Sales-focused CTAs",
        ],
      },
      "And we can direct people toward:",
      "DMs, calls, lead magnets, or your website.",
      "Followers are useful. But the real goal is building an audience that can eventually become business.",
    ],
  },
  {
    q: "Why do I need 90 days?",
    a: [
      "Because we're building a content asset, not looking for one viral video.",
      "The first few weeks are about understanding your market and testing different ideas.",
      "Then we identify the topics, hooks, and formats that perform best.",
      "After that, we create more of what is working and improve the system over time.",
      "90 days gives us enough time to research, test, learn, and build a repeatable content system around your personal brand.",
      "No guaranteed follower or revenue numbers. The goal is to build a stronger personal brand and a content engine that consistently creates opportunities.",
    ],
  },
];

/** "Who is this for?" copy from the client brief, word for word. */
export const audienceIntro =
  "If you're a finance expert with valuable knowledge but don't have the time to create content consistently, this is for you.";

export const audiences = [
  {
    title: "Financial Advisors",
    body: "Build trust, educate your audience, and turn your expertise into content that brings in potential clients.",
  },
  {
    title: "Wealth Managers",
    body: "Use your personal brand to stand out, build authority, and attract high-value investors.",
  },
  {
    title: "Mortgage Brokers",
    body: "Turn your mortgage knowledge into simple content that builds trust and generates qualified enquiries.",
  },
  {
    title: "Insurance Advisors",
    body: "Educate your audience on insurance while building a personal brand people remember and trust.",
  },
  {
    title: "CPAs & Tax Advisors",
    body: "Turn complex tax topics into simple content that attracts business owners and high-value clients.",
  },
  {
    title: "Financial Coaches",
    body: "Grow your audience, build authority, and turn your expertise into demand for your coaching services.",
  },
  {
    title: "Accounting Firm Owners",
    body: "Show your expertise online and use content to attract businesses looking for ongoing accounting support.",
  },
  {
    title: "Business Finance Consultants",
    body: "Share practical financial advice that positions you as the expert and creates new client opportunities.",
  },
  {
    title: "Lending & Loan Professionals",
    body: "Create educational content that answers common questions, builds credibility, and generates leads.",
  },
  {
    title: "Investment & Trading Educators",
    body: "Turn your knowledge and market insights into content that grows your audience and builds your personal brand.",
  },
];

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
/** Paste a real VSL embed URL (YouTube/Vimeo/Wistia) to show the video in the hero. Don't add autoplay. */
export const vslEmbedUrl: string | null = "https://www.youtube.com/embed/RRahce8PfNU?rel=0";
