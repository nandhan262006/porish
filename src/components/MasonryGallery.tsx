import Image from "next/image";
import Link from "next/link";
import { GALLERIES } from "@/lib/gallery";

type Tile = {
  key: string;
  file: string;
  width: number;
  height: number;
  title: string;
  href: string;
};

const PER_CATEGORY = 6;

function buildTiles(): Tile[] {
  // /new-born and /toddlers read the same category, so keep one bucket per
  // category instead of repeating the same three frames under two labels
  const seenCategories = new Set<string>();
  const buckets = GALLERIES.filter((gallery) => {
    if (seenCategories.has(gallery.category)) return false;
    seenCategories.add(gallery.category);
    return true;
  }).map((gallery) => ({
    href: `/${gallery.slug}`,
    title: gallery.title,
    images: gallery.images.slice(0, PER_CATEGORY),
  }));

  const tiles: Tile[] = [];
  const depth = Math.max(...buckets.map((bucket) => bucket.images.length));

  // round-robin the categories so no single column ends up all one genre
  for (let row = 0; row < depth; row += 1) {
    for (const bucket of buckets) {
      const image = bucket.images[row];
      if (!image) continue;
      tiles.push({
        key: `${bucket.href}-${image.file}`,
        file: image.file,
        width: image.width,
        height: image.height,
        title: bucket.title,
        href: bucket.href,
      });
    }
  }

  return tiles;
}

export default function MasonryGallery() {
  const tiles = buildTiles();

  return (
    <section className="px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="serif-display mt-3 text-5xl md:text-7xl">The wall</h2>
          </div>
          <p className="hidden max-w-xs text-sm leading-6 text-muted md:block">
            Recent frames, unretouched and uncropped. Open any one to see the
            full story.
          </p>
        </div>

        <div className="columns-2 gap-4 lg:columns-3 [&>*]:mb-4">
          {tiles.map((tile) => (
            <Link
              key={tile.key}
              href={tile.href}
              className="photo group relative block break-inside-avoid"
            >
              <Image
                src={`/${tile.file}`}
                alt={`${tile.title} photograph by Phorish Shoots`}
                width={tile.width}
                height={tile.height}
                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 45vw"
                className="h-auto w-full transition duration-700 ease-out group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-[#1a1410]/88 via-[#1a1410]/25 to-transparent px-3 pt-12 pb-3 text-[#f6f1ea] opacity-0 transition duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <span className="block text-[10px] tracking-[0.24em] uppercase text-[#f3c7b6]">
                  {tile.title}
                </span>
                <span className="serif-display mt-1 block text-xl leading-none md:text-2xl">
                  View gallery
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}