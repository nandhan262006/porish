"use client";

import { useRef, useState, useTransition } from "react";
import { isControlFlow } from "./AdminForm";

/**
 * Sets a gallery's cover without re-rendering the page: the Cover badge
 * moves to this card instantly; on failure it moves back.
 */
export default function CoverButton({
  action,
  slug,
  src,
}: {
  action: (formData: FormData) => void | Promise<void>;
  slug: string;
  src: string;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  function ownBadge(): Element | null {
    return btnRef.current?.closest("[data-item]")?.querySelector("[data-cover-badge]") ?? null;
  }

  function allBadges(): Element[] {
    const grid = btnRef.current?.closest("ul");
    return grid ? Array.from(grid.querySelectorAll("[data-cover-badge]")) : [];
  }

  function flip() {
    if (pending) return;
    const own = ownBadge();
    if (!own || !own.classList.contains("hidden")) return; // already the cover
    const prev = allBadges().find((b) => !b.classList.contains("hidden")) ?? null;
    allBadges().forEach((b) => b.classList.add("hidden"));
    own.classList.remove("hidden");
    setError(null);
    const formData = new FormData();
    formData.set("slug", slug);
    formData.set("src", src);
    start(async () => {
      try {
        await action(formData);
      } catch (e) {
        if (isControlFlow(e)) throw e;
        own.classList.add("hidden");
        prev?.classList.remove("hidden");
        setError(
          e instanceof Error && e.message && !e.message.startsWith("Failed query")
            ? e.message
            : "Couldn't set the cover — the database didn't answer. Try again.",
        );
      }
    });
  }

  return (
    <span className="relative inline">
      <button
        ref={btnRef}
        type="button"
        onClick={flip}
        disabled={pending}
        title="Make this photo the gallery's cover — it leads the gallery page"
        className="inline-flex h-8 items-center border border-black/15 px-3 text-[10px] font-semibold tracking-[0.18em] uppercase text-muted transition-colors hover:border-foreground hover:text-foreground disabled:cursor-wait disabled:opacity-50"
      >
        Cover{pending ? " …" : ""}
      </button>
      {error ? (
        <span className="absolute left-0 top-full z-10 mt-1 whitespace-nowrap rounded bg-terracotta px-2 py-0.5 text-[10px] text-background">
          {error}
        </span>
      ) : null}
    </span>
  );
}
