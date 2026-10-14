import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ImageStreamHero from "@/components/ImageStreamHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getGalleries, getGalleryBySlug } from "@/lib/content";
import { SITE_URL, INSTAGRAM, DEFAULT_OG_IMAGE, abs } from "@/lib/seo";

export async function generateStaticParams() {
  const galleries = await getGalleries();
  return galleries.map((g) => ({ gallery: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gallery: string }>;
}): Promise<Metadata> {
  const { gallery } = await params;
  const g = await getGalleryBySlug(gallery);
  if (!g) return {};
  // Layout title template already appends "| Phorish Shoots" — no brand suffix here.
  const title = g.seoTitle ? `${g.title} ${g.seoTitle.split(" in ")[0]}` : g.title;
  const description = g.seoDescription || g.blurb;
  const cover = g.images[0];
  const ogImage = cover ? abs(cover.file) : DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    keywords: [`${g.title} photographer Nizamabad`, `${g.title} photography Hyderabad`, "Phorish Shoots", g.blurb],
    alternates: { canonical: `/${g.slug}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${g.slug}`,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${g.title} photography by Phorish Shoots in Nizamabad` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ gallery: string }>;
}) {
  const { gallery } = await params;
  const all = await getGalleries();
  const g = all.find((x) => x.slug === gallery);
  if (!g) notFound();

  const images = g.images;
  const idx = all.findIndex((x) => x.slug === g.slug);
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];

  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${g.title} Photography — Phorish Shoots`,
    description: g.seoDescription || g.blurb,
    url: `${SITE_URL}/${g.slug}`,
    image: images.slice(0, 8).map((img) => img.file),
    author: { "@type": "Organization", name: "Phorish Shoots", url: SITE_URL },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: g.title, item: `${SITE_URL}/${g.slug}` },
    ],
  };

  // Descriptive, keyword-rich alt text beats "photograph N" for both
  // screen readers and image search — without knowing each frame's content.
  const altFor = (i: number) =>
    `${g.title} photography in Nizamabad, Telangana — frame ${i + 1} of ${images.length} by Phorish Shoots`;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="bg-[#1a1410] text-[#f6f1ea]">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: g.title }]} />
      </div>
      <ImageStreamHero
        images={images.map((image, i) => ({
          src: image.file,
          alt: altFor(i),
        }))}
        className="h-[68svh] max-h-[620px] min-h-[440px] w-full border-b border-black/10"
        // Same mobile close-up as The Wall: fewer, bigger, closer cards.
        // Tuned against this hero's default geometry (which is deeper
        // than the home override), so sizes scale up proportionally.
        mobileCards={6}
        mobileSpeed={20}
        mobilePath={{
          cardWidth: 24,
          cardHeight: 33,
          birthHeight: 4.5,
          exitHeight: 62,
          railExit: 40,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/80 via-[#1a1410]/10 to-[#1a1410]/30" />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1360px] flex-col items-center justify-end px-5 pb-12 text-center md:px-10">
          <p className="text-[11px] font-medium tracking-[0.28em] uppercase text-[#f3c7b6]">
            Portfolio
          </p>
          <h1 className="serif-display mt-4 text-5xl tracking-[0.02em] text-[#f6f1ea] uppercase md:text-7xl">
            {g.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-7 text-white/80">
            {g.seoCopy || g.blurb}
          </p>
        </div>
      </ImageStreamHero>

      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-10">
      <section aria-label={`${g.title} photo gallery`} className="pt-10 md:pt-14">
        <p className="mx-auto mb-8 max-w-2xl text-center text-[0.9375rem] leading-7 text-muted">
          {g.blurb} Based in Nizamabad, shooting across Hyderabad, Telangana
          and India —{" "}
          <Link href="/contact-us" className="underline underline-offset-4">
            book this story
          </Link>
          .
        </p>
      </section>
      </div>

      {/* Full-bleed masonry: no gutters, so frames of any height pack
          flush and newly uploaded photos slot in with nowhere to gap. */}
      <div className="columns-2 gap-0 md:columns-3">
        {images.map((file, i) => (
          <Reveal
            key={file.file}
            delay={Math.min(i, 6) * 70}
            className="break-inside-avoid"
          >
            <a
              href={file.file}
              target="_blank"
              rel="noreferrer"
              aria-label={`${g.title} photo ${i + 1} of ${images.length} — open full size`}
              className="block"
            >
              <span className="photo relative block bg-[#efe7de]">
                <Image
                  src={file.file}
                  alt={altFor(i)}
                  width={file.width}
                  height={file.height}
                  priority={i < 2}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="h-auto w-full"
                />
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-10">
      <section className="py-12">
        <Reveal delay={140} className="text-center">
          <p className="eyebrow">
            {images.length} photograph{images.length === 1 ? "" : "s"} — {g.title} by Phorish Shoots
          </p>
          <nav aria-label="Gallery navigation" className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <Link href={`/${prev.slug}`} className="nav-link">
              ← {prev.title}
            </Link>
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href={`/${next.slug}`} className="nav-link">
              {next.title} →
            </Link>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              className="nav-link"
            >
              More on Instagram ↗
            </a>
          </nav>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-muted">
            Love this style?{" "}
            <Link href="/contact-us" className="underline underline-offset-4">
              Check your date
            </Link>{" "}
            — wedding season fills months ahead across Telangana.
          </p>
        </Reveal>
      </section>
      </div>
    </main>
  );
}
