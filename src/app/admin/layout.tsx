import { isAdmin } from "@/lib/session";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdmin();

  // Login page renders bare; everything else gets the studio shell.
  if (!authed) return <>{children}</>;

  return (
    <div className="mx-auto w-full max-w-[1360px] px-5 py-8 md:px-10 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-3xl bg-[#1a1410] p-5 text-[#f6f1ea] lg:sticky lg:top-24">
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#f3c7b6]">
            Studio CMS
          </p>
          <AdminNav />
          <div className="mt-5 border-t border-white/10 pt-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="mb-3 block rounded-lg px-3 py-2 text-[11px] font-medium tracking-[0.18em] uppercase text-white/70 hover:bg-white/10 hover:text-white"
            >
              View live site ↗
            </a>
            <LogoutButton />
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
