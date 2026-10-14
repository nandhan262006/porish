import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/session";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Admin login" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-[70svh] w-full max-w-[1360px] items-center justify-center px-5 py-16 md:px-10">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-cream p-8 text-center shadow-[0_18px_40px_rgba(26,20,16,0.08)] md:p-10">
        <p className="eyebrow">Phorish Shoots · Studio access</p>
        <h1 className="serif-display mt-4 text-4xl md:text-5xl">Welcome back</h1>
        <p className="mt-3 text-[0.9375rem] leading-7 text-muted">
          Sign in to edit your photos, galleries and website texts.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
