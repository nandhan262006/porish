"use server";

import { inArray, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { TAGS } from "@/lib/content";
import { publish, requireAdmin } from "@/lib/admin";

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
