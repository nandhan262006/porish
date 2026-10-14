import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { mediaUrl } from "@/lib/media";
import AdminForm from "@/components/admin/AdminForm";
import Field from "@/components/admin/Field";
import Submit, { TinyAction } from "@/components/admin/Submit";
import { deleteService, moveService, saveService } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const db = getDb();
  const [rows, photos] = await Promise.all([
    db.select().from(schema.services).orderBy(asc(schema.services.sortOrder)),
    db
      .select({
        src: schema.galleryImages.src,
        title: schema.galleries.title,
        slug: schema.galleries.slug,
      })
      .from(schema.galleryImages)
      .innerJoin(schema.galleries, eq(schema.galleries.slug, schema.galleryImages.gallerySlug)),
  ]);

  const norm = (s: string) => (s ?? "").replace(/^\/+/, "");
  const sourceBySrc = new Map(photos.map((p) => [norm(p.src), p]));

  return (
    <main>
      <p className="eyebrow">Studio CMS · Services</p>
      <h1 className="serif-display mt-3 text-4xl md:text-5xl">What we shoot</h1>
      <p className="mt-3 max-w-xl text-[0.9375rem] leading-7 text-muted">
        The spinning carousel on the homepage. Cover images pulled from a gallery are labeled under the photo. Use ↑ ↓ to reorder the cards.
      </p>

      <ul className="mt-8 space-y-5">
        {rows.map((row, i) => {
          const source = row.coverImage ? sourceBySrc.get(norm(row.coverImage)) : undefined;
          const fileName = (row.coverImage ?? "").split("/").pop() || "";
          return (
          <li key={row.slug} data-item className="rounded-3xl border border-black/10 bg-cream p-5 md:p-6">
            <div className="flex gap-5">
              <div className="hidden w-24 shrink-0 sm:block">
                <div className="relative h-28 w-24 overflow-hidden rounded-xl bg-[#efe7de]">
                  {row.coverImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={mediaUrl(row.coverImage)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                  ) : null}
                </div>
                <p className="mt-2 text-[11px] leading-5 text-muted" title={row.coverImage ?? ""}>
                  {source ? (
                    <>
                      From galleries ·{" "}
                      <Link href={`/admin/galleries/${source.slug}`} className="underline underline-offset-2 hover:text-foreground">
                        {source.title}
                      </Link>
                    </>
                  ) : row.coverImage ? (
                    "Custom · not in galleries"
                  ) : (
                    "No cover set"
                  )}
                  {fileName ? <span className="block truncate font-medium text-foreground/70">{fileName}</span> : null}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <AdminForm action={saveService} className="grid gap-4 md:grid-cols-12">
                  <input type="hidden" name="slug" value={row.slug} />
                  <div className="flex flex-col gap-4 md:col-span-4">
                    <Field name="title" label={`Service ${i + 1}`} defaultValue={row.title} />
                    <Field name="frames" label="Frames in gallery" type="number" defaultValue={String(row.frames)} />
                  </div>
                  <div className="flex flex-col gap-4 md:col-span-4">
                    <Field name="subtitle" label="Tagline" defaultValue={row.subtitle} textarea rows={2} />
                    <Field name="style" label="Style" defaultValue={row.style} />
                  </div>
                  <div className="flex flex-col gap-4 md:col-span-4">
                    <Field
                      name="coverImage"
                      label="Cover image"
                      defaultValue={row.coverImage ?? ""}
                      hint="Path like /phorish-extract/… or a full https:// URL"
                    />
                    <div className="flex items-end">
                      <Submit />
                    </div>
                  </div>
                </AdminForm>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4">
                  <TinyAction action={moveService} label="↑" args={{ slug: row.slug, dir: "up" }} tone="neutral" />
                  <TinyAction action={moveService} label="↓" args={{ slug: row.slug, dir: "down" }} tone="neutral" />
                  <TinyAction action={deleteService} label="Delete" args={{ slug: row.slug }} tone="danger"
                    confirm={`Delete the "${row.title}" service permanently? Its card disappears from the homepage carousel.`}
                    optimistic refresh={false} />
                  <span className="ml-auto text-[11px] tracking-[0.18em] uppercase text-muted">
                    /{row.slug}
                  </span>
                </div>
              </div>
            </div>
          </li>
          );
        })}
      </ul>

      <section className="mt-10 rounded-3xl bg-[#1a1410] p-6 text-[#f6f1ea] md:p-8">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#f3c7b6]">Add new service</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
          Name it exactly like its gallery so the card links to a live page (e.g. “Weddings” → /wedding). Add its cover afterwards in the card above.
        </p>
        <AdminForm action={saveService} refresh className="mt-4 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <Field name="title" label="Title" placeholder="Weddings" />
          </div>
          <div className="md:col-span-5">
            <Field name="subtitle" label="Tagline" placeholder="Documentary & candid…" />
          </div>
          <div className="flex items-end md:col-span-2">
            <Submit>Add</Submit>
          </div>
        </AdminForm>
      </section>
    </main>
  );
}
