import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Workolo",
  description: "What Workolo collects when you book a call, and how it's used.",
  alternates: { canonical: "/privacy" },
};

// NOTE FOR WORKOLO: this describes exactly what the site's code does. Have it
// reviewed for your jurisdiction (GDPR/CCPA) before running paid traffic.
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 24, 2026">
      <p>
        This policy explains what Workolo (&quot;we&quot;) collects through workolo.io and how we use it. Questions:{" "}
        <a href="mailto:hello@workolo.io">hello@workolo.io</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Booking details you enter:</strong> name, email, optional phone number, your Instagram handle or other socials, a short
          description of your business, your answers to the qualifying questions (timeline, desired outcome, budget range), your time zone and
          the time you pick.
        </li>
        <li>
          <strong>Consent choices:</strong> whether you agreed to SMS notifications and to these terms.
        </li>
        <li>
          <strong>Campaign data:</strong> if you arrived from an ad, the campaign parameters in the link (for example utm_source or fbclid)
          are stored for your browser session and attached to your booking.
        </li>
        <li>
          <strong>Analytics:</strong> if enabled, Google Analytics and the Meta Pixel record page views and booking steps (for example
          &quot;slot selected&quot; or &quot;booking completed&quot;). They do not receive your name, email or phone number from this site.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To schedule, prepare for and hold the call you booked, and to contact you about it.</li>
        <li>To send SMS notifications about the call, only if you opted in.</li>
        <li>To measure which ads and pages lead to booked calls.</li>
      </ul>
      <p>We don&apos;t sell your personal information.</p>

      <h2>Who processes it</h2>
      <p>
        Booking details are stored with our scheduling provider (for example Cal.com, Google Calendar or our automation tooling) and our
        hosting provider. Analytics data is processed by Google and Meta under their own policies.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct or delete your information at any time by emailing <a href="mailto:hello@workolo.io">hello@workolo.io</a>.
        You can reply STOP to any SMS to opt out.
      </p>

      <h2>Financial disclaimer</h2>
      <p>We create marketing content. We don&apos;t give financial advice, and we don&apos;t promise trading or investment results.</p>
    </LegalPage>
  );
}
