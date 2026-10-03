import HomeHero from "@/components/homehero";
import HomeAbout from "@/components/homeabout";
import ServiceCarousel from "@/components/ServiceCarousel";
import HomeGallery from "@/components/HomeGallery";
import Cinematics from "@/components/Cinematics";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import GalleryCTA from "@/components/gallerycta";
import ImageStreamHero from "@/components/ImageStreamHero";
import { GALLERIES } from "@/lib/gallery";

// One stream across every genre: round-robin the categories (deduped —
// /new-born and /toddlers read the same files) so the corridor mixes
// weddings, pre-wedding, newborn and modeling instead of one long run.
const seenCategories = new Set<string>();
const buckets = GALLERIES.filter((gallery) => {
  if (seenCategories.has(gallery.category)) return false;
  seenCategories.add(gallery.category);
  return true;
}).map((gallery) => ({
  title: gallery.title,
  images: gallery.images.slice(0, 3),
}));

const streamImages: { src: string; alt: string }[] = [];
const depth = Math.max(...buckets.map((bucket) => bucket.images.length));
for (let row = 0; row < depth; row += 1) {
  for (const bucket of buckets) {
    const image = bucket.images[row];
    if (image) {
      streamImages.push({
        src: `/${image.file}`,
        alt: `${bucket.title} photograph by Phorish Shoots`,
      });
    }
  }
}

// Five preview frames per story for the filterable gallery below services.
// Server Component reads the filesystem; the client grid only gets serializable props.
const GALLERY_ORDER = [
  "weddings",
  "pre-wedding",
  "new-born",
  "toddlers",
  "modeling",
];
const galleryPreviews = GALLERY_ORDER.flatMap((slug) => {
  const gallery = GALLERIES.find((g) => g.slug === slug);
  if (!gallery) return [];
  return [
    {
      slug: gallery.slug,
      title: gallery.title,
      total: gallery.images.length,
      images: gallery.images.slice(0, 5),
    },
  ];
});

export default function Home() {
  return (
    <main>
      <HomeHero />
      <HomeAbout />
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
      <ServiceCarousel />
      <HomeGallery categories={galleryPreviews} />
      <Cinematics />
      <Testimonials />
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-10">
        <ContactSection />
      </div>
      <GalleryCTA />
    </main>
  );
}