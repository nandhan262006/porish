"use server";

import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { TAGS } from "@/lib/content";
import { formId, formString, publish, requireAdmin } from "@/lib/admin";
import { deleteR2Objects } from "@/lib/storage";
import type { UploadedMeta } from "@/lib/upload";

const table = schema.films;

export async function saveFilm(formData: FormData) {
  await requireAdmin();
  const id = Number(formString(formData, "id"));
  const title = formString(formData, "title");
  const videoSrc = formString(formData, "videoSrc");
  const posterSrc = formString(formData, "posterSrc");
  if (!title || !videoSrc) throw new Error("Title and video source are required.");

  const db = getDb();
  if (Number.isInteger(id) && id > 0) {
    await db.update(table).set({ title, videoSrc, posterSrc }).where(eq(table.id, id));
  } else {
    const all = await db.select({ n: table.sortOrder }).from(table);
    const next = all.reduce((m, r) => Math.max(m, r.n), -1) + 1;
    await db.insert(table).values({ title, videoSrc, posterSrc, sortOrder: next, visible: 1 });
  }
  publish(TAGS.films);
}

export async function deleteFilm(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const db = getDb();
  const [row] = await db.select().from(table).where(eq(table.id, id));
  if (!row) return;
  await db.delete(table).where(eq(table.id, id));
  // Poster may be a shared gallery photo — only the video file is owned here.
  await deleteR2Objects([row.videoSrc]);
  publish(TAGS.films);
}

export async function toggleFilm(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const db = getDb();
  const [row] = await db.select().from(table).where(eq(table.id, id));
  if (!row) return;
  await db.update(table).set({ visible: row.visible ? 0 : 1 }).where(eq(table.id, id));
  publish(TAGS.films);
}


/** Swap a film with its neighbour (dir "up" | "down"). */
export async function moveFilm(formData: FormData) {
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
  publish(TAGS.films);
}

/** Called by the client Uploader after a video lands in R2. */
export async function applyFilmVideo(id: number, meta: UploadedMeta) {
  await requireAdmin();
  await getDb().update(table).set({ videoSrc: meta.key }).where(eq(table.id, id));
  publish(TAGS.films);
}

export async function addFilmUpload(meta: UploadedMeta) {
  await requireAdmin();
  const db = getDb();
  const all = await db.select({ n: table.sortOrder }).from(table);
  const next = all.reduce((m, r) => Math.max(m, r.n), -1) + 1;
  const title = meta.filename.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").slice(0, 80) || "New film";
  await db.insert(table).values({ title, videoSrc: meta.key, posterSrc: "", sortOrder: next, visible: 1 });
  publish(TAGS.films);
}
