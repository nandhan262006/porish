"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { isControlFlow } from "./AdminForm";

const toneClass: Record<"neutral" | "danger" | "accent", string> = {
  danger: "border-terracotta/40 text-terracotta hover:bg-terracotta hover:text-background",
  accent: "border-foreground/40 text-foreground hover:bg-foreground hover:text-background",
  neutral: "border-black/15 text-muted hover:border-foreground hover:text-foreground",
};

function bumpCount(selector: string, delta: number) {
  if (!delta) return;
  const el = document.querySelector(selector);
  if (!el) return;
  const n = Number.parseInt(el.textContent ?? "0", 10);
  el.textContent = String(Math.max(0, (Number.isFinite(n) ? n : 0) + delta));
}

export function TinyAction({
  action,
  label,
  args = {},
  tone = "neutral",
  confirm,
  optimistic = false,
  refresh = true,
  liveDelta = 0,
  totalDelta = 0,
  featuredDelta = 0,
  toggle,
  initialVisible,
}: {
  action: (formData: FormData) => void | Promise<void>;
  label: string;
  args?: Record<string, string | number>;
  tone?: "neutral" | "danger" | "accent";
  /** When set, submit opens a confirm dialog with this message first. */
  confirm?: string;
  /** Hide the enclosing [data-item] row instantly on submit; restored on failure. */
  optimistic?: boolean;
  /** Re-fetch the server page after success. Turn off for optimistic-only actions. */
  refresh?: boolean;
  /** Client-side deltas for [data-live]/[data-total]/[data-featured] spans on optimistic delete. */
  liveDelta?: number;
  totalDelta?: number;
  featuredDelta?: number;
  /** Show/Hide style action: swaps label + fades row without a server re-render. */
  toggle?: { on: string; off: string };
  initialVisible?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  // Keeps the queued submit so the dialog's Confirm button can run it.
  const pendingRun = useRef<(() => void) | null>(null);
  const [pending, start] = useTransition();
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [visible, setVisible] = useState(initialVisible ?? true);

  function host(): HTMLElement | null {
    return formRef.current?.closest<HTMLElement>("[data-item]") ?? null;
  }

  // Row + status text live inside the same [data-item] card. Both admin
  // list styles are handled (gallery detail uses opacity-45, the other
  // lists use opacity-50).
  function paintRow(el: HTMLElement | null, nextVisible: boolean) {
    if (!el) return;
    el.classList.toggle("opacity-45", !nextVisible);
    el.classList.toggle("opacity-50", !nextVisible);
    const status = el.querySelector("[data-visibility-status]");
    if (status) status.textContent = nextVisible ? "Live" : "Hidden";
  }

  function run(formData: FormData) {
    setError(null);
    const el = toggle ? host() : optimistic ? host() : null;

    // Apply every visual change synchronously — the click should feel free.
    let applied: (() => void) | null = null;
    if (toggle && el) {
      const next = !visible;
      const live = next ? 1 : -1;
      paintRow(el, next);
      bumpCount("[data-live]", live);
      setVisible(next);
      applied = () => {
        paintRow(el, !next);
        bumpCount("[data-live]", -live);
        setVisible(!next);
      };
    } else if (optimistic && el) {
      el.style.display = "none";
      bumpCount("[data-live]", liveDelta);
      bumpCount("[data-total]", totalDelta);
      bumpCount("[data-featured]", featuredDelta);
      applied = () => {
        el.style.display = "";
        bumpCount("[data-live]", -liveDelta);
        bumpCount("[data-total]", -totalDelta);
        bumpCount("[data-featured]", -featuredDelta);
      };
    }

    start(async () => {
      try {
        await action(formData);
        // Optimistic paths already match the server; heavier actions (move,
        // cover) still re-render.
        if (refresh) router.refresh();
      } catch (e) {
        if (isControlFlow(e)) throw e;
        applied?.();
        setError(
          e instanceof Error && e.message && !e.message.startsWith("Failed query")
            ? e.message
            : "Couldn't update — the database didn't answer. Try again.",
        );
      }
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (confirm) {
      setAsking(true);
      pendingRun.current = () => run(formData);
      return;
    }
    run(formData);
  }

  return (
    <>
      <form ref={formRef} onSubmit={onSubmit} className="inline">
        {Object.entries(args).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <button
          type="submit"
          disabled={pending}
          aria-pressed={toggle ? visible : undefined}
          title={
            toggle
              ? visible
                ? "Live on the site — click to hide"
                : "Hidden from the site — click to show"
              : undefined
          }
          className={
            toggle
              ? `inline-flex h-8 items-center gap-1.5 border px-3 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors disabled:cursor-wait disabled:opacity-60 ${
                  visible
                    ? "border-foreground bg-foreground text-background hover:bg-terracotta hover:border-terracotta"
                    : "border-dashed border-black/25 bg-transparent text-muted hover:border-terracotta hover:text-terracotta"
                }`
              : `inline-flex h-8 items-center border px-3 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors disabled:cursor-wait disabled:opacity-50 ${toneClass[tone]}`
          }
        >
          {toggle ? (
            <>
              <span
                aria-hidden
                className={`inline-block h-1.5 w-1.5 rounded-full ${visible ? "bg-emerald-400" : "border border-current"}`}
              />
              {visible ? toggle.on : toggle.off}
              {pending ? " …" : ""}
            </>
          ) : pending ? (
            "…"
          ) : (
            label
          )}
        </button>
      </form>

      {error ? (
        <p
          role="alert"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-terracotta px-4 py-2 text-xs font-medium text-background shadow-lg"
        >
          {error}
        </p>
      ) : null}

      {asking ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setAsking(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-cream p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-terracotta">
              Are you sure?
            </p>
            <p className="mt-3 text-sm leading-6 text-foreground">{confirm}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAsking(false)}
                className="inline-flex h-9 items-center border border-black/15 px-4 text-[11px] font-semibold tracking-[0.18em] uppercase text-muted hover:border-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => {
                  setAsking(false);
                  pendingRun.current?.();
                  pendingRun.current = null;
                }}
                className="inline-flex h-9 items-center bg-terracotta px-4 text-[11px] font-semibold tracking-[0.18em] uppercase text-background hover:bg-foreground"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
