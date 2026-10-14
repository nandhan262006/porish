import { asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import AdminForm from "@/components/admin/AdminForm";
import Field from "@/components/admin/Field";
import Submit, { TinyAction } from "@/components/admin/Submit";
import {
  deleteTestimonial,
  moveTestimonial,
  saveTestimonial,
  toggleTestimonial,
} from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const rows = await getDb()
    .select()
    .from(schema.testimonials)
    .orderBy(asc(schema.testimonials.sortOrder), asc(schema.testimonials.id));

  return (
    <main>
      <p className="eyebrow">Studio CMS · Testimonials</p>
      <h1 className="serif-display mt-3 text-4xl md:text-5xl">Client love notes</h1>
      <p className="mt-3 max-w-xl text-[0.9375rem] leading-7 text-muted">
        {rows.length} quotes. The homepage wall shows the first nine that are Live, in this order. Hide keeps a quote here but takes it off the site. Use ↑ ↓ to reorder.
      </p>

      <ul className="mt-8 space-y-5">
        {rows.map((row, i) => (
          <li
            key={row.id}
            data-item
            className={`rounded-3xl border border-black/10 bg-cream p-5 md:p-6 ${row.visible ? "" : "opacity-50"}`}
          >
            <AdminForm action={saveTestimonial} className="grid gap-4 md:grid-cols-12">
              <input type="hidden" name="id" value={row.id} />
              <div className="md:col-span-7">
                <Field name="quote" label={`Quote ${i + 1}`} defaultValue={row.quote} textarea rows={3} />
              </div>
              <div className="flex flex-col gap-4 md:col-span-3">
                <Field name="name" label="Name" defaultValue={row.name} />
                <Field name="role" label="Role / city" defaultValue={row.role} />
              </div>
              <div className="flex items-end md:col-span-2">
                <Submit />
              </div>
            </AdminForm>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4">
              <TinyAction
                action={toggleTestimonial}
                label={row.visible ? "Hide" : "Show"}
                args={{ id: row.id }}
                tone="accent"
                toggle={{ on: "Hide", off: "Show" }}
                initialVisible={!!row.visible}
                refresh={false}
              />
              <TinyAction action={deleteTestimonial} label="Delete" args={{ id: row.id }} tone="danger"
                confirm="Delete this testimonial permanently? This cannot be undone."
                optimistic refresh={false} />
              <TinyAction action={moveTestimonial} label="↑" args={{ id: row.id, dir: "up" }} tone="neutral" />
              <TinyAction action={moveTestimonial} label="↓" args={{ id: row.id, dir: "down" }} tone="neutral" />
              <span data-visibility-status className="ml-auto text-[11px] tracking-[0.18em] uppercase text-muted">
                {row.visible ? "Live" : "Hidden"}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-10 rounded-3xl bg-[#1a1410] p-6 text-[#f6f1ea] md:p-8">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#f3c7b6]">Add new</p>
        <AdminForm action={saveTestimonial} refresh className="mt-4 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-7">
            <Field name="quote" label="Quote" textarea rows={3} placeholder="What the couple said…" />
          </div>
          <div className="flex flex-col gap-4 md:col-span-3">
            <Field name="name" label="Name" placeholder="Sruthi & Kiran" />
            <Field name="role" label="Role / city" placeholder="Wedding · Nizamabad" />
          </div>
          <div className="flex items-end md:col-span-2">
            <Submit>Add</Submit>
          </div>
        </AdminForm>
      </section>
    </main>
  );
}
