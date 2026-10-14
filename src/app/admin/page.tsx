import Link from "next/link";
import { redirect } from "next/navigation";
import { count } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { schema } from "@/lib/db";
import { isAdmin } from "@/lib/session";

export const metadata = { title: "Studio dashboard" };
export const dynamic = "force-dynamic";

async function overviewCounts() {
  const db = getDb();
  const [[g], [gi], [f], [t], [q], [s]] = await Promise.all([
    db.select({ n: count() }).from(schema.galleries),
    db.select({ n: count() }).from(schema.galleryImages),
    db.select({ n: count() }).from(schema.films),
    db.select({ n: count() }).from(schema.testimonials),
    db.select({ n: count() }).from(schema.faqs),
    db.select({ n: count() }).from(schema.services),
  ]);
  return {
    galleries: g?.n ?? 0,
    photos: gi?.n ?? 0,
    films: f?.n ?? 0,
    testimonials: t?.n ?? 0,
    faqs: q?.n ?? 0,
    services: s?.n ?? 0,
  };
}

const CARDS = [
  { href: "/admin/galleries", label: "Galleries", key: "galleries", hint: "Upload photos, hide frames, and star the ones that appear on the homepage." },
  { href: "/admin/films", label: "Films", key: "films", hint: "Wedding films on the homepage. Add, replace, or hide." },
  { href: "/admin/services", label: "Services", key: "services", hint: "The homepage carousel — titles, taglines, and cover photos." },
  { href: "/admin/testimonials", label: "Testimonials", key: "testimonials", hint: "Quotes on the homepage. The first nine live ones show." },
  { href: "/admin/faqs", label: "FAQs", key: "faqs", hint: "Questions on the homepage accordion." },
] as const;

const LINKS = [
  { href: "/admin/home", label: "Homepage hero", hint: "The three fanned photos under the headline." },
  { href: "/admin/settings", label: "Settings", hint: "Phone, address, hours, headline, and about text." },
] as const;

export default async function AdminOverviewPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  let counts: Awaited<ReturnType<typeof overviewCounts>> | null = null;
  let dbError: string | null = null;
  try {
    counts = await overviewCounts();
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Database unreachable.";
  }

  return (
    <main>
      <p className="eyebrow">Studio CMS</p>
      <h1 className="serif-display mt-3 text-4xl md:text-5xl">Overview</h1>
      <p className="mt-3 max-w-xl text-[0.9375rem] leading-7 text-muted">
        Edit the live site from here. A save says Saved when it worked. Hide takes something off the site without deleting it. Star a photo to put it on the homepage Gallery strip.
      </p>

      {dbError ? (
        <p role="alert" className="mt-6 rounded-2xl border border-terracotta/40 bg-cream p-5 text-sm leading-7">
          Database unreachable: {dbError} — run{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5">npm run db:seed</code>{" "}
          locally, or set <code className="rounded bg-black/5 px-1.5 py-0.5">TURSO_DATABASE_URL</code>.
        </p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl bg-[#1a1410] p-6 text-[#f6f1ea]">
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#f3c7b6]">
            Photos in library
          </p>
          <p className="serif-display mt-2 text-6xl">{counts?.photos ?? "—"}</p>
          <p className="mt-2 text-sm text-white/60">
            across {counts?.galleries ?? "—"} galleries
          </p>
        </div>
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group rounded-3xl border border-black/10 bg-cream p-6 transition-shadow hover:shadow-[0_18px_40px_rgba(26,20,16,0.10)]"
          >
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-terracotta">
              {card.label}
            </p>
            <p className="serif-display mt-2 text-5xl">
              {counts ? counts[card.key as keyof typeof counts] : "—"}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">{card.hint}</p>
            <span className="mt-3 inline-block border-b border-foreground/30 pb-0.5 text-[11px] tracking-[0.2em] uppercase group-hover:border-terracotta group-hover:text-terracotta">
              Open →
            </span>
          </Link>
        ))}
        {LINKS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-3xl border border-black/10 bg-cream p-6 transition-shadow hover:shadow-[0_18px_40px_rgba(26,20,16,0.10)]"
          >
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-terracotta">
              {card.label}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">{card.hint}</p>
            <span className="mt-3 inline-block border-b border-foreground/30 pb-0.5 text-[11px] tracking-[0.2em] uppercase group-hover:border-terracotta group-hover:text-terracotta">
              Open →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-black/10 bg-cream p-6">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-terracotta">
          Quick guide
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[0.9375rem] leading-7 text-muted">
          <li>On homepage / Add to homepage only changes the homepage Gallery strip. The full gallery page still shows every visible photo.</li>
          <li>Hide keeps the item here but removes it from the live site. Delete removes it for good.</li>
          <li>Use ↑ ↓ on any list to reorder — photos, films, services, quotes, questions and hero tiles all follow that order on the live site.</li>
          <li>If a page says the database did not answer, wait a moment and press Try again. Nothing else is broken.</li>
        </ul>
      </div>
    </main>
  );
}
