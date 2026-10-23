import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { mediaUrl } from "@/lib/media";
import AdminForm from "@/components/admin/AdminForm";
import Field from "@/components/admin/Field";
import Submit from "@/components/admin/Submit";
import Uploader from "@/components/admin/Uploader";
import PhotoPicker from "@/components/admin/PhotoPicker";
import { pickAboutImage, saveSettings, setAboutImage } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

const GROUPS: {
  title: string;
  copy: string;
  fields: { key: string; label: string; textarea?: boolean; rows?: number; type?: "text" | "number" | "email" | "url" | "tel"; hint?: string }[];
}[] = [
  {
    title: "Contact & studio",
    copy: "Phone, address, hours and socials — used across the site, footer and contact page.",
    fields: [
      { key: "phone_display", label: "Phone (shown)", type: "tel" },
      { key: "phone_tel", label: "Phone (tel: link)", type: "tel" },
      { key: "email", label: "Email", type: "email" },
      { key: "instagram", label: "Instagram URL", type: "url" },
      { key: "youtube", label: "YouTube URL", type: "url" },
      { key: "maps_url", label: "Google Maps link", type: "url" },
      { key: "address", label: "Studio address", textarea: true, rows: 2 },
      { key: "hours", label: "Opening hours" },
      { key: "rating_value", label: "Google rating", type: "number" },
      { key: "review_count", label: "Review count", type: "number" },
    ],
  },
  {
    title: "Homepage hero",
    copy: "The first thing couples see. Headline renders on two lines — second line is italic.",
    fields: [
      { key: "hero_eyebrow", label: "Eyebrow" },
      { key: "hero_h1_a", label: "Headline — line 1" },
      { key: "hero_h1_b", label: "Headline — line 2 (italic)" },
      { key: "hero_sub", label: "Sub-headline", textarea: true, rows: 3 },
      { key: "hero_proof", label: "Proof bar", hint: "Shown under the buttons: 100+ weddings · style · rating" },
    ],
  },
  {
    title: "About teaser",
    copy: "The studio intro block on the homepage. Use “ & ” between the two names to keep the italic ampersand.",
    fields: [
      { key: "about_names", label: "Names" },
      { key: "about_p1", label: "Paragraph 1", textarea: true, rows: 4 },
      { key: "about_p2", label: "Paragraph 2", textarea: true, rows: 4 },
      { key: "about_stat_1_value", label: "Stat 1 — value", hint: "The big number, e.g. 2020 or 100+" },
      { key: "about_stat_1_label", label: "Stat 1 — label", hint: "The small caption below it" },
      { key: "about_stat_2_value", label: "Stat 2 — value" },
      { key: "about_stat_2_label", label: "Stat 2 — label" },
      { key: "about_stat_3_value", label: "Stat 3 — value" },
      { key: "about_stat_3_label", label: "Stat 3 — label" },
    ],
  },
];

export default async function AdminSettingsPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const db = getDb();
  const [rows, photos] = await Promise.all([
    db.select().from(schema.siteSettings),
    db
      .select({
        src: schema.galleryImages.src,
        visible: schema.galleryImages.visible,
        title: schema.galleries.title,
      })
      .from(schema.galleryImages)
      .innerJoin(schema.galleries, eq(schema.galleries.slug, schema.galleryImages.gallerySlug))
      .orderBy(asc(schema.galleryImages.sortOrder)),
  ]);
  const values = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const aboutSrc = values.about_image ?? "/ABOUT.png";
  const pickable = photos
    .filter((p) => p.visible)
    .map((p) => ({ src: p.src, thumb: mediaUrl(p.src), title: p.title }));

  return (
    <main>
      <p className="eyebrow">Studio CMS · Settings</p>
      <h1 className="serif-display mt-3 text-4xl md:text-5xl">Site settings</h1>
      <p className="mt-3 max-w-xl text-[0.9375rem] leading-7 text-muted">
        Phone, address, homepage headline, and the about text. One save updates all of them on the live site.
      </p>

      <AdminForm action={saveSettings} className="mt-8 space-y-10">
        {GROUPS.map((group) => (
          <fieldset key={group.title} className="rounded-3xl border border-black/10 bg-cream p-6 md:p-8">
            <legend className="sr-only">{group.title}</legend>
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-terracotta">{group.title}</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{group.copy}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {group.fields.map((f) => (
                <Field
                  key={f.key}
                  name={f.key}
                  label={f.label}
                  defaultValue={values[f.key] ?? ""}
                  textarea={f.textarea}
                  rows={f.rows}
                  type={f.type}
                  hint={f.hint}
                />
              ))}
            </div>
          </fieldset>
        ))}
        <div className="flex items-center gap-4">
          <Submit>Save & publish</Submit>
          <p className="text-xs text-muted">One click saves all groups.</p>
        </div>
      </AdminForm>

      <section className="mt-10 rounded-3xl border border-black/10 bg-cream p-6 md:p-8">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-terracotta">
          About portrait
        </p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          The photo beside the founders&apos; story — shared by the homepage
          teaser and the About page. Upload a new portrait or pick a frame
          from the galleries.
        </p>
        <div className="mt-6 flex flex-col gap-6 md:flex-row">
          <div className="shrink-0 self-center md:self-start">
            <div className="photo relative h-56 w-44 overflow-hidden rounded-2xl bg-[#efe7de]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(aboutSrc)}
                alt="Current about portrait"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-2 w-44 truncate text-[11px] leading-5 text-muted" title={aboutSrc}>
              {aboutSrc.split("/").pop() || aboutSrc}
            </p>
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted">
                Choose from galleries
              </p>
              <div className="mt-2">
                <PhotoPicker photos={pickable} onPick={pickAboutImage} buttonLabel="Choose from galleries" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-muted">
                Upload new photo
              </p>
              <Uploader
                folder="about"
                kind="image"
                label="Upload new portrait"
                hint="One JPG/PNG — goes to R2 and becomes the about photo."
                onUploaded={setAboutImage}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
