import { asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import AdminForm from "@/components/admin/AdminForm";
import Field from "@/components/admin/Field";
import Submit, { TinyAction } from "@/components/admin/Submit";
import { deleteFaq, moveFaq, saveFaq, toggleFaq } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const rows = await getDb()
    .select()
    .from(schema.faqs)
    .orderBy(asc(schema.faqs.sortOrder), asc(schema.faqs.id));

  return (
    <main>
      <p className="eyebrow">Studio CMS · FAQs</p>
      <h1 className="serif-display mt-3 text-4xl md:text-5xl">Questions, answered</h1>
      <p className="mt-3 max-w-xl text-[0.9375rem] leading-7 text-muted">
        {rows.length} questions on the homepage. Hide keeps one here but takes it off the site. Use ↑ ↓ to reorder.
      </p>

      <ul className="mt-8 space-y-5">
        {rows.map((row, i) => (
          <li
            key={row.id}
            data-item
            className={`rounded-3xl border border-black/10 bg-cream p-5 md:p-6 ${row.visible ? "" : "opacity-50"}`}
          >
            <AdminForm action={saveFaq} className="grid gap-4">
              <input type="hidden" name="id" value={row.id} />
              <Field name="question" label={`Question ${i + 1}`} defaultValue={row.question} />
              <Field name="answer" label="Answer" defaultValue={row.answer} textarea rows={4} />
              <div>
                <Submit />
              </div>
            </AdminForm>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4">
              <TinyAction action={toggleFaq} label={row.visible ? "Hide" : "Show"} args={{ id: row.id }} tone="accent" toggle={{ on: "Hide", off: "Show" }} initialVisible={!!row.visible} refresh={false} />
              <TinyAction action={deleteFaq} label="Delete" args={{ id: row.id }} tone="danger"
                confirm="Delete this FAQ permanently? This cannot be undone."
                optimistic refresh={false} />
              <TinyAction action={moveFaq} label="↑" args={{ id: row.id, dir: "up" }} tone="neutral" />
              <TinyAction action={moveFaq} label="↓" args={{ id: row.id, dir: "down" }} tone="neutral" />
              <span data-visibility-status className="ml-auto text-[11px] tracking-[0.18em] uppercase text-muted">
                {row.visible ? "Live" : "Hidden"}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-10 rounded-3xl bg-[#1a1410] p-6 text-[#f6f1ea] md:p-8">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#f3c7b6]">Add new</p>
        <AdminForm action={saveFaq} refresh className="mt-4 grid gap-4">
          <Field name="question" label="Question" placeholder="What do couples ask most?" />
          <Field name="answer" label="Answer" textarea rows={4} />
          <div>
            <Submit>Add</Submit>
          </div>
        </AdminForm>
      </section>
    </main>
  );
}
