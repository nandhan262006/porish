import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact — Phorish Shoots",
  description:
    "Visit Phorish Shoots in Mubaraknagar, Nizamabad — 4.9 stars from 85 Google reviews. Call 085003 62643 or book on WhatsApp.",
};

const MAPS_URL = "https://maps.app.goo.gl/BLWq2ZWdHid7ptkXA";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Phorish Shoots",
  description:
    "Professional photography service specializing in weddings and baby portraits.",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "No. 04, Laxmi Priya Nagar, Janapriya Nagar Road, Mubaraknagar",
    addressLocality: "Nizamabad",
    addressRegion: "Telangana",
    postalCode: "503003",
    addressCountry: "IN",
  },
  telephone: "+91-8500362643",
  url: "https://www.instagram.com/phorish_shoots/",
  hasMap: MAPS_URL,
  openingHours: "Mo-Su 00:00-20:30",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "85",
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      <section className="pt-16 text-center md:pt-24">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h1 className="serif-display mt-4 text-5xl tracking-[0.02em] uppercase md:text-7xl">
            Let&rsquo;s talk
          </h1>
          <p className="script-note mt-4 text-xl md:text-2xl">
            dates fill fast — say hello early.
          </p>
          <div
            aria-label="Rated 4.9 out of 5 from 85 Google reviews"
            className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
          >
            <span className="serif-display text-3xl">4.9</span>
            <span aria-hidden className="text-base tracking-[0.2em] text-terracotta">
              ★★★★★
            </span>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="border-b border-foreground/30 pb-0.5 text-[11px] tracking-[0.22em] uppercase transition-colors hover:border-foreground"
            >
              85 Google reviews
            </a>
          </div>
        </Reveal>
      </section>

      <ContactSection />
    </main>
  );
}
