"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";

export type MasonryImage = { file: string; width: number; height: number };

export default function GalleryMasonry({
  title,
  images,
}: {
  title: string;
  images: MasonryImage[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  const altFor = (i: number) =>
    `${title} photography in Nizamabad, Telangana — frame ${i + 1} of ${images.length} by Phorish Shoots`;

  return (
    <>
      {/* Full-bleed masonry: no gutters, so frames of any height pack
          flush and newly uploaded photos slot in with nowhere to gap. */}
      <div className="columns-2 gap-0 md:columns-3">
        {images.map((file, i) => (
          <Reveal
            key={file.file}
            delay={Math.min(i, 6) * 70}
            className="break-inside-avoid"
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${title} photo ${i + 1} of ${images.length} — open in viewer`}
              className="block w-full cursor-pointer"
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
            </button>
          </Reveal>
        ))}
      </div>

      <Lightbox
        images={images.map((f, i) => ({ src: f.file, alt: altFor(i) }))}
        index={open}
        onNavigate={setOpen}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
