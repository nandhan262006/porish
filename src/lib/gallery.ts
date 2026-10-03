import fs from "node:fs";
import path from "node:path";
import categoryFiles from "../../data/categories.json";

export type GalleryImage = {
  file: string;
  width: number;
  height: number;
};

export type Gallery = {
  slug: string;
  title: string;
  category: string;
  blurb: string;
  images: GalleryImage[];
};

const PUBLIC_DIR = path.join(process.cwd(), "public");

// slugs match the navbar: /weddings, /pre-wedding, /toddlers, /new-born, /modeling
const CATEGORIES: Omit<Gallery, "images">[] = [
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
    category: "babybump-toddlers",
    blurb: "First steps, favourite toys and unfiltered joy — childhood exactly as it is.",
  },
  {
    slug: "new-born",
    title: "New Born",
    category: "newborn",
    blurb: "The earliest days, gently documented — tiny hands, sleepy stretches, new beginnings.",
  },
  {
    slug: "modeling",
    title: "Modeling",
    category: "modeling",
    blurb: "Portraits with intent for portfolios, brands and editorials — studio and on location.",
  },
];

/** Intrinsic pixel size, so thumbnails keep each photo's real shape
 *  (no crop, no letterbox) and the grid never shifts on load. */
function imageSize(file: string): { width: number; height: number } {
  const buf = fs.readFileSync(path.join(PUBLIC_DIR, file));

  // PNG: IHDR is always the first chunk
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // JPEG: walk the marker segments to the first SOF frame header
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    const isLengthless =
      marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9);
    if (marker === 0xff || isLengthless) {
      i += 2;
      continue;
    }
    const segmentLength = buf.readUInt16BE(i + 2);
    const isFrameHeader =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrameHeader) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + segmentLength;
  }

  return { width: 1, height: 1 };
}

function loadImages(category: string): GalleryImage[] {
  const files: string[] = (categoryFiles as Record<string, string[]>)[category] ?? [];
  return files
    // data can reference files that were never downloaded
    .filter((file) => fs.existsSync(path.join(PUBLIC_DIR, file)))
    .map((file) => ({ file, ...imageSize(file) }));
}

export const GALLERIES: Gallery[] = CATEGORIES.map((c) => ({
  ...c,
  images: loadImages(c.category),
}));

export function galleryBySlug(slug: string): Gallery | undefined {
  return GALLERIES.find((g) => g.slug === slug);
}
