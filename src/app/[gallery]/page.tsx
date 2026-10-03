import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import ImageStreamHero from "@/components/ImageStreamHero";
import { GALLERIES, galleryBySlug } from "@/lib/gallery";

export function generateStaticParams() {
  return GALLERIES.map((g) => ({ gallery: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gallery: string }>;
}) {
  const { gallery } = await params;
  const g = galleryBySlug(gallery);
  if (!g) return {};
  return {
    title: `${g.title} — Phorish Shoots`,
    description: g.blurb,
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ gallery: string }>;
}) {
  const { gallery } = await params;
  const g = galleryBySlug(gallery);
  if (!g) notFound();

  const images = g.images;

  return (
    <main>
      <ImageStreamHero
        images={images.map((image, i) => ({
          src: `/${image.file}`,
          alt: `${g.title} photograph ${i + 1} by Phorish Shoots`,
        }))}
        className="h-[68svh] max-h-[620px] min-h-[440px] w-full border-b border-black/10"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/80 via-[#1a1410]/10 to-[#1a1410]/30" />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1360px] flex-col items-center justify-end px-5 pb-12 text-center md:px-10">
          <p className="text-[11px] font-medium tracking-[0.28em] uppercase text-[#f3c7b6]">
            Portfolio
          </p>
          <h1 className="serif-display mt-4 text-5xl tracking-[0.02em] text-[#f6f1ea] uppercase md:text-7xl">
            {g.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-7 text-white/75">
            {g.blurb}
          </p>
        </div>
      </ImageStreamHero>

      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-10">

      <section className="py-10 md:py-14">
        <div className="grid grid-cols-2 gap-[6px] md:grid-cols-3">
          {images.map((file, i) => (
            <Reveal key={file.file} delay={Math.min(i, 6) * 70}>
              <a
                href={`/${file.file}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`${g.title} photograph ${i + 1} — open full size`}
                className="block"
              >
                <span className="photo relative block bg-[#efe7de]">
                  <Image
                    src={`/${file.file}`}
                    alt={`${g.title} photograph ${i + 1} by Phorish Shoots`}
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

        <Reveal delay={140} className="mt-12 text-center">
          <p className="eyebrow">
            {images.length} photograph{images.length === 1 ? "" : "s"}
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <a
              href="https://www.instagram.com/phorish_shoots/"
              target="_blank"
              rel="noreferrer"
              className="nav-link"
            >
              More on Instagram ↗
            </a>
          </div>
        </Reveal>
      </section>
      </div>
    </main>
  );
}
