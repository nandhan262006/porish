import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { mediaUrl } from "@/lib/media";
import AdminForm from "@/components/admin/AdminForm";
import Field from "@/components/admin/Field";
import Submit, { TinyAction } from "@/components/admin/Submit";
import Uploader from "@/components/admin/Uploader";
import PhotoPicker from "@/components/admin/PhotoPicker";
import {
  applyTileImage,
  createTile,
  deleteTile,
  moveTile,
  saveTile,
  pickTileImage,
  toggleTile,
} from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Homepage" };

const SLOT_LABELS = ["Left wing", "Centre (front)", "Right wing"];

export default async function AdminHomePage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const db = getDb();
  const [tiles, photos] = await Promise.all([
    db.select().from(schema.homeTiles).orderBy(asc(schema.homeTiles.sortOrder), asc(schema.homeTiles.id)),
    db
      .select({
        src: schema.galleryImages.src,
        visible: schema.galleryImages.visible,
        title: schema.galleries.title,
        slug: schema.galleries.slug,
      })
      .from(schema.galleryImages)
      .innerJoin(schema.galleries, eq(schema.galleries.slug, schema.galleryImages.gallerySlug))
      .orderBy(asc(schema.galleryImages.sortOrder)),
  ]);

  const pickable = photos
    .filter((p) => p.visible)
    .map((p) => ({ src: p.src, thumb: mediaUrl(p.src), title: p.title }));

  // Acknowledge where each tile image comes from: match against gallery
  // frames (seeded paths carry a leading slash, R2 keys don't).
  const norm = (s: string) => s.replace(/^\/+/, "");
  const sourceBySrc = new Map(photos.map((p) => [norm(p.src), p]));

  return (
    <main>
      <p className="eyebrow">Studio CMS · Homepage</p>
      <h1 className="serif-display mt-3 text-4xl md:text-5xl">Hero fan trio</h1>
      <p className="mt-3 max-w-2xl text-[0.9375rem] leading-7 text-muted">
        The three fanned photos under the headline. The first three that are Live fill the wings, left to right. Tilt and size stay fixed. Use ↑ ↓ to reorder the slots.
        Hero wording lives in <Link href="/admin/settings" className="underline underline-offset-4">Settings → Homepage hero</Link>.
      </p>

      <ul className="mt-8 space-y-6">
        {tiles.map((tile, i) => {
          const source = sourceBySrc.get(norm(tile.src));
          const fileName = tile.src.split("/").pop() || tile.src;
          return (
          <li key={tile.id} data-item className={`rounded-3xl border border-black/10 bg-cream p-5 md:p-6 ${tile.visible ? "" : "opacity-50"}`}>
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="shrink-0 self-center md:self-start">
                <div className="photo relative h-56 w-44 overflow-hidden rounded-2xl bg-[#efe7de]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(tile.src)} alt={tile.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
                <p className="mt-2 w-44 text-[11px] leading-5 text-muted" title={tile.src}>
                  {source ? (
                    <>
                      From galleries ·{" "}
                      <Link href={`/admin/galleries/${source.slug}`} className="underline underline-offset-2 hover:text-foreground">
                        {source.title}
                      </Link>
                    </>
                  ) : (
                    "Custom upload · not in galleries"
                  )}
                  <span className="block truncate font-medium text-foreground/70">{fileName}</span>
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-terracotta">
                  Slot {i + 1} · {SLOT_LABELS[i] ?? "Spare"}
                </p>
                <AdminForm action={saveTile} className="mt-3 grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="id" value={tile.id} />
                  <Field name="label" label="Label" defaultValue={tile.label} />
                  <Field name="href" label="Links to" defaultValue={tile.href} hint="e.g. /weddings" />
                  <Field name="alt" label="Alt text" defaultValue={tile.alt} />
                  <Field name="position" label="Crop focus" defaultValue={tile.position} hint="CSS object-position class, e.g. object-[center_30%]" />
                  <div className="md:col-span-2">
                    <Submit />
                  </div>
                </AdminForm>

                <div className="mt-4 border-t border-black/10 pt-4">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted">Change image</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <PhotoPicker photos={pickable} onPick={pickTileImage.bind(null, tile.id)} buttonLabel="Choose from galleries" />
                  </div>
                </div>

                <div className="mt-3">
                  <Uploader
                    folder={`hero-${tile.id}`}
                    kind="image"
                    label="Upload new photo"
                    hint="One JPG/PNG — goes to R2 and replaces this tile."
                    onUploaded={applyTileImage.bind(null, tile.id)}
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4">
                  <TinyAction action={toggleTile} label={tile.visible ? "Hide" : "Show"} args={{ id: tile.id }} tone="accent" toggle={{ on: "Hide", off: "Show" }} initialVisible={!!tile.visible} refresh={false} />
                  <TinyAction action={deleteTile} label="Delete" args={{ id: tile.id }} tone="danger"
                  confirm="Delete this homepage tile permanently?"
                  optimistic refresh={false} />
                  <TinyAction action={moveTile} label="↑" args={{ id: tile.id, dir: "up" }} tone="neutral" />
                  <TinyAction action={moveTile} label="↓" args={{ id: tile.id, dir: "down" }} tone="neutral" />
                  <span data-visibility-status className="ml-auto text-[11px] tracking-[0.18em] uppercase text-muted">{tile.visible ? "Live" : "Hidden"}</span>
                </div>
              </div>
            </div>
          </li>
          );
        })}
      </ul>

      <section className="mt-10 rounded-3xl bg-[#1a1410] p-6 text-[#f6f1ea] md:p-8">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#f3c7b6]">Add a spare tile</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
          Only the first three live tiles fill the fan — a new one waits as a spare until you move it up. Its photo and alt text can be changed afterwards.
        </p>
        <AdminForm action={createTile} refresh className="mt-4 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <Field name="label" label="Label" placeholder="Pre-Wedding" />
          </div>
          <div className="md:col-span-5">
            <Field name="href" label="Links to" placeholder="/pre-wedding" />
          </div>
          <div className="flex items-end md:col-span-2">
            <Submit>Add</Submit>
          </div>
        </AdminForm>
      </section>
    </main>
  );
}
