"use server";

import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { TAGS } from "@/lib/content";
import { formId, formString, publish, requireAdmin } from "@/lib/admin";
import type { UploadedMeta } from "@/lib/upload";

const table = schema.homeTiles;

export async function saveTile(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const href = formString(formData, "href");
  const label = formString(formData, "label");
  const alt = formString(formData, "alt");
  const position = formString(formData, "position");
  if (!href || !label) throw new Error("Link and label are required.");
  await getDb()
    .update(table)
    .set({ href, label, alt, position: position || "center 35%" })
    .where(eq(table.id, id));
  publish(TAGS.home);
}

export async function applyTileImage(id: number, meta: UploadedMeta) {
  await requireAdmin();
  await getDb().update(table).set({ src: meta.key }).where(eq(table.id, id));
  publish(TAGS.home);
}

/** Used by the gallery photo picker (called straight from the client). */
export async function pickTileImage(id: number, src: string) {
  await requireAdmin();
  if (!src) throw new Error("Missing image source.");
  await getDb().update(table).set({ src }).where(eq(table.id, id));
  publish(TAGS.home);
}

export async function toggleTile(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const db = getDb();
  const [row] = await db.select().from(table).where(eq(table.id, id));
  if (!row) return;
  await db.update(table).set({ visible: row.visible ? 0 : 1 }).where(eq(table.id, id));
  publish(TAGS.home);
}


export async function deleteTile(formData: FormData) {
  await requireAdmin();
  await getDb().delete(table).where(eq(table.id, formId(formData)));
  publish(TAGS.home);
}

/** Append a spare tile. The live hero only shows the first three live
 *  tiles, so a new one waits as a spare until it is moved up. Its image
 *  defaults to the first visible gallery photo (or the first tile's
 *  image) — change it with the picker or uploader afterwards. */
export async function createTile(formData: FormData) {
  await requireAdmin();
  const href = formString(formData, "href");
  const label = formString(formData, "label");
  if (!href || !label) throw new Error("Link and label are required.");
  const db = getDb();
  const [firstPhoto] = await db
    .select({ src: schema.galleryImages.src })
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.visible, 1))
    .orderBy(asc(schema.galleryImages.sortOrder), asc(schema.galleryImages.id));
  const [firstTile] = await db
    .select({ src: table.src })
    .from(table)
    .orderBy(asc(table.sortOrder), asc(table.id));
  const src = firstPhoto?.src ?? firstTile?.src ?? "";
  if (!src) {
    throw new Error(
      "Add photos to a gallery first — a hero tile needs an image.",
    );
  }
  const all = await db.select({ n: table.sortOrder }).from(table);
  const next = all.reduce((m, r) => Math.max(m, r.n), -1) + 1;
  await db.insert(table).values({
    href,
    label,
    src,
    alt: label,
    position: "center 35%",
    sortOrder: next,
    visible: 1,
  });
  publish(TAGS.home);
}

/** Swap a tile with its neighbour (dir "up" | "down"). */
export async function moveTile(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const dir = formString(formData, "dir") === "down" ? 1 : -1;
  const db = getDb();
  const rows = await db
    .select({ id: table.id, sortOrder: table.sortOrder })
    .from(table)
    .orderBy(asc(table.sortOrder), asc(table.id));
  const idx = rows.findIndex((r) => r.id === id);
  const other = rows[idx + dir];
  if (idx < 0 || !other) return;
  const cur = rows[idx];
  await db.update(table).set({ sortOrder: other.sortOrder }).where(eq(table.id, cur.id));
  await db.update(table).set({ sortOrder: cur.sortOrder }).where(eq(table.id, other.id));
  publish(TAGS.home);
}
