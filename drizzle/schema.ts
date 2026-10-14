import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/** Phase 1 CMS schema. Turso (libsql) compatible. Local dev uses file:./data/cms.db */

export const galleries = sqliteTable("galleries", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  blurb: text("blurb").notNull().default(""),
  seoTitle: text("seo_title").default(""),
  seoDescription: text("seo_description").default(""),
  seoCopy: text("seo_copy").default(""),
  coverImage: text("cover_image").default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: text("updated_at").notNull().default(""),
});

export const galleryImages = sqliteTable("gallery_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gallerySlug: text("gallery_slug")
    .notNull()
    .references(() => galleries.slug, { onDelete: "cascade" }),
  src: text("src").notNull(),
  alt: text("alt").notNull().default(""),
  width: integer("width").notNull().default(1200),
  height: integer("height").notNull().default(800),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible").notNull().default(1),
  featured: integer("featured").notNull().default(0),
});

export const films = sqliteTable("films", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  videoSrc: text("video_src").notNull(),
  posterSrc: text("poster_src").default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible").notNull().default(1),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  rating: integer("rating").notNull().default(5),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible").notNull().default(1),
});

export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible").notNull().default(1),
});

export const services = sqliteTable("services", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  note: text("note").notNull().default(""),
  style: text("style").notNull().default(""),
  frames: integer("frames").notNull().default(0),
  coverImage: text("cover_image").default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull().default(""),
});

export const homeTiles = sqliteTable("home_tiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  href: text("href").notNull(),
  label: text("label").notNull(),
  src: text("src").notNull(),
  alt: text("alt").notNull().default(""),
  position: text("position").notNull().default("object-[center_35%]"),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible").notNull().default(1),
});

export type GalleryRow = typeof galleries.$inferSelect;
export type GalleryImageRow = typeof galleryImages.$inferSelect;
export type FilmRow = typeof films.$inferSelect;
export type HomeTileRow = typeof homeTiles.$inferSelect;
