"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-left">
        <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted">
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          autoFocus
          placeholder="••••••••"
          className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-[1rem] outline-none placeholder:text-foreground/30 focus:border-terracotta"
        />
      </label>
      {error ? (
        <p role="alert" className="text-sm leading-6 text-terracotta">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy || password.length === 0}
        className="rounded-xl bg-foreground px-4 py-3 text-[12px] font-semibold tracking-[0.22em] uppercase text-background transition-opacity disabled:opacity-40"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
