import { redirect } from "next/navigation";
import { getDb, schema } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import AdminForm from "@/components/admin/AdminForm";
import Field from "@/components/admin/Field";
import Submit from "@/components/admin/Submit";
import { saveSettings } from "./actions";

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
    ],
  },
];

export default async function AdminSettingsPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const rows = await getDb().select().from(schema.siteSettings);
  const values = Object.fromEntries(rows.map((r) => [r.key, r.value]));

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
    </main>
  );
}
