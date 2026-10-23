"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isControlFlow } from "./AdminForm";

export type PickablePhoto = {
  /** Raw stored path (what goes into the DB). */
  src: string;
  /** Resolved public URL for the thumbnail. */
  thumb: string;
  title: string;
};

export default function PhotoPicker({
  photos,
  onPick,
  buttonLabel = "Choose from galleries",
}: {
  photos: PickablePhoto[];
  onPick: (src: string) => Promise<void>;
  buttonLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return photos;
    return photos.filter(
      (p) => p.title.toLowerCase().includes(q) || p.src.toLowerCase().includes(q),
    );
  }, [photos, query]);

  async function pick(src: string) {
    if (busy) return;
    setBusy(true);
    try {
      await onPick(src);
      dialogRef.current?.close();
      // The tile thumbnail is server-rendered — refresh so the picked
      // photo appears without a manual reload.
      router.refresh();
    } catch (e) {
      // Session expiry surfaces as a redirect — send the admin to login
      // instead of failing silently with the dialog stuck open.
      if (isControlFlow(e)) {
        dialogRef.current?.close();
        router.push("/admin/login");
        router.refresh();
        return;
      }
      throw e;
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex h-8 items-center border border-black/15 px-3 text-[10px] font-semibold tracking-[0.18em] uppercase text-muted transition-colors hover:border-foreground hover:text-foreground"
      >
        {buttonLabel}
      </button>
      <dialog
        ref={dialogRef}
        className="w-[min(92vw,900px)] rounded-3xl border border-black/10 bg-cream p-0 backdrop:bg-black/50"
      >
        <div className="flex items-center justify-between gap-4 p-5">
          <h2 className="serif-display text-2xl">Pick a photo</h2>
          <form method="dialog">
            <button className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted hover:text-terracotta">
              Close ✕
            </button>
          </form>
        </div>
        <div className="px-5">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — weddings, pre-wedding, modeling…"
            autoFocus
            className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-terracotta"
          />
        </div>
        <ul className="mt-4 grid max-h-[60vh] grid-cols-3 gap-2 overflow-y-auto p-5 pt-3 sm:grid-cols-5">
          {filtered.map((photo) => (
            <li key={photo.src}>
              <button
                type="button"
                disabled={busy}
                onClick={() => void pick(photo.src)}
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#efe7de] transition-transform hover:scale-[1.03] focus:outline-2 focus:outline-terracotta"
                title={`${photo.title} · ${photo.src}`}
              >
                {/* Plain img: 150+ thumbs, no optimizer round-trips needed. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.thumb} alt={`${photo.title} gallery photo`} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-1.5 pt-5 pb-1 text-left text-[9px] font-semibold tracking-[0.12em] uppercase text-white">
                  {photo.title}
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 ? (
            <li className="col-span-full py-10 text-center text-sm text-muted">No photos match “{query}”.</li>
          ) : null}
        </ul>
      </dialog>
    </>
  );
}
