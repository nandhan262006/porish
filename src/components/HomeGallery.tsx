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
    <section id="gallery" aria-labelledby="gallery-heading" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Wedding & family portfolio</p>
            <h2 id="gallery-heading" className="serif-display mt-3 text-5xl md:text-7xl">
              Gallery
            </h2>
          </div>
          <p className="max-w-xs text-[0.9375rem] leading-7 text-muted">
            Pick a story — every frame marked Home in the studio CMS.
            Full galleries one tap away.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Wedding and family gallery categories"
          className="mt-10 flex gap-x-6 gap-y-3 overflow-x-auto border-b border-black/10 pb-3"
        >
          {categories.map((c) => {
            const selected = c.slug === active.slug;
            return (
              <button
                key={c.slug}
                role="tab"
                aria-selected={selected}
                aria-controls="gallery-panel"
                id={`gallery-tab-${c.slug}`}
                onClick={() => setActiveSlug(c.slug)}
                className={`shrink-0 border-b pb-1 text-[12px] font-medium tracking-[0.18em] uppercase transition-colors ${
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
          id="gallery-panel"
          role="tabpanel"
          aria-labelledby={`gallery-tab-${active.slug}`}
          className="caption-fade mt-10 w-full columns-2 gap-0 md:columns-3 lg:columns-5"
        >
          {active.images.map((image, i) => (
            <a
              key={image.file}
              href={image.file}
              target="_blank"
              rel="noreferrer"
              aria-label={`${active.title} photography in Nizamabad — photo ${i + 1} of ${active.images.length}, open full size`}
              className="block break-inside-avoid"
            >
              <span className="photo relative block bg-[#efe7de]">
                <Image
                  src={image.file}
                  alt={`${active.title} photography in Nizamabad by Phorish Shoots — frame ${i + 1}`}
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
          <p className="text-[12px] font-medium tracking-[0.18em] uppercase text-muted">
            {active.images.length} of {active.total} — {active.title} photography
          </p>
          <Link href={`/${active.slug}`} aria-label={`Open the full ${active.title} photography gallery`} className="nav-link">
            Open {active.title} gallery
          </Link>
        </div>
    </section>
  );
}
