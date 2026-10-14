import { asc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { count } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { mediaUrl } from "@/lib/media";
import AdminForm from "@/components/admin/AdminForm";
import Field from "@/components/admin/Field";
import Submit, { TinyAction } from "@/components/admin/Submit";
import { deleteGallery, saveGallery } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Galleries" };

export default async function AdminGalleriesPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const db = getDb();
  const [rows, counts] = await Promise.all([
    db.select().from(schema.galleries).orderBy(asc(schema.galleries.sortOrder)),
    db
      .select({ slug: schema.galleryImages.gallerySlug, n: count() })
      .from(schema.galleryImages)
      .groupBy(schema.galleryImages.gallerySlug),
  ]);
  const photoCount = new Map(counts.map((c) => [c.slug, c.n]));

  return (
    <main>
      <p className="eyebrow">Studio CMS · Galleries</p>
      <h1 className="serif-display mt-3 text-4xl md:text-5xl">Galleries</h1>
      <p className="mt-3 max-w-xl text-[0.9375rem] leading-7 text-muted">
        Open a gallery to upload photos, hide frames, star photos for the homepage, and write alt text.
      </p>

      <ul className="mt-8 space-y-5">
        {rows.map((row) => (
          <li key={row.slug} data-item className="rounded-3xl border border-black/10 bg-cream p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-20 shrink-0">
                <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-[#efe7de]" title={row.coverImage || "No cover set"}>
                  {row.coverImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={mediaUrl(row.coverImage)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                  ) : null}
                </div>
                <p className="mt-1 truncate text-[10px] text-muted" title={row.coverImage || "No cover set"}>
                  {row.coverImage ? `Cover · ${row.coverImage.split("/").pop()}` : "No cover"}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/galleries/${row.slug}`}
                  className="serif-display block text-2xl transition-colors hover:text-terracotta"
                >
                  {row.title}
                </Link>
                <p className="mt-1 text-xs tracking-[0.18em] uppercase text-muted">
                  /{row.slug} · {photoCount.get(row.slug) ?? 0} photos ·
                  {row.updatedAt ? `updated ${new Date(row.updatedAt).toLocaleDateString("en-in")}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TinyAction action={deleteGallery} label="Delete" args={{ slug: row.slug }} tone="danger"
                confirm={`Delete the whole "${row.title}" gallery and ALL of its photos? This cannot be undone.`}
                optimistic refresh={false} />
                <Link
                  href={`/admin/galleries/${row.slug}`}
                  className="inline-flex h-8 items-center border border-foreground/40 px-3 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors hover:bg-foreground hover:text-background"
                >
                  Edit photos →
                </Link>
              </div>
            </div>
            <details className="group mt-4 border-t border-black/10 pt-4">
              <summary className="cursor-pointer list-none text-[11px] font-semibold tracking-[0.2em] uppercase text-muted hover:text-foreground">
                Text & SEO
              </summary>
              <AdminForm action={saveGallery} className="mt-4 grid gap-4 md:grid-cols-2">
                <input type="hidden" name="slug" value={row.slug} />
                <Field name="title" label="Title" defaultValue={row.title} />
                <Field name="blurb" label="Blurb" defaultValue={row.blurb} textarea rows={2} />
                <Field name="seoTitle" label="SEO title" defaultValue={row.seoTitle ?? ""} />
                <Field name="seoDescription" label="SEO description" defaultValue={row.seoDescription ?? ""} textarea rows={3} />
                <div className="md:col-span-2">
                  <Field name="seoCopy" label="Hero copy (gallery page)" defaultValue={row.seoCopy ?? ""} textarea rows={3} hint="Shown under the gallery name banner." />
                </div>
                <div>
                  <Submit />
                </div>
              </AdminForm>
            </details>
          </li>
        ))}
      </ul>

      <section className="mt-10 rounded-3xl bg-[#1a1410] p-6 text-[#f6f1ea] md:p-8">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#f3c7b6]">Start a new gallery</p>
        <AdminForm action={saveGallery} refresh className="mt-4 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <Field name="title" label="Title" placeholder="Wedding Highlights" />
          </div>
          <div className="md:col-span-5">
            <Field name="blurb" label="Blurb" placeholder="One line about the story…" />
          </div>
          <div className="flex items-end md:col-span-2">
            <Submit>Create</Submit>
          </div>
        </AdminForm>
      </section>
    </main>
  );
}
