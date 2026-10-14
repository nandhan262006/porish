import type { Metadata } from "next";
import HomeHero from "@/components/homehero";
import HomeAbout from "@/components/homeabout";
import ServiceCarousel from "@/components/ServiceCarousel";
import HomeGallery from "@/components/HomeGallery";
import Cinematics from "@/components/Cinematics";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import GalleryCTA from "@/components/gallerycta";
import Faq from "@/components/Faq";
import ImageStreamHero from "@/components/ImageStreamHero";
import { getGalleries, getHome, getServices, getSettings, getTestimonials } from "@/lib/content";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Wedding Photographer in Nizamabad, Telangana | Phorish Shoots",
  description:
    "Phorish Shoots — documentary wedding photographer in Nizamabad. 100+ weddings since 2020: weddings, pre-wedding, newborn, toddler, modeling & films across Hyderabad & India. Rated 4.9 (85 Google reviews).",
  keywords: [
    "wedding photographer Nizamabad",
    "candid wedding photographer Telangana",
    "pre-wedding shoot Hyderabad",
    "newborn photographer Nizamabad",
    "wedding films Telangana",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Phorish Shoots | Wedding Photographer in Nizamabad, Telangana",
    description:
      "Real people, real emotions, timeless memories. 100+ weddings since 2020 — documentary, candid & editorial photography across India.",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Phorish Shoots — wedding photography in Nizamabad" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phorish Shoots | Wedding Photographer in Nizamabad",
    description:
      "Documentary weddings, pre-wedding, newborn, toddler & modeling across Telangana & India. 100+ weddings since 2020.",
    images: [DEFAULT_OG_IMAGE],
  },
};

// One stream across every genre: round-robin the categories (deduped) so
// the corridor mixes weddings, pre-wedding, newborn and modeling.
function buildStream(galleries: Awaited<ReturnType<typeof getGalleries>>) {
  const seenCategories = new Set<string>();
  const buckets = galleries
    .filter((gallery) => {
      if (seenCategories.has(gallery.category)) return false;
      seenCategories.add(gallery.category);
      return true;
    })
    .map((gallery) => ({
      title: gallery.title,
      images: gallery.images.slice(0, 3),
    }));

  const streamImages: { src: string; alt: string }[] = [];
  const depth = Math.max(0, ...buckets.map((bucket) => bucket.images.length));
  for (let row = 0; row < depth; row += 1) {
    for (const bucket of buckets) {
      const image = bucket.images[row];
      if (image) {
        streamImages.push({
          src: image.file,
          alt: `${bucket.title} photograph by Phorish Shoots`,
        });
      }
    }
  }
  return streamImages;
}

// Homepage strip per story. Featured frames (any count the admin stars)
// all show. If a gallery has none featured we fall back to its first 5
// so the strip is never empty and never dumps the whole library.
function buildPreviews(galleries: Awaited<ReturnType<typeof getGalleries>>) {
  return galleries
    .filter((g) => g.images.length > 0)
    .map((gallery) => {
      const featured = gallery.images.filter((i) => i.featured);
      return {
        slug: gallery.slug,
        title: gallery.title,
        total: gallery.images.length,
        images: featured.length ? featured : gallery.images.slice(0, 5),
      };
    });
}

export default async function Home() {
  const [galleries, home, services, testimonials, settings] = await Promise.all([
    getGalleries(),
    getHome(),
    getServices(),
    getTestimonials(),
    getSettings(),
  ]);

  const streamImages = buildStream(galleries);
  const galleryPreviews = buildPreviews(galleries);

  const REVIEW_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Phorish Shoots Wedding Photography",
    image: DEFAULT_OG_IMAGE,
    description:
      "Documentary wedding photography in Nizamabad, Telangana — weddings, pre-wedding, newborn, toddler and modeling sessions across India.",
    brand: { "@type": "Brand", name: "Phorish Shoots" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: settings.rating_value ?? "4.9",
      reviewCount: settings.review_count ?? "85",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(REVIEW_SCHEMA) }}
      />
      <HomeHero home={home} />
      <HomeAbout
        names={home.aboutNames}
        paragraph1={home.aboutP1}
        paragraph2={home.aboutP2}
      />
      <ImageStreamHero
        images={streamImages}
        className="h-[76svh] max-h-[680px] min-h-[480px] w-full md:h-[600px]"
        path={{
          // Big and shallow for phones: a flat projection so there is
          // almost no tunnel, and cards are born large (6cqw) and leave
          // large (55cqw). Ratio ~9 over 9 cards keeps the ribbon solid.
          perspective: 48,
          cardWidth: 20,
          cardHeight: 28,
          birthHeight: 6,
          exitHeight: 55,
        }}
        // Mobile close-up: 6 cards per rail instead of 9, each born
        // bigger and leaving huge. Wider cards + tucked rails keep the
        // ribbon overlapped so it never tears at this lower density.
        mobileCards={6}
        mobileSpeed={20}
        mobilePath={{
          perspective: 42,
          cardWidth: 27,
          cardHeight: 37,
          birthHeight: 8.5,
          exitHeight: 68,
          railExit: 40,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/80 via-[#1a1410]/10 to-[#1a1410]/30" />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1360px] flex-col items-center justify-end px-5 pb-12 text-center md:px-10">
          <p className="text-[11px] font-medium tracking-[0.28em] uppercase text-[#f3c7b6]">
            Selected work
          </p>
          <h2 className="serif-display mt-4 text-5xl tracking-[0.02em] text-[#f6f1ea] uppercase md:text-7xl">
            The wall
          </h2>
          <a
            href="#services"
            className="mt-6 inline-block border-b border-[#f6f1ea]/60 pb-1 text-[11px] tracking-[0.24em] uppercase text-[#f6f1ea]"
          >
            Browse the galleries ↓
          </a>
        </div>
      </ImageStreamHero>
      <ServiceCarousel services={services} />
      <HomeGallery categories={galleryPreviews} />
      <Cinematics />
      <Testimonials items={testimonials} />
      <Faq />
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-10">
        <ContactSection />
      </div>
      <GalleryCTA />
    </main>
  );
}
