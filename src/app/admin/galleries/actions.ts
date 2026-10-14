"use server";

import { and, asc, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { TAGS } from "@/lib/content";
import { formId, formString, publish, requireAdmin } from "@/lib/admin";
import { deleteR2Objects } from "@/lib/storage";
import type { UploadedMeta } from "@/lib/upload";

const galleries = schema.galleries;
const images = schema.galleryImages;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function saveGallery(formData: FormData) {
  await requireAdmin();
  const slug = formString(formData, "slug");
  const title = formString(formData, "title");
  const blurb = formString(formData, "blurb");
  const seoTitle = formString(formData, "seoTitle");
  const seoDescription = formString(formData, "seoDescription");
  const seoCopy = formString(formData, "seoCopy");
  if (!title) throw new Error("Title is required.");

  const db = getDb();
  if (slug) {
    await db
      .update(galleries)
      .set({ title, blurb, seoTitle, seoDescription, seoCopy, updatedAt: new Date().toISOString() })
      .where(eq(galleries.slug, slug));
  } else {
    const newSlug = slugify(title);
    if (!newSlug) throw new Error("Title must contain letters or numbers.");
    const [existing] = await db
      .select({ slug: galleries.slug })
      .from(galleries)
      .where(eq(galleries.slug, newSlug));
    if (existing) {
      throw new Error(
        `A gallery with the URL /${newSlug} already exists — pick a different title.`,
      );
    }
    const all = await db.select({ n: galleries.sortOrder }).from(galleries);
    const next = all.reduce((m, r) => Math.max(m, r.n), -1) + 1;
    await db
      .insert(galleries)
      .values({
        slug: newSlug,
        title,
        category: newSlug,
        blurb,
        seoTitle,
        seoDescription,
        seoCopy,
        sortOrder: next,
        updatedAt: new Date().toISOString(),
      });
  }
  publish(TAGS.galleries);
}

export async function deleteGallery(formData: FormData) {
  await requireAdmin();
  const slug = formString(formData, "slug");
  const db = getDb();
  const photoRows = await db
    .select({ src: images.src })
    .from(images)
    .where(eq(images.gallerySlug, slug));
  await db.delete(images).where(eq(images.gallerySlug, slug));
  await db.delete(galleries).where(eq(galleries.slug, slug));
  // Best-effort R2 cleanup so deleted frames stop costing storage.
  // Legacy local paths (/phorish-extract/…) are filtered inside.
  await deleteR2Objects(photoRows.map((p) => p.src));
  publish(TAGS.galleries);
}


/** Called by the client Uploader after bytes hit R2. Stores the bucket-relative path. */
export async function addPhoto(gallerySlug: string, meta: UploadedMeta) {
  await requireAdmin();
  const db = getDb();
  // One round-trip: compute the next sort position in a sub-select instead of
  // reading the whole list back first (matters on remote Turso).
  const next = sql`(select coalesce(max(${images.sortOrder}), -1) + 1 from ${images} where ${images.gallerySlug} = ${gallerySlug})`;
  await db.insert(images).values({
    gallerySlug,
    src: meta.key,
    alt: meta.filename.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").slice(0, 120),
    width: meta.width,
    height: meta.height,
    sortOrder: next,
    visible: 1,
  });
  publish(TAGS.galleries);
}

export async function savePhoto(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const alt = formString(formData, "alt");
  await getDb().update(images).set({ alt }).where(eq(images.id, id));
  publish(TAGS.galleries);
}

export async function togglePhoto(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  // Flip in place — one write, no read-first round-trip.
  await getDb()
    .update(images)
    .set({ visible: sql`1 - ${images.visible}` })
    .where(eq(images.id, id));
  publish(TAGS.galleries);
}

export async function toggleFeatured(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  await getDb()
    .update(images)
    .set({ featured: sql`1 - ${images.featured}` })
    .where(eq(images.id, id));
  publish(TAGS.galleries);
}

export async function deletePhoto(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const db = getDb();
  const [row] = await db.select().from(images).where(eq(images.id, id));
  if (!row) return;
  await db.delete(images).where(eq(images.id, id));
  // A deleted frame can't stay the gallery cover — clear it so the
  // list thumbnail falls back to "No cover" instead of a dead image.
  await db
    .update(galleries)
    .set({ coverImage: "", updatedAt: new Date().toISOString() })
    .where(
      and(
        eq(galleries.slug, row.gallerySlug),
        eq(galleries.coverImage, row.src),
      ),
    );
  await deleteR2Objects([row.src]);
  publish(TAGS.galleries);
}


export async function setCover(formData: FormData) {
  await requireAdmin();
  const slug = formString(formData, "slug");
  const src = formString(formData, "src");
  await getDb()
    .update(galleries)
    .set({ coverImage: src, updatedAt: new Date().toISOString() })
    .where(eq(galleries.slug, slug));
  publish(TAGS.galleries);
}

/** Swap a frame with its neighbour (dir "up" | "down") inside its gallery. */
export async function movePhoto(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const dir = formString(formData, "dir") === "down" ? 1 : -1;
  const db = getDb();
  const [row] = await db.select().from(images).where(eq(images.id, id));
  if (!row) return;
  const sibs = await db
    .select({ id: images.id, sortOrder: images.sortOrder })
    .from(images)
    .where(eq(images.gallerySlug, row.gallerySlug))
    .orderBy(asc(images.sortOrder), asc(images.id));
  const idx = sibs.findIndex((s) => s.id === id);
  const other = sibs[idx + dir];
  if (idx < 0 || !other) return;
  const cur = sibs[idx];
  await db
    .update(images)
    .set({ sortOrder: other.sortOrder })
    .where(eq(images.id, cur.id));
  await db
    .update(images)
    .set({ sortOrder: cur.sortOrder })
    .where(eq(images.id, other.id));
  publish(TAGS.galleries);
}
