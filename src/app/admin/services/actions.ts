"use server";

import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { TAGS } from "@/lib/content";
import { formInt, formString, publish, requireAdmin } from "@/lib/admin";

const table = schema.services;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function saveService(formData: FormData) {
  await requireAdmin();
  const slug = formString(formData, "slug");
  const title = formString(formData, "title");
  const subtitle = formString(formData, "subtitle");
  const style = formString(formData, "style");
  const frames = formInt(formData, "frames");
  const coverImage = formString(formData, "coverImage");
  if (!title) throw new Error("Title is required.");

  const db = getDb();
  if (slug) {
    await getDb()
      .update(table)
      .set({ title, subtitle, note: subtitle, style, frames, coverImage })
      .where(eq(table.slug, slug));
  } else {
    const newSlug = slugify(title);
    if (!newSlug) throw new Error("Title must contain letters or numbers.");
    const [existing] = await db
      .select({ slug: table.slug })
      .from(table)
      .where(eq(table.slug, newSlug));
    if (existing) {
      throw new Error(
        `A service with the URL /${newSlug} already exists — pick a different title.`,
      );
    }
    const all = await db.select({ n: table.sortOrder }).from(table);
    const next = all.reduce((m, r) => Math.max(m, r.n), -1) + 1;
    await db.insert(table).values({
      slug: newSlug,
      title,
      subtitle,
      note: subtitle,
      style,
      frames,
      coverImage,
      sortOrder: next,
    });
  }
  publish(TAGS.services);
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  const slug = formString(formData, "slug");
  if (!slug) throw new Error("Missing slug.");
  // No R2 cleanup here on purpose: a service cover is usually a shared
  // gallery photo, owned by its gallery — deleting the file would break it.
  await getDb().delete(table).where(eq(table.slug, slug));
  publish(TAGS.services);
}

/** Swap a service with its neighbour (dir "up" | "down"). */
export async function moveService(formData: FormData) {
  await requireAdmin();
  const slug = formString(formData, "slug");
  if (!slug) throw new Error("Missing slug.");
  const dir = formString(formData, "dir") === "down" ? 1 : -1;
  const db = getDb();
  const rows = await db
    .select({ slug: table.slug, sortOrder: table.sortOrder })
    .from(table)
    .orderBy(asc(table.sortOrder), asc(table.slug));
  const idx = rows.findIndex((r) => r.slug === slug);
  const other = rows[idx + dir];
  if (idx < 0 || !other) return;
  const cur = rows[idx];
  await db.update(table).set({ sortOrder: other.sortOrder }).where(eq(table.slug, cur.slug));
  await db.update(table).set({ sortOrder: cur.sortOrder }).where(eq(table.slug, other.slug));
  publish(TAGS.services);
}
