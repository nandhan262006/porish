"use server";

import { inArray, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { TAGS } from "@/lib/content";
import { publish, requireAdmin } from "@/lib/admin";
import type { UploadedMeta } from "@/lib/upload";

// Keys the dashboard may write. Anything else in the table is read-only.
const EDITABLE_SETTINGS = [
  "phone_display",
  "phone_tel",
  "email",
  "instagram",
  "maps_url",
  "address",
  "hours",
  "rating_value",
  "review_count",
  "hero_eyebrow",
  "hero_h1_a",
  "hero_h1_b",
  "hero_sub",
  "hero_proof",
  "about_names",
  "about_p1",
  "about_p2",
  "about_image",
] as const;

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const t = new Date().toISOString();
  const rows = EDITABLE_SETTINGS.map((key) => ({
    key,
    value: String(formData.get(key) ?? "").trim(),
    updatedAt: t,
  })).filter((r) => r.value.length > 0);

  const db = getDb();
  if (rows.length) {
    await db
      .insert(schema.siteSettings)
      .values(rows)
      .onConflictDoUpdate({
        target: schema.siteSettings.key,
        set: { value: sql`excluded.value`, updatedAt: t },
      });
  }
  // keys cleared to "" still exist in `rows` filter above; blank them explicitly
  const cleared = EDITABLE_SETTINGS.filter(
    (key) => String(formData.get(key) ?? "").trim() === "",
  );
  if (cleared.length) {
    await db
      .update(schema.siteSettings)
      .set({ value: "", updatedAt: t })
      .where(inArray(schema.siteSettings.key, cleared));
  }

  publish(TAGS.settings, TAGS.home);
}

/** About portrait — stores the R2 key (or gallery src) like hero tiles. */
export async function setAboutImage(meta: UploadedMeta) {
  await requireAdmin();
  if (!meta.key) throw new Error("Missing image key.");
  const t = new Date().toISOString();
  await getDb()
    .insert(schema.siteSettings)
    .values({ key: "about_image", value: meta.key, updatedAt: t })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value: meta.key, updatedAt: t },
    });
  publish(TAGS.settings, TAGS.home);
}

/** Pick the about portrait from an existing gallery frame. */
export async function pickAboutImage(src: string) {
  await requireAdmin();
  if (!src) throw new Error("Missing image source.");
  const t = new Date().toISOString();
  await getDb()
    .insert(schema.siteSettings)
    .values({ key: "about_image", value: src, updatedAt: t })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value: src, updatedAt: t },
    });
  publish(TAGS.settings, TAGS.home);
}
