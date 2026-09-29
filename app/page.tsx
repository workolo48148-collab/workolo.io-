import { CalBooking } from "@/components/site/cal-booking";
import { Faq } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Audience, Founder, HowItWorks, Pricing, Proof, Section } from "@/components/site/sections";
import { StickyCta } from "@/components/site/sticky-cta";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 font-semibold text-primary-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <main id="main">
        {/* Order follows the client brief: Hero → Wall of proof → Who is it for → About me
            → How we work → FAQ → Packages → Calendar */}
        <Hero />
        <Proof />
        <Audience />
        <Founder />
        <HowItWorks />
        <Faq />
        <Pricing />
        <Section id="book" labelledBy="book-title" className="border-t border-border">
          <SectionHeading id="book-title" title="Book Your Strategy Call" />
          <div className="mt-14">
            <CalBooking />
          </div>
        </Section>
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
