import { unstable_cache } from "next/cache";
import { and, asc, eq } from "drizzle-orm";
import { getDb, schema } from "./db";
import { mediaUrl } from "./media";

/** Cached DB reads for the public site. Every section has a tag; admin
 *  writes expire it via publish() so edits go live without rebuilds.
 *  The 5-minute revalidate floor is a backstop: if a tag expiry ever
 *  misses a cache (e.g. another server instance), the page still goes
 *  fresh on its own within minutes instead of a year. */

export const TAGS = {
  galleries: "content:galleries",
  films: "content:films",
  services: "content:services",
  testimonials: "content:testimonials",
  faqs: "content:faqs",
  settings: "content:settings",
  home: "content:home",
} as const;

export type GalleryImageVM = {
  file: string;
  width: number;
  height: number;
  featured: boolean;
};
export type GalleryVM = {
  slug: string;
  title: string;
  category: string;
  blurb: string;
  seoTitle: string;
  seoDescription: string;
  seoCopy: string;
  coverImage: string;
  images: GalleryImageVM[];
};

const visibleImages = (slug: string) =>
  getDb()
    .select()
    .from(schema.galleryImages)
    .where(
      and(eq(schema.galleryImages.gallerySlug, slug), eq(schema.galleryImages.visible, 1)),
    )
    .orderBy(asc(schema.galleryImages.sortOrder), asc(schema.galleryImages.id));

async function loadGalleries(): Promise<GalleryVM[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.galleries)
    .orderBy(asc(schema.galleries.sortOrder));
  const images = await Promise.all(rows.map((r) => visibleImages(r.slug)));
  return rows.map((r, i) => {
    const imgs = images[i].map((img) => ({
      file: mediaUrl(img.src),
      width: img.width,
      height: img.height,
      featured: img.featured === 1,
    }));
    const cover = r.coverImage ? mediaUrl(r.coverImage) : "";
    // The cover set in admin should lead the gallery, wherever it sits
    // in sort order.
    const ordered = cover
      ? [...imgs.filter((img) => img.file === cover), ...imgs.filter((img) => img.file !== cover)]
      : imgs;
    return {
      slug: r.slug,
      title: r.title,
      category: r.category,
      blurb: r.blurb,
      seoTitle: r.seoTitle ?? "",
      seoDescription: r.seoDescription ?? "",
      seoCopy: r.seoCopy ?? "",
      coverImage: cover,
      images: ordered,
    };
  });
}

export const getGalleries = unstable_cache(loadGalleries, ["content:galleries"], {
  tags: [TAGS.galleries],
  revalidate: 300,
});

export async function getGalleryBySlug(slug: string): Promise<GalleryVM | undefined> {
  const galleries = await getGalleries();
  return galleries.find((g) => g.slug === slug);
}

export type FilmVM = { id: number; title: string; src: string; poster: string };

const loadFilms = async (): Promise<FilmVM[]> => {
  const rows = await getDb()
    .select()
    .from(schema.films)
    .where(eq(schema.films.visible, 1))
    .orderBy(asc(schema.films.sortOrder), asc(schema.films.id));
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    src: mediaUrl(r.videoSrc),
    poster: r.posterSrc ? mediaUrl(r.posterSrc) : "",
  }));
};

export const getFilms = unstable_cache(loadFilms, ["content:films"], {
  tags: [TAGS.films],
  revalidate: 300,
});

export type ServiceVM = {
  slug: string;
  href: string;
  title: string;
  subtitle: string;
  image: string;
  frames: number;
  style: string;
};

const loadServices = async (): Promise<ServiceVM[]> => {
  const rows = await getDb()
    .select()
    .from(schema.services)
    .orderBy(asc(schema.services.sortOrder));
  return rows.map((r) => ({
    slug: r.slug,
    href: `/${r.slug}`,
    title: r.title,
    subtitle: r.subtitle,
    image: r.coverImage ? mediaUrl(r.coverImage) : "",
    frames: r.frames,
    style: r.style,
  }));
};

export const getServices = unstable_cache(loadServices, ["content:services"], {
  tags: [TAGS.services],
  revalidate: 300,
});

export type TestimonialVM = { id: number; text: string; name: string; role: string };

const loadTestimonials = async (): Promise<TestimonialVM[]> => {
  const rows = await getDb()
    .select()
    .from(schema.testimonials)
    .where(eq(schema.testimonials.visible, 1))
    .orderBy(asc(schema.testimonials.sortOrder), asc(schema.testimonials.id));
  return rows.map((r) => ({ id: r.id, text: r.quote, name: r.name, role: r.role }));
};

export const getTestimonials = unstable_cache(loadTestimonials, ["content:testimonials"], {
  tags: [TAGS.testimonials],
  revalidate: 300,
});

export type FaqVM = { id: number; q: string; a: string };

const loadFaqs = async (): Promise<FaqVM[]> => {
  const rows = await getDb()
    .select()
    .from(schema.faqs)
    .where(eq(schema.faqs.visible, 1))
    .orderBy(asc(schema.faqs.sortOrder), asc(schema.faqs.id));
  return rows.map((r) => ({ id: r.id, q: r.question, a: r.answer }));
};

export const getFaqs = unstable_cache(loadFaqs, ["content:faqs"], {
  tags: [TAGS.faqs],
  revalidate: 300,
});

export type SettingsVM = Record<string, string>;

const loadSettings = async (): Promise<SettingsVM> => {
  const rows = await getDb().select().from(schema.siteSettings);
  const out: SettingsVM = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
};

export const getSettings = unstable_cache(loadSettings, ["content:settings"], {
  tags: [TAGS.settings],
  revalidate: 300,
});

export type HomeTileVM = {
  href: string;
  label: string;
  file: string;
  alt: string;
  position: string;
};

export type HomeVM = {
  heroEyebrow: string;
  heroH1A: string;
  heroH1B: string;
  heroSub: string;
  heroProof: string;
  aboutNames: string;
  aboutP1: string;
  aboutP2: string;
  aboutImage: string;
  tiles: HomeTileVM[];
};

const loadHome = async (): Promise<HomeVM> => {
  const db = getDb();
  const [settings, tiles] = await Promise.all([
    loadSettings(),
    db
      .select()
      .from(schema.homeTiles)
      .where(eq(schema.homeTiles.visible, 1))
      .orderBy(asc(schema.homeTiles.sortOrder), asc(schema.homeTiles.id)),
  ]);
  return {
    heroEyebrow: settings.hero_eyebrow ?? "",
    heroH1A: settings.hero_h1_a ?? "",
    heroH1B: settings.hero_h1_b ?? "",
    heroSub: settings.hero_sub ?? "",
    heroProof: settings.hero_proof ?? "",
    aboutNames: settings.about_names ?? "",
    aboutP1: settings.about_p1 ?? "",
    aboutP2: settings.about_p2 ?? "",
    aboutImage: mediaUrl(settings.about_image ?? "/ABOUT.png"),
    tiles: tiles.map((t) => ({
      href: t.href,
      label: t.label,
      file: mediaUrl(t.src),
      alt: t.alt,
      position: t.position,
    })),
  };
};

export const getHome = unstable_cache(loadHome, ["content:home"], {
  tags: [TAGS.home],
  revalidate: 300,
});
