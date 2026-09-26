import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import categories from "@/../data/categories.json";

type Gallery = {
  slug: string;
  title: string;
  category: string;
  blurb: string;
};

const GALLERIES: Gallery[] = [
  {
    slug: "weddings",
    title: "Weddings",
    category: "weddings",
    blurb: "Rituals, tears and laughter from the big day — held exactly as they happened.",
  },
  {
    slug: "pre-wedding",
    title: "Pre-Wedding",
    category: "pre-wedding",
    blurb: "Quiet hours before the vows — two people, soft light and a story worth slowing down for.",
  },
  {
    slug: "toddlers",
    title: "Toddlers",
    category: "new-born-toddlers",
    blurb: "First steps, favourite toys and unfiltered joy — childhood exactly as it is.",
  },
  {
    slug: "new-born",
    title: "New Born",
    category: "new-born-toddlers",
    blurb: "The earliest days, gently documented — tiny hands, sleepy stretches, new beginnings.",
  },
  {
    slug: "modeling",
    title: "Modeling",
    category: "modeling",
    blurb: "Portraits with intent for portfolios, brands and editorials — studio and on location.",
  },
];

const BY_SLUG = Object.fromEntries(GALLERIES.map((g) => [g.slug, g]));
const PUBLIC_DIR = path.join(process.cwd(), "public");

export function generateStaticParams() {
  return GALLERIES.map((g) => ({ gallery: g.slug }));
}

// unknown slugs 404 instead of rendering on demand
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gallery: string }>;
}) {
  const { gallery } = await params;
  const g = BY_SLUG[gallery];
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
  const g = BY_SLUG[gallery];
  if (!g) notFound();

  const files: string[] =
    (categories as Record<string, string[]>)[g.category] ?? [];
  // guard against data referencing files that were never downloaded
  const images = files.filter((f) => fs.existsSync(path.join(PUBLIC_DIR, f)));

  return (
    <main className="mx-auto w-full max-w-[1360px] px-6 md:px-10">
      <section className="pt-16 pb-4 md:pt-24">
        <Reveal className="text-center">
          <p className="eyebrow">Portfolio</p>
          <h1 className="serif-display mt-4 text-5xl tracking-[0.02em] uppercase md:text-7xl">
            {g.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-7 text-muted">
            {g.blurb}
          </p>
          <div className="thin-rule mx-auto mt-8 w-16" />
        </Reveal>
      </section>

      <section className="py-10 md:py-14">
        <div className="grid grid-cols-2 gap-[6px] md:grid-cols-3">
          {images.map((file, i) => (
            <Reveal key={file} delay={Math.min(i, 6) * 70}>
              <a
                href={`/${file}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`${g.title} photograph ${i + 1} — open full size`}
                className="block"
              >
                <span className="photo relative block aspect-[4/5]">
                  <Image
                    src={`/${file}`}
                    alt={`${g.title} photograph ${i + 1} by Phorish Shoots`}
                    fill
                    priority={i < 2}
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover"
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
              ← Home
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
    </main>
  );
}
