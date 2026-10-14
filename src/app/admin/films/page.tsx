import { asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import AdminForm from "@/components/admin/AdminForm";
import Field from "@/components/admin/Field";
import Submit, { TinyAction } from "@/components/admin/Submit";
import Uploader from "@/components/admin/Uploader";
import { addFilmUpload, applyFilmVideo, deleteFilm, moveFilm, saveFilm, toggleFilm } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Films" };

export default async function AdminFilmsPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const rows = await getDb()
    .select()
    .from(schema.films)
    .orderBy(asc(schema.films.sortOrder), asc(schema.films.id));

  return (
    <main>
      <p className="eyebrow">Studio CMS · Films</p>
      <h1 className="serif-display mt-3 text-4xl md:text-5xl">Wedding films</h1>
      <p className="mt-3 max-w-xl text-[0.9375rem] leading-7 text-muted">
        The Films section on the homepage. Hide takes a film off the live site. Upload replaces the file. Use ↑ ↓ to reorder.
      </p>

      <ul className="mt-8 space-y-5">
        {rows.map((row, i) => (
          <li
            key={row.id}
            data-item
            className={`rounded-3xl border border-black/10 bg-cream p-5 md:p-6 ${row.visible ? "" : "opacity-50"}`}
          >
            <AdminForm action={saveFilm} className="grid gap-4 md:grid-cols-12">
              <input type="hidden" name="id" value={row.id} />
              <div className="flex flex-col gap-4 md:col-span-4">
                <Field name="title" label={`Film ${i + 1}`} defaultValue={row.title} />
                <Field name="posterSrc" label="Poster image (optional)" defaultValue={row.posterSrc ?? ""} hint="Path or https:// URL" />
              </div>
              <div className="flex flex-col gap-4 md:col-span-6">
                <Field name="videoSrc" label="Video source" defaultValue={row.videoSrc} hint="Path like /videos/… or a full https:// URL" />
              </div>
              <div className="flex items-end md:col-span-2">
                <Submit />
              </div>
            </AdminForm>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4">
              <TinyAction action={toggleFilm} label={row.visible ? "Hide" : "Show"} args={{ id: row.id }} tone="accent" toggle={{ on: "Hide", off: "Show" }} initialVisible={!!row.visible} refresh={false} />
              <TinyAction action={deleteFilm} label="Delete" args={{ id: row.id }} tone="danger"
                confirm="Delete this film permanently? This cannot be undone."
                optimistic refresh={false} />
              <TinyAction action={moveFilm} label="↑" args={{ id: row.id, dir: "up" }} tone="neutral" />
              <TinyAction action={moveFilm} label="↓" args={{ id: row.id, dir: "down" }} tone="neutral" />
              <span data-visibility-status className="ml-auto text-[11px] tracking-[0.18em] uppercase text-muted">
                {row.visible ? "Live" : "Hidden"}
              </span>
            </div>
            <div className="mt-3">
              <Uploader
                folder={`films-${row.id}`}
                kind="video"
                label="Replace video"
                hint="MP4 / WebM / MOV — uploads straight to R2 and swaps this row’s source."
                onUploaded={applyFilmVideo.bind(null, row.id)}
              />
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-10 rounded-3xl bg-[#1a1410] p-6 text-[#f6f1ea] md:p-8">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#f3c7b6]">Add new film</p>
        <AdminForm action={saveFilm} refresh className="mt-4 grid gap-4 md:grid-cols-12">
          <div className="flex flex-col gap-4 md:col-span-4">
            <Field name="title" label="Title" placeholder="Cinematic 05" />
            <Field name="posterSrc" label="Poster image (optional)" />
          </div>
          <div className="flex flex-col gap-4 md:col-span-6">
            <Field name="videoSrc" label="Video source" placeholder="/videos/… or https://…" />
          </div>
          <div className="flex items-end md:col-span-2">
            <Submit>Add</Submit>
          </div>
        </AdminForm>
        <div className="mt-4 max-w-lg">
          <Uploader
            folder="films"
            kind="video"
            label="…or upload a video file"
            hint="Goes to R2 and creates the film row automatically."
            onUploaded={addFilmUpload}
          />
        </div>
      </section>
    </main>
  );
}
