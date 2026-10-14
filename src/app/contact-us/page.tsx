import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactSection from "@/components/ContactSection";

import { SITE_URL, DEFAULT_OG_IMAGE, INSTAGRAM } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact — Book Wedding Photography in Nizamabad",
  description:
    "Book Phorish Shoots in Mubaraknagar, Nizamabad — 4.9 stars from 85 Google reviews. Wedding, pre-wedding, newborn & toddler photography across Telangana & India. Call +91 85003 62643 or WhatsApp.",
  keywords: [
    "book wedding photographer Nizamabad",
    "Phorish Shoots contact",
    "wedding photography packages Telangana",
  ],
  alternates: { canonical: "/contact-us" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/contact-us`,
    title: "Contact Phorish Shoots — Book Your Date in Nizamabad",
    description:
      "4.9 stars from 85 Google reviews. Call +91 85003 62643 or book on WhatsApp — wedding dates fill fast.",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Contact Phorish Shoots wedding photography studio" }],
  },
};

const MAPS_URL = "https://maps.app.goo.gl/BLWq2ZWdHid7ptkXA";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/contact-us#studio`,
  name: "Phorish Shoots",
  image: DEFAULT_OG_IMAGE,
  description:
    "Documentary wedding photographer in Nizamabad — weddings, pre-wedding, newborn, toddler and modeling photography across Telangana & India.",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "No. 04, Laxmi Priya Nagar, Janapriya Nagar Road, Mubaraknagar",
    addressLocality: "Nizamabad",
    addressRegion: "Telangana",
    postalCode: "503003",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 18.702, longitude: 78.1218 },
  telephone: "+91-8500362643",
  email: "phorishshoots@gmail.com",
  url: SITE_URL,
  sameAs: [INSTAGRAM, MAPS_URL],
  hasMap: MAPS_URL,
  priceRange: "₹₹",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "20:30",
  },
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
