import dynamic from "next/dynamic";
import { BookingProvider } from "@/components/booking/booking-provider";
import { Faq } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { SectionHeading } from "@/components/site/section-heading";
import { FinalCta, Founder, HowItWorks, Included, Pricing, ProblemSolution, Proof, Section } from "@/components/site/sections";
import { StickyCta } from "@/components/site/sticky-cta";

// Below the fold: split into its own chunk so hydrating the hero isn't blocked by it.
const BookingWidget = dynamic(() => import("@/components/booking/booking-section").then((m) => m.BookingWidget));

export default function Home() {
  return (
    <BookingProvider>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 font-semibold text-primary-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <div id="top" />
      <Header />
      <main id="main">
        <Hero />
        <ProblemSolution />
        <Included />
        <HowItWorks />
        <Proof />
        <Founder />
        <Pricing />
        <Section id="book" labelledBy="book-title" className="scroll-mt-16">
          <SectionHeading
            id="book-title"
            eyebrow="Book a call"
            title="Pick a time that works for you"
            lead="30 minutes to see if the content system fits your business. Times are shown in your time zone."
          />
          <div className="mt-10">
            <BookingWidget />
          </div>
        </Section>
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </BookingProvider>
  );
}
