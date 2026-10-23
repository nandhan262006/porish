import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb, schema } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { mediaUrl } from "@/lib/media";
import AdminForm from "@/components/admin/AdminForm";
import CoverButton from "@/components/admin/CoverButton";
import Uploader from "@/components/admin/Uploader";
import { TinyAction } from "@/components/admin/Submit";
import FeatureToggle from "@/components/admin/FeatureToggle";
import { addPhoto, deletePhoto, movePhoto, savePhoto, setCover, toggleFeatured, togglePhoto } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: `Gallery · ${slug}` };
}

export default async function AdminGalleryPhotosPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;

  const db = getDb();
  const [gallery] = await db.select().from(schema.galleries).where(eq(schema.galleries.slug, slug));
  if (!gallery) notFound();
  const photos = await db
    .select()
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.gallerySlug, slug))
    .orderBy(asc(schema.galleryImages.sortOrder), asc(schema.galleryImages.id));

  const registerUpload = addPhoto.bind(null, slug);

  return (
    <main>
      <p className="eyebrow">Studio CMS · Galleries</p>
      <h1 className="serif-display mt-3 text-4xl md:text-5xl">{gallery.title}</h1>
      <p className="mt-3 max-w-xl text-[0.9375rem] leading-7 text-muted">
        <Link href="/admin/galleries" className="underline underline-offset-4">← All galleries</Link>
        {" · "}
        <a href={`/${slug}`} target="_blank" rel="noreferrer" className="underline underline-offset-4">
          view live ↗
        </a>
        {" · "}<span data-live>{photos.filter((p) => p.visible).length}</span> of{" "}
        <span data-total>{photos.length}</span> frames live
      {" · ★ "}<span data-featured>{photos.filter((p) => p.featured === 1 && p.visible).length}</span>{" "}
      on the homepage strip. Star as many as you want — every starred live photo shows there. Hide removes a photo from the live gallery only. Use ↑ ↓ to reorder frames.
      </p>

      <div className="mt-6 max-w-lg">
        <Uploader
          folder={slug}
          kind="image"
          multiple
          label="Add photos to this gallery"
          hint="JPG / PNG / WebP / AVIF — goes straight to R2, appended at the end of the grid."
          onUploaded={registerUpload}
        />
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {photos.map((photo, i) => (
          <li
            key={photo.id}
            data-item
            className={`rounded-2xl border border-black/10 bg-cream p-3 ${photo.visible ? "" : "opacity-45"}`}
          >
            <div className="photo relative aspect-[4/5] overflow-hidden rounded-xl bg-[#efe7de]">
              {/* Plain img: dozens of thumbs, no optimizer round-trips needed. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(photo.src)}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span
                data-cover-badge
                className={`absolute left-2 top-2 rounded-full bg-terracotta px-2 py-0.5 text-[9px] font-semibold tracking-[0.18em] uppercase text-background ${gallery.coverImage === photo.src ? "" : "hidden"}`}
              >
                Cover
              </span>
              <span
                data-feature-badge
                className={`absolute right-2 top-2 rounded-full bg-[#1a1410]/85 px-2 py-0.5 text-[9px] font-semibold tracking-[0.18em] uppercase text-[#f3c7b6] ${photo.featured === 1 ? "" : "hidden"}`}
              >
                ★ Home
              </span>
            </div>
            <p className="mt-2 truncate text-[10px] tracking-[0.08em] uppercase text-muted" title={photo.src}>
              {photo.src.split("/").pop()}
            </p>
            <AdminForm action={savePhoto} className="mt-2">
              <input type="hidden" name="id" value={photo.id} />
              <input
                type="text"
                name="alt"
                defaultValue={photo.alt}
                placeholder="Alt text…"
                aria-label={`Alt text for frame ${i + 1}`}
                className="w-full rounded-lg border border-black/15 bg-white/70 px-2 py-1.5 text-xs outline-none focus:border-terracotta"
              />
              <button
                type="submit"
                className="mt-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-terracotta hover:underline"
              >
                Save alt
              </button>
            </AdminForm>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <FeatureToggle
                action={toggleFeatured}
                id={photo.id}
                featured={photo.featured === 1}
              />
              <TinyAction
                action={togglePhoto}
                label={photo.visible ? "Hide" : "Show"}
                args={{ id: photo.id }}
                tone="accent"
                toggle={{ on: "Hide", off: "Show" }}
                initialVisible={!!photo.visible}
                refresh={false}
              />
              <CoverButton action={setCover} slug={slug} src={photo.src} />
              <TinyAction
                action={movePhoto}
                label="↑"
                args={{ id: photo.id, dir: "up" }}
                tone="neutral"
              />
              <TinyAction
                action={movePhoto}
                label="↓"
                args={{ id: photo.id, dir: "down" }}
                tone="neutral"
              />
              <TinyAction
                action={deletePhoto}
                label="✕"
                args={{ id: photo.id }}
                tone="danger"
                confirm={`Delete this frame permanently? It disappears from the gallery immediately and cannot be undone from here.`}
                optimistic
                refresh={false}
                liveDelta={photo.visible ? -1 : 0}
                totalDelta={-1}
                featuredDelta={photo.featured === 1 ? -1 : 0}
              />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
