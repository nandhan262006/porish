"use server";

import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { TAGS } from "@/lib/content";
import { formId, formString, publish, requireAdmin } from "@/lib/admin";

const table = schema.faqs;

export async function saveFaq(formData: FormData) {
  await requireAdmin();
  const id = Number(formString(formData, "id"));
  const question = formString(formData, "question");
  const answer = formString(formData, "answer");
  if (!question || !answer) throw new Error("Question and answer are required.");

  const db = getDb();
  if (Number.isInteger(id) && id > 0) {
    await db.update(table).set({ question, answer }).where(eq(table.id, id));
  } else {
    const all = await db.select({ n: table.sortOrder }).from(table);
    const next = all.reduce((m, r) => Math.max(m, r.n), -1) + 1;
    await db.insert(table).values({ question, answer, sortOrder: next, visible: 1 });
  }
  publish(TAGS.faqs);
}

export async function deleteFaq(formData: FormData) {
  await requireAdmin();
  await getDb().delete(table).where(eq(table.id, formId(formData)));
  publish(TAGS.faqs);
}

export async function toggleFaq(formData: FormData) {
  await requireAdmin();
  const id = formId(formData);
  const db = getDb();
  const [row] = await db.select().from(table).where(eq(table.id, id));
  if (!row) return;
  await db.update(table).set({ visible: row.visible ? 0 : 1 }).where(eq(table.id, id));
  publish(TAGS.faqs);
}

/** Swap a FAQ with its neighbour (dir "up" | "down"). */
export async function moveFaq(formData: FormData) {
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
  publish(TAGS.faqs);
}

