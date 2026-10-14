import "server-only";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "./session";
import { TAGS } from "./content";

/** Guard for every admin server action: throws the user to login
 *  when the session cookie is missing/invalid. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/** Publish helper: expire the tag immediately (read-your-own-writes),
 *  so the next hit to a tagged page waits for fresh data instead of
 *  serving the old HTML. All callers are Server Actions, which is the
 *  only context updateTag supports. */
export function publish(...tags: (typeof TAGS)[keyof typeof TAGS][]) {
  for (const tag of tags) updateTag(tag);
}

export function formString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function formInt(formData: FormData, key: string, fallback = 0): number {
  const n = Number(formString(formData, key));
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export function formId(formData: FormData): number {
  const id = formInt(formData, "id", NaN);
  if (!Number.isInteger(id)) throw new Error(`Missing or invalid id: ${id}`);
  return id;
}
