"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type PreviewImage = {
  file: string;
  width: number;
  height: number;
};

export type PreviewCategory = {
  slug: string;
  title: string;
  total: number;
  images: PreviewImage[];
};

export default function HomeGallery({
  categories,
}: {
  categories: PreviewCategory[];
}) {
  const [activeSlug, setActiveSlug] = useState(
    categories[0]?.slug ?? "",
  );
  const active =
    categories.find((c) => c.slug === activeSlug) ?? categories[0];

  if (!active) return null;

  return (
    <section id="gallery" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2 className="serif-display mt-3 text-5xl md:text-7xl">
              Gallery
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-muted">
            Pick a story — five frames from each shoot, full galleries one
            tap away.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Gallery categories"
          className="mt-10 flex gap-x-6 gap-y-3 overflow-x-auto border-b border-black/10 pb-3"
        >
          {categories.map((c) => {
            const selected = c.slug === active.slug;
            return (
              <button
                key={c.slug}
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveSlug(c.slug)}
                className={`shrink-0 border-b pb-1 text-[11px] tracking-[0.22em] uppercase transition-colors ${
                  selected
                    ? "border-terracotta text-foreground"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {c.title}
              </button>
            );
          })}
        </div>
      </div>

        <div
          key={active.slug}
          className="caption-fade mt-6 w-full columns-2 gap-0 border-y border-black/10 lg:columns-5 [&>*]:mb-0"
        >
          {active.images.map((image, i) => (
            <a
              key={image.file}
              href={`/${image.file}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`${active.title} photograph ${i + 1} — open full size`}
              className="block break-inside-avoid"
            >
              <span className="photo relative block bg-[#efe7de]">
                <Image
                  src={`/${image.file}`}
                  alt={`${active.title} photograph ${i + 1} by Phorish Shoots`}
                  width={image.width}
                  height={image.height}
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="h-auto w-full"
                />
              </span>
            </a>
          ))}
        </div>

      <div className="mx-auto mt-8 flex max-w-[1360px] flex-col items-center justify-between gap-4 px-5 sm:flex-row md:px-10">
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted">
            5 of {active.total} — {active.title}
          </p>
          <Link href={`/${active.slug}`} className="nav-link">
            Open {active.title} gallery
          </Link>
        </div>
    </section>
  );
}
