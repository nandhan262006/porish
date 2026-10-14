"use client";

import { useRef, useState, useTransition } from "react";
import { isControlFlow } from "./AdminForm";

/**
 * Per-frame toggle for "show this frame in the homepage gallery strip".
 * Flips optimistically; restores on failure. The homepage itself refreshes
 * through the publish tag, so no admin-page re-render is needed.
 */
export default function FeatureToggle({
  action,
  id,
  featured,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: number;
  featured: boolean;
}) {
  const [on, setOn] = useState(featured);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

  function bumpFeatured(delta: number) {
    const el = document.querySelector("[data-featured]");
    if (!el) return;
    const n = Number.parseInt(el.textContent ?? "0", 10);
    el.textContent = String(Math.max(0, (Number.isFinite(n) ? n : 0) + delta));
  }

  // The ★ Home badge on the photo is server-rendered, so flip it here —
  // otherwise the button changes but the card looks untouched.
  function paintBadge(next: boolean) {
    const badge = wrapRef.current
      ?.closest("[data-item]")
      ?.querySelector("[data-feature-badge]");
    if (badge) badge.classList.toggle("hidden", !next);
  }

  function flip() {
    if (pending) return;
    const next = !on;
    setOn(next);
    paintBadge(next);
    bumpFeatured(next ? 1 : -1);
    setError(null);
    const formData = new FormData();
    formData.set("id", String(id));
    start(async () => {
      try {
        await action(formData);
      } catch (e) {
        if (isControlFlow(e)) throw e;
        setOn(!next);
        paintBadge(!next);
        bumpFeatured(next ? -1 : 1);
        setError(
          e instanceof Error && e.message && !e.message.startsWith("Failed query")
            ? e.message
            : "Couldn't update — the database didn't answer. Try again.",
        );
      }
    });
  }

  return (
    <span ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={flip}
        disabled={pending}
        aria-pressed={on}
        title={
          on
            ? "Showing in the homepage Gallery strip — click to remove"
            : "Not on the homepage — click to add it to the Gallery strip"
        }
        className={`inline-flex h-8 items-center gap-1 border px-3 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors disabled:cursor-wait disabled:opacity-50 ${
          on
            ? "border-terracotta bg-terracotta text-background hover:bg-foreground"
            : "border-black/15 text-muted hover:border-terracotta hover:text-terracotta"
        }`}
      >
        <span aria-hidden>{on ? "✓" : "+"}</span>
        Homepage
        {pending ? " …" : ""}
      </button>
      {error ? (
        <span className="absolute left-0 top-full z-10 mt-1 whitespace-nowrap rounded bg-terracotta px-2 py-0.5 text-[10px] text-background">
          {error}
        </span>
      ) : null}
    </span>
  );
}
